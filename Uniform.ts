import { ShaderProgram, ShaderProgramComponent } from "./Program";
import { GraphicLibraryContext } from "./Shader";

export class ShaderUniform extends ShaderProgramComponent {

    public location: WebGLUniformLocation;
    public name: string;

    protected _queue: [Function, unknown][] = [];

    constructor(name: string, ...rest: (ShaderProgram | Promise<unknown>)[]) {

        super();

        this.name = name;

        this.connect(...rest);

    }

    public async $compile($compile?: Promise<unknown>): Promise<void> {

        if (this._isCompiled) return;
        this._isCompiled = true;

        const [gl, shaderProgram] = await Promise.all([this._$renderingContext[0], this._$program[0]]);

        this.location = gl.getUniformLocation(shaderProgram.program, this.name);

        for (const [delegate, value] of this._queue) {

            delegate.apply(this, value);

        }

    }

    public uniform1f(value: number): this {

        if (this._isCompiled) {

            this._renderingContext.uniform1f(this.location, value);

        } else {

            this._queue.push([this.uniform1f, [value]]);

        }

        return this;

    }

    public uniform1fv(values: number[]): this {

        if (this._isCompiled) {

            this._renderingContext.uniform1fv(this.location, values);

        } else {

            this._queue.push([this.uniform1fv, [values]]);

        }

        return this;

    }

    public uniform2f(value1: number, value2: number): this {

        if (this._isCompiled) {

            this._renderingContext.uniform2f(this.location, value1, value2);

        } else {

            this._queue.push([this.uniform2f, [value1, value2]]);

        }

        return this;

    }

    public uniform2fv(values: number[]): this {

        if (this._isCompiled) {

            this._renderingContext.uniform2fv(this.location, values);

        } else {

            this._queue.push([this.uniform2fv, [values]]);

        }

        return this;

    }

    public uniform3f(value1: number, value2: number, value3: number): this {

        if (this._isCompiled) {

            this._renderingContext.uniform3f(this.location, value1, value2, value3);

        } else {

            this._queue.push([this.uniform3f, [value1, value2, value3]]);

        }

        return this;

    }

    public uniform3fv(values: number[]): this {

        if (this._isCompiled) {

            this._renderingContext.uniform3fv(this.location, values);

        } else {

            this._queue.push([this.uniform3fv, [values]]);

        }

        return this;

    }

    public uniform4f(value1: number, value2: number, value3: number, value4: number): this {

        if (this._isCompiled) {

            this._renderingContext.uniform4f(this.location, value1, value2, value3, value4);

        } else {

            this._queue.push([this.uniform4f, [value1, value2, value3, value4]]);

        }

        return this;

    }

    public uniform4fv(values: number[]): this {

        if (this._isCompiled) {

            this._renderingContext.uniform4fv(this.location, values);

        } else {

            this._queue.push([this.uniform4fv, [values]]);

        }

        return this;

    }

    public uniformMatrix2fv(elements: number[]): this {

        if (this._isCompiled) {

            this._renderingContext.uniformMatrix2fv(this.location, false, elements);

        } else {

            this._queue.push([this.uniformMatrix2fv, [elements]]);

        }

        return this;

    }

    public uniformMatrix3fv(elements: number[]): this {

        if (this._isCompiled) {

            this._renderingContext.uniformMatrix3fv(this.location, false, elements);

        } else {

            this._queue.push([this.uniformMatrix3fv, [elements]]);

        }

        return this;

    }

    public uniformMatrix4fv(elements: number[]): this {

        if (this._isCompiled) {

            this._renderingContext.uniformMatrix4fv(this.location, false, elements);

        } else {

            this._queue.push([this.uniformMatrix4fv, [elements]]);

        }

        return this;

    }

    // Integers

    public uniform1i(value: number): this {

        if (this._isCompiled) {

            this._renderingContext.uniform1i(this.location, value);

        } else {

            this._queue.push([this.uniform1i, [value]]);

        }

        return this;

    }

