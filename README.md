# Shaders-TS
Initialize Shaders out-of-order using typescript.

Use the .connect( ... ) method build help the engine build a dependency mesh that will

```js
const gl: GraphicLibraryContext = canvas.getContext("webgl2", {
  preserveDrawingBuffer: false
});

// fetch the shaders. We can use link or direct source. I will parse and resolve the parameters automatically.
const fragmentShader: FragmentShader = new FragmentShader(`./frag-shader.frag`);
const vertexShader: VertexShader = new VertexShader(`./vert-shader.vert`);

// get me sum of that good ole shaderProgram. Make different `ShaderProgram` based on your needs.
const shaderProgram: ShaderProgram = new ShaderProgram(gl);
shaderProgram.connect(fragmentShader);
shaderProgram.connect(vertexShader);

const positions: number[] = [1, 1, -1, 1, 1, -1,  -1, -1, -1, 1, 1, -1];
const shaderBuffer: ShaderBuffer = new ShaderBuffer
  new ShaderVertexArrayBuffer(
    new Float32Array(positions)), new ShaderAttribute("a_position", new ShaderAttributesProperties(2, gl.FLOAT)
  )
);

// doesn't matter what order we do things because .connect will reorder the state machine
var shaderUniform: ShaderUniform = new ShaderUniform("u_time");
shaderProgram.connect(shaderUniform);

// connect each component sequentially or all in the constructor. Make it your way baby!!!!
const shaderTexture: ShaderTexture = new ShaderTexture("u_texture");
shaderTexture
  .connect(new ShaderTextureProperties({ internal_format: gl.RGBA, format: gl.RGBA, type: gl.UNSIGNED_BYTE }));
shaderTexture.connect(new ShaderTexture2D().connect("./img/leaves.jpg")).connect($texture);
shaderProgram.connect(shaderTexture);

// if we have everything present then compile.
await shaderProgram.$compile();
```


## Rendering phase...

After the program is compiled just call shaderProgram.use(), then update any uniforms and just like that...
Your Bussin'

```js
// rendering p

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// let do magic all dependencies are sorted and state machine are set up automagically. (YES MAGIC!!!)
shaderProgram.use();

// this example uses drawArray but draw elements is essentially the same.
shaderProgram.uniforms.get("u_time").uniform1f(i * 0.1);

const primitiveType = gl.TRIANGLES;
const offset = 0;
const count = 6;
gl.drawArrays(primitiveType, offset, count); 
```
