import { $Obstruct, $Promise, $UsePromise } from "../../core/Core";
import { RunTimeError } from "../../core/error/Error";
import { $Enforce } from "../../enforce/Enforce";
import { ShaderAttribute } from "../Attribute";
import { IShaderProgramComponent, ShaderProgram, ShaderProgramComponent } from "../Program";
import { ShaderArrayBuffer } from "./Array";
import { ShaderElementsBuffer } from "./Elements";

export interface IShaderBuffer extends IShaderProgramComponent {}

export class ShaderBuffer extends ShaderProgramComponent implements IShaderBuffer {

    private _$iBuffer: $Promise<IShaderBuffer>;
    private _iBuffer: IShaderBuffer; 

    public readonly attributes: Map<string, ShaderAttribute> = new Map();

    constructor(...rest: unknown[]) {

        super();

        this._$iBuffer = $UsePromise();

        this.connect(...rest);

    }

    public connect(...rest: unknown[]): this {

        for (const value of rest) {

            if (value instanceof ShaderArrayBuffer) {

                // locally cast value to `iShaderBuffer`
                const iShaderBuffer: IShaderBuffer = value;

                // it probably close to go time.
                this._iBuffer = iShaderBuffer;
                this._$iBuffer[1](value);

            } else if (value instanceof ShaderElementsBuffer) { 

                // locally cast value to `iShaderBuffer`
                const iShaderBuffer: IShaderBuffer = value;

                // this time we have an `ShaderElementsBuffer`. Oh fancy!!
                this._iBuffer = iShaderBuffer;
                this._$iBuffer[1](value);

            } else if (value instanceof ShaderAttribute) {

                // locally cast value to `shaderAttribute`.
                const shaderAttribute: ShaderAttribute = value;

                // make sure we haven't already added this attribute already. Otherwise get your shit together!
                const name: string = shaderAttribute.name;
                if (this.attributes.has(name)) throw new RunTimeError(`ShaderSttributes already exists : "${name}"`);

                // we're good to gooooo...
                shaderAttribute.connect(this);
                this.attributes.set(name, shaderAttribute);

            }

        }

        // if we can't find anythign at this level to conenct then try with parent class.
        return super.connect(...rest);

    }

    public async $compile(): Promise<void> {

        // this instance should only be compiled once.
        if (this._isCompiled) return;
        this._isCompiled = true;

        // enforce/await all the critical dependencies. So we can `$compile` out of order.
        const [shaderProgram, iShaderBuffer] = await $Enforce<[ShaderProgram, IShaderBuffer]>([this._$program[0], this._$iBuffer[0]], $Obstruct(250, `${this.constructor.name}.$compile() enforcement failed`));

        // `iShaderBuffer` most definitely needs the shaderProgram to get it `GraphicLibraryContext:(gl)` instance.
        iShaderBuffer.connect(shaderProgram);

        // some `iShaderBuffer` like `ShaderVertexArrayBuffer` needs to know when attributes has been added before clean up.
        const cleanUpCallback: Function = await iShaderBuffer.$compile() as Function;

        // `ShaderAttributes` are dependendent on which/how `IShaderBuffer` is set up. Pass the shaderProgram and compile.
        for (const [string, shaderAttributes] of this.attributes) {

            shaderAttributes.connect(shaderProgram);
            await shaderAttributes.$compile();

        }

        // let `iShaderBuffer` clean up any code from $compile.
        if (cleanUpCallback) cleanUpCallback();

    }

    public use(): void {

        // binds the connected `IShaderBuffer`
        this._iBuffer.use();

        // now that the buffers are binded. The ShaderAttributes will activate. Most likely does nothing.
        for (const [string, shaderAttributes] of this.attributes) {

            shaderAttributes.use();

        }

    }

}

