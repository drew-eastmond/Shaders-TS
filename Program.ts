import { $Promise, $UsePromise } from "../core/Core";
import { ShaderBuffer } from "./buffer/Buffer";
import { FragmentShader, VertexShader, GraphicLibraryContext } from "./Shader";
import { ShaderTexture } from "./texture/Texture";
import { ShaderUniform } from "./Uniform";

export interface IShaderProgramComponent {

    connect(...rest: unknown[]): this;
    $compile(): Promise<void | Function>;
    use(): void;
    $destroy(): Promise<unknown>;

}

export class ShaderProgramComponent implements IShaderProgramComponent {

    protected _program: WebGLProgram;
    protected _$program: $Promise<ShaderProgram>;

    protected _$renderingContext: $Promise<GraphicLibraryContext>;
    protected _renderingContext: GraphicLibraryContext;

    protected _isCompiled: boolean;

    public enabled;

    public constructor() {

        this._$program = $UsePromise();
        this._$renderingContext = $UsePromise();

        this._isCompiled = false;

        this.enabled = true;

    }

    protected _thenConnect: (value: unknown) => void = function (value: unknown) {

        this.connect(value);

    }.bind(this);

    public connect(...rest: (ShaderProgram | GraphicLibraryContext | Promise<unknown> | unknown)[]): this {

        for (const value of rest) {

            if (value instanceof ShaderProgram) {

                const shaderProgram: ShaderProgram = value;
                const renderingContext: GraphicLibraryContext = shaderProgram.renderingContext;

                this._program = shaderProgram.program;
                this._renderingContext = renderingContext;

                this._$renderingContext[1](shaderProgram.renderingContext);
                this._$program[1](shaderProgram);

            } else if (value instanceof Promise) {

                value
                    .then(this._thenConnect);

            } else if (value instanceof WebGLRenderingContext || value instanceof WebGLRenderingContext) {

                const renderingContext: GraphicLibraryContext = value;

                this._$renderingContext[1](renderingContext);
                this._renderingContext = renderingContext;

            }

        }

        return this;

    }

    public async $compile(): Promise<Function | void> {

    }

    public use(): void {

    }

    public async $destroy(): Promise<void> {


    }

}

export class ShaderProgram {

    private _isCompiled: boolean;

    private _$vertexShader: $Promise<VertexShader>;
    private _$fragmentShader: $Promise<FragmentShader>;

    public renderingContext: GraphicLibraryContext;

    public program: WebGLProgram;

    public readonly buffers: Set<ShaderBuffer> = new Set(); 

    public readonly uniforms: Map<string, ShaderUniform> = new Map();

    public readonly textures: ShaderTexture[] = [];

    constructor(renderingContext: GraphicLibraryContext) {

        this._isCompiled = false;

        this._$vertexShader = $UsePromise();
        this._$fragmentShader = $UsePromise();

        this.renderingContext = renderingContext;

    }

    public connect(...rest: (FragmentShader | VertexShader | ShaderProgramComponent | ShaderUniform)[]): this {

        for (const value of rest) {

            if (value instanceof VertexShader) {

                const vertexShader: VertexShader = value;
                vertexShader.connect(this);
                this._$vertexShader[1](vertexShader);

            } else if (value instanceof FragmentShader) {

                const fragmentShader: FragmentShader = value;
                fragmentShader.connect(this);
                this._$fragmentShader[1](fragmentShader);

            } else if (value instanceof ShaderBuffer) {

                const shaderBuffer: ShaderBuffer = value;
                shaderBuffer.connect(this);
                this.buffers.add(shaderBuffer);

            } else if (value instanceof ShaderUniform) {

                const shaderUniform: ShaderUniform = value;
                shaderUniform.connect(this);
                this.uniforms.set(shaderUniform.name, shaderUniform);

            } else if (value instanceof ShaderTexture) {

                const shaderTexture: ShaderTexture = value;
                this.textures.push(shaderTexture);

            }

        }

        return this;

    }

    public async $compile(): Promise<WebGLProgram> {

        if (this._isCompiled) return this.program;
        this._isCompiled = true;

        const gl: GraphicLibraryContext = this.renderingContext;

        // Setup Vertext/Fragment Shader functions
        const [vertexShader, fragmentShader] = await Promise.all([this._$vertexShader[0], this._$fragmentShader[0]]);

        // Setup Program and Attach Shader functions
        this.program = this.renderingContext.createProgram();
        if (this.program) {

            gl.attachShader(this.program, await vertexShader.$compile());
            gl.attachShader(this.program, await fragmentShader.$compile());
            gl.linkProgram(this.program);

        } else {

            console.error('#dv> webgl program error');

        }

        gl.useProgram(this.program);

        for (const shaderBuffer of this.buffers) {

            shaderBuffer.connect(this);
            await shaderBuffer.$compile();

        }

        for (const [name, shaderUniform] of this.uniforms) {

            shaderUniform.connect(this);
            await shaderUniform.$compile();

        }

        for (const shaderTexture of this.textures) {

            shaderTexture.connect(this);
            await shaderTexture.$compile();

        }

        return this.program;

    }

    public use(): void {

        const gl: GraphicLibraryContext = this.renderingContext;

        gl.useProgram(this.program);

        for (const shaderBuffer of this.buffers) {

            if (shaderBuffer.enabled) shaderBuffer.use();

        }

        for (const [string, shaderUniform] of this.uniforms) {

            shaderUniform.use();

        }

        const textures: ShaderTexture[] = this.textures;
        for (let i: number = 0; i < textures.length; i++) {

            const shaderTexture: ShaderTexture = textures[i];

            gl.uniform1i(shaderTexture.uniform(), i);

            gl.activeTexture(gl.TEXTURE0 + i);

            shaderTexture.use();

        }

    }

}