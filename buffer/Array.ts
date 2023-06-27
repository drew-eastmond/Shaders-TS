import { $Promise, $UsePromise } from "../../core/Core";
import { ShaderProgram, ShaderProgramComponent } from "../Program";
import { GraphicLibraryContext } from "../Shader";
import { IShaderBuffer } from "./Buffer";

export class ShaderArrayBuffer extends ShaderProgramComponent implements IShaderBuffer {

    protected _buffer: WebGLBuffer;

    protected _$data: $Promise<ArrayBufferView>;

    constructor(...rest: (ArrayBufferView | ShaderProgram | GraphicLibraryContext | Promise<unknown> | unknown)[]) {

        super();

        this._$data = $UsePromise();

        this.connect(...rest);

    }

    public connect(...rest: (ArrayBufferView | ShaderProgram | GraphicLibraryContext | Promise<unknown> | unknown)[]): this {

        for (const value of rest) {

            if (ArrayBuffer.isView(value)) {

                this._$data[1](value);

            }

        }

        return super.connect(...rest);

    }

    public async $compile(): Promise<Function | void> {

        console.error("<<<<<<<", this.constructor.name);

        if (this._isCompiled) return;
        this._isCompiled = true;

        const [gl, data] = await Promise.all([this._$renderingContext[0], this._$data[0]]);

        this._buffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    }

    public use(): void {

        const gl: GraphicLibraryContext = this._renderingContext;

        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);

    }

}