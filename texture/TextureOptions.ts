import { $Promise } from "../../core/Core";
import { IShaderProgramComponent, ShaderProgramComponent } from "../Program";
import { GraphicLibraryContext } from "../Shader";
import { ShaderTextureTarget } from "./Texture";

export interface IShaderTextureOption extends IShaderProgramComponent {

    sorting: number;

}

export class ShaderTextureOption extends ShaderProgramComponent {

    protected _target: number;
    protected _$target: $Promise<number>;

    public sorting: number = 0;

    public connect(...rest: unknown[]): this {

        for (const value of rest) {

            if (value instanceof ShaderTextureTarget) {

                const shaderTextureTarget: ShaderTextureTarget = value;
                const target: number = shaderTextureTarget.target;

                this._target = target;
                this._$target[1](target);

            }

        }

        return super.connect(...rest);

    }



}

export class ShaderTextureParameterI extends ShaderTextureOption {

    private _key: number;
    private _value: number;

    constructor(key: number, value: number) {

        super();

        this._key = key;
        this._value = value;

    }

    public async $compile(): Promise<void> {

        const [gl] = await Promise.all([this._$renderingContext[0]]);

    }

    public use(): void {

        const gl: GraphicLibraryContext = this._renderingContext;

        gl.texParameteri(this._target, this._key, this._value);

    }

}

export class ShaderTextureParameterF extends ShaderTextureOption {

    private _key: number;
    private _value: number;

    constructor(key: number, value: number) {

        super();

        this._key = key;
        this._value = value;

    }

    public async $compile(): Promise<void> {

        const [gl] = await Promise.all([this._$renderingContext[0]]);

    }

    public use(): void {

        const gl: GraphicLibraryContext = this._renderingContext;

        gl.texParameterf(this._target, this._key, this._value);

    }

}

export class ShaderTextureMipMap extends ShaderTextureOption {

    public async $compile(): Promise<void> {

        const [gl] = await Promise.all([this._$renderingContext[0]]);

        gl.generateMipmap(this._target || gl.TEXTURE_2D);
        // gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        // gl.generateMipmap(gl.TEXTURE_3D);
        // gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
        
    }

}

export class ShaderTextureWrap extends ShaderTextureOption {

    private _wrap_s: number;
    private _wrap_t: number;

    constructor(properties?: { wrap_s?: number, wrap_t?: number }) {

        super();

        if (properties !== undefined) {

            this._wrap_s = properties.wrap_s;
            this._wrap_t = properties.wrap_t;

        }
        
    }

    public async $compile(): Promise<void> {

        const [gl] = await Promise.all([this._$renderingContext[0]]);

    }

    public use(): void {

        const gl: GraphicLibraryContext = this._renderingContext;

        if (this._wrap_s === undefined) {

            gl.texParameteri(this._target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

        } else {

            gl.texParameteri(this._target, gl.TEXTURE_WRAP_S, this._wrap_s);

        }

        if (this._wrap_t === undefined) {

            gl.texParameteri(this._target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        } else {

            gl.texParameteri(this._target, gl.TEXTURE_WRAP_T, this._wrap_t);

        }
        
    }

}

export class ShaderTextureMinFilter extends ShaderTextureOption {

    private _value: number;

    constructor(value?: number) {

        super();

        this._value = value;

    }

    public async $compile(): Promise<void> {

        const [gl] = await Promise.all([this._$renderingContext[0]]);

    }

    public use(): void {

        const gl: GraphicLibraryContext = this._renderingContext;

        if (this._value === undefined) {

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        } else {

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._value);

        }

    }

}

export class ShaderTextureMaxFilter extends ShaderTextureOption {

    private _value: number;

    constructor(value?: number) {

        super();

        this._value = value;

    }

    public async $compile(): Promise<void> {

        const [gl] = await Promise.all([this._$renderingContext[0]]);

    }

    public use(): void {

        const gl: GraphicLibraryContext = this._renderingContext;

        if (this._value === undefined) {

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        } else {

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        }

    }

}