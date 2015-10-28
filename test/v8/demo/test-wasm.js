var buffer = readbuffer("demo.wasm");
WASM.verifyModule(buffer);
var module = WASM.instantiateModule(buffer);

var _start = performance.now();
var ret = module._main();
var _end = performance.now();
print("  time: " + (_end - _start) + " ms");
print("  result: " + ret);
