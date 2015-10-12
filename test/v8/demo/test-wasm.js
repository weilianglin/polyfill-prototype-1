var buffer = readbuffer("demo.wasm");
var module = WASM.instantiateModule(buffer);

var _start = performance.now();
var ret = module._main();
var _end = performance.now();
print("time: " + (_end - _start));
print("result: " + ret);
