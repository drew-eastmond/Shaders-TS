import { GraphicLibraryContext } from "../Shader";
import { ShaderArrayBuffer } from "./Array";

export class ShaderVertexArrayBuffer extends ShaderArrayBuffer {

    private _vertexArrayObject: WebGLVertexArrayObject | WebGLVertexArrayObjectOES;

    private _createVertexArray: Function;
    private _bindVertexArray: Function;
    private _deleteVertexArray: Function;
    private _isVertexArray: Function;

    public async $compile(): Promise<Function> {

        if (this._isCompiled) return;

        const [gl, data] = await Promise.all([this._$renderingContext[0], this._$data[0]]);

        const oesExtension = gl.getExtension("OES_vertex_array_object");
        if (oesExtension) {

            this._createVertexArray = () => { return oesExtension.createVertexArrayOES(); };
            this._bindVertexArray = (vertexArray: WebGLVertexArrayObjectOES) => { return oesExtension.bindVertexArrayOES(vertexArray); };
            this._deleteVertexArray = (vertexArray: WebGLVertexArrayObjectOES) => { return oesExtension.deleteVertexArrayOES(vertexArray); };

        } else {

            this._createVertexArray = function () { return gl.createVertexArray(); };
            this._bindVertexArray = (vertexArray: WebGLVertexArrayObject) => { return gl.bindVertexArray(vertexArray); };
            this._deleteVertexArray = (vertexArray: WebGLVertexArrayObject) => { return gl.deleteVertexArray(vertexArray); };

        }

        this._vertexArrayObject = this._createVertexArray();
        this._bindVertexArray(this._vertexArrayObject);

        await super.$compile();

        return function () {

            this._bindVertexArray(null);

            console.warn("unbinded");

        }.bind(this);

    }

    public use(): void {

        const gl: GraphicLibraryContext = this._renderingContext;

        this._bindVertexArray(this._vertexArrayObject);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);

    }

    public async $destroy(): Promise<void> {

        this._deleteVertexArray(this._deleteVertexArray);

    }

}