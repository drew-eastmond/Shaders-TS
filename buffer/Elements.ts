import { $Promise, $UsePromise } from "../../core/Core";
import { ShaderProgramComponent } from "../Program";
import { GraphicLibraryContext } from "../Shader";

export class ShaderElementsBuffer extends ShaderProgramComponent {

    private _$data: $Promise<ArrayBufferView>;

    private _buffer: WebGLBuffer;

    constructor(...rest: (ArrayBufferView | unknown)[]) {

        super();

        this._$data = $UsePromise();

        this.connect(...rest);

    }

    public async $compile(): Promise<Function | void> {

        console.error("<<<<<<<", this.constructor.name);

        if (this._isCompiled) return;
        this._isCompiled = true;

        const [gl, data] = await Promise.all([this._$renderingContext[0], this._$data[0]]);

        this._buffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

    }

    connect(...rest: unknown[]): this {

        for (const value of rest) {

            if (ArrayBuffer.isView(value)) {

                this._$data[1](value);

            }

        }

        return super.connect(...rest);

    }

    public use(): void {

        const gl: GraphicLibraryContext = this._renderingContext;

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer);

    }

}