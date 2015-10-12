load("demo.js");
var m = asmModule(this);

var ret = m._main();
var _start = performance.now();
ret = m._main();
var _end = performance.now();
print("  time: " + (_end - _start) + " ms");
print("  result: " + ret);
