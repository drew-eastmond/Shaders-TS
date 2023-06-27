import { $Promise, $UsePromise } from "../../core/Core";
import { ShaderProgram, ShaderProgramComponent } from "../Program";
import { GraphicLibraryContext } from "../Shader";
import { IShaderTextureOption } from "./TextureOptions";

export class ShaderTextureProperties {

    internalFormat: number;
    format: number;
    type: number;

    mipmap?: number;
    width?: number;
    height?: number;
    border?: number;
    offset?: number;

    constructor(properties: { internal_format: number, format: number, type?: number, /* mipmap?: number, width?: number, height?: number, border?: number, offset?: number */ }) {

        //this.mipmap = properties.mipmap || 0;
        this.type = properties.type;
        this.internalFormat = properties.internal_format;
        this.format = properties.format || properties.internal_format;
        //this.width = properties.width;
        //this.height = properties.height;
        //this.border = properties.border || 0;
        
        
        //this.offset = properties.offset;

    }

}

// export interface IShaderTextureTarget extends IShaderProgramComponent { }

export class ShaderTextureTarget extends ShaderProgramComponent {

    public target: number;

}

export class ShaderTexture2D extends ShaderTextureTarget {

    private _$texture: $Promise<WebGLTexture>;
    private _texture: WebGLTexture;

    private _$source: $Promise<TexImageSource | ArrayBufferView>
    private _source: TexImageSource | ArrayBufferView;

    private _$properties: $Promise<ShaderTextureProperties>;
    private _properties: ShaderTextureProperties;

    constructor(...rest: (ShaderProgram | WebGLTexture | ShaderTextureProperties | HTMLImageElement | ArrayBufferView | string | Promise<unknown>)[]) {

        super();

        this._$texture = $UsePromise();

        this._$source = $UsePromise();

        this._$properties = $UsePromise();

        this.connect(...rest);

    }

    public connect(...rest: (ShaderProgram | WebGLTexture | ShaderTextureProperties | HTMLImageElement | ArrayBufferView | string | Promise<unknown>)[]): this {

        for (const value of rest) {

            if (value instanceof WebGLTexture) {

                const texture: WebGLTexture = value;
                this._texture = texture;
                this._$texture[1](texture);

            } else if (value instanceof ShaderTextureProperties) {

                const properties: ShaderTextureProperties = value;
                this._properties = properties;
                this._$properties[1](properties);

            } else if (value instanceof HTMLImageElement) {

                this._source = value;
                this._$source[1](value);

            } else if (value instanceof HTMLCanvasElement) {

                this._source = value;
                this._$source[1](value);

            } else if (ArrayBuffer.isView(value)) {

                this._source = value;
                this._$source[1](value);

            } else if (value.constructor == String) {

                const _this: this = this;
                const url: string = value as string;
                const image: HTMLImageElement = new Image();
                image.src = url;
                image.onload = function () {

                    _this._source = image;
                    _this._$source[1](image);

                };

            }

        }

        return super.connect(...rest);
    }

    public async $compile(): Promise<void> {

        if (this._isCompiled) return;
        this._isCompiled = true;

        const [gl, properties, texture, source] = await Promise.all([this._$renderingContext[0], this._$properties[0], this._$texture[0], this._$source[0]]);

        this.target = gl.TEXTURE_2D;

        this._texture = texture; gl.createTexture();

        gl.bindTexture(this.target, this._texture);

        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, this._source);
        // gl.texImage2D(this.target, properties.mipmap, properties.internalformat, properties.width, properties.height, properties.border, properties.format, properties.type, this._source);

        gl.texImage2D(this.target, properties.mipmap, properties.internalFormat, properties.format, properties.type, source);


    }

    public use(): void {

        const gl: GraphicLibraryContext = this._renderingContext;

        gl.bindTexture(this.target, this._texture);

        // gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);

    }

}

export class ShaderTexture extends ShaderProgramComponent {

    private _name: string;

    private _texture: WebGLTexture;

    private _options: IShaderTextureOption[];

    private _$target: $Promise<ShaderTextureTarget>;
    private _target: ShaderTextureTarget;

    private _$properties: $Promise<ShaderTextureProperties>;

    constructor(name: string, ...rest: (ShaderProgram | ShaderTexture2D | ShaderTextureProperties)[]) {

        super();

        this._name = name;

        this._options = [];

        this._$properties = $UsePromise();

        this._$target = $UsePromise();

        this.connect(...rest);

    }

    public uniform(): WebGLUniformLocation {

        const gl: GraphicLibraryContext = this._renderingContext;

        return gl.getUniformLocation(this._program, this._name);

    }

    public connect(...rest: (ShaderProgram | ShaderTexture2D | ShaderTextureProperties | Promise<unknown>)[]): this {

        for (const value of rest) {

            if (value instanceof ShaderTexture2D) {

                if (this._isCompiled) {

                    this._$target = $UsePromise();
                    this._target = value;
                    this._$target[1](value);

                    this._isCompiled = false;
                    this.$compile();

                } else {

                    this._target = value;
                    this._$target[1](value);

                }

            } else if (value instanceof ShaderTextureProperties) {

                const properties: ShaderTextureProperties = value;
                this._$properties[1](properties);

            }

        }

        return super.connect(...rest);

    }

    public async $compile(): Promise<void> {

        if (this._isCompiled) return;
        this._isCompiled = true;

        const [gl, shaderProgram, shaderTextureTarget, properties] = await Promise.all([this._$renderingContext[0], this._$program[0], this._$target[0], this._$properties[0]]);

        this._texture = gl.createTexture();

        shaderTextureTarget.connect(shaderProgram, this._texture, properties);
        await shaderTextureTarget.$compile();

        for (const textureOption of this._options) {

            textureOption.connect(shaderProgram, shaderTextureTarget);
            await textureOption.$compile();

        }

        this._options.sort(function (optionA, optionB) {

            return optionA.sorting - optionB.sorting;

        });

    }

    public use(): void {

        const gl = this._renderingContext;

        this._target.use();

        for (const shaderTextureOption of this._options) {

            shaderTextureOption.use();

        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


    }


}