    public uniform1iv(values: number[]): this {

        if (this._isCompiled) {

            this._renderingContext.uniform1iv(this.location, values);

        } else {

            this._queue.push([this.uniform1iv, [values]]);

        }

        return this;

    }

    public uniform2i(value1: number, value2: number): this {

        if (this._isCompiled) {

            this._renderingContext.uniform2i(this.location, value1, value2);

        } else {

            this._queue.push([this.uniform2i, [value1, value2]]);

        }

        return this;

    }

    public uniform2iv(values: number[]): this {

        if (this._isCompiled) {

            this._renderingContext.uniform2iv(this.location, values);

        } else {

            this._queue.push([this.uniform2iv, [values]]);

        }

        return this;

    }

    public uniform3i(value1: number, value2: number, value3: number): this {

        if (this._isCompiled) {

            this._renderingContext.uniform3i(this.location, value1, value2, value3);

        } else {

            this._queue.push([this.uniform3i, [value1, value2, value3]]);

        }

        return this;

    }

    public uniform3iv(values: number[]): this {

        if (this._isCompiled) {

            this._renderingContext.uniform3iv(this.location, values);

        } else {

            this._queue.push([this.uniform3iv, [values]]);

        }

        return this;

    }

    public uniform4i(value1: number, value2: number, value3: number, value4: number): this {

        if (this._isCompiled) {

            this._renderingContext.uniform4i(this.location, value1, value2, value3, value4);

        } else {

            this._queue.push([this.uniform4i, [value1, value2, value3, value4]]);

        }

        return this;

    }

    public uniform4iv(values: number[]): this {

        if (this._isCompiled) {

            this._renderingContext.uniform4iv(this.location, values);

        } else {

            this._queue.push([this.uniform4iv, [values]]);

        }

        return this;

    }

}

//    gl.uniform1f(floatUniformLoc, v);                 // for float
//    gl.uniform1fv(floatUniformLoc, [v]);               // for float or float array
//    gl.uniform2f(vec2UniformLoc, v0, v1);            // for vec2
//    gl.uniform2fv(vec2UniformLoc, [v0, v1]);          // for vec2 or vec2 array
//    gl.uniform3f(vec3UniformLoc, v0, v1, v2);        // for vec3
//    gl.uniform3fv(vec3UniformLoc, [v0, v1, v2]);      // for vec3 or vec3 array
//    gl.uniform4f(vec4UniformLoc, v0, v1, v2, v4);    // for vec4
//    gl.uniform4fv(vec4UniformLoc, [v0, v1, v2, v4]);  // for vec4 or vec4 array
//
//    gl.uniformMatrix2fv(mat2UniformLoc, false, [  4x element array ])  // for mat2 or mat2 array
//    gl.uniformMatrix3fv(mat3UniformLoc, false, [  9x element array ])  // for mat3 or mat3 array
//    gl.uniformMatrix4fv(mat4UniformLoc, false, [ 16x element array ])  // for mat4 or mat4 array
//
//    gl.uniform1i(intUniformLoc, v);                 // for int
//    gl.uniform1iv(intUniformLoc, [v]);                 // for int or int array
//    gl.uniform2i(ivec2UniformLoc, v0, v1);            // for ivec2
//    gl.uniform2iv(ivec2UniformLoc, [v0, v1]);          // for ivec2 or ivec2 array
//    gl.uniform3i(ivec3UniformLoc, v0, v1, v2);        // for ivec3
//    gl.uniform3iv(ivec3UniformLoc, [v0, v1, v2]);      // for ivec3 or ivec3 array
//    gl.uniform4i(ivec4UniformLoc, v0, v1, v2, v4);    // for ivec4
//    gl.uniform4iv(ivec4UniformLoc, [v0, v1, v2, v4]);  // for ivec4 or ivec4 array
//
//    gl.uniform1i(sampler2DUniformLoc, v);           // for sampler2D (textures)
//    gl.uniform1iv(sampler2DUniformLoc, [v]);           // for sampler2D or sampler2D array
//
//    gl.uniform1i(samplerCubeUniformLoc, v);         // for samplerCube (textures)
//    gl.uniform1iv(samplerCubeUniformLoc, [v]);   