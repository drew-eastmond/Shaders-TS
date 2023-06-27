import { $Promise, $UsePromise } from "../core/Core";
import { ShaderProgramComponent } from "./Program";

export class ShaderAttributesProperties {

    public size: number;
    public type: number;
    public normalize: boolean;
    public stride: number;
    public offset: number;

    constructor(size: number, type: number, normalize?: boolean, stride?: number, offset?: number) {

        this.size = size;
        this.type = type;
        this.normalize = normalize || false;
        this.stride = stride || 0;
        this.offset = offset || 0;

    }

}

export class ShaderAttribute extends ShaderProgramComponent {

    public name: string;
    public location: number;

    private _$properties: $Promise<ShaderAttributesProperties>;
    private _properties: ShaderAttributesProperties;

    constructor(name: string, properties?: ShaderAttributesProperties) {

        super();

        this.name = name;

        this._$properties = $UsePromise();
        if (properties instanceof ShaderAttributesProperties) {

            this._$properties[1](properties);
            this._properties = properties;

        }

    }

    /* public location() {

        const gl: RenderingContext = this._renderingContext;
        return gl.getAttribLocation(this._program, this.name);

    } */

    public connect(...rest: unknown[]): this {

        for (const value of rest) {

            if (value instanceof ShaderAttributesProperties) {

                const properties: ShaderAttributesProperties = value;
                this._properties = properties;
                this._$properties[1](properties);

            }

        }

        return super.connect(...rest);

    }

    public async $compile(): Promise<void> {

        if (this._isCompiled) return;
        this._isCompiled = true;

        const [gl, shaderProgram, properties] = await Promise.all([this._$renderingContext[0], this._$program[0], this._$properties[0]]);

        this.location = gl.getAttribLocation(this._program, this.name);

    }

    public use(): void {

        const gl: RenderingContext = this._renderingContext;
        const properties = this._properties;

        // const location = gl.getAttribLocation(this._program, this.name);

        //if (gl instanceof WebGLRenderingContext) {
            gl.enableVertexAttribArray(this.location);
            gl.vertexAttribPointer(this.location, properties.size, properties.type, properties.normalize, properties.stride, properties.offset);

        //}

        
    }

}