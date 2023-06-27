import { $Promise, $UsePromise } from "../core/Core";
import { RunTimeError } from "../core/error/Error";
import { ShaderProgram } from "./Program";

export type GraphicLibraryContext = WebGLRenderingContext | WebGL2RenderingContext;

class AbstractShader {

    public static Fetch(url: string): Promise<string> {

        console.log(url);

        return new Promise(function (resolve: Function, reject: Function) {

            fetch(url)
                .then(async function (response: Response) {

                    console.log(response);
                    resolve(await response.text());

                });

        });

    }

    protected _isCompiled: boolean;

    protected _$renderingContext: $Promise<GraphicLibraryContext>;
    protected _$source: $Promise<string>;
    protected _$type: $Promise<number>;

    public shader: WebGLShader;

    constructor(...rest: (ShaderProgram | string | Promise<unknown>)[]) {

        this._isCompiled = false;

        this._$renderingContext = $UsePromise();
        this._$source = $UsePromise();
        this._$type = $UsePromise();

        this.connect(...rest);

    }

    private _thenConnect = function (value: unknown) {

        this.connect(value);

    }.bind(this);

    /* public source($source: Promise<string> | string): this {

        if ($source instanceof Promise) {

            $source
                .then(this._$source[1] as (value: string) => unknown);

        } else {

            this._$source[1]($source);

        }

        return this;

    } */

    public connect(...rest: (ShaderProgram | string | Promise<unknown>)[]): this {

        for (const value of rest) {

            if (value.constructor == String) {

                var regex = /void\s+main\s*\(\)\s*\{.+?\}/ms;
                if (regex.test(value)) {

                    this._$source[1](value);

                } else {

                    AbstractShader.Fetch(value)
                        .then(this._$source[1] as (resolve: unknown) => unknown);

                }

            } else if (value instanceof ShaderProgram) {

                const shaderProgram: ShaderProgram = value;
                this._$renderingContext[1](shaderProgram.renderingContext);

            } else if (value instanceof WebGLRenderingContext || value instanceof WebGL2RenderingContext) {

                this._$renderingContext[1](value);

            } else if (value instanceof Promise) {

                value
                    .then(this._$source[1] as (value: unknown) => unknown);

            }

            else {

                throw new RunTimeError(`Incorrected parameter used ${value}`);

            }

        }

        return this;

    }

    public async $compile(): Promise<WebGLShader> {

        if (this._isCompiled) return this.shader;
        this._isCompiled = true;

        const [renderingContext, type, source] = await Promise.all([this._$renderingContext[0], this._$type[0], this._$source[0]]);

        this.shader = renderingContext.createShader(type);

        if (!this.shader) {
            console.error('> cannot create shader');
            return;
        }

        renderingContext.shaderSource(this.shader, source);
        renderingContext.compileShader(this.shader);
        const success = renderingContext.getShaderParameter(this.shader, renderingContext.COMPILE_STATUS);
        if (!success) {
            
            const error: string = renderingContext.getShaderInfoLog(this.shader);
            renderingContext.deleteShader(this.shader);

            throw new RunTimeError(`${error}\nAbstractShader.$compile() : Unabled to create shader\n`);

        }

        return this.shader;

    }

}

export class FragmentShader extends AbstractShader {

    constructor(...rest: unknown[]) {

        super(...rest);

        const resolver: Function | ((resolve?: string) => unknown) = this._$type[1];
        this._$renderingContext[0]
            .then(function (renderingContext: WebGLRenderingContext) {

                resolver(renderingContext.FRAGMENT_SHADER);

            });

    }

}

export class VertexShader extends AbstractShader {

    constructor(...rest: unknown[]) {

        super(...rest);

        const resolver: Function | ((resolve?: string) => unknown) = this._$type[1];
        this._$renderingContext[0]
            .then(function (renderingContext: WebGLRenderingContext) {

                resolver(renderingContext.VERTEX_SHADER);

            });

    }

}