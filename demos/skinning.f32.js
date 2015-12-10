var Module;
if (!Module) Module = (typeof Module !== "undefined" ? Module : null) || {};
var moduleOverrides = {};
for (var key in Module) {
 if (Module.hasOwnProperty(key)) {
  moduleOverrides[key] = Module[key];
 }
}
var ENVIRONMENT_IS_WEB = typeof window === "object";
var ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
var ENVIRONMENT_IS_NODE = typeof process === "object" && typeof require === "function" && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (ENVIRONMENT_IS_NODE) {
 if (!Module["print"]) Module["print"] = function print(x) {
  process["stdout"].write(x + "\n");
 };
 if (!Module["printErr"]) Module["printErr"] = function printErr(x) {
  process["stderr"].write(x + "\n");
 };
 var nodeFS = require("fs");
 var nodePath = require("path");
 Module["read"] = function read(filename, binary) {
  filename = nodePath["normalize"](filename);
  var ret = nodeFS["readFileSync"](filename);
  if (!ret && filename != nodePath["resolve"](filename)) {
   filename = path.join(__dirname, "..", "src", filename);
   ret = nodeFS["readFileSync"](filename);
  }
  if (ret && !binary) ret = ret.toString();
  return ret;
 };
 Module["readBinary"] = function readBinary(filename) {
  var ret = Module["read"](filename, true);
  if (!ret.buffer) {
   ret = new Uint8Array(ret);
  }
  assert(ret.buffer);
  return ret;
 };
 Module["load"] = function load(f) {
  globalEval(read(f));
 };
 if (!Module["thisProgram"]) {
  if (process["argv"].length > 1) {
   Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/");
  } else {
   Module["thisProgram"] = "unknown-program";
  }
 }
 Module["arguments"] = process["argv"].slice(2);
 if (typeof module !== "undefined") {
  module["exports"] = Module;
 }
 process["on"]("uncaughtException", (function(ex) {
  if (!(ex instanceof ExitStatus)) {
   throw ex;
  }
 }));
 Module["inspect"] = (function() {
  return "[Emscripten Module object]";
 });
} else if (ENVIRONMENT_IS_SHELL) {
 if (!Module["print"]) Module["print"] = print;
 if (typeof printErr != "undefined") Module["printErr"] = printErr;
 if (typeof read != "undefined") {
  Module["read"] = read;
 } else {
  Module["read"] = function read() {
   throw "no read() available (jsc?)";
  };
 }
 Module["readBinary"] = function readBinary(f) {
  if (typeof readbuffer === "function") {
   return new Uint8Array(readbuffer(f));
  }
  var data = read(f, "binary");
  assert(typeof data === "object");
  return data;
 };
 if (typeof scriptArgs != "undefined") {
  Module["arguments"] = scriptArgs;
 } else if (typeof arguments != "undefined") {
  Module["arguments"] = arguments;
 }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
 Module["read"] = function read(url) {
  var xhr = new XMLHttpRequest;
  xhr.open("GET", url, false);
  xhr.send(null);
  return xhr.responseText;
 };
 if (typeof arguments != "undefined") {
  Module["arguments"] = arguments;
 }
 if (typeof console !== "undefined") {
  if (!Module["print"]) Module["print"] = function print(x) {
   console.log(x);
  };
  if (!Module["printErr"]) Module["printErr"] = function printErr(x) {
   console.log(x);
  };
 } else {
  var TRY_USE_DUMP = false;
  if (!Module["print"]) Module["print"] = TRY_USE_DUMP && typeof dump !== "undefined" ? (function(x) {
   dump(x);
  }) : (function(x) {});
 }
 if (ENVIRONMENT_IS_WORKER) {
  Module["load"] = importScripts;
 }
 if (typeof Module["setWindowTitle"] === "undefined") {
  Module["setWindowTitle"] = (function(title) {
   document.title = title;
  });
 }
} else {
 throw "Unknown runtime environment. Where are we?";
}
function globalEval(x) {
 eval.call(null, x);
}
if (!Module["load"] && Module["read"]) {
 Module["load"] = function load(f) {
  globalEval(Module["read"](f));
 };
}
if (!Module["print"]) {
 Module["print"] = (function() {});
}
if (!Module["printErr"]) {
 Module["printErr"] = Module["print"];
}
if (!Module["arguments"]) {
 Module["arguments"] = [];
}
if (!Module["thisProgram"]) {
 Module["thisProgram"] = "./this.program";
}
Module.print = Module["print"];
Module.printErr = Module["printErr"];
Module["preRun"] = [];
Module["postRun"] = [];
for (var key in moduleOverrides) {
 if (moduleOverrides.hasOwnProperty(key)) {
  Module[key] = moduleOverrides[key];
 }
}
var Runtime = {
 setTempRet0: (function(value) {
  tempRet0 = value;
 }),
 getTempRet0: (function() {
  return tempRet0;
 }),
 stackSave: (function() {
  return STACKTOP;
 }),
 stackRestore: (function(stackTop) {
  STACKTOP = stackTop;
 }),
 getNativeTypeSize: (function(type) {
  switch (type) {
  case "i1":
  case "i8":
   return 1;
  case "i16":
   return 2;
  case "i32":
   return 4;
  case "i64":
   return 8;
  case "float":
   return 4;
  case "double":
   return 8;
  default:
   {
    if (type[type.length - 1] === "*") {
     return Runtime.QUANTUM_SIZE;
    } else if (type[0] === "i") {
     var bits = parseInt(type.substr(1));
     assert(bits % 8 === 0);
     return bits / 8;
    } else {
     return 0;
    }
   }
  }
 }),
 getNativeFieldSize: (function(type) {
  return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
 }),
 STACK_ALIGN: 16,
 prepVararg: (function(ptr, type) {
  if (type === "double" || type === "i64") {
   if (ptr & 7) {
    assert((ptr & 7) === 4);
    ptr += 4;
   }
  } else {
   assert((ptr & 3) === 0);
  }
  return ptr;
 }),
 getAlignSize: (function(type, size, vararg) {
  if (!vararg && (type == "i64" || type == "double")) return 8;
  if (!type) return Math.min(size, 8);
  return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
 }),
 dynCall: (function(sig, ptr, args) {
  if (args && args.length) {
   if (!args.splice) args = Array.prototype.slice.call(args);
   args.splice(0, 0, ptr);
   return Module["dynCall_" + sig].apply(null, args);
  } else {
   return Module["dynCall_" + sig].call(null, ptr);
  }
 }),
 functionPointers: [],
 addFunction: (function(func) {
  for (var i = 0; i < Runtime.functionPointers.length; i++) {
   if (!Runtime.functionPointers[i]) {
    Runtime.functionPointers[i] = func;
    return 2 * (1 + i);
   }
  }
  throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.";
 }),
 removeFunction: (function(index) {
  Runtime.functionPointers[(index - 2) / 2] = null;
 }),
 warnOnce: (function(text) {
  if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
  if (!Runtime.warnOnce.shown[text]) {
   Runtime.warnOnce.shown[text] = 1;
   Module.printErr(text);
  }
 }),
 funcWrappers: {},
 getFuncWrapper: (function(func, sig) {
  assert(sig);
  if (!Runtime.funcWrappers[sig]) {
   Runtime.funcWrappers[sig] = {};
  }
  var sigCache = Runtime.funcWrappers[sig];
  if (!sigCache[func]) {
   sigCache[func] = function dynCall_wrapper() {
    return Runtime.dynCall(sig, func, arguments);
   };
  }
  return sigCache[func];
 }),
 getCompilerSetting: (function(name) {
  throw "You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work";
 }),
 stackAlloc: (function(size) {
  var ret = STACKTOP;
  STACKTOP = STACKTOP + size | 0;
  STACKTOP = STACKTOP + 15 & -16;
  return ret;
 }),
 staticAlloc: (function(size) {
  var ret = STATICTOP;
  STATICTOP = STATICTOP + size | 0;
  STATICTOP = STATICTOP + 15 & -16;
  return ret;
 }),
 dynamicAlloc: (function(size) {
  var ret = DYNAMICTOP;
  DYNAMICTOP = DYNAMICTOP + size | 0;
  DYNAMICTOP = DYNAMICTOP + 15 & -16;
  if (DYNAMICTOP >= TOTAL_MEMORY) {
   var success = enlargeMemory();
   if (!success) {
    DYNAMICTOP = ret;
    return 0;
   }
  }
  return ret;
 }),
 alignMemory: (function(size, quantum) {
  var ret = size = Math.ceil(size / (quantum ? quantum : 16)) * (quantum ? quantum : 16);
  return ret;
 }),
 makeBigInt: (function(low, high, unsigned) {
  var ret = unsigned ? +(low >>> 0) + +(high >>> 0) * +4294967296 : +(low >>> 0) + +(high | 0) * +4294967296;
  return ret;
 }),
 GLOBAL_BASE: 8,
 QUANTUM_SIZE: 4,
 __dummy__: 0
};
Module["Runtime"] = Runtime;
var __THREW__ = 0;
var ABORT = false;
var EXITSTATUS = 0;
var undef = 0;
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
function assert(condition, text) {
 if (!condition) {
  abort("Assertion failed: " + text);
 }
}
var globalScope = this;
function getCFunc(ident) {
 var func = Module["_" + ident];
 if (!func) {
  try {
   func = eval("_" + ident);
  } catch (e) {}
 }
 assert(func, "Cannot call unknown function " + ident + " (perhaps LLVM optimizations or closure removed it?)");
 return func;
}
var cwrap, ccall;
((function() {
 var JSfuncs = {
  "stackSave": (function() {
   Runtime.stackSave();
  }),
  "stackRestore": (function() {
   Runtime.stackRestore();
  }),
  "arrayToC": (function(arr) {
   var ret = Runtime.stackAlloc(arr.length);
   writeArrayToMemory(arr, ret);
   return ret;
  }),
  "stringToC": (function(str) {
   var ret = 0;
   if (str !== null && str !== undefined && str !== 0) {
    ret = Runtime.stackAlloc((str.length << 2) + 1);
    writeStringToMemory(str, ret);
   }
   return ret;
  })
 };
 var toC = {
  "string": JSfuncs["stringToC"],
  "array": JSfuncs["arrayToC"]
 };
 ccall = function ccallFunc(ident, returnType, argTypes, args, opts) {
  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  if (args) {
   for (var i = 0; i < args.length; i++) {
    var converter = toC[argTypes[i]];
    if (converter) {
     if (stack === 0) stack = Runtime.stackSave();
     cArgs[i] = converter(args[i]);
    } else {
     cArgs[i] = args[i];
    }
   }
  }
  var ret = func.apply(null, cArgs);
  if (returnType === "string") ret = Pointer_stringify(ret);
  if (stack !== 0) {
   if (opts && opts.async) {
    EmterpreterAsync.asyncFinalizers.push((function() {
     Runtime.stackRestore(stack);
    }));
    return;
   }
   Runtime.stackRestore(stack);
  }
  return ret;
 };
 var sourceRegex = /^function\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/;
 function parseJSFunc(jsfunc) {
  var parsed = jsfunc.toString().match(sourceRegex).slice(1);
  return {
   arguments: parsed[0],
   body: parsed[1],
   returnValue: parsed[2]
  };
 }
 var JSsource = {};
 for (var fun in JSfuncs) {
  if (JSfuncs.hasOwnProperty(fun)) {
   JSsource[fun] = parseJSFunc(JSfuncs[fun]);
  }
 }
 cwrap = function cwrap(ident, returnType, argTypes) {
  argTypes = argTypes || [];
  var cfunc = getCFunc(ident);
  var numericArgs = argTypes.every((function(type) {
   return type === "number";
  }));
  var numericRet = returnType !== "string";
  if (numericRet && numericArgs) {
   return cfunc;
  }
  var argNames = argTypes.map((function(x, i) {
   return "$" + i;
  }));
  var funcstr = "(function(" + argNames.join(",") + ") {";
  var nargs = argTypes.length;
  if (!numericArgs) {
   funcstr += "var stack = " + JSsource["stackSave"].body + ";";
   for (var i = 0; i < nargs; i++) {
    var arg = argNames[i], type = argTypes[i];
    if (type === "number") continue;
    var convertCode = JSsource[type + "ToC"];
    funcstr += "var " + convertCode.arguments + " = " + arg + ";";
    funcstr += convertCode.body + ";";
    funcstr += arg + "=" + convertCode.returnValue + ";";
   }
  }
  var cfuncname = parseJSFunc((function() {
   return cfunc;
  })).returnValue;
  funcstr += "var ret = " + cfuncname + "(" + argNames.join(",") + ");";
  if (!numericRet) {
   var strgfy = parseJSFunc((function() {
    return Pointer_stringify;
   })).returnValue;
   funcstr += "ret = " + strgfy + "(ret);";
  }
  if (!numericArgs) {
   funcstr += JSsource["stackRestore"].body.replace("()", "(stack)") + ";";
  }
  funcstr += "return ret})";
  return eval(funcstr);
 };
}))();
Module["ccall"] = ccall;
Module["cwrap"] = cwrap;
function setValue(ptr, value, type, noSafe) {
 type = type || "i8";
 if (type.charAt(type.length - 1) === "*") type = "i32";
 switch (type) {
 case "i1":
  HEAP8[ptr >> 0] = value;
  break;
 case "i8":
  HEAP8[ptr >> 0] = value;
  break;
 case "i16":
  HEAP16[ptr >> 1] = value;
  break;
 case "i32":
  HEAP32[ptr >> 2] = value;
  break;
 case "i64":
  tempI64 = [ value >>> 0, (tempDouble = value, +Math_abs(tempDouble) >= +1 ? tempDouble > +0 ? (Math_min(+Math_floor(tempDouble / +4294967296), +4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / +4294967296) >>> 0 : 0) ], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
  break;
 case "float":
  HEAPF32[ptr >> 2] = value;
  break;
 case "double":
  HEAPF64[ptr >> 3] = value;
  break;
 default:
  abort("invalid type for setValue: " + type);
 }
}
Module["setValue"] = setValue;
function getValue(ptr, type, noSafe) {
 type = type || "i8";
 if (type.charAt(type.length - 1) === "*") type = "i32";
 switch (type) {
 case "i1":
  return HEAP8[ptr >> 0];
 case "i8":
  return HEAP8[ptr >> 0];
 case "i16":
  return HEAP16[ptr >> 1];
 case "i32":
  return HEAP32[ptr >> 2];
 case "i64":
  return HEAP32[ptr >> 2];
 case "float":
  return HEAPF32[ptr >> 2];
 case "double":
  return HEAPF64[ptr >> 3];
 default:
  abort("invalid type for setValue: " + type);
 }
 return null;
}
Module["getValue"] = getValue;
var ALLOC_NORMAL = 0;
var ALLOC_STACK = 1;
var ALLOC_STATIC = 2;
var ALLOC_DYNAMIC = 3;
var ALLOC_NONE = 4;
Module["ALLOC_NORMAL"] = ALLOC_NORMAL;
Module["ALLOC_STACK"] = ALLOC_STACK;
Module["ALLOC_STATIC"] = ALLOC_STATIC;
Module["ALLOC_DYNAMIC"] = ALLOC_DYNAMIC;
Module["ALLOC_NONE"] = ALLOC_NONE;
function allocate(slab, types, allocator, ptr) {
 var zeroinit, size;
 if (typeof slab === "number") {
  zeroinit = true;
  size = slab;
 } else {
  zeroinit = false;
  size = slab.length;
 }
 var singleType = typeof types === "string" ? types : null;
 var ret;
 if (allocator == ALLOC_NONE) {
  ret = ptr;
 } else {
  ret = [ _malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc ][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
 }
 if (zeroinit) {
  var ptr = ret, stop;
  assert((ret & 3) == 0);
  stop = ret + (size & ~3);
  for (; ptr < stop; ptr += 4) {
   HEAP32[ptr >> 2] = 0;
  }
  stop = ret + size;
  while (ptr < stop) {
   HEAP8[ptr++ >> 0] = 0;
  }
  return ret;
 }
 if (singleType === "i8") {
  if (slab.subarray || slab.slice) {
   HEAPU8.set(slab, ret);
  } else {
   HEAPU8.set(new Uint8Array(slab), ret);
  }
  return ret;
 }
 var i = 0, type, typeSize, previousType;
 while (i < size) {
  var curr = slab[i];
  if (typeof curr === "function") {
   curr = Runtime.getFunctionIndex(curr);
  }
  type = singleType || types[i];
  if (type === 0) {
   i++;
   continue;
  }
  if (type == "i64") type = "i32";
  setValue(ret + i, curr, type);
  if (previousType !== type) {
   typeSize = Runtime.getNativeTypeSize(type);
   previousType = type;
  }
  i += typeSize;
 }
 return ret;
}
Module["allocate"] = allocate;
function getMemory(size) {
 if (!staticSealed) return Runtime.staticAlloc(size);
 if (typeof _sbrk !== "undefined" && !_sbrk.called || !runtimeInitialized) return Runtime.dynamicAlloc(size);
 return _malloc(size);
}
Module["getMemory"] = getMemory;
function Pointer_stringify(ptr, length) {
 if (length === 0 || !ptr) return "";
 var hasUtf = 0;
 var t;
 var i = 0;
 while (1) {
  t = HEAPU8[ptr + i >> 0];
  hasUtf |= t;
  if (t == 0 && !length) break;
  i++;
  if (length && i == length) break;
 }
 if (!length) length = i;
 var ret = "";
 if (hasUtf < 128) {
  var MAX_CHUNK = 1024;
  var curr;
  while (length > 0) {
   curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
   ret = ret ? ret + curr : curr;
   ptr += MAX_CHUNK;
   length -= MAX_CHUNK;
  }
  return ret;
 }
 return Module["UTF8ToString"](ptr);
}
Module["Pointer_stringify"] = Pointer_stringify;
function AsciiToString(ptr) {
 var str = "";
 while (1) {
  var ch = HEAP8[ptr++ >> 0];
  if (!ch) return str;
  str += String.fromCharCode(ch);
 }
}
Module["AsciiToString"] = AsciiToString;
function stringToAscii(str, outPtr) {
 return writeAsciiToMemory(str, outPtr, false);
}
Module["stringToAscii"] = stringToAscii;
function UTF8ArrayToString(u8Array, idx) {
 var u0, u1, u2, u3, u4, u5;
 var str = "";
 while (1) {
  u0 = u8Array[idx++];
  if (!u0) return str;
  if (!(u0 & 128)) {
   str += String.fromCharCode(u0);
   continue;
  }
  u1 = u8Array[idx++] & 63;
  if ((u0 & 224) == 192) {
   str += String.fromCharCode((u0 & 31) << 6 | u1);
   continue;
  }
  u2 = u8Array[idx++] & 63;
  if ((u0 & 240) == 224) {
   u0 = (u0 & 15) << 12 | u1 << 6 | u2;
  } else {
   u3 = u8Array[idx++] & 63;
   if ((u0 & 248) == 240) {
    u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u3;
   } else {
    u4 = u8Array[idx++] & 63;
    if ((u0 & 252) == 248) {
     u0 = (u0 & 3) << 24 | u1 << 18 | u2 << 12 | u3 << 6 | u4;
    } else {
     u5 = u8Array[idx++] & 63;
     u0 = (u0 & 1) << 30 | u1 << 24 | u2 << 18 | u3 << 12 | u4 << 6 | u5;
    }
   }
  }
  if (u0 < 65536) {
   str += String.fromCharCode(u0);
  } else {
   var ch = u0 - 65536;
   str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
  }
 }
}
Module["UTF8ArrayToString"] = UTF8ArrayToString;
function UTF8ToString(ptr) {
 return UTF8ArrayToString(HEAPU8, ptr);
}
Module["UTF8ToString"] = UTF8ToString;
function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
 if (!(maxBytesToWrite > 0)) return 0;
 var startIdx = outIdx;
 var endIdx = outIdx + maxBytesToWrite - 1;
 for (var i = 0; i < str.length; ++i) {
  var u = str.charCodeAt(i);
  if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
  if (u <= 127) {
   if (outIdx >= endIdx) break;
   outU8Array[outIdx++] = u;
  } else if (u <= 2047) {
   if (outIdx + 1 >= endIdx) break;
   outU8Array[outIdx++] = 192 | u >> 6;
   outU8Array[outIdx++] = 128 | u & 63;
  } else if (u <= 65535) {
   if (outIdx + 2 >= endIdx) break;
   outU8Array[outIdx++] = 224 | u >> 12;
   outU8Array[outIdx++] = 128 | u >> 6 & 63;
   outU8Array[outIdx++] = 128 | u & 63;
  } else if (u <= 2097151) {
   if (outIdx + 3 >= endIdx) break;
   outU8Array[outIdx++] = 240 | u >> 18;
   outU8Array[outIdx++] = 128 | u >> 12 & 63;
   outU8Array[outIdx++] = 128 | u >> 6 & 63;
   outU8Array[outIdx++] = 128 | u & 63;
  } else if (u <= 67108863) {
   if (outIdx + 4 >= endIdx) break;
   outU8Array[outIdx++] = 248 | u >> 24;
   outU8Array[outIdx++] = 128 | u >> 18 & 63;
   outU8Array[outIdx++] = 128 | u >> 12 & 63;
   outU8Array[outIdx++] = 128 | u >> 6 & 63;
   outU8Array[outIdx++] = 128 | u & 63;
  } else {
   if (outIdx + 5 >= endIdx) break;
   outU8Array[outIdx++] = 252 | u >> 30;
   outU8Array[outIdx++] = 128 | u >> 24 & 63;
   outU8Array[outIdx++] = 128 | u >> 18 & 63;
   outU8Array[outIdx++] = 128 | u >> 12 & 63;
   outU8Array[outIdx++] = 128 | u >> 6 & 63;
   outU8Array[outIdx++] = 128 | u & 63;
  }
 }
 outU8Array[outIdx] = 0;
 return outIdx - startIdx;
}
Module["stringToUTF8Array"] = stringToUTF8Array;
function stringToUTF8(str, outPtr, maxBytesToWrite) {
 return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
}
Module["stringToUTF8"] = stringToUTF8;
function lengthBytesUTF8(str) {
 var len = 0;
 for (var i = 0; i < str.length; ++i) {
  var u = str.charCodeAt(i);
  if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
  if (u <= 127) {
   ++len;
  } else if (u <= 2047) {
   len += 2;
  } else if (u <= 65535) {
   len += 3;
  } else if (u <= 2097151) {
   len += 4;
  } else if (u <= 67108863) {
   len += 5;
  } else {
   len += 6;
  }
 }
 return len;
}
Module["lengthBytesUTF8"] = lengthBytesUTF8;
function UTF16ToString(ptr) {
 var i = 0;
 var str = "";
 while (1) {
  var codeUnit = HEAP16[ptr + i * 2 >> 1];
  if (codeUnit == 0) return str;
  ++i;
  str += String.fromCharCode(codeUnit);
 }
}
Module["UTF16ToString"] = UTF16ToString;
function stringToUTF16(str, outPtr, maxBytesToWrite) {
 if (maxBytesToWrite === undefined) {
  maxBytesToWrite = 2147483647;
 }
 if (maxBytesToWrite < 2) return 0;
 maxBytesToWrite -= 2;
 var startPtr = outPtr;
 var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
 for (var i = 0; i < numCharsToWrite; ++i) {
  var codeUnit = str.charCodeAt(i);
  HEAP16[outPtr >> 1] = codeUnit;
  outPtr += 2;
 }
 HEAP16[outPtr >> 1] = 0;
 return outPtr - startPtr;
}
Module["stringToUTF16"] = stringToUTF16;
function lengthBytesUTF16(str) {
 return str.length * 2;
}
Module["lengthBytesUTF16"] = lengthBytesUTF16;
function UTF32ToString(ptr) {
 var i = 0;
 var str = "";
 while (1) {
  var utf32 = HEAP32[ptr + i * 4 >> 2];
  if (utf32 == 0) return str;
  ++i;
  if (utf32 >= 65536) {
   var ch = utf32 - 65536;
   str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
  } else {
   str += String.fromCharCode(utf32);
  }
 }
}
Module["UTF32ToString"] = UTF32ToString;
function stringToUTF32(str, outPtr, maxBytesToWrite) {
 if (maxBytesToWrite === undefined) {
  maxBytesToWrite = 2147483647;
 }
 if (maxBytesToWrite < 4) return 0;
 var startPtr = outPtr;
 var endPtr = startPtr + maxBytesToWrite - 4;
 for (var i = 0; i < str.length; ++i) {
  var codeUnit = str.charCodeAt(i);
  if (codeUnit >= 55296 && codeUnit <= 57343) {
   var trailSurrogate = str.charCodeAt(++i);
   codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
  }
  HEAP32[outPtr >> 2] = codeUnit;
  outPtr += 4;
  if (outPtr + 4 > endPtr) break;
 }
 HEAP32[outPtr >> 2] = 0;
 return outPtr - startPtr;
}
Module["stringToUTF32"] = stringToUTF32;
function lengthBytesUTF32(str) {
 var len = 0;
 for (var i = 0; i < str.length; ++i) {
  var codeUnit = str.charCodeAt(i);
  if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
  len += 4;
 }
 return len;
}
Module["lengthBytesUTF32"] = lengthBytesUTF32;
function demangle(func) {
 var hasLibcxxabi = !!Module["___cxa_demangle"];
 if (hasLibcxxabi) {
  try {
   var buf = _malloc(func.length);
   writeStringToMemory(func.substr(1), buf);
   var status = _malloc(4);
   var ret = Module["___cxa_demangle"](buf, 0, 0, status);
   if (getValue(status, "i32") === 0 && ret) {
    return Pointer_stringify(ret);
   }
  } catch (e) {} finally {
   if (buf) _free(buf);
   if (status) _free(status);
   if (ret) _free(ret);
  }
 }
 var i = 3;
 var basicTypes = {
  "v": "void",
  "b": "bool",
  "c": "char",
  "s": "short",
  "i": "int",
  "l": "long",
  "f": "float",
  "d": "double",
  "w": "wchar_t",
  "a": "signed char",
  "h": "unsigned char",
  "t": "unsigned short",
  "j": "unsigned int",
  "m": "unsigned long",
  "x": "long long",
  "y": "unsigned long long",
  "z": "..."
 };
 var subs = [];
 var first = true;
 function dump(x) {
  if (x) Module.print(x);
  Module.print(func);
  var pre = "";
  for (var a = 0; a < i; a++) pre += " ";
  Module.print(pre + "^");
 }
 function parseNested() {
  i++;
  if (func[i] === "K") i++;
  var parts = [];
  while (func[i] !== "E") {
   if (func[i] === "S") {
    i++;
    var next = func.indexOf("_", i);
    var num = func.substring(i, next) || 0;
    parts.push(subs[num] || "?");
    i = next + 1;
    continue;
   }
   if (func[i] === "C") {
    parts.push(parts[parts.length - 1]);
    i += 2;
    continue;
   }
   var size = parseInt(func.substr(i));
   var pre = size.toString().length;
   if (!size || !pre) {
    i--;
    break;
   }
   var curr = func.substr(i + pre, size);
   parts.push(curr);
   subs.push(curr);
   i += pre + size;
  }
  i++;
  return parts;
 }
 function parse(rawList, limit, allowVoid) {
  limit = limit || Infinity;
  var ret = "", list = [];
  function flushList() {
   return "(" + list.join(", ") + ")";
  }
  var name;
  if (func[i] === "N") {
   name = parseNested().join("::");
   limit--;
   if (limit === 0) return rawList ? [ name ] : name;
  } else {
   if (func[i] === "K" || first && func[i] === "L") i++;
   var size = parseInt(func.substr(i));
   if (size) {
    var pre = size.toString().length;
    name = func.substr(i + pre, size);
    i += pre + size;
   }
  }
  first = false;
  if (func[i] === "I") {
   i++;
   var iList = parse(true);
   var iRet = parse(true, 1, true);
   ret += iRet[0] + " " + name + "<" + iList.join(", ") + ">";
  } else {
   ret = name;
  }
  paramLoop : while (i < func.length && limit-- > 0) {
   var c = func[i++];
   if (c in basicTypes) {
    list.push(basicTypes[c]);
   } else {
    switch (c) {
    case "P":
     list.push(parse(true, 1, true)[0] + "*");
     break;
    case "R":
     list.push(parse(true, 1, true)[0] + "&");
     break;
    case "L":
     {
      i++;
      var end = func.indexOf("E", i);
      var size = end - i;
      list.push(func.substr(i, size));
      i += size + 2;
      break;
     }
    case "A":
     {
      var size = parseInt(func.substr(i));
      i += size.toString().length;
      if (func[i] !== "_") throw "?";
      i++;
      list.push(parse(true, 1, true)[0] + " [" + size + "]");
      break;
     }
    case "E":
     break paramLoop;
    default:
     ret += "?" + c;
     break paramLoop;
    }
   }
  }
  if (!allowVoid && list.length === 1 && list[0] === "void") list = [];
  if (rawList) {
   if (ret) {
    list.push(ret + "?");
   }
   return list;
  } else {
   return ret + flushList();
  }
 }
 var parsed = func;
 try {
  if (func == "Object._main" || func == "_main") {
   return "main()";
  }
  if (typeof func === "number") func = Pointer_stringify(func);
  if (func[0] !== "_") return func;
  if (func[1] !== "_") return func;
  if (func[2] !== "Z") return func;
  switch (func[3]) {
  case "n":
   return "operator new()";
  case "d":
   return "operator delete()";
  }
  parsed = parse();
 } catch (e) {
  parsed += "?";
 }
 if (parsed.indexOf("?") >= 0 && !hasLibcxxabi) {
  Runtime.warnOnce("warning: a problem occurred in builtin C++ name demangling; build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling");
 }
 return parsed;
}
function demangleAll(text) {
 return text.replace(/__Z[\w\d_]+/g, (function(x) {
  var y = demangle(x);
  return x === y ? x : x + " [" + y + "]";
 }));
}
function jsStackTrace() {
 var err = new Error;
 if (!err.stack) {
  try {
   throw new Error(0);
  } catch (e) {
   err = e;
  }
  if (!err.stack) {
   return "(no stack trace available)";
  }
 }
 return err.stack.toString();
}
function stackTrace() {
 return demangleAll(jsStackTrace());
}
Module["stackTrace"] = stackTrace;
var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
 if (x % 4096 > 0) {
  x += 4096 - x % 4096;
 }
 return x;
}
var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false;
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0;
var DYNAMIC_BASE = 0, DYNAMICTOP = 0;
function abortOnCannotGrowMemory() {
 abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which adjusts the size at runtime but prevents some optimizations, (3) set Module.TOTAL_MEMORY to a higher value before the program runs, or if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ");
}
function enlargeMemory() {
 abortOnCannotGrowMemory();
}
var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;
var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216;
var totalMemory = 64 * 1024;
while (totalMemory < TOTAL_MEMORY || totalMemory < 2 * TOTAL_STACK) {
 if (totalMemory < 16 * 1024 * 1024) {
  totalMemory *= 2;
 } else {
  totalMemory += 16 * 1024 * 1024;
 }
}
if (totalMemory !== TOTAL_MEMORY) {
 TOTAL_MEMORY = totalMemory;
}
assert(typeof Int32Array !== "undefined" && typeof Float64Array !== "undefined" && !!(new Int32Array(1))["subarray"] && !!(new Int32Array(1))["set"], "JS engine does not provide full typed array support");
var buffer;
buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, "Typed arrays 2 must be run on a little-endian system");
Module["HEAP"] = HEAP;
Module["buffer"] = buffer;
Module["HEAP8"] = HEAP8;
Module["HEAP16"] = HEAP16;
Module["HEAP32"] = HEAP32;
Module["HEAPU8"] = HEAPU8;
Module["HEAPU16"] = HEAPU16;
Module["HEAPU32"] = HEAPU32;
Module["HEAPF32"] = HEAPF32;
Module["HEAPF64"] = HEAPF64;
function callRuntimeCallbacks(callbacks) {
 while (callbacks.length > 0) {
  var callback = callbacks.shift();
  if (typeof callback == "function") {
   callback();
   continue;
  }
  var func = callback.func;
  if (typeof func === "number") {
   if (callback.arg === undefined) {
    Runtime.dynCall("v", func);
   } else {
    Runtime.dynCall("vi", func, [ callback.arg ]);
   }
  } else {
   func(callback.arg === undefined ? null : callback.arg);
  }
 }
}
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATEXIT__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
var runtimeExited = false;
function preRun() {
 if (Module["preRun"]) {
  if (typeof Module["preRun"] == "function") Module["preRun"] = [ Module["preRun"] ];
  while (Module["preRun"].length) {
   addOnPreRun(Module["preRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPRERUN__);
}
function ensureInitRuntime() {
 if (runtimeInitialized) return;
 runtimeInitialized = true;
 callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
 callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
 callRuntimeCallbacks(__ATEXIT__);
 runtimeExited = true;
}
function postRun() {
 if (Module["postRun"]) {
  if (typeof Module["postRun"] == "function") Module["postRun"] = [ Module["postRun"] ];
  while (Module["postRun"].length) {
   addOnPostRun(Module["postRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
 __ATPRERUN__.unshift(cb);
}
Module["addOnPreRun"] = addOnPreRun;
function addOnInit(cb) {
 __ATINIT__.unshift(cb);
}
Module["addOnInit"] = addOnInit;
function addOnPreMain(cb) {
 __ATMAIN__.unshift(cb);
}
Module["addOnPreMain"] = addOnPreMain;
function addOnExit(cb) {
 __ATEXIT__.unshift(cb);
}
Module["addOnExit"] = addOnExit;
function addOnPostRun(cb) {
 __ATPOSTRUN__.unshift(cb);
}
Module["addOnPostRun"] = addOnPostRun;
function intArrayFromString(stringy, dontAddNull, length) {
 var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
 var u8array = new Array(len);
 var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
 if (dontAddNull) u8array.length = numBytesWritten;
 return u8array;
}
Module["intArrayFromString"] = intArrayFromString;
function intArrayToString(array) {
 var ret = [];
 for (var i = 0; i < array.length; i++) {
  var chr = array[i];
  if (chr > 255) {
   chr &= 255;
  }
  ret.push(String.fromCharCode(chr));
 }
 return ret.join("");
}
Module["intArrayToString"] = intArrayToString;
function writeStringToMemory(string, buffer, dontAddNull) {
 var array = intArrayFromString(string, dontAddNull);
 var i = 0;
 while (i < array.length) {
  var chr = array[i];
  HEAP8[buffer + i >> 0] = chr;
  i = i + 1;
 }
}
Module["writeStringToMemory"] = writeStringToMemory;
function writeArrayToMemory(array, buffer) {
 for (var i = 0; i < array.length; i++) {
  HEAP8[buffer++ >> 0] = array[i];
 }
}
Module["writeArrayToMemory"] = writeArrayToMemory;
function writeAsciiToMemory(str, buffer, dontAddNull) {
 for (var i = 0; i < str.length; ++i) {
  HEAP8[buffer++ >> 0] = str.charCodeAt(i);
 }
 if (!dontAddNull) HEAP8[buffer >> 0] = 0;
}
Module["writeAsciiToMemory"] = writeAsciiToMemory;
function unSign(value, bits, ignore) {
 if (value >= 0) {
  return value;
 }
 return bits <= 32 ? 2 * Math.abs(1 << bits - 1) + value : Math.pow(2, bits) + value;
}
function reSign(value, bits, ignore) {
 if (value <= 0) {
  return value;
 }
 var half = bits <= 32 ? Math.abs(1 << bits - 1) : Math.pow(2, bits - 1);
 if (value >= half && (bits <= 32 || value > half)) {
  value = -2 * half + value;
 }
 return value;
}
if (!Math["imul"] || Math["imul"](4294967295, 5) !== -5) Math["imul"] = function imul(a, b) {
 var ah = a >>> 16;
 var al = a & 65535;
 var bh = b >>> 16;
 var bl = b & 65535;
 return al * bl + (ah * bl + al * bh << 16) | 0;
};
Math.imul = Math["imul"];
if (!Math["fround"]) {
 var froundBuffer = new Float32Array(1);
 Math["fround"] = (function(x) {
  froundBuffer[0] = x;
  return froundBuffer[0];
 });
}
Math.fround = Math["fround"];
if (!Math["clz32"]) Math["clz32"] = (function(x) {
 x = x >>> 0;
 for (var i = 0; i < 32; i++) {
  if (x & 1 << 31 - i) return i;
 }
 return 32;
});
Math.clz32 = Math["clz32"];
var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_min = Math.min;
var Math_clz32 = Math.clz32;
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
function getUniqueRunDependency(id) {
 return id;
}
function addRunDependency(id) {
 runDependencies++;
 if (Module["monitorRunDependencies"]) {
  Module["monitorRunDependencies"](runDependencies);
 }
}
Module["addRunDependency"] = addRunDependency;
function removeRunDependency(id) {
 runDependencies--;
 if (Module["monitorRunDependencies"]) {
  Module["monitorRunDependencies"](runDependencies);
 }
 if (runDependencies == 0) {
  if (runDependencyWatcher !== null) {
   clearInterval(runDependencyWatcher);
   runDependencyWatcher = null;
  }
  if (dependenciesFulfilled) {
   var callback = dependenciesFulfilled;
   dependenciesFulfilled = null;
   callback();
  }
 }
}
Module["removeRunDependency"] = removeRunDependency;
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};
var memoryInitializer = null;
var ASM_CONSTS = [];
STATIC_BASE = 8;
STATICTOP = STATIC_BASE + 4512;
__ATINIT__.push();
memoryInitializer = "skinning.f32.js.mem";
var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
assert(tempDoublePtr % 8 == 0);
function copyTempFloat(ptr) {
 HEAP8[tempDoublePtr] = HEAP8[ptr];
 HEAP8[tempDoublePtr + 1] = HEAP8[ptr + 1];
 HEAP8[tempDoublePtr + 2] = HEAP8[ptr + 2];
 HEAP8[tempDoublePtr + 3] = HEAP8[ptr + 3];
}
function copyTempDouble(ptr) {
 HEAP8[tempDoublePtr] = HEAP8[ptr];
 HEAP8[tempDoublePtr + 1] = HEAP8[ptr + 1];
 HEAP8[tempDoublePtr + 2] = HEAP8[ptr + 2];
 HEAP8[tempDoublePtr + 3] = HEAP8[ptr + 3];
 HEAP8[tempDoublePtr + 4] = HEAP8[ptr + 4];
 HEAP8[tempDoublePtr + 5] = HEAP8[ptr + 5];
 HEAP8[tempDoublePtr + 6] = HEAP8[ptr + 6];
 HEAP8[tempDoublePtr + 7] = HEAP8[ptr + 7];
}
var _BDtoIHigh = true;
Module["_i64Subtract"] = _i64Subtract;
Module["_i64Add"] = _i64Add;
function _pthread_cleanup_push(routine, arg) {
 __ATEXIT__.push((function() {
  Runtime.dynCall("vi", routine, [ arg ]);
 }));
 _pthread_cleanup_push.level = __ATEXIT__.length;
}
function __ZSt18uncaught_exceptionv() {
 return !!__ZSt18uncaught_exceptionv.uncaught_exception;
}
var EXCEPTIONS = {
 last: 0,
 caught: [],
 infos: {},
 deAdjust: (function(adjusted) {
  if (!adjusted || EXCEPTIONS.infos[adjusted]) return adjusted;
  for (var ptr in EXCEPTIONS.infos) {
   var info = EXCEPTIONS.infos[ptr];
   if (info.adjusted === adjusted) {
    return ptr;
   }
  }
  return adjusted;
 }),
 addRef: (function(ptr) {
  if (!ptr) return;
  var info = EXCEPTIONS.infos[ptr];
  info.refcount++;
 }),
 decRef: (function(ptr) {
  if (!ptr) return;
  var info = EXCEPTIONS.infos[ptr];
  assert(info.refcount > 0);
  info.refcount--;
  if (info.refcount === 0) {
   if (info.destructor) {
    Runtime.dynCall("vi", info.destructor, [ ptr ]);
   }
   delete EXCEPTIONS.infos[ptr];
   ___cxa_free_exception(ptr);
  }
 }),
 clearRef: (function(ptr) {
  if (!ptr) return;
  var info = EXCEPTIONS.infos[ptr];
  info.refcount = 0;
 })
};
function ___resumeException(ptr) {
 if (!EXCEPTIONS.last) {
  EXCEPTIONS.last = ptr;
 }
 EXCEPTIONS.clearRef(EXCEPTIONS.deAdjust(ptr));
 throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
}
function ___cxa_find_matching_catch() {
 var thrown = EXCEPTIONS.last;
 if (!thrown) {
  return (asm["setTempRet0"](0), 0) | 0;
 }
 var info = EXCEPTIONS.infos[thrown];
 var throwntype = info.type;
 if (!throwntype) {
  return (asm["setTempRet0"](0), thrown) | 0;
 }
 var typeArray = Array.prototype.slice.call(arguments);
 var pointer = Module["___cxa_is_pointer_type"](throwntype);
 if (!___cxa_find_matching_catch.buffer) ___cxa_find_matching_catch.buffer = _malloc(4);
 HEAP32[___cxa_find_matching_catch.buffer >> 2] = thrown;
 thrown = ___cxa_find_matching_catch.buffer;
 for (var i = 0; i < typeArray.length; i++) {
  if (typeArray[i] && Module["___cxa_can_catch"](typeArray[i], throwntype, thrown)) {
   thrown = HEAP32[thrown >> 2];
   info.adjusted = thrown;
   return (asm["setTempRet0"](typeArray[i]), thrown) | 0;
  }
 }
 thrown = HEAP32[thrown >> 2];
 return (asm["setTempRet0"](throwntype), thrown) | 0;
}
function ___cxa_throw(ptr, type, destructor) {
 EXCEPTIONS.infos[ptr] = {
  ptr: ptr,
  adjusted: ptr,
  type: type,
  destructor: destructor,
  refcount: 0
 };
 EXCEPTIONS.last = ptr;
 if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
  __ZSt18uncaught_exceptionv.uncaught_exception = 1;
 } else {
  __ZSt18uncaught_exceptionv.uncaught_exception++;
 }
 throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
}
Module["_memset"] = _memset;
var _BDtoILow = true;
Module["_bitshift64Lshr"] = _bitshift64Lshr;
Module["_bitshift64Shl"] = _bitshift64Shl;
function _pthread_cleanup_pop() {
 assert(_pthread_cleanup_push.level == __ATEXIT__.length, "cannot pop if something else added meanwhile!");
 __ATEXIT__.pop();
 _pthread_cleanup_push.level = __ATEXIT__.length;
}
function _abort() {
 Module["abort"]();
}
function ___lock() {}
function ___unlock() {}
var ERRNO_CODES = {
 EPERM: 1,
 ENOENT: 2,
 ESRCH: 3,
 EINTR: 4,
 EIO: 5,
 ENXIO: 6,
 E2BIG: 7,
 ENOEXEC: 8,
 EBADF: 9,
 ECHILD: 10,
 EAGAIN: 11,
 EWOULDBLOCK: 11,
 ENOMEM: 12,
 EACCES: 13,
 EFAULT: 14,
 ENOTBLK: 15,
 EBUSY: 16,
 EEXIST: 17,
 EXDEV: 18,
 ENODEV: 19,
 ENOTDIR: 20,
 EISDIR: 21,
 EINVAL: 22,
 ENFILE: 23,
 EMFILE: 24,
 ENOTTY: 25,
 ETXTBSY: 26,
 EFBIG: 27,
 ENOSPC: 28,
 ESPIPE: 29,
 EROFS: 30,
 EMLINK: 31,
 EPIPE: 32,
 EDOM: 33,
 ERANGE: 34,
 ENOMSG: 42,
 EIDRM: 43,
 ECHRNG: 44,
 EL2NSYNC: 45,
 EL3HLT: 46,
 EL3RST: 47,
 ELNRNG: 48,
 EUNATCH: 49,
 ENOCSI: 50,
 EL2HLT: 51,
 EDEADLK: 35,
 ENOLCK: 37,
 EBADE: 52,
 EBADR: 53,
 EXFULL: 54,
 ENOANO: 55,
 EBADRQC: 56,
 EBADSLT: 57,
 EDEADLOCK: 35,
 EBFONT: 59,
 ENOSTR: 60,
 ENODATA: 61,
 ETIME: 62,
 ENOSR: 63,
 ENONET: 64,
 ENOPKG: 65,
 EREMOTE: 66,
 ENOLINK: 67,
 EADV: 68,
 ESRMNT: 69,
 ECOMM: 70,
 EPROTO: 71,
 EMULTIHOP: 72,
 EDOTDOT: 73,
 EBADMSG: 74,
 ENOTUNIQ: 76,
 EBADFD: 77,
 EREMCHG: 78,
 ELIBACC: 79,
 ELIBBAD: 80,
 ELIBSCN: 81,
 ELIBMAX: 82,
 ELIBEXEC: 83,
 ENOSYS: 38,
 ENOTEMPTY: 39,
 ENAMETOOLONG: 36,
 ELOOP: 40,
 EOPNOTSUPP: 95,
 EPFNOSUPPORT: 96,
 ECONNRESET: 104,
 ENOBUFS: 105,
 EAFNOSUPPORT: 97,
 EPROTOTYPE: 91,
 ENOTSOCK: 88,
 ENOPROTOOPT: 92,
 ESHUTDOWN: 108,
 ECONNREFUSED: 111,
 EADDRINUSE: 98,
 ECONNABORTED: 103,
 ENETUNREACH: 101,
 ENETDOWN: 100,
 ETIMEDOUT: 110,
 EHOSTDOWN: 112,
 EHOSTUNREACH: 113,
 EINPROGRESS: 115,
 EALREADY: 114,
 EDESTADDRREQ: 89,
 EMSGSIZE: 90,
 EPROTONOSUPPORT: 93,
 ESOCKTNOSUPPORT: 94,
 EADDRNOTAVAIL: 99,
 ENETRESET: 102,
 EISCONN: 106,
 ENOTCONN: 107,
 ETOOMANYREFS: 109,
 EUSERS: 87,
 EDQUOT: 122,
 ESTALE: 116,
 ENOTSUP: 95,
 ENOMEDIUM: 123,
 EILSEQ: 84,
 EOVERFLOW: 75,
 ECANCELED: 125,
 ENOTRECOVERABLE: 131,
 EOWNERDEAD: 130,
 ESTRPIPE: 86
};
var ERRNO_MESSAGES = {
 0: "Success",
 1: "Not super-user",
 2: "No such file or directory",
 3: "No such process",
 4: "Interrupted system call",
 5: "I/O error",
 6: "No such device or address",
 7: "Arg list too long",
 8: "Exec format error",
 9: "Bad file number",
 10: "No children",
 11: "No more processes",
 12: "Not enough core",
 13: "Permission denied",
 14: "Bad address",
 15: "Block device required",
 16: "Mount device busy",
 17: "File exists",
 18: "Cross-device link",
 19: "No such device",
 20: "Not a directory",
 21: "Is a directory",
 22: "Invalid argument",
 23: "Too many open files in system",
 24: "Too many open files",
 25: "Not a typewriter",
 26: "Text file busy",
 27: "File too large",
 28: "No space left on device",
 29: "Illegal seek",
 30: "Read only file system",
 31: "Too many links",
 32: "Broken pipe",
 33: "Math arg out of domain of func",
 34: "Math result not representable",
 35: "File locking deadlock error",
 36: "File or path name too long",
 37: "No record locks available",
 38: "Function not implemented",
 39: "Directory not empty",
 40: "Too many symbolic links",
 42: "No message of desired type",
 43: "Identifier removed",
 44: "Channel number out of range",
 45: "Level 2 not synchronized",
 46: "Level 3 halted",
 47: "Level 3 reset",
 48: "Link number out of range",
 49: "Protocol driver not attached",
 50: "No CSI structure available",
 51: "Level 2 halted",
 52: "Invalid exchange",
 53: "Invalid request descriptor",
 54: "Exchange full",
 55: "No anode",
 56: "Invalid request code",
 57: "Invalid slot",
 59: "Bad font file fmt",
 60: "Device not a stream",
 61: "No data (for no delay io)",
 62: "Timer expired",
 63: "Out of streams resources",
 64: "Machine is not on the network",
 65: "Package not installed",
 66: "The object is remote",
 67: "The link has been severed",
 68: "Advertise error",
 69: "Srmount error",
 70: "Communication error on send",
 71: "Protocol error",
 72: "Multihop attempted",
 73: "Cross mount point (not really error)",
 74: "Trying to read unreadable message",
 75: "Value too large for defined data type",
 76: "Given log. name not unique",
 77: "f.d. invalid for this operation",
 78: "Remote address changed",
 79: "Can   access a needed shared lib",
 80: "Accessing a corrupted shared lib",
 81: ".lib section in a.out corrupted",
 82: "Attempting to link in too many libs",
 83: "Attempting to exec a shared library",
 84: "Illegal byte sequence",
 86: "Streams pipe error",
 87: "Too many users",
 88: "Socket operation on non-socket",
 89: "Destination address required",
 90: "Message too long",
 91: "Protocol wrong type for socket",
 92: "Protocol not available",
 93: "Unknown protocol",
 94: "Socket type not supported",
 95: "Not supported",
 96: "Protocol family not supported",
 97: "Address family not supported by protocol family",
 98: "Address already in use",
 99: "Address not available",
 100: "Network interface is not configured",
 101: "Network is unreachable",
 102: "Connection reset by network",
 103: "Connection aborted",
 104: "Connection reset by peer",
 105: "No buffer space available",
 106: "Socket is already connected",
 107: "Socket is not connected",
 108: "Can't send after socket shutdown",
 109: "Too many references",
 110: "Connection timed out",
 111: "Connection refused",
 112: "Host is down",
 113: "Host is unreachable",
 114: "Socket already connected",
 115: "Connection already in progress",
 116: "Stale file handle",
 122: "Quota exceeded",
 123: "No medium (in tape drive)",
 125: "Operation canceled",
 130: "Previous owner died",
 131: "State not recoverable"
};
function ___setErrNo(value) {
 if (Module["___errno_location"]) HEAP32[Module["___errno_location"]() >> 2] = value;
 return value;
}
var PATH = {
 splitPath: (function(filename) {
  var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
  return splitPathRe.exec(filename).slice(1);
 }),
 normalizeArray: (function(parts, allowAboveRoot) {
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
   var last = parts[i];
   if (last === ".") {
    parts.splice(i, 1);
   } else if (last === "..") {
    parts.splice(i, 1);
    up++;
   } else if (up) {
    parts.splice(i, 1);
    up--;
   }
  }
  if (allowAboveRoot) {
   for (; up--; up) {
    parts.unshift("..");
   }
  }
  return parts;
 }),
 normalize: (function(path) {
  var isAbsolute = path.charAt(0) === "/", trailingSlash = path.substr(-1) === "/";
  path = PATH.normalizeArray(path.split("/").filter((function(p) {
   return !!p;
  })), !isAbsolute).join("/");
  if (!path && !isAbsolute) {
   path = ".";
  }
  if (path && trailingSlash) {
   path += "/";
  }
  return (isAbsolute ? "/" : "") + path;
 }),
 dirname: (function(path) {
  var result = PATH.splitPath(path), root = result[0], dir = result[1];
  if (!root && !dir) {
   return ".";
  }
  if (dir) {
   dir = dir.substr(0, dir.length - 1);
  }
  return root + dir;
 }),
 basename: (function(path) {
  if (path === "/") return "/";
  var lastSlash = path.lastIndexOf("/");
  if (lastSlash === -1) return path;
  return path.substr(lastSlash + 1);
 }),
 extname: (function(path) {
  return PATH.splitPath(path)[3];
 }),
 join: (function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return PATH.normalize(paths.join("/"));
 }),
 join2: (function(l, r) {
  return PATH.normalize(l + "/" + r);
 }),
 resolve: (function() {
  var resolvedPath = "", resolvedAbsolute = false;
  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
   var path = i >= 0 ? arguments[i] : FS.cwd();
   if (typeof path !== "string") {
    throw new TypeError("Arguments to path.resolve must be strings");
   } else if (!path) {
    return "";
   }
   resolvedPath = path + "/" + resolvedPath;
   resolvedAbsolute = path.charAt(0) === "/";
  }
  resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((function(p) {
   return !!p;
  })), !resolvedAbsolute).join("/");
  return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
 }),
 relative: (function(from, to) {
  from = PATH.resolve(from).substr(1);
  to = PATH.resolve(to).substr(1);
  function trim(arr) {
   var start = 0;
   for (; start < arr.length; start++) {
    if (arr[start] !== "") break;
   }
   var end = arr.length - 1;
   for (; end >= 0; end--) {
    if (arr[end] !== "") break;
   }
   if (start > end) return [];
   return arr.slice(start, end - start + 1);
  }
  var fromParts = trim(from.split("/"));
  var toParts = trim(to.split("/"));
  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
   if (fromParts[i] !== toParts[i]) {
    samePartsLength = i;
    break;
   }
  }
  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
   outputParts.push("..");
  }
  outputParts = outputParts.concat(toParts.slice(samePartsLength));
  return outputParts.join("/");
 })
};
var TTY = {
 ttys: [],
 init: (function() {}),
 shutdown: (function() {}),
 register: (function(dev, ops) {
  TTY.ttys[dev] = {
   input: [],
   output: [],
   ops: ops
  };
  FS.registerDevice(dev, TTY.stream_ops);
 }),
 stream_ops: {
  open: (function(stream) {
   var tty = TTY.ttys[stream.node.rdev];
   if (!tty) {
    throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
   }
   stream.tty = tty;
   stream.seekable = false;
  }),
  close: (function(stream) {
   stream.tty.ops.flush(stream.tty);
  }),
  flush: (function(stream) {
   stream.tty.ops.flush(stream.tty);
  }),
  read: (function(stream, buffer, offset, length, pos) {
   if (!stream.tty || !stream.tty.ops.get_char) {
    throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
   }
   var bytesRead = 0;
   for (var i = 0; i < length; i++) {
    var result;
    try {
     result = stream.tty.ops.get_char(stream.tty);
    } catch (e) {
     throw new FS.ErrnoError(ERRNO_CODES.EIO);
    }
    if (result === undefined && bytesRead === 0) {
     throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
    }
    if (result === null || result === undefined) break;
    bytesRead++;
    buffer[offset + i] = result;
   }
   if (bytesRead) {
    stream.node.timestamp = Date.now();
   }
   return bytesRead;
  }),
  write: (function(stream, buffer, offset, length, pos) {
   if (!stream.tty || !stream.tty.ops.put_char) {
    throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
   }
   for (var i = 0; i < length; i++) {
    try {
     stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
    } catch (e) {
     throw new FS.ErrnoError(ERRNO_CODES.EIO);
    }
   }
   if (length) {
    stream.node.timestamp = Date.now();
   }
   return i;
  })
 },
 default_tty_ops: {
  get_char: (function(tty) {
   if (!tty.input.length) {
    var result = null;
    if (ENVIRONMENT_IS_NODE) {
     var BUFSIZE = 256;
     var buf = new Buffer(BUFSIZE);
     var bytesRead = 0;
     var fd = process.stdin.fd;
     var usingDevice = false;
     try {
      fd = fs.openSync("/dev/stdin", "r");
      usingDevice = true;
     } catch (e) {}
     bytesRead = fs.readSync(fd, buf, 0, BUFSIZE, null);
     if (usingDevice) {
      fs.closeSync(fd);
     }
     if (bytesRead > 0) {
      result = buf.slice(0, bytesRead).toString("utf-8");
     } else {
      result = null;
     }
    } else if (typeof window != "undefined" && typeof window.prompt == "function") {
     result = window.prompt("Input: ");
     if (result !== null) {
      result += "\n";
     }
    } else if (typeof readline == "function") {
     result = readline();
     if (result !== null) {
      result += "\n";
     }
    }
    if (!result) {
     return null;
    }
    tty.input = intArrayFromString(result, true);
   }
   return tty.input.shift();
  }),
  put_char: (function(tty, val) {
   if (val === null || val === 10) {
    Module["print"](UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   } else {
    if (val != 0) tty.output.push(val);
   }
  }),
  flush: (function(tty) {
   if (tty.output && tty.output.length > 0) {
    Module["print"](UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   }
  })
 },
 default_tty1_ops: {
  put_char: (function(tty, val) {
   if (val === null || val === 10) {
    Module["printErr"](UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   } else {
    if (val != 0) tty.output.push(val);
   }
  }),
  flush: (function(tty) {
   if (tty.output && tty.output.length > 0) {
    Module["printErr"](UTF8ArrayToString(tty.output, 0));
    tty.output = [];
   }
  })
 }
};
var MEMFS = {
 ops_table: null,
 mount: (function(mount) {
  return MEMFS.createNode(null, "/", 16384 | 511, 0);
 }),
 createNode: (function(parent, name, mode, dev) {
  if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  if (!MEMFS.ops_table) {
   MEMFS.ops_table = {
    dir: {
     node: {
      getattr: MEMFS.node_ops.getattr,
      setattr: MEMFS.node_ops.setattr,
      lookup: MEMFS.node_ops.lookup,
      mknod: MEMFS.node_ops.mknod,
      rename: MEMFS.node_ops.rename,
      unlink: MEMFS.node_ops.unlink,
      rmdir: MEMFS.node_ops.rmdir,
      readdir: MEMFS.node_ops.readdir,
      symlink: MEMFS.node_ops.symlink
     },
     stream: {
      llseek: MEMFS.stream_ops.llseek
     }
    },
    file: {
     node: {
      getattr: MEMFS.node_ops.getattr,
      setattr: MEMFS.node_ops.setattr
     },
     stream: {
      llseek: MEMFS.stream_ops.llseek,
      read: MEMFS.stream_ops.read,
      write: MEMFS.stream_ops.write,
      allocate: MEMFS.stream_ops.allocate,
      mmap: MEMFS.stream_ops.mmap,
      msync: MEMFS.stream_ops.msync
     }
    },
    link: {
     node: {
      getattr: MEMFS.node_ops.getattr,
      setattr: MEMFS.node_ops.setattr,
      readlink: MEMFS.node_ops.readlink
     },
     stream: {}
    },
    chrdev: {
     node: {
      getattr: MEMFS.node_ops.getattr,
      setattr: MEMFS.node_ops.setattr
     },
     stream: FS.chrdev_stream_ops
    }
   };
  }
  var node = FS.createNode(parent, name, mode, dev);
  if (FS.isDir(node.mode)) {
   node.node_ops = MEMFS.ops_table.dir.node;
   node.stream_ops = MEMFS.ops_table.dir.stream;
   node.contents = {};
  } else if (FS.isFile(node.mode)) {
   node.node_ops = MEMFS.ops_table.file.node;
   node.stream_ops = MEMFS.ops_table.file.stream;
   node.usedBytes = 0;
   node.contents = null;
  } else if (FS.isLink(node.mode)) {
   node.node_ops = MEMFS.ops_table.link.node;
   node.stream_ops = MEMFS.ops_table.link.stream;
  } else if (FS.isChrdev(node.mode)) {
   node.node_ops = MEMFS.ops_table.chrdev.node;
   node.stream_ops = MEMFS.ops_table.chrdev.stream;
  }
  node.timestamp = Date.now();
  if (parent) {
   parent.contents[name] = node;
  }
  return node;
 }),
 getFileDataAsRegularArray: (function(node) {
  if (node.contents && node.contents.subarray) {
   var arr = [];
   for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
   return arr;
  }
  return node.contents;
 }),
 getFileDataAsTypedArray: (function(node) {
  if (!node.contents) return new Uint8Array;
  if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
  return new Uint8Array(node.contents);
 }),
 expandFileStorage: (function(node, newCapacity) {
  if (node.contents && node.contents.subarray && newCapacity > node.contents.length) {
   node.contents = MEMFS.getFileDataAsRegularArray(node);
   node.usedBytes = node.contents.length;
  }
  if (!node.contents || node.contents.subarray) {
   var prevCapacity = node.contents ? node.contents.buffer.byteLength : 0;
   if (prevCapacity >= newCapacity) return;
   var CAPACITY_DOUBLING_MAX = 1024 * 1024;
   newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) | 0);
   if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
   var oldContents = node.contents;
   node.contents = new Uint8Array(newCapacity);
   if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
   return;
  }
  if (!node.contents && newCapacity > 0) node.contents = [];
  while (node.contents.length < newCapacity) node.contents.push(0);
 }),
 resizeFileStorage: (function(node, newSize) {
  if (node.usedBytes == newSize) return;
  if (newSize == 0) {
   node.contents = null;
   node.usedBytes = 0;
   return;
  }
  if (!node.contents || node.contents.subarray) {
   var oldContents = node.contents;
   node.contents = new Uint8Array(new ArrayBuffer(newSize));
   if (oldContents) {
    node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
   }
   node.usedBytes = newSize;
   return;
  }
  if (!node.contents) node.contents = [];
  if (node.contents.length > newSize) node.contents.length = newSize; else while (node.contents.length < newSize) node.contents.push(0);
  node.usedBytes = newSize;
 }),
 node_ops: {
  getattr: (function(node) {
   var attr = {};
   attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
   attr.ino = node.id;
   attr.mode = node.mode;
   attr.nlink = 1;
   attr.uid = 0;
   attr.gid = 0;
   attr.rdev = node.rdev;
   if (FS.isDir(node.mode)) {
    attr.size = 4096;
   } else if (FS.isFile(node.mode)) {
    attr.size = node.usedBytes;
   } else if (FS.isLink(node.mode)) {
    attr.size = node.link.length;
   } else {
    attr.size = 0;
   }
   attr.atime = new Date(node.timestamp);
   attr.mtime = new Date(node.timestamp);
   attr.ctime = new Date(node.timestamp);
   attr.blksize = 4096;
   attr.blocks = Math.ceil(attr.size / attr.blksize);
   return attr;
  }),
  setattr: (function(node, attr) {
   if (attr.mode !== undefined) {
    node.mode = attr.mode;
   }
   if (attr.timestamp !== undefined) {
    node.timestamp = attr.timestamp;
   }
   if (attr.size !== undefined) {
    MEMFS.resizeFileStorage(node, attr.size);
   }
  }),
  lookup: (function(parent, name) {
   throw FS.genericErrors[ERRNO_CODES.ENOENT];
  }),
  mknod: (function(parent, name, mode, dev) {
   return MEMFS.createNode(parent, name, mode, dev);
  }),
  rename: (function(old_node, new_dir, new_name) {
   if (FS.isDir(old_node.mode)) {
    var new_node;
    try {
     new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {}
    if (new_node) {
     for (var i in new_node.contents) {
      throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
     }
    }
   }
   delete old_node.parent.contents[old_node.name];
   old_node.name = new_name;
   new_dir.contents[new_name] = old_node;
   old_node.parent = new_dir;
  }),
  unlink: (function(parent, name) {
   delete parent.contents[name];
  }),
  rmdir: (function(parent, name) {
   var node = FS.lookupNode(parent, name);
   for (var i in node.contents) {
    throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
   }
   delete parent.contents[name];
  }),
  readdir: (function(node) {
   var entries = [ ".", ".." ];
   for (var key in node.contents) {
    if (!node.contents.hasOwnProperty(key)) {
     continue;
    }
    entries.push(key);
   }
   return entries;
  }),
  symlink: (function(parent, newname, oldpath) {
   var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
   node.link = oldpath;
   return node;
  }),
  readlink: (function(node) {
   if (!FS.isLink(node.mode)) {
    throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
   }
   return node.link;
  })
 },
 stream_ops: {
  read: (function(stream, buffer, offset, length, position) {
   var contents = stream.node.contents;
   if (position >= stream.node.usedBytes) return 0;
   var size = Math.min(stream.node.usedBytes - position, length);
   assert(size >= 0);
   if (size > 8 && contents.subarray) {
    buffer.set(contents.subarray(position, position + size), offset);
   } else {
    for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
   }
   return size;
  }),
  write: (function(stream, buffer, offset, length, position, canOwn) {
   if (!length) return 0;
   var node = stream.node;
   node.timestamp = Date.now();
   if (buffer.subarray && (!node.contents || node.contents.subarray)) {
    if (canOwn) {
     node.contents = buffer.subarray(offset, offset + length);
     node.usedBytes = length;
     return length;
    } else if (node.usedBytes === 0 && position === 0) {
     node.contents = new Uint8Array(buffer.subarray(offset, offset + length));
     node.usedBytes = length;
     return length;
    } else if (position + length <= node.usedBytes) {
     node.contents.set(buffer.subarray(offset, offset + length), position);
     return length;
    }
   }
   MEMFS.expandFileStorage(node, position + length);
   if (node.contents.subarray && buffer.subarray) node.contents.set(buffer.subarray(offset, offset + length), position); else {
    for (var i = 0; i < length; i++) {
     node.contents[position + i] = buffer[offset + i];
    }
   }
   node.usedBytes = Math.max(node.usedBytes, position + length);
   return length;
  }),
  llseek: (function(stream, offset, whence) {
   var position = offset;
   if (whence === 1) {
    position += stream.position;
   } else if (whence === 2) {
    if (FS.isFile(stream.node.mode)) {
     position += stream.node.usedBytes;
    }
   }
   if (position < 0) {
    throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
   }
   return position;
  }),
  allocate: (function(stream, offset, length) {
   MEMFS.expandFileStorage(stream.node, offset + length);
   stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
  }),
  mmap: (function(stream, buffer, offset, length, position, prot, flags) {
   if (!FS.isFile(stream.node.mode)) {
    throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
   }
   var ptr;
   var allocated;
   var contents = stream.node.contents;
   if (!(flags & 2) && (contents.buffer === buffer || contents.buffer === buffer.buffer)) {
    allocated = false;
    ptr = contents.byteOffset;
   } else {
    if (position > 0 || position + length < stream.node.usedBytes) {
     if (contents.subarray) {
      contents = contents.subarray(position, position + length);
     } else {
      contents = Array.prototype.slice.call(contents, position, position + length);
     }
    }
    allocated = true;
    ptr = _malloc(length);
    if (!ptr) {
     throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
    }
    buffer.set(contents, ptr);
   }
   return {
    ptr: ptr,
    allocated: allocated
   };
  }),
  msync: (function(stream, buffer, offset, length, mmapFlags) {
   if (!FS.isFile(stream.node.mode)) {
    throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
   }
   if (mmapFlags & 2) {
    return 0;
   }
   var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
   return 0;
  })
 }
};
var IDBFS = {
 dbs: {},
 indexedDB: (function() {
  if (typeof indexedDB !== "undefined") return indexedDB;
  var ret = null;
  if (typeof window === "object") ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  assert(ret, "IDBFS used, but indexedDB not supported");
  return ret;
 }),
 DB_VERSION: 21,
 DB_STORE_NAME: "FILE_DATA",
 mount: (function(mount) {
  return MEMFS.mount.apply(null, arguments);
 }),
 syncfs: (function(mount, populate, callback) {
  IDBFS.getLocalSet(mount, (function(err, local) {
   if (err) return callback(err);
   IDBFS.getRemoteSet(mount, (function(err, remote) {
    if (err) return callback(err);
    var src = populate ? remote : local;
    var dst = populate ? local : remote;
    IDBFS.reconcile(src, dst, callback);
   }));
  }));
 }),
 getDB: (function(name, callback) {
  var db = IDBFS.dbs[name];
  if (db) {
   return callback(null, db);
  }
  var req;
  try {
   req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
  } catch (e) {
   return callback(e);
  }
  req.onupgradeneeded = (function(e) {
   var db = e.target.result;
   var transaction = e.target.transaction;
   var fileStore;
   if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
    fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
   } else {
    fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
   }
   if (!fileStore.indexNames.contains("timestamp")) {
    fileStore.createIndex("timestamp", "timestamp", {
     unique: false
    });
   }
  });
  req.onsuccess = (function() {
   db = req.result;
   IDBFS.dbs[name] = db;
   callback(null, db);
  });
  req.onerror = (function(e) {
   callback(this.error);
   e.preventDefault();
  });
 }),
 getLocalSet: (function(mount, callback) {
  var entries = {};
  function isRealDir(p) {
   return p !== "." && p !== "..";
  }
  function toAbsolute(root) {
   return (function(p) {
    return PATH.join2(root, p);
   });
  }
  var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
  while (check.length) {
   var path = check.pop();
   var stat;
   try {
    stat = FS.stat(path);
   } catch (e) {
    return callback(e);
   }
   if (FS.isDir(stat.mode)) {
    check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
   }
   entries[path] = {
    timestamp: stat.mtime
   };
  }
  return callback(null, {
   type: "local",
   entries: entries
  });
 }),
 getRemoteSet: (function(mount, callback) {
  var entries = {};
  IDBFS.getDB(mount.mountpoint, (function(err, db) {
   if (err) return callback(err);
   var transaction = db.transaction([ IDBFS.DB_STORE_NAME ], "readonly");
   transaction.onerror = (function(e) {
    callback(this.error);
    e.preventDefault();
   });
   var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
   var index = store.index("timestamp");
   index.openKeyCursor().onsuccess = (function(event) {
    var cursor = event.target.result;
    if (!cursor) {
     return callback(null, {
      type: "remote",
      db: db,
      entries: entries
     });
    }
    entries[cursor.primaryKey] = {
     timestamp: cursor.key
    };
    cursor.continue();
   });
  }));
 }),
 loadLocalEntry: (function(path, callback) {
  var stat, node;
  try {
   var lookup = FS.lookupPath(path);
   node = lookup.node;
   stat = FS.stat(path);
  } catch (e) {
   return callback(e);
  }
  if (FS.isDir(stat.mode)) {
   return callback(null, {
    timestamp: stat.mtime,
    mode: stat.mode
   });
  } else if (FS.isFile(stat.mode)) {
   node.contents = MEMFS.getFileDataAsTypedArray(node);
   return callback(null, {
    timestamp: stat.mtime,
    mode: stat.mode,
    contents: node.contents
   });
  } else {
   return callback(new Error("node type not supported"));
  }
 }),
 storeLocalEntry: (function(path, entry, callback) {
  try {
   if (FS.isDir(entry.mode)) {
    FS.mkdir(path, entry.mode);
   } else if (FS.isFile(entry.mode)) {
    FS.writeFile(path, entry.contents, {
     encoding: "binary",
     canOwn: true
    });
   } else {
    return callback(new Error("node type not supported"));
   }
   FS.chmod(path, entry.mode);
   FS.utime(path, entry.timestamp, entry.timestamp);
  } catch (e) {
   return callback(e);
  }
  callback(null);
 }),
 removeLocalEntry: (function(path, callback) {
  try {
   var lookup = FS.lookupPath(path);
   var stat = FS.stat(path);
   if (FS.isDir(stat.mode)) {
    FS.rmdir(path);
   } else if (FS.isFile(stat.mode)) {
    FS.unlink(path);
   }
  } catch (e) {
   return callback(e);
  }
  callback(null);
 }),
 loadRemoteEntry: (function(store, path, callback) {
  var req = store.get(path);
  req.onsuccess = (function(event) {
   callback(null, event.target.result);
  });
  req.onerror = (function(e) {
   callback(this.error);
   e.preventDefault();
  });
 }),
 storeRemoteEntry: (function(store, path, entry, callback) {
  var req = store.put(entry, path);
  req.onsuccess = (function() {
   callback(null);
  });
  req.onerror = (function(e) {
   callback(this.error);
   e.preventDefault();
  });
 }),
 removeRemoteEntry: (function(store, path, callback) {
  var req = store.delete(path);
  req.onsuccess = (function() {
   callback(null);
  });
  req.onerror = (function(e) {
   callback(this.error);
   e.preventDefault();
  });
 }),
 reconcile: (function(src, dst, callback) {
  var total = 0;
  var create = [];
  Object.keys(src.entries).forEach((function(key) {
   var e = src.entries[key];
   var e2 = dst.entries[key];
   if (!e2 || e.timestamp > e2.timestamp) {
    create.push(key);
    total++;
   }
  }));
  var remove = [];
  Object.keys(dst.entries).forEach((function(key) {
   var e = dst.entries[key];
   var e2 = src.entries[key];
   if (!e2) {
    remove.push(key);
    total++;
   }
  }));
  if (!total) {
   return callback(null);
  }
  var errored = false;
  var completed = 0;
  var db = src.type === "remote" ? src.db : dst.db;
  var transaction = db.transaction([ IDBFS.DB_STORE_NAME ], "readwrite");
  var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  function done(err) {
   if (err) {
    if (!done.errored) {
     done.errored = true;
     return callback(err);
    }
    return;
   }
   if (++completed >= total) {
    return callback(null);
   }
  }
  transaction.onerror = (function(e) {
   done(this.error);
   e.preventDefault();
  });
  create.sort().forEach((function(path) {
   if (dst.type === "local") {
    IDBFS.loadRemoteEntry(store, path, (function(err, entry) {
     if (err) return done(err);
     IDBFS.storeLocalEntry(path, entry, done);
    }));
   } else {
    IDBFS.loadLocalEntry(path, (function(err, entry) {
     if (err) return done(err);
     IDBFS.storeRemoteEntry(store, path, entry, done);
    }));
   }
  }));
  remove.sort().reverse().forEach((function(path) {
   if (dst.type === "local") {
    IDBFS.removeLocalEntry(path, done);
   } else {
    IDBFS.removeRemoteEntry(store, path, done);
   }
  }));
 })
};
var NODEFS = {
 isWindows: false,
 staticInit: (function() {
  NODEFS.isWindows = !!process.platform.match(/^win/);
 }),
 mount: (function(mount) {
  assert(ENVIRONMENT_IS_NODE);
  return NODEFS.createNode(null, "/", NODEFS.getMode(mount.opts.root), 0);
 }),
 createNode: (function(parent, name, mode, dev) {
  if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  var node = FS.createNode(parent, name, mode);
  node.node_ops = NODEFS.node_ops;
  node.stream_ops = NODEFS.stream_ops;
  return node;
 }),
 getMode: (function(path) {
  var stat;
  try {
   stat = fs.lstatSync(path);
   if (NODEFS.isWindows) {
    stat.mode = stat.mode | (stat.mode & 146) >> 1;
   }
  } catch (e) {
   if (!e.code) throw e;
   throw new FS.ErrnoError(ERRNO_CODES[e.code]);
  }
  return stat.mode;
 }),
 realPath: (function(node) {
  var parts = [];
  while (node.parent !== node) {
   parts.push(node.name);
   node = node.parent;
  }
  parts.push(node.mount.opts.root);
  parts.reverse();
  return PATH.join.apply(null, parts);
 }),
 flagsToPermissionStringMap: {
  0: "r",
  1: "r+",
  2: "r+",
  64: "r",
  65: "r+",
  66: "r+",
  129: "rx+",
  193: "rx+",
  514: "w+",
  577: "w",
  578: "w+",
  705: "wx",
  706: "wx+",
  1024: "a",
  1025: "a",
  1026: "a+",
  1089: "a",
  1090: "a+",
  1153: "ax",
  1154: "ax+",
  1217: "ax",
  1218: "ax+",
  4096: "rs",
  4098: "rs+"
 },
 flagsToPermissionString: (function(flags) {
  flags &= ~32768;
  if (flags in NODEFS.flagsToPermissionStringMap) {
   return NODEFS.flagsToPermissionStringMap[flags];
  } else {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
 }),
 node_ops: {
  getattr: (function(node) {
   var path = NODEFS.realPath(node);
   var stat;
   try {
    stat = fs.lstatSync(path);
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
   if (NODEFS.isWindows && !stat.blksize) {
    stat.blksize = 4096;
   }
   if (NODEFS.isWindows && !stat.blocks) {
    stat.blocks = (stat.size + stat.blksize - 1) / stat.blksize | 0;
   }
   return {
    dev: stat.dev,
    ino: stat.ino,
    mode: stat.mode,
    nlink: stat.nlink,
    uid: stat.uid,
    gid: stat.gid,
    rdev: stat.rdev,
    size: stat.size,
    atime: stat.atime,
    mtime: stat.mtime,
    ctime: stat.ctime,
    blksize: stat.blksize,
    blocks: stat.blocks
   };
  }),
  setattr: (function(node, attr) {
   var path = NODEFS.realPath(node);
   try {
    if (attr.mode !== undefined) {
     fs.chmodSync(path, attr.mode);
     node.mode = attr.mode;
    }
    if (attr.timestamp !== undefined) {
     var date = new Date(attr.timestamp);
     fs.utimesSync(path, date, date);
    }
    if (attr.size !== undefined) {
     fs.truncateSync(path, attr.size);
    }
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  lookup: (function(parent, name) {
   var path = PATH.join2(NODEFS.realPath(parent), name);
   var mode = NODEFS.getMode(path);
   return NODEFS.createNode(parent, name, mode);
  }),
  mknod: (function(parent, name, mode, dev) {
   var node = NODEFS.createNode(parent, name, mode, dev);
   var path = NODEFS.realPath(node);
   try {
    if (FS.isDir(node.mode)) {
     fs.mkdirSync(path, node.mode);
    } else {
     fs.writeFileSync(path, "", {
      mode: node.mode
     });
    }
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
   return node;
  }),
  rename: (function(oldNode, newDir, newName) {
   var oldPath = NODEFS.realPath(oldNode);
   var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
   try {
    fs.renameSync(oldPath, newPath);
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  unlink: (function(parent, name) {
   var path = PATH.join2(NODEFS.realPath(parent), name);
   try {
    fs.unlinkSync(path);
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  rmdir: (function(parent, name) {
   var path = PATH.join2(NODEFS.realPath(parent), name);
   try {
    fs.rmdirSync(path);
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  readdir: (function(node) {
   var path = NODEFS.realPath(node);
   try {
    return fs.readdirSync(path);
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  symlink: (function(parent, newName, oldPath) {
   var newPath = PATH.join2(NODEFS.realPath(parent), newName);
   try {
    fs.symlinkSync(oldPath, newPath);
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  readlink: (function(node) {
   var path = NODEFS.realPath(node);
   try {
    path = fs.readlinkSync(path);
    path = NODEJS_PATH.relative(NODEJS_PATH.resolve(node.mount.opts.root), path);
    return path;
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  })
 },
 stream_ops: {
  open: (function(stream) {
   var path = NODEFS.realPath(stream.node);
   try {
    if (FS.isFile(stream.node.mode)) {
     stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
    }
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  close: (function(stream) {
   try {
    if (FS.isFile(stream.node.mode) && stream.nfd) {
     fs.closeSync(stream.nfd);
    }
   } catch (e) {
    if (!e.code) throw e;
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
  }),
  read: (function(stream, buffer, offset, length, position) {
   if (length === 0) return 0;
   var nbuffer = new Buffer(length);
   var res;
   try {
    res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
   } catch (e) {
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
   if (res > 0) {
    for (var i = 0; i < res; i++) {
     buffer[offset + i] = nbuffer[i];
    }
   }
   return res;
  }),
  write: (function(stream, buffer, offset, length, position) {
   var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
   var res;
   try {
    res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
   } catch (e) {
    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
   }
   return res;
  }),
  llseek: (function(stream, offset, whence) {
   var position = offset;
   if (whence === 1) {
    position += stream.position;
   } else if (whence === 2) {
    if (FS.isFile(stream.node.mode)) {
     try {
      var stat = fs.fstatSync(stream.nfd);
      position += stat.size;
     } catch (e) {
      throw new FS.ErrnoError(ERRNO_CODES[e.code]);
     }
    }
   }
   if (position < 0) {
    throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
   }
   return position;
  })
 }
};
var WORKERFS = {
 DIR_MODE: 16895,
 FILE_MODE: 33279,
 reader: null,
 mount: (function(mount) {
  assert(ENVIRONMENT_IS_WORKER);
  if (!WORKERFS.reader) WORKERFS.reader = new FileReaderSync;
  var root = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0);
  var createdParents = {};
  function ensureParent(path) {
   var parts = path.split("/");
   var parent = root;
   for (var i = 0; i < parts.length - 1; i++) {
    var curr = parts.slice(0, i + 1).join("/");
    if (!createdParents[curr]) {
     createdParents[curr] = WORKERFS.createNode(parent, curr, WORKERFS.DIR_MODE, 0);
    }
    parent = createdParents[curr];
   }
   return parent;
  }
  function base(path) {
   var parts = path.split("/");
   return parts[parts.length - 1];
  }
  Array.prototype.forEach.call(mount.opts["files"] || [], (function(file) {
   WORKERFS.createNode(ensureParent(file.name), base(file.name), WORKERFS.FILE_MODE, 0, file, file.lastModifiedDate);
  }));
  (mount.opts["blobs"] || []).forEach((function(obj) {
   WORKERFS.createNode(ensureParent(obj["name"]), base(obj["name"]), WORKERFS.FILE_MODE, 0, obj["data"]);
  }));
  (mount.opts["packages"] || []).forEach((function(pack) {
   pack["metadata"].files.forEach((function(file) {
    var name = file.filename.substr(1);
    WORKERFS.createNode(ensureParent(name), base(name), WORKERFS.FILE_MODE, 0, pack["blob"].slice(file.start, file.end));
   }));
  }));
  return root;
 }),
 createNode: (function(parent, name, mode, dev, contents, mtime) {
  var node = FS.createNode(parent, name, mode);
  node.mode = mode;
  node.node_ops = WORKERFS.node_ops;
  node.stream_ops = WORKERFS.stream_ops;
  node.timestamp = (mtime || new Date).getTime();
  assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE);
  if (mode === WORKERFS.FILE_MODE) {
   node.size = contents.size;
   node.contents = contents;
  } else {
   node.size = 4096;
   node.contents = {};
  }
  if (parent) {
   parent.contents[name] = node;
  }
  return node;
 }),
 node_ops: {
  getattr: (function(node) {
   return {
    dev: 1,
    ino: undefined,
    mode: node.mode,
    nlink: 1,
    uid: 0,
    gid: 0,
    rdev: undefined,
    size: node.size,
    atime: new Date(node.timestamp),
    mtime: new Date(node.timestamp),
    ctime: new Date(node.timestamp),
    blksize: 4096,
    blocks: Math.ceil(node.size / 4096)
   };
  }),
  setattr: (function(node, attr) {
   if (attr.mode !== undefined) {
    node.mode = attr.mode;
   }
   if (attr.timestamp !== undefined) {
    node.timestamp = attr.timestamp;
   }
  }),
  lookup: (function(parent, name) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  }),
  mknod: (function(parent, name, mode, dev) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }),
  rename: (function(oldNode, newDir, newName) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }),
  unlink: (function(parent, name) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }),
  rmdir: (function(parent, name) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }),
  readdir: (function(node) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }),
  symlink: (function(parent, newName, oldPath) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }),
  readlink: (function(node) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  })
 },
 stream_ops: {
  read: (function(stream, buffer, offset, length, position) {
   if (position >= stream.node.size) return 0;
   var chunk = stream.node.contents.slice(position, position + length);
   var ab = WORKERFS.reader.readAsArrayBuffer(chunk);
   buffer.set(new Uint8Array(ab), offset);
   return chunk.size;
  }),
  write: (function(stream, buffer, offset, length, position) {
   throw new FS.ErrnoError(ERRNO_CODES.EIO);
  }),
  llseek: (function(stream, offset, whence) {
   var position = offset;
   if (whence === 1) {
    position += stream.position;
   } else if (whence === 2) {
    if (FS.isFile(stream.node.mode)) {
     position += stream.node.size;
    }
   }
   if (position < 0) {
    throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
   }
   return position;
  })
 }
};
var _stdin = allocate(1, "i32*", ALLOC_STATIC);
var _stdout = allocate(1, "i32*", ALLOC_STATIC);
var _stderr = allocate(1, "i32*", ALLOC_STATIC);
var FS = {
 root: null,
 mounts: [],
 devices: [ null ],
 streams: [],
 nextInode: 1,
 nameTable: null,
 currentPath: "/",
 initialized: false,
 ignorePermissions: true,
 trackingDelegate: {},
 tracking: {
  openFlags: {
   READ: 1,
   WRITE: 2
  }
 },
 ErrnoError: null,
 genericErrors: {},
 filesystems: null,
 handleFSError: (function(e) {
  if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
  return ___setErrNo(e.errno);
 }),
 lookupPath: (function(path, opts) {
  path = PATH.resolve(FS.cwd(), path);
  opts = opts || {};
  if (!path) return {
   path: "",
   node: null
  };
  var defaults = {
   follow_mount: true,
   recurse_count: 0
  };
  for (var key in defaults) {
   if (opts[key] === undefined) {
    opts[key] = defaults[key];
   }
  }
  if (opts.recurse_count > 8) {
   throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
  }
  var parts = PATH.normalizeArray(path.split("/").filter((function(p) {
   return !!p;
  })), false);
  var current = FS.root;
  var current_path = "/";
  for (var i = 0; i < parts.length; i++) {
   var islast = i === parts.length - 1;
   if (islast && opts.parent) {
    break;
   }
   current = FS.lookupNode(current, parts[i]);
   current_path = PATH.join2(current_path, parts[i]);
   if (FS.isMountpoint(current)) {
    if (!islast || islast && opts.follow_mount) {
     current = current.mounted.root;
    }
   }
   if (!islast || opts.follow) {
    var count = 0;
    while (FS.isLink(current.mode)) {
     var link = FS.readlink(current_path);
     current_path = PATH.resolve(PATH.dirname(current_path), link);
     var lookup = FS.lookupPath(current_path, {
      recurse_count: opts.recurse_count
     });
     current = lookup.node;
     if (count++ > 40) {
      throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
     }
    }
   }
  }
  return {
   path: current_path,
   node: current
  };
 }),
 getPath: (function(node) {
  var path;
  while (true) {
   if (FS.isRoot(node)) {
    var mount = node.mount.mountpoint;
    if (!path) return mount;
    return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path;
   }
   path = path ? node.name + "/" + path : node.name;
   node = node.parent;
  }
 }),
 hashName: (function(parentid, name) {
  var hash = 0;
  for (var i = 0; i < name.length; i++) {
   hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
  }
  return (parentid + hash >>> 0) % FS.nameTable.length;
 }),
 hashAddNode: (function(node) {
  var hash = FS.hashName(node.parent.id, node.name);
  node.name_next = FS.nameTable[hash];
  FS.nameTable[hash] = node;
 }),
 hashRemoveNode: (function(node) {
  var hash = FS.hashName(node.parent.id, node.name);
  if (FS.nameTable[hash] === node) {
   FS.nameTable[hash] = node.name_next;
  } else {
   var current = FS.nameTable[hash];
   while (current) {
    if (current.name_next === node) {
     current.name_next = node.name_next;
     break;
    }
    current = current.name_next;
   }
  }
 }),
 lookupNode: (function(parent, name) {
  var err = FS.mayLookup(parent);
  if (err) {
   throw new FS.ErrnoError(err, parent);
  }
  var hash = FS.hashName(parent.id, name);
  for (var node = FS.nameTable[hash]; node; node = node.name_next) {
   var nodeName = node.name;
   if (node.parent.id === parent.id && nodeName === name) {
    return node;
   }
  }
  return FS.lookup(parent, name);
 }),
 createNode: (function(parent, name, mode, rdev) {
  if (!FS.FSNode) {
   FS.FSNode = (function(parent, name, mode, rdev) {
    if (!parent) {
     parent = this;
    }
    this.parent = parent;
    this.mount = parent.mount;
    this.mounted = null;
    this.id = FS.nextInode++;
    this.name = name;
    this.mode = mode;
    this.node_ops = {};
    this.stream_ops = {};
    this.rdev = rdev;
   });
   FS.FSNode.prototype = {};
   var readMode = 292 | 73;
   var writeMode = 146;
   Object.defineProperties(FS.FSNode.prototype, {
    read: {
     get: (function() {
      return (this.mode & readMode) === readMode;
     }),
     set: (function(val) {
      val ? this.mode |= readMode : this.mode &= ~readMode;
     })
    },
    write: {
     get: (function() {
      return (this.mode & writeMode) === writeMode;
     }),
     set: (function(val) {
      val ? this.mode |= writeMode : this.mode &= ~writeMode;
     })
    },
    isFolder: {
     get: (function() {
      return FS.isDir(this.mode);
     })
    },
    isDevice: {
     get: (function() {
      return FS.isChrdev(this.mode);
     })
    }
   });
  }
  var node = new FS.FSNode(parent, name, mode, rdev);
  FS.hashAddNode(node);
  return node;
 }),
 destroyNode: (function(node) {
  FS.hashRemoveNode(node);
 }),
 isRoot: (function(node) {
  return node === node.parent;
 }),
 isMountpoint: (function(node) {
  return !!node.mounted;
 }),
 isFile: (function(mode) {
  return (mode & 61440) === 32768;
 }),
 isDir: (function(mode) {
  return (mode & 61440) === 16384;
 }),
 isLink: (function(mode) {
  return (mode & 61440) === 40960;
 }),
 isChrdev: (function(mode) {
  return (mode & 61440) === 8192;
 }),
 isBlkdev: (function(mode) {
  return (mode & 61440) === 24576;
 }),
 isFIFO: (function(mode) {
  return (mode & 61440) === 4096;
 }),
 isSocket: (function(mode) {
  return (mode & 49152) === 49152;
 }),
 flagModes: {
  "r": 0,
  "rs": 1052672,
  "r+": 2,
  "w": 577,
  "wx": 705,
  "xw": 705,
  "w+": 578,
  "wx+": 706,
  "xw+": 706,
  "a": 1089,
  "ax": 1217,
  "xa": 1217,
  "a+": 1090,
  "ax+": 1218,
  "xa+": 1218
 },
 modeStringToFlags: (function(str) {
  var flags = FS.flagModes[str];
  if (typeof flags === "undefined") {
   throw new Error("Unknown file open mode: " + str);
  }
  return flags;
 }),
 flagsToPermissionString: (function(flag) {
  var perms = [ "r", "w", "rw" ][flag & 3];
  if (flag & 512) {
   perms += "w";
  }
  return perms;
 }),
 nodePermissions: (function(node, perms) {
  if (FS.ignorePermissions) {
   return 0;
  }
  if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
   return ERRNO_CODES.EACCES;
  } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
   return ERRNO_CODES.EACCES;
  } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
   return ERRNO_CODES.EACCES;
  }
  return 0;
 }),
 mayLookup: (function(dir) {
  var err = FS.nodePermissions(dir, "x");
  if (err) return err;
  if (!dir.node_ops.lookup) return ERRNO_CODES.EACCES;
  return 0;
 }),
 mayCreate: (function(dir, name) {
  try {
   var node = FS.lookupNode(dir, name);
   return ERRNO_CODES.EEXIST;
  } catch (e) {}
  return FS.nodePermissions(dir, "wx");
 }),
 mayDelete: (function(dir, name, isdir) {
  var node;
  try {
   node = FS.lookupNode(dir, name);
  } catch (e) {
   return e.errno;
  }
  var err = FS.nodePermissions(dir, "wx");
  if (err) {
   return err;
  }
  if (isdir) {
   if (!FS.isDir(node.mode)) {
    return ERRNO_CODES.ENOTDIR;
   }
   if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
    return ERRNO_CODES.EBUSY;
   }
  } else {
   if (FS.isDir(node.mode)) {
    return ERRNO_CODES.EISDIR;
   }
  }
  return 0;
 }),
 mayOpen: (function(node, flags) {
  if (!node) {
   return ERRNO_CODES.ENOENT;
  }
  if (FS.isLink(node.mode)) {
   return ERRNO_CODES.ELOOP;
  } else if (FS.isDir(node.mode)) {
   if ((flags & 2097155) !== 0 || flags & 512) {
    return ERRNO_CODES.EISDIR;
   }
  }
  return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
 }),
 MAX_OPEN_FDS: 4096,
 nextfd: (function(fd_start, fd_end) {
  fd_start = fd_start || 0;
  fd_end = fd_end || FS.MAX_OPEN_FDS;
  for (var fd = fd_start; fd <= fd_end; fd++) {
   if (!FS.streams[fd]) {
    return fd;
   }
  }
  throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
 }),
 getStream: (function(fd) {
  return FS.streams[fd];
 }),
 createStream: (function(stream, fd_start, fd_end) {
  if (!FS.FSStream) {
   FS.FSStream = (function() {});
   FS.FSStream.prototype = {};
   Object.defineProperties(FS.FSStream.prototype, {
    object: {
     get: (function() {
      return this.node;
     }),
     set: (function(val) {
      this.node = val;
     })
    },
    isRead: {
     get: (function() {
      return (this.flags & 2097155) !== 1;
     })
    },
    isWrite: {
     get: (function() {
      return (this.flags & 2097155) !== 0;
     })
    },
    isAppend: {
     get: (function() {
      return this.flags & 1024;
     })
    }
   });
  }
  var newStream = new FS.FSStream;
  for (var p in stream) {
   newStream[p] = stream[p];
  }
  stream = newStream;
  var fd = FS.nextfd(fd_start, fd_end);
  stream.fd = fd;
  FS.streams[fd] = stream;
  return stream;
 }),
 closeStream: (function(fd) {
  FS.streams[fd] = null;
 }),
 chrdev_stream_ops: {
  open: (function(stream) {
   var device = FS.getDevice(stream.node.rdev);
   stream.stream_ops = device.stream_ops;
   if (stream.stream_ops.open) {
    stream.stream_ops.open(stream);
   }
  }),
  llseek: (function() {
   throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
  })
 },
 major: (function(dev) {
  return dev >> 8;
 }),
 minor: (function(dev) {
  return dev & 255;
 }),
 makedev: (function(ma, mi) {
  return ma << 8 | mi;
 }),
 registerDevice: (function(dev, ops) {
  FS.devices[dev] = {
   stream_ops: ops
  };
 }),
 getDevice: (function(dev) {
  return FS.devices[dev];
 }),
 getMounts: (function(mount) {
  var mounts = [];
  var check = [ mount ];
  while (check.length) {
   var m = check.pop();
   mounts.push(m);
   check.push.apply(check, m.mounts);
  }
  return mounts;
 }),
 syncfs: (function(populate, callback) {
  if (typeof populate === "function") {
   callback = populate;
   populate = false;
  }
  var mounts = FS.getMounts(FS.root.mount);
  var completed = 0;
  function done(err) {
   if (err) {
    if (!done.errored) {
     done.errored = true;
     return callback(err);
    }
    return;
   }
   if (++completed >= mounts.length) {
    callback(null);
   }
  }
  mounts.forEach((function(mount) {
   if (!mount.type.syncfs) {
    return done(null);
   }
   mount.type.syncfs(mount, populate, done);
  }));
 }),
 mount: (function(type, opts, mountpoint) {
  var root = mountpoint === "/";
  var pseudo = !mountpoint;
  var node;
  if (root && FS.root) {
   throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
  } else if (!root && !pseudo) {
   var lookup = FS.lookupPath(mountpoint, {
    follow_mount: false
   });
   mountpoint = lookup.path;
   node = lookup.node;
   if (FS.isMountpoint(node)) {
    throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
   }
   if (!FS.isDir(node.mode)) {
    throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
   }
  }
  var mount = {
   type: type,
   opts: opts,
   mountpoint: mountpoint,
   mounts: []
  };
  var mountRoot = type.mount(mount);
  mountRoot.mount = mount;
  mount.root = mountRoot;
  if (root) {
   FS.root = mountRoot;
  } else if (node) {
   node.mounted = mount;
   if (node.mount) {
    node.mount.mounts.push(mount);
   }
  }
  return mountRoot;
 }),
 unmount: (function(mountpoint) {
  var lookup = FS.lookupPath(mountpoint, {
   follow_mount: false
  });
  if (!FS.isMountpoint(lookup.node)) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  var node = lookup.node;
  var mount = node.mounted;
  var mounts = FS.getMounts(mount);
  Object.keys(FS.nameTable).forEach((function(hash) {
   var current = FS.nameTable[hash];
   while (current) {
    var next = current.name_next;
    if (mounts.indexOf(current.mount) !== -1) {
     FS.destroyNode(current);
    }
    current = next;
   }
  }));
  node.mounted = null;
  var idx = node.mount.mounts.indexOf(mount);
  assert(idx !== -1);
  node.mount.mounts.splice(idx, 1);
 }),
 lookup: (function(parent, name) {
  return parent.node_ops.lookup(parent, name);
 }),
 mknod: (function(path, mode, dev) {
  var lookup = FS.lookupPath(path, {
   parent: true
  });
  var parent = lookup.node;
  var name = PATH.basename(path);
  if (!name || name === "." || name === "..") {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  var err = FS.mayCreate(parent, name);
  if (err) {
   throw new FS.ErrnoError(err);
  }
  if (!parent.node_ops.mknod) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  return parent.node_ops.mknod(parent, name, mode, dev);
 }),
 create: (function(path, mode) {
  mode = mode !== undefined ? mode : 438;
  mode &= 4095;
  mode |= 32768;
  return FS.mknod(path, mode, 0);
 }),
 mkdir: (function(path, mode) {
  mode = mode !== undefined ? mode : 511;
  mode &= 511 | 512;
  mode |= 16384;
  return FS.mknod(path, mode, 0);
 }),
 mkdev: (function(path, mode, dev) {
  if (typeof dev === "undefined") {
   dev = mode;
   mode = 438;
  }
  mode |= 8192;
  return FS.mknod(path, mode, dev);
 }),
 symlink: (function(oldpath, newpath) {
  if (!PATH.resolve(oldpath)) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  }
  var lookup = FS.lookupPath(newpath, {
   parent: true
  });
  var parent = lookup.node;
  if (!parent) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  }
  var newname = PATH.basename(newpath);
  var err = FS.mayCreate(parent, newname);
  if (err) {
   throw new FS.ErrnoError(err);
  }
  if (!parent.node_ops.symlink) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  return parent.node_ops.symlink(parent, newname, oldpath);
 }),
 rename: (function(old_path, new_path) {
  var old_dirname = PATH.dirname(old_path);
  var new_dirname = PATH.dirname(new_path);
  var old_name = PATH.basename(old_path);
  var new_name = PATH.basename(new_path);
  var lookup, old_dir, new_dir;
  try {
   lookup = FS.lookupPath(old_path, {
    parent: true
   });
   old_dir = lookup.node;
   lookup = FS.lookupPath(new_path, {
    parent: true
   });
   new_dir = lookup.node;
  } catch (e) {
   throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
  }
  if (!old_dir || !new_dir) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  if (old_dir.mount !== new_dir.mount) {
   throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
  }
  var old_node = FS.lookupNode(old_dir, old_name);
  var relative = PATH.relative(old_path, new_dirname);
  if (relative.charAt(0) !== ".") {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  relative = PATH.relative(new_path, old_dirname);
  if (relative.charAt(0) !== ".") {
   throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
  }
  var new_node;
  try {
   new_node = FS.lookupNode(new_dir, new_name);
  } catch (e) {}
  if (old_node === new_node) {
   return;
  }
  var isdir = FS.isDir(old_node.mode);
  var err = FS.mayDelete(old_dir, old_name, isdir);
  if (err) {
   throw new FS.ErrnoError(err);
  }
  err = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
  if (err) {
   throw new FS.ErrnoError(err);
  }
  if (!old_dir.node_ops.rename) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
   throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
  }
  if (new_dir !== old_dir) {
   err = FS.nodePermissions(old_dir, "w");
   if (err) {
    throw new FS.ErrnoError(err);
   }
  }
  try {
   if (FS.trackingDelegate["willMovePath"]) {
    FS.trackingDelegate["willMovePath"](old_path, new_path);
   }
  } catch (e) {
   console.log("FS.trackingDelegate['willMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message);
  }
  FS.hashRemoveNode(old_node);
  try {
   old_dir.node_ops.rename(old_node, new_dir, new_name);
  } catch (e) {
   throw e;
  } finally {
   FS.hashAddNode(old_node);
  }
  try {
   if (FS.trackingDelegate["onMovePath"]) FS.trackingDelegate["onMovePath"](old_path, new_path);
  } catch (e) {
   console.log("FS.trackingDelegate['onMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message);
  }
 }),
 rmdir: (function(path) {
  var lookup = FS.lookupPath(path, {
   parent: true
  });
  var parent = lookup.node;
  var name = PATH.basename(path);
  var node = FS.lookupNode(parent, name);
  var err = FS.mayDelete(parent, name, true);
  if (err) {
   throw new FS.ErrnoError(err);
  }
  if (!parent.node_ops.rmdir) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  if (FS.isMountpoint(node)) {
   throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
  }
  try {
   if (FS.trackingDelegate["willDeletePath"]) {
    FS.trackingDelegate["willDeletePath"](path);
   }
  } catch (e) {
   console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message);
  }
  parent.node_ops.rmdir(parent, name);
  FS.destroyNode(node);
  try {
   if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path);
  } catch (e) {
   console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message);
  }
 }),
 readdir: (function(path) {
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  var node = lookup.node;
  if (!node.node_ops.readdir) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
  }
  return node.node_ops.readdir(node);
 }),
 unlink: (function(path) {
  var lookup = FS.lookupPath(path, {
   parent: true
  });
  var parent = lookup.node;
  var name = PATH.basename(path);
  var node = FS.lookupNode(parent, name);
  var err = FS.mayDelete(parent, name, false);
  if (err) {
   if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
   throw new FS.ErrnoError(err);
  }
  if (!parent.node_ops.unlink) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  if (FS.isMountpoint(node)) {
   throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
  }
  try {
   if (FS.trackingDelegate["willDeletePath"]) {
    FS.trackingDelegate["willDeletePath"](path);
   }
  } catch (e) {
   console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message);
  }
  parent.node_ops.unlink(parent, name);
  FS.destroyNode(node);
  try {
   if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path);
  } catch (e) {
   console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message);
  }
 }),
 readlink: (function(path) {
  var lookup = FS.lookupPath(path);
  var link = lookup.node;
  if (!link) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  }
  if (!link.node_ops.readlink) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  return PATH.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
 }),
 stat: (function(path, dontFollow) {
  var lookup = FS.lookupPath(path, {
   follow: !dontFollow
  });
  var node = lookup.node;
  if (!node) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  }
  if (!node.node_ops.getattr) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  return node.node_ops.getattr(node);
 }),
 lstat: (function(path) {
  return FS.stat(path, true);
 }),
 chmod: (function(path, mode, dontFollow) {
  var node;
  if (typeof path === "string") {
   var lookup = FS.lookupPath(path, {
    follow: !dontFollow
   });
   node = lookup.node;
  } else {
   node = path;
  }
  if (!node.node_ops.setattr) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  node.node_ops.setattr(node, {
   mode: mode & 4095 | node.mode & ~4095,
   timestamp: Date.now()
  });
 }),
 lchmod: (function(path, mode) {
  FS.chmod(path, mode, true);
 }),
 fchmod: (function(fd, mode) {
  var stream = FS.getStream(fd);
  if (!stream) {
   throw new FS.ErrnoError(ERRNO_CODES.EBADF);
  }
  FS.chmod(stream.node, mode);
 }),
 chown: (function(path, uid, gid, dontFollow) {
  var node;
  if (typeof path === "string") {
   var lookup = FS.lookupPath(path, {
    follow: !dontFollow
   });
   node = lookup.node;
  } else {
   node = path;
  }
  if (!node.node_ops.setattr) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  node.node_ops.setattr(node, {
   timestamp: Date.now()
  });
 }),
 lchown: (function(path, uid, gid) {
  FS.chown(path, uid, gid, true);
 }),
 fchown: (function(fd, uid, gid) {
  var stream = FS.getStream(fd);
  if (!stream) {
   throw new FS.ErrnoError(ERRNO_CODES.EBADF);
  }
  FS.chown(stream.node, uid, gid);
 }),
 truncate: (function(path, len) {
  if (len < 0) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  var node;
  if (typeof path === "string") {
   var lookup = FS.lookupPath(path, {
    follow: true
   });
   node = lookup.node;
  } else {
   node = path;
  }
  if (!node.node_ops.setattr) {
   throw new FS.ErrnoError(ERRNO_CODES.EPERM);
  }
  if (FS.isDir(node.mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
  }
  if (!FS.isFile(node.mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  var err = FS.nodePermissions(node, "w");
  if (err) {
   throw new FS.ErrnoError(err);
  }
  node.node_ops.setattr(node, {
   size: len,
   timestamp: Date.now()
  });
 }),
 ftruncate: (function(fd, len) {
  var stream = FS.getStream(fd);
  if (!stream) {
   throw new FS.ErrnoError(ERRNO_CODES.EBADF);
  }
  if ((stream.flags & 2097155) === 0) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  FS.truncate(stream.node, len);
 }),
 utime: (function(path, atime, mtime) {
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  var node = lookup.node;
  node.node_ops.setattr(node, {
   timestamp: Math.max(atime, mtime)
  });
 }),
 open: (function(path, flags, mode, fd_start, fd_end) {
  if (path === "") {
   throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  }
  flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
  mode = typeof mode === "undefined" ? 438 : mode;
  if (flags & 64) {
   mode = mode & 4095 | 32768;
  } else {
   mode = 0;
  }
  var node;
  if (typeof path === "object") {
   node = path;
  } else {
   path = PATH.normalize(path);
   try {
    var lookup = FS.lookupPath(path, {
     follow: !(flags & 131072)
    });
    node = lookup.node;
   } catch (e) {}
  }
  var created = false;
  if (flags & 64) {
   if (node) {
    if (flags & 128) {
     throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
    }
   } else {
    node = FS.mknod(path, mode, 0);
    created = true;
   }
  }
  if (!node) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
  }
  if (FS.isChrdev(node.mode)) {
   flags &= ~512;
  }
  if (flags & 65536 && !FS.isDir(node.mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
  }
  if (!created) {
   var err = FS.mayOpen(node, flags);
   if (err) {
    throw new FS.ErrnoError(err);
   }
  }
  if (flags & 512) {
   FS.truncate(node, 0);
  }
  flags &= ~(128 | 512);
  var stream = FS.createStream({
   node: node,
   path: FS.getPath(node),
   flags: flags,
   seekable: true,
   position: 0,
   stream_ops: node.stream_ops,
   ungotten: [],
   error: false
  }, fd_start, fd_end);
  if (stream.stream_ops.open) {
   stream.stream_ops.open(stream);
  }
  if (Module["logReadFiles"] && !(flags & 1)) {
   if (!FS.readFiles) FS.readFiles = {};
   if (!(path in FS.readFiles)) {
    FS.readFiles[path] = 1;
    Module["printErr"]("read file: " + path);
   }
  }
  try {
   if (FS.trackingDelegate["onOpenFile"]) {
    var trackingFlags = 0;
    if ((flags & 2097155) !== 1) {
     trackingFlags |= FS.tracking.openFlags.READ;
    }
    if ((flags & 2097155) !== 0) {
     trackingFlags |= FS.tracking.openFlags.WRITE;
    }
    FS.trackingDelegate["onOpenFile"](path, trackingFlags);
   }
  } catch (e) {
   console.log("FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message);
  }
  return stream;
 }),
 close: (function(stream) {
  if (stream.getdents) stream.getdents = null;
  try {
   if (stream.stream_ops.close) {
    stream.stream_ops.close(stream);
   }
  } catch (e) {
   throw e;
  } finally {
   FS.closeStream(stream.fd);
  }
 }),
 llseek: (function(stream, offset, whence) {
  if (!stream.seekable || !stream.stream_ops.llseek) {
   throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
  }
  stream.position = stream.stream_ops.llseek(stream, offset, whence);
  stream.ungotten = [];
  return stream.position;
 }),
 read: (function(stream, buffer, offset, length, position) {
  if (length < 0 || position < 0) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  if ((stream.flags & 2097155) === 1) {
   throw new FS.ErrnoError(ERRNO_CODES.EBADF);
  }
  if (FS.isDir(stream.node.mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
  }
  if (!stream.stream_ops.read) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  var seeking = true;
  if (typeof position === "undefined") {
   position = stream.position;
   seeking = false;
  } else if (!stream.seekable) {
   throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
  }
  var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
  if (!seeking) stream.position += bytesRead;
  return bytesRead;
 }),
 write: (function(stream, buffer, offset, length, position, canOwn) {
  if (length < 0 || position < 0) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  if ((stream.flags & 2097155) === 0) {
   throw new FS.ErrnoError(ERRNO_CODES.EBADF);
  }
  if (FS.isDir(stream.node.mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
  }
  if (!stream.stream_ops.write) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  if (stream.flags & 1024) {
   FS.llseek(stream, 0, 2);
  }
  var seeking = true;
  if (typeof position === "undefined") {
   position = stream.position;
   seeking = false;
  } else if (!stream.seekable) {
   throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
  }
  var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
  if (!seeking) stream.position += bytesWritten;
  try {
   if (stream.path && FS.trackingDelegate["onWriteToFile"]) FS.trackingDelegate["onWriteToFile"](stream.path);
  } catch (e) {
   console.log("FS.trackingDelegate['onWriteToFile']('" + path + "') threw an exception: " + e.message);
  }
  return bytesWritten;
 }),
 allocate: (function(stream, offset, length) {
  if (offset < 0 || length <= 0) {
   throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
  }
  if ((stream.flags & 2097155) === 0) {
   throw new FS.ErrnoError(ERRNO_CODES.EBADF);
  }
  if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
  }
  if (!stream.stream_ops.allocate) {
   throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
  }
  stream.stream_ops.allocate(stream, offset, length);
 }),
 mmap: (function(stream, buffer, offset, length, position, prot, flags) {
  if ((stream.flags & 2097155) === 1) {
   throw new FS.ErrnoError(ERRNO_CODES.EACCES);
  }
  if (!stream.stream_ops.mmap) {
   throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
  }
  return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
 }),
 msync: (function(stream, buffer, offset, length, mmapFlags) {
  if (!stream || !stream.stream_ops.msync) {
   return 0;
  }
  return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
 }),
 munmap: (function(stream) {
  return 0;
 }),
 ioctl: (function(stream, cmd, arg) {
  if (!stream.stream_ops.ioctl) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
  }
  return stream.stream_ops.ioctl(stream, cmd, arg);
 }),
 readFile: (function(path, opts) {
  opts = opts || {};
  opts.flags = opts.flags || "r";
  opts.encoding = opts.encoding || "binary";
  if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
   throw new Error('Invalid encoding type "' + opts.encoding + '"');
  }
  var ret;
  var stream = FS.open(path, opts.flags);
  var stat = FS.stat(path);
  var length = stat.size;
  var buf = new Uint8Array(length);
  FS.read(stream, buf, 0, length, 0);
  if (opts.encoding === "utf8") {
   ret = UTF8ArrayToString(buf, 0);
  } else if (opts.encoding === "binary") {
   ret = buf;
  }
  FS.close(stream);
  return ret;
 }),
 writeFile: (function(path, data, opts) {
  opts = opts || {};
  opts.flags = opts.flags || "w";
  opts.encoding = opts.encoding || "utf8";
  if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
   throw new Error('Invalid encoding type "' + opts.encoding + '"');
  }
  var stream = FS.open(path, opts.flags, opts.mode);
  if (opts.encoding === "utf8") {
   var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
   var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
   FS.write(stream, buf, 0, actualNumBytes, 0, opts.canOwn);
  } else if (opts.encoding === "binary") {
   FS.write(stream, data, 0, data.length, 0, opts.canOwn);
  }
  FS.close(stream);
 }),
 cwd: (function() {
  return FS.currentPath;
 }),
 chdir: (function(path) {
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  if (!FS.isDir(lookup.node.mode)) {
   throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
  }
  var err = FS.nodePermissions(lookup.node, "x");
  if (err) {
   throw new FS.ErrnoError(err);
  }
  FS.currentPath = lookup.path;
 }),
 createDefaultDirectories: (function() {
  FS.mkdir("/tmp");
  FS.mkdir("/home");
  FS.mkdir("/home/web_user");
 }),
 createDefaultDevices: (function() {
  FS.mkdir("/dev");
  FS.registerDevice(FS.makedev(1, 3), {
   read: (function() {
    return 0;
   }),
   write: (function(stream, buffer, offset, length, pos) {
    return length;
   })
  });
  FS.mkdev("/dev/null", FS.makedev(1, 3));
  TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
  TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
  FS.mkdev("/dev/tty", FS.makedev(5, 0));
  FS.mkdev("/dev/tty1", FS.makedev(6, 0));
  var random_device;
  if (typeof crypto !== "undefined") {
   var randomBuffer = new Uint8Array(1);
   random_device = (function() {
    crypto.getRandomValues(randomBuffer);
    return randomBuffer[0];
   });
  } else if (ENVIRONMENT_IS_NODE) {
   random_device = (function() {
    return require("crypto").randomBytes(1)[0];
   });
  } else {
   random_device = (function() {
    return Math.random() * 256 | 0;
   });
  }
  FS.createDevice("/dev", "random", random_device);
  FS.createDevice("/dev", "urandom", random_device);
  FS.mkdir("/dev/shm");
  FS.mkdir("/dev/shm/tmp");
 }),
 createSpecialDirectories: (function() {
  FS.mkdir("/proc");
  FS.mkdir("/proc/self");
  FS.mkdir("/proc/self/fd");
  FS.mount({
   mount: (function() {
    var node = FS.createNode("/proc/self", "fd", 16384 | 511, 73);
    node.node_ops = {
     lookup: (function(parent, name) {
      var fd = +name;
      var stream = FS.getStream(fd);
      if (!stream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
      var ret = {
       parent: null,
       mount: {
        mountpoint: "fake"
       },
       node_ops: {
        readlink: (function() {
         return stream.path;
        })
       }
      };
      ret.parent = ret;
      return ret;
     })
    };
    return node;
   })
  }, {}, "/proc/self/fd");
 }),
 createStandardStreams: (function() {
  if (Module["stdin"]) {
   FS.createDevice("/dev", "stdin", Module["stdin"]);
  } else {
   FS.symlink("/dev/tty", "/dev/stdin");
  }
  if (Module["stdout"]) {
   FS.createDevice("/dev", "stdout", null, Module["stdout"]);
  } else {
   FS.symlink("/dev/tty", "/dev/stdout");
  }
  if (Module["stderr"]) {
   FS.createDevice("/dev", "stderr", null, Module["stderr"]);
  } else {
   FS.symlink("/dev/tty1", "/dev/stderr");
  }
  var stdin = FS.open("/dev/stdin", "r");
  assert(stdin.fd === 0, "invalid handle for stdin (" + stdin.fd + ")");
  var stdout = FS.open("/dev/stdout", "w");
  assert(stdout.fd === 1, "invalid handle for stdout (" + stdout.fd + ")");
  var stderr = FS.open("/dev/stderr", "w");
  assert(stderr.fd === 2, "invalid handle for stderr (" + stderr.fd + ")");
 }),
 ensureErrnoError: (function() {
  if (FS.ErrnoError) return;
  FS.ErrnoError = function ErrnoError(errno, node) {
   this.node = node;
   this.setErrno = (function(errno) {
    this.errno = errno;
    for (var key in ERRNO_CODES) {
     if (ERRNO_CODES[key] === errno) {
      this.code = key;
      break;
     }
    }
   });
   this.setErrno(errno);
   this.message = ERRNO_MESSAGES[errno];
  };
  FS.ErrnoError.prototype = new Error;
  FS.ErrnoError.prototype.constructor = FS.ErrnoError;
  [ ERRNO_CODES.ENOENT ].forEach((function(code) {
   FS.genericErrors[code] = new FS.ErrnoError(code);
   FS.genericErrors[code].stack = "<generic error, no stack>";
  }));
 }),
 staticInit: (function() {
  FS.ensureErrnoError();
  FS.nameTable = new Array(4096);
  FS.mount(MEMFS, {}, "/");
  FS.createDefaultDirectories();
  FS.createDefaultDevices();
  FS.createSpecialDirectories();
  FS.filesystems = {
   "MEMFS": MEMFS,
   "IDBFS": IDBFS,
   "NODEFS": NODEFS,
   "WORKERFS": WORKERFS
  };
 }),
 init: (function(input, output, error) {
  assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
  FS.init.initialized = true;
  FS.ensureErrnoError();
  Module["stdin"] = input || Module["stdin"];
  Module["stdout"] = output || Module["stdout"];
  Module["stderr"] = error || Module["stderr"];
  FS.createStandardStreams();
 }),
 quit: (function() {
  FS.init.initialized = false;
  var fflush = Module["_fflush"];
  if (fflush) fflush(0);
  for (var i = 0; i < FS.streams.length; i++) {
   var stream = FS.streams[i];
   if (!stream) {
    continue;
   }
   FS.close(stream);
  }
 }),
 getMode: (function(canRead, canWrite) {
  var mode = 0;
  if (canRead) mode |= 292 | 73;
  if (canWrite) mode |= 146;
  return mode;
 }),
 joinPath: (function(parts, forceRelative) {
  var path = PATH.join.apply(null, parts);
  if (forceRelative && path[0] == "/") path = path.substr(1);
  return path;
 }),
 absolutePath: (function(relative, base) {
  return PATH.resolve(base, relative);
 }),
 standardizePath: (function(path) {
  return PATH.normalize(path);
 }),
 findObject: (function(path, dontResolveLastLink) {
  var ret = FS.analyzePath(path, dontResolveLastLink);
  if (ret.exists) {
   return ret.object;
  } else {
   ___setErrNo(ret.error);
   return null;
  }
 }),
 analyzePath: (function(path, dontResolveLastLink) {
  try {
   var lookup = FS.lookupPath(path, {
    follow: !dontResolveLastLink
   });
   path = lookup.path;
  } catch (e) {}
  var ret = {
   isRoot: false,
   exists: false,
   error: 0,
   name: null,
   path: null,
   object: null,
   parentExists: false,
   parentPath: null,
   parentObject: null
  };
  try {
   var lookup = FS.lookupPath(path, {
    parent: true
   });
   ret.parentExists = true;
   ret.parentPath = lookup.path;
   ret.parentObject = lookup.node;
   ret.name = PATH.basename(path);
   lookup = FS.lookupPath(path, {
    follow: !dontResolveLastLink
   });
   ret.exists = true;
   ret.path = lookup.path;
   ret.object = lookup.node;
   ret.name = lookup.node.name;
   ret.isRoot = lookup.path === "/";
  } catch (e) {
   ret.error = e.errno;
  }
  return ret;
 }),
 createFolder: (function(parent, name, canRead, canWrite) {
  var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
  var mode = FS.getMode(canRead, canWrite);
  return FS.mkdir(path, mode);
 }),
 createPath: (function(parent, path, canRead, canWrite) {
  parent = typeof parent === "string" ? parent : FS.getPath(parent);
  var parts = path.split("/").reverse();
  while (parts.length) {
   var part = parts.pop();
   if (!part) continue;
   var current = PATH.join2(parent, part);
   try {
    FS.mkdir(current);
   } catch (e) {}
   parent = current;
  }
  return current;
 }),
 createFile: (function(parent, name, properties, canRead, canWrite) {
  var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
  var mode = FS.getMode(canRead, canWrite);
  return FS.create(path, mode);
 }),
 createDataFile: (function(parent, name, data, canRead, canWrite, canOwn) {
  var path = name ? PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name) : parent;
  var mode = FS.getMode(canRead, canWrite);
  var node = FS.create(path, mode);
  if (data) {
   if (typeof data === "string") {
    var arr = new Array(data.length);
    for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
    data = arr;
   }
   FS.chmod(node, mode | 146);
   var stream = FS.open(node, "w");
   FS.write(stream, data, 0, data.length, 0, canOwn);
   FS.close(stream);
   FS.chmod(node, mode);
  }
  return node;
 }),
 createDevice: (function(parent, name, input, output) {
  var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
  var mode = FS.getMode(!!input, !!output);
  if (!FS.createDevice.major) FS.createDevice.major = 64;
  var dev = FS.makedev(FS.createDevice.major++, 0);
  FS.registerDevice(dev, {
   open: (function(stream) {
    stream.seekable = false;
   }),
   close: (function(stream) {
    if (output && output.buffer && output.buffer.length) {
     output(10);
    }
   }),
   read: (function(stream, buffer, offset, length, pos) {
    var bytesRead = 0;
    for (var i = 0; i < length; i++) {
     var result;
     try {
      result = input();
     } catch (e) {
      throw new FS.ErrnoError(ERRNO_CODES.EIO);
     }
     if (result === undefined && bytesRead === 0) {
      throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
     }
     if (result === null || result === undefined) break;
     bytesRead++;
     buffer[offset + i] = result;
    }
    if (bytesRead) {
     stream.node.timestamp = Date.now();
    }
    return bytesRead;
   }),
   write: (function(stream, buffer, offset, length, pos) {
    for (var i = 0; i < length; i++) {
     try {
      output(buffer[offset + i]);
     } catch (e) {
      throw new FS.ErrnoError(ERRNO_CODES.EIO);
     }
    }
    if (length) {
     stream.node.timestamp = Date.now();
    }
    return i;
   })
  });
  return FS.mkdev(path, mode, dev);
 }),
 createLink: (function(parent, name, target, canRead, canWrite) {
  var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
  return FS.symlink(target, path);
 }),
 forceLoadFile: (function(obj) {
  if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
  var success = true;
  if (typeof XMLHttpRequest !== "undefined") {
   throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
  } else if (Module["read"]) {
   try {
    obj.contents = intArrayFromString(Module["read"](obj.url), true);
    obj.usedBytes = obj.contents.length;
   } catch (e) {
    success = false;
   }
  } else {
   throw new Error("Cannot load without read() or XMLHttpRequest.");
  }
  if (!success) ___setErrNo(ERRNO_CODES.EIO);
  return success;
 }),
 createLazyFile: (function(parent, name, url, canRead, canWrite) {
  function LazyUint8Array() {
   this.lengthKnown = false;
   this.chunks = [];
  }
  LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
   if (idx > this.length - 1 || idx < 0) {
    return undefined;
   }
   var chunkOffset = idx % this.chunkSize;
   var chunkNum = idx / this.chunkSize | 0;
   return this.getter(chunkNum)[chunkOffset];
  };
  LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
   this.getter = getter;
  };
  LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
   var xhr = new XMLHttpRequest;
   xhr.open("HEAD", url, false);
   xhr.send(null);
   if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
   var datalength = Number(xhr.getResponseHeader("Content-length"));
   var header;
   var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
   var chunkSize = 1024 * 1024;
   if (!hasByteServing) chunkSize = datalength;
   var doXHR = (function(from, to) {
    if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
    if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
    var xhr = new XMLHttpRequest;
    xhr.open("GET", url, false);
    if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
    if (typeof Uint8Array != "undefined") xhr.responseType = "arraybuffer";
    if (xhr.overrideMimeType) {
     xhr.overrideMimeType("text/plain; charset=x-user-defined");
    }
    xhr.send(null);
    if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
    if (xhr.response !== undefined) {
     return new Uint8Array(xhr.response || []);
    } else {
     return intArrayFromString(xhr.responseText || "", true);
    }
   });
   var lazyArray = this;
   lazyArray.setDataGetter((function(chunkNum) {
    var start = chunkNum * chunkSize;
    var end = (chunkNum + 1) * chunkSize - 1;
    end = Math.min(end, datalength - 1);
    if (typeof lazyArray.chunks[chunkNum] === "undefined") {
     lazyArray.chunks[chunkNum] = doXHR(start, end);
    }
    if (typeof lazyArray.chunks[chunkNum] === "undefined") throw new Error("doXHR failed!");
    return lazyArray.chunks[chunkNum];
   }));
   this._length = datalength;
   this._chunkSize = chunkSize;
   this.lengthKnown = true;
  };
  if (typeof XMLHttpRequest !== "undefined") {
   if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
   var lazyArray = new LazyUint8Array;
   Object.defineProperty(lazyArray, "length", {
    get: (function() {
     if (!this.lengthKnown) {
      this.cacheLength();
     }
     return this._length;
    })
   });
   Object.defineProperty(lazyArray, "chunkSize", {
    get: (function() {
     if (!this.lengthKnown) {
      this.cacheLength();
     }
     return this._chunkSize;
    })
   });
   var properties = {
    isDevice: false,
    contents: lazyArray
   };
  } else {
   var properties = {
    isDevice: false,
    url: url
   };
  }
  var node = FS.createFile(parent, name, properties, canRead, canWrite);
  if (properties.contents) {
   node.contents = properties.contents;
  } else if (properties.url) {
   node.contents = null;
   node.url = properties.url;
  }
  Object.defineProperty(node, "usedBytes", {
   get: (function() {
    return this.contents.length;
   })
  });
  var stream_ops = {};
  var keys = Object.keys(node.stream_ops);
  keys.forEach((function(key) {
   var fn = node.stream_ops[key];
   stream_ops[key] = function forceLoadLazyFile() {
    if (!FS.forceLoadFile(node)) {
     throw new FS.ErrnoError(ERRNO_CODES.EIO);
    }
    return fn.apply(null, arguments);
   };
  }));
  stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
   if (!FS.forceLoadFile(node)) {
    throw new FS.ErrnoError(ERRNO_CODES.EIO);
   }
   var contents = stream.node.contents;
   if (position >= contents.length) return 0;
   var size = Math.min(contents.length - position, length);
   assert(size >= 0);
   if (contents.slice) {
    for (var i = 0; i < size; i++) {
     buffer[offset + i] = contents[position + i];
    }
   } else {
    for (var i = 0; i < size; i++) {
     buffer[offset + i] = contents.get(position + i);
    }
   }
   return size;
  };
  node.stream_ops = stream_ops;
  return node;
 }),
 createPreloadedFile: (function(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
  Browser.init();
  var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
  var dep = getUniqueRunDependency("cp " + fullname);
  function processData(byteArray) {
   function finish(byteArray) {
    if (preFinish) preFinish();
    if (!dontCreateFile) {
     FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
    }
    if (onload) onload();
    removeRunDependency(dep);
   }
   var handled = false;
   Module["preloadPlugins"].forEach((function(plugin) {
    if (handled) return;
    if (plugin["canHandle"](fullname)) {
     plugin["handle"](byteArray, fullname, finish, (function() {
      if (onerror) onerror();
      removeRunDependency(dep);
     }));
     handled = true;
    }
   }));
   if (!handled) finish(byteArray);
  }
  addRunDependency(dep);
  if (typeof url == "string") {
   Browser.asyncLoad(url, (function(byteArray) {
    processData(byteArray);
   }), onerror);
  } else {
   processData(url);
  }
 }),
 indexedDB: (function() {
  return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 }),
 DB_NAME: (function() {
  return "EM_FS_" + window.location.pathname;
 }),
 DB_VERSION: 20,
 DB_STORE_NAME: "FILE_DATA",
 saveFilesToDB: (function(paths, onload, onerror) {
  onload = onload || (function() {});
  onerror = onerror || (function() {});
  var indexedDB = FS.indexedDB();
  try {
   var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
  } catch (e) {
   return onerror(e);
  }
  openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
   console.log("creating db");
   var db = openRequest.result;
   db.createObjectStore(FS.DB_STORE_NAME);
  };
  openRequest.onsuccess = function openRequest_onsuccess() {
   var db = openRequest.result;
   var transaction = db.transaction([ FS.DB_STORE_NAME ], "readwrite");
   var files = transaction.objectStore(FS.DB_STORE_NAME);
   var ok = 0, fail = 0, total = paths.length;
   function finish() {
    if (fail == 0) onload(); else onerror();
   }
   paths.forEach((function(path) {
    var putRequest = files.put(FS.analyzePath(path).object.contents, path);
    putRequest.onsuccess = function putRequest_onsuccess() {
     ok++;
     if (ok + fail == total) finish();
    };
    putRequest.onerror = function putRequest_onerror() {
     fail++;
     if (ok + fail == total) finish();
    };
   }));
   transaction.onerror = onerror;
  };
  openRequest.onerror = onerror;
 }),
 loadFilesFromDB: (function(paths, onload, onerror) {
  onload = onload || (function() {});
  onerror = onerror || (function() {});
  var indexedDB = FS.indexedDB();
  try {
   var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
  } catch (e) {
   return onerror(e);
  }
  openRequest.onupgradeneeded = onerror;
  openRequest.onsuccess = function openRequest_onsuccess() {
   var db = openRequest.result;
   try {
    var transaction = db.transaction([ FS.DB_STORE_NAME ], "readonly");
   } catch (e) {
    onerror(e);
    return;
   }
   var files = transaction.objectStore(FS.DB_STORE_NAME);
   var ok = 0, fail = 0, total = paths.length;
   function finish() {
    if (fail == 0) onload(); else onerror();
   }
   paths.forEach((function(path) {
    var getRequest = files.get(path);
    getRequest.onsuccess = function getRequest_onsuccess() {
     if (FS.analyzePath(path).exists) {
      FS.unlink(path);
     }
     FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
     ok++;
     if (ok + fail == total) finish();
    };
    getRequest.onerror = function getRequest_onerror() {
     fail++;
     if (ok + fail == total) finish();
    };
   }));
   transaction.onerror = onerror;
  };
  openRequest.onerror = onerror;
 })
};
var SYSCALLS = {
 DEFAULT_POLLMASK: 5,
 mappings: {},
 umask: 511,
 calculateAt: (function(dirfd, path) {
  if (path[0] !== "/") {
   var dir;
   if (dirfd === -100) {
    dir = FS.cwd();
   } else {
    var dirstream = FS.getStream(dirfd);
    if (!dirstream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
    dir = dirstream.path;
   }
   path = PATH.join2(dir, path);
  }
  return path;
 }),
 doStat: (function(func, path, buf) {
  try {
   var stat = func(path);
  } catch (e) {
   if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
    return -ERRNO_CODES.ENOTDIR;
   }
   throw e;
  }
  HEAP32[buf >> 2] = stat.dev;
  HEAP32[buf + 4 >> 2] = 0;
  HEAP32[buf + 8 >> 2] = stat.ino;
  HEAP32[buf + 12 >> 2] = stat.mode;
  HEAP32[buf + 16 >> 2] = stat.nlink;
  HEAP32[buf + 20 >> 2] = stat.uid;
  HEAP32[buf + 24 >> 2] = stat.gid;
  HEAP32[buf + 28 >> 2] = stat.rdev;
  HEAP32[buf + 32 >> 2] = 0;
  HEAP32[buf + 36 >> 2] = stat.size;
  HEAP32[buf + 40 >> 2] = 4096;
  HEAP32[buf + 44 >> 2] = stat.blocks;
  HEAP32[buf + 48 >> 2] = stat.atime.getTime() / 1e3 | 0;
  HEAP32[buf + 52 >> 2] = 0;
  HEAP32[buf + 56 >> 2] = stat.mtime.getTime() / 1e3 | 0;
  HEAP32[buf + 60 >> 2] = 0;
  HEAP32[buf + 64 >> 2] = stat.ctime.getTime() / 1e3 | 0;
  HEAP32[buf + 68 >> 2] = 0;
  HEAP32[buf + 72 >> 2] = stat.ino;
  return 0;
 }),
 doMsync: (function(addr, stream, len, flags) {
  var buffer = new Uint8Array(HEAPU8.subarray(addr, addr + len));
  FS.msync(stream, buffer, 0, len, flags);
 }),
 doMkdir: (function(path, mode) {
  path = PATH.normalize(path);
  if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
  FS.mkdir(path, mode, 0);
  return 0;
 }),
 doMknod: (function(path, mode, dev) {
  switch (mode & 61440) {
  case 32768:
  case 8192:
  case 24576:
  case 4096:
  case 49152:
   break;
  default:
   return -ERRNO_CODES.EINVAL;
  }
  FS.mknod(path, mode, dev);
  return 0;
 }),
 doReadlink: (function(path, buf, bufsize) {
  if (bufsize <= 0) return -ERRNO_CODES.EINVAL;
  var ret = FS.readlink(path);
  ret = ret.slice(0, Math.max(0, bufsize));
  writeStringToMemory(ret, buf, true);
  return ret.length;
 }),
 doAccess: (function(path, amode) {
  if (amode & ~7) {
   return -ERRNO_CODES.EINVAL;
  }
  var node;
  var lookup = FS.lookupPath(path, {
   follow: true
  });
  node = lookup.node;
  var perms = "";
  if (amode & 4) perms += "r";
  if (amode & 2) perms += "w";
  if (amode & 1) perms += "x";
  if (perms && FS.nodePermissions(node, perms)) {
   return -ERRNO_CODES.EACCES;
  }
  return 0;
 }),
 doDup: (function(path, flags, suggestFD) {
  var suggest = FS.getStream(suggestFD);
  if (suggest) FS.close(suggest);
  return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
 }),
 doReadv: (function(stream, iov, iovcnt, offset) {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
   var ptr = HEAP32[iov + i * 8 >> 2];
   var len = HEAP32[iov + (i * 8 + 4) >> 2];
   var curr = FS.read(stream, HEAP8, ptr, len, offset);
   if (curr < 0) return -1;
   ret += curr;
   if (curr < len) break;
  }
  return ret;
 }),
 doWritev: (function(stream, iov, iovcnt, offset) {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
   var ptr = HEAP32[iov + i * 8 >> 2];
   var len = HEAP32[iov + (i * 8 + 4) >> 2];
   var curr = FS.write(stream, HEAP8, ptr, len, offset);
   if (curr < 0) return -1;
   ret += curr;
  }
  return ret;
 }),
 varargs: 0,
 get: (function(varargs) {
  SYSCALLS.varargs += 4;
  var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
  return ret;
 }),
 getStr: (function() {
  var ret = Pointer_stringify(SYSCALLS.get());
  return ret;
 }),
 getStreamFromFD: (function() {
  var stream = FS.getStream(SYSCALLS.get());
  if (!stream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
  return stream;
 }),
 getSocketFromFD: (function() {
  var socket = SOCKFS.getSocket(SYSCALLS.get());
  if (!socket) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
  return socket;
 }),
 getSocketAddress: (function(allowNull) {
  var addrp = SYSCALLS.get(), addrlen = SYSCALLS.get();
  if (allowNull && addrp === 0) return null;
  var info = __read_sockaddr(addrp, addrlen);
  if (info.errno) throw new FS.ErrnoError(info.errno);
  info.addr = DNS.lookup_addr(info.addr) || info.addr;
  return info;
 }),
 get64: (function() {
  var low = SYSCALLS.get(), high = SYSCALLS.get();
  if (low >= 0) assert(high === 0); else assert(high === -1);
  return low;
 }),
 getZero: (function() {
  assert(SYSCALLS.get() === 0);
 })
};
function ___syscall6(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var stream = SYSCALLS.getStreamFromFD();
  FS.close(stream);
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function _sysconf(name) {
 switch (name) {
 case 30:
  return PAGE_SIZE;
 case 85:
  return totalMemory / PAGE_SIZE;
 case 132:
 case 133:
 case 12:
 case 137:
 case 138:
 case 15:
 case 235:
 case 16:
 case 17:
 case 18:
 case 19:
 case 20:
 case 149:
 case 13:
 case 10:
 case 236:
 case 153:
 case 9:
 case 21:
 case 22:
 case 159:
 case 154:
 case 14:
 case 77:
 case 78:
 case 139:
 case 80:
 case 81:
 case 82:
 case 68:
 case 67:
 case 164:
 case 11:
 case 29:
 case 47:
 case 48:
 case 95:
 case 52:
 case 51:
 case 46:
  return 200809;
 case 79:
  return 0;
 case 27:
 case 246:
 case 127:
 case 128:
 case 23:
 case 24:
 case 160:
 case 161:
 case 181:
 case 182:
 case 242:
 case 183:
 case 184:
 case 243:
 case 244:
 case 245:
 case 165:
 case 178:
 case 179:
 case 49:
 case 50:
 case 168:
 case 169:
 case 175:
 case 170:
 case 171:
 case 172:
 case 97:
 case 76:
 case 32:
 case 173:
 case 35:
  return -1;
 case 176:
 case 177:
 case 7:
 case 155:
 case 8:
 case 157:
 case 125:
 case 126:
 case 92:
 case 93:
 case 129:
 case 130:
 case 131:
 case 94:
 case 91:
  return 1;
 case 74:
 case 60:
 case 69:
 case 70:
 case 4:
  return 1024;
 case 31:
 case 42:
 case 72:
  return 32;
 case 87:
 case 26:
 case 33:
  return 2147483647;
 case 34:
 case 1:
  return 47839;
 case 38:
 case 36:
  return 99;
 case 43:
 case 37:
  return 2048;
 case 0:
  return 2097152;
 case 3:
  return 65536;
 case 28:
  return 32768;
 case 44:
  return 32767;
 case 75:
  return 16384;
 case 39:
  return 1e3;
 case 89:
  return 700;
 case 71:
  return 256;
 case 40:
  return 255;
 case 2:
  return 100;
 case 180:
  return 64;
 case 25:
  return 20;
 case 5:
  return 16;
 case 6:
  return 6;
 case 73:
  return 4;
 case 84:
  {
   if (typeof navigator === "object") return navigator["hardwareConcurrency"] || 1;
   return 1;
  }
 }
 ___setErrNo(ERRNO_CODES.EINVAL);
 return -1;
}
function _sbrk(bytes) {
 var self = _sbrk;
 if (!self.called) {
  DYNAMICTOP = alignMemoryPage(DYNAMICTOP);
  self.called = true;
  assert(Runtime.dynamicAlloc);
  self.alloc = Runtime.dynamicAlloc;
  Runtime.dynamicAlloc = (function() {
   abort("cannot dynamically allocate, sbrk now has control");
  });
 }
 var ret = DYNAMICTOP;
 if (bytes != 0) {
  var success = self.alloc(bytes);
  if (!success) return -1 >>> 0;
 }
 return ret;
}
function ___syscall146(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var stream = SYSCALLS.getStreamFromFD(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
  return SYSCALLS.doWritev(stream, iov, iovcnt);
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function _gettimeofday(ptr) {
 var now = Date.now();
 HEAP32[ptr >> 2] = now / 1e3 | 0;
 HEAP32[ptr + 4 >> 2] = now % 1e3 * 1e3 | 0;
 return 0;
}
var _BItoD = true;
function _emscripten_memcpy_big(dest, src, num) {
 HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
 return dest;
}
Module["_memcpy"] = _memcpy;
function _emscripten_set_main_loop_timing(mode, value) {
 Browser.mainLoop.timingMode = mode;
 Browser.mainLoop.timingValue = value;
 if (!Browser.mainLoop.func) {
  return 1;
 }
 if (mode == 0) {
  Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
   setTimeout(Browser.mainLoop.runner, value);
  };
  Browser.mainLoop.method = "timeout";
 } else if (mode == 1) {
  Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
   Browser.requestAnimationFrame(Browser.mainLoop.runner);
  };
  Browser.mainLoop.method = "rAF";
 } else if (mode == 2) {
  if (!window["setImmediate"]) {
   var setImmediates = [];
   var emscriptenMainLoopMessageId = "__emcc";
   function Browser_setImmediate_messageHandler(event) {
    if (event.source === window && event.data === emscriptenMainLoopMessageId) {
     event.stopPropagation();
     setImmediates.shift()();
    }
   }
   window.addEventListener("message", Browser_setImmediate_messageHandler, true);
   window["setImmediate"] = function Browser_emulated_setImmediate(func) {
    setImmediates.push(func);
    window.postMessage(emscriptenMainLoopMessageId, "*");
   };
  }
  Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
   window["setImmediate"](Browser.mainLoop.runner);
  };
  Browser.mainLoop.method = "immediate";
 }
 return 0;
}
function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop, arg, noSetTiming) {
 Module["noExitRuntime"] = true;
 assert(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");
 Browser.mainLoop.func = func;
 Browser.mainLoop.arg = arg;
 var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
 Browser.mainLoop.runner = function Browser_mainLoop_runner() {
  if (ABORT) return;
  if (Browser.mainLoop.queue.length > 0) {
   var start = Date.now();
   var blocker = Browser.mainLoop.queue.shift();
   blocker.func(blocker.arg);
   if (Browser.mainLoop.remainingBlockers) {
    var remaining = Browser.mainLoop.remainingBlockers;
    var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
    if (blocker.counted) {
     Browser.mainLoop.remainingBlockers = next;
    } else {
     next = next + .5;
     Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9;
    }
   }
   console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + " ms");
   Browser.mainLoop.updateStatus();
   setTimeout(Browser.mainLoop.runner, 0);
   return;
  }
  if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
  Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
  if (Browser.mainLoop.timingMode == 1 && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
   Browser.mainLoop.scheduler();
   return;
  }
  if (Browser.mainLoop.method === "timeout" && Module.ctx) {
   Module.printErr("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!");
   Browser.mainLoop.method = "";
  }
  Browser.mainLoop.runIter((function() {
   if (typeof arg !== "undefined") {
    Runtime.dynCall("vi", func, [ arg ]);
   } else {
    Runtime.dynCall("v", func);
   }
  }));
  if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
  if (typeof SDL === "object" && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
  Browser.mainLoop.scheduler();
 };
 if (!noSetTiming) {
  if (fps && fps > 0) _emscripten_set_main_loop_timing(0, 1e3 / fps); else _emscripten_set_main_loop_timing(1, 1);
  Browser.mainLoop.scheduler();
 }
 if (simulateInfiniteLoop) {
  throw "SimulateInfiniteLoop";
 }
}
var Browser = {
 mainLoop: {
  scheduler: null,
  method: "",
  currentlyRunningMainloop: 0,
  func: null,
  arg: 0,
  timingMode: 0,
  timingValue: 0,
  currentFrameNumber: 0,
  queue: [],
  pause: (function() {
   Browser.mainLoop.scheduler = null;
   Browser.mainLoop.currentlyRunningMainloop++;
  }),
  resume: (function() {
   Browser.mainLoop.currentlyRunningMainloop++;
   var timingMode = Browser.mainLoop.timingMode;
   var timingValue = Browser.mainLoop.timingValue;
   var func = Browser.mainLoop.func;
   Browser.mainLoop.func = null;
   _emscripten_set_main_loop(func, 0, false, Browser.mainLoop.arg, true);
   _emscripten_set_main_loop_timing(timingMode, timingValue);
   Browser.mainLoop.scheduler();
  }),
  updateStatus: (function() {
   if (Module["setStatus"]) {
    var message = Module["statusMessage"] || "Please wait...";
    var remaining = Browser.mainLoop.remainingBlockers;
    var expected = Browser.mainLoop.expectedBlockers;
    if (remaining) {
     if (remaining < expected) {
      Module["setStatus"](message + " (" + (expected - remaining) + "/" + expected + ")");
     } else {
      Module["setStatus"](message);
     }
    } else {
     Module["setStatus"]("");
    }
   }
  }),
  runIter: (function(func) {
   if (ABORT) return;
   if (Module["preMainLoop"]) {
    var preRet = Module["preMainLoop"]();
    if (preRet === false) {
     return;
    }
   }
   try {
    func();
   } catch (e) {
    if (e instanceof ExitStatus) {
     return;
    } else {
     if (e && typeof e === "object" && e.stack) Module.printErr("exception thrown: " + [ e, e.stack ]);
     throw e;
    }
   }
   if (Module["postMainLoop"]) Module["postMainLoop"]();
  })
 },
 isFullScreen: false,
 pointerLock: false,
 moduleContextCreatedCallbacks: [],
 workers: [],
 init: (function() {
  if (!Module["preloadPlugins"]) Module["preloadPlugins"] = [];
  if (Browser.initted) return;
  Browser.initted = true;
  try {
   new Blob;
   Browser.hasBlobConstructor = true;
  } catch (e) {
   Browser.hasBlobConstructor = false;
   console.log("warning: no blob constructor, cannot create blobs with mimetypes");
  }
  Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : !Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null;
  Browser.URLObject = typeof window != "undefined" ? window.URL ? window.URL : window.webkitURL : undefined;
  if (!Module.noImageDecoding && typeof Browser.URLObject === "undefined") {
   console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
   Module.noImageDecoding = true;
  }
  var imagePlugin = {};
  imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
   return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
  };
  imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) {
   var b = null;
   if (Browser.hasBlobConstructor) {
    try {
     b = new Blob([ byteArray ], {
      type: Browser.getMimetype(name)
     });
     if (b.size !== byteArray.length) {
      b = new Blob([ (new Uint8Array(byteArray)).buffer ], {
       type: Browser.getMimetype(name)
      });
     }
    } catch (e) {
     Runtime.warnOnce("Blob constructor present but fails: " + e + "; falling back to blob builder");
    }
   }
   if (!b) {
    var bb = new Browser.BlobBuilder;
    bb.append((new Uint8Array(byteArray)).buffer);
    b = bb.getBlob();
   }
   var url = Browser.URLObject.createObjectURL(b);
   var img = new Image;
   img.onload = function img_onload() {
    assert(img.complete, "Image " + name + " could not be decoded");
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    Module["preloadedImages"][name] = canvas;
    Browser.URLObject.revokeObjectURL(url);
    if (onload) onload(byteArray);
   };
   img.onerror = function img_onerror(event) {
    console.log("Image " + url + " could not be decoded");
    if (onerror) onerror();
   };
   img.src = url;
  };
  Module["preloadPlugins"].push(imagePlugin);
  var audioPlugin = {};
  audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
   return !Module.noAudioDecoding && name.substr(-4) in {
    ".ogg": 1,
    ".wav": 1,
    ".mp3": 1
   };
  };
  audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) {
   var done = false;
   function finish(audio) {
    if (done) return;
    done = true;
    Module["preloadedAudios"][name] = audio;
    if (onload) onload(byteArray);
   }
   function fail() {
    if (done) return;
    done = true;
    Module["preloadedAudios"][name] = new Audio;
    if (onerror) onerror();
   }
   if (Browser.hasBlobConstructor) {
    try {
     var b = new Blob([ byteArray ], {
      type: Browser.getMimetype(name)
     });
    } catch (e) {
     return fail();
    }
    var url = Browser.URLObject.createObjectURL(b);
    var audio = new Audio;
    audio.addEventListener("canplaythrough", (function() {
     finish(audio);
    }), false);
    audio.onerror = function audio_onerror(event) {
     if (done) return;
     console.log("warning: browser could not fully decode audio " + name + ", trying slower base64 approach");
     function encode64(data) {
      var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var PAD = "=";
      var ret = "";
      var leftchar = 0;
      var leftbits = 0;
      for (var i = 0; i < data.length; i++) {
       leftchar = leftchar << 8 | data[i];
       leftbits += 8;
       while (leftbits >= 6) {
        var curr = leftchar >> leftbits - 6 & 63;
        leftbits -= 6;
        ret += BASE[curr];
       }
      }
      if (leftbits == 2) {
       ret += BASE[(leftchar & 3) << 4];
       ret += PAD + PAD;
      } else if (leftbits == 4) {
       ret += BASE[(leftchar & 15) << 2];
       ret += PAD;
      }
      return ret;
     }
     audio.src = "data:audio/x-" + name.substr(-3) + ";base64," + encode64(byteArray);
     finish(audio);
    };
    audio.src = url;
    Browser.safeSetTimeout((function() {
     finish(audio);
    }), 1e4);
   } else {
    return fail();
   }
  };
  Module["preloadPlugins"].push(audioPlugin);
  var canvas = Module["canvas"];
  function pointerLockChange() {
   Browser.pointerLock = document["pointerLockElement"] === canvas || document["mozPointerLockElement"] === canvas || document["webkitPointerLockElement"] === canvas || document["msPointerLockElement"] === canvas;
  }
  if (canvas) {
   canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] || canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || (function() {});
   canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || (function() {});
   canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
   document.addEventListener("pointerlockchange", pointerLockChange, false);
   document.addEventListener("mozpointerlockchange", pointerLockChange, false);
   document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
   document.addEventListener("mspointerlockchange", pointerLockChange, false);
   if (Module["elementPointerLock"]) {
    canvas.addEventListener("click", (function(ev) {
     if (!Browser.pointerLock && canvas.requestPointerLock) {
      canvas.requestPointerLock();
      ev.preventDefault();
     }
    }), false);
   }
  }
 }),
 createContext: (function(canvas, useWebGL, setInModule, webGLContextAttributes) {
  if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx;
  var ctx;
  var contextHandle;
  if (useWebGL) {
   var contextAttributes = {
    antialias: false,
    alpha: false
   };
   if (webGLContextAttributes) {
    for (var attribute in webGLContextAttributes) {
     contextAttributes[attribute] = webGLContextAttributes[attribute];
    }
   }
   contextHandle = GL.createContext(canvas, contextAttributes);
   if (contextHandle) {
    ctx = GL.getContext(contextHandle).GLctx;
   }
   canvas.style.backgroundColor = "black";
  } else {
   ctx = canvas.getContext("2d");
  }
  if (!ctx) return null;
  if (setInModule) {
   if (!useWebGL) assert(typeof GLctx === "undefined", "cannot set in module if GLctx is used, but we are a non-GL context that would replace it");
   Module.ctx = ctx;
   if (useWebGL) GL.makeContextCurrent(contextHandle);
   Module.useWebGL = useWebGL;
   Browser.moduleContextCreatedCallbacks.forEach((function(callback) {
    callback();
   }));
   Browser.init();
  }
  return ctx;
 }),
 destroyContext: (function(canvas, useWebGL, setInModule) {}),
 fullScreenHandlersInstalled: false,
 lockPointer: undefined,
 resizeCanvas: undefined,
 requestFullScreen: (function(lockPointer, resizeCanvas, vrDevice) {
  Browser.lockPointer = lockPointer;
  Browser.resizeCanvas = resizeCanvas;
  Browser.vrDevice = vrDevice;
  if (typeof Browser.lockPointer === "undefined") Browser.lockPointer = true;
  if (typeof Browser.resizeCanvas === "undefined") Browser.resizeCanvas = false;
  if (typeof Browser.vrDevice === "undefined") Browser.vrDevice = null;
  var canvas = Module["canvas"];
  function fullScreenChange() {
   Browser.isFullScreen = false;
   var canvasContainer = canvas.parentNode;
   if ((document["webkitFullScreenElement"] || document["webkitFullscreenElement"] || document["mozFullScreenElement"] || document["mozFullscreenElement"] || document["fullScreenElement"] || document["fullscreenElement"] || document["msFullScreenElement"] || document["msFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvasContainer) {
    canvas.cancelFullScreen = document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["webkitCancelFullScreen"] || document["msExitFullscreen"] || document["exitFullscreen"] || (function() {});
    canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
    if (Browser.lockPointer) canvas.requestPointerLock();
    Browser.isFullScreen = true;
    if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
   } else {
    canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
    canvasContainer.parentNode.removeChild(canvasContainer);
    if (Browser.resizeCanvas) Browser.setWindowedCanvasSize();
   }
   if (Module["onFullScreen"]) Module["onFullScreen"](Browser.isFullScreen);
   Browser.updateCanvasDimensions(canvas);
  }
  if (!Browser.fullScreenHandlersInstalled) {
   Browser.fullScreenHandlersInstalled = true;
   document.addEventListener("fullscreenchange", fullScreenChange, false);
   document.addEventListener("mozfullscreenchange", fullScreenChange, false);
   document.addEventListener("webkitfullscreenchange", fullScreenChange, false);
   document.addEventListener("MSFullscreenChange", fullScreenChange, false);
  }
  var canvasContainer = document.createElement("div");
  canvas.parentNode.insertBefore(canvasContainer, canvas);
  canvasContainer.appendChild(canvas);
  canvasContainer.requestFullScreen = canvasContainer["requestFullScreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullScreen"] ? (function() {
   canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]);
  }) : null);
  if (vrDevice) {
   canvasContainer.requestFullScreen({
    vrDisplay: vrDevice
   });
  } else {
   canvasContainer.requestFullScreen();
  }
 }),
 nextRAF: 0,
 fakeRequestAnimationFrame: (function(func) {
  var now = Date.now();
  if (Browser.nextRAF === 0) {
   Browser.nextRAF = now + 1e3 / 60;
  } else {
   while (now + 2 >= Browser.nextRAF) {
    Browser.nextRAF += 1e3 / 60;
   }
  }
  var delay = Math.max(Browser.nextRAF - now, 0);
  setTimeout(func, delay);
 }),
 requestAnimationFrame: function requestAnimationFrame(func) {
  if (typeof window === "undefined") {
   Browser.fakeRequestAnimationFrame(func);
  } else {
   if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window["requestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["msRequestAnimationFrame"] || window["oRequestAnimationFrame"] || Browser.fakeRequestAnimationFrame;
   }
   window.requestAnimationFrame(func);
  }
 },
 safeCallback: (function(func) {
  return (function() {
   if (!ABORT) return func.apply(null, arguments);
  });
 }),
 allowAsyncCallbacks: true,
 queuedAsyncCallbacks: [],
 pauseAsyncCallbacks: (function() {
  Browser.allowAsyncCallbacks = false;
 }),
 resumeAsyncCallbacks: (function() {
  Browser.allowAsyncCallbacks = true;
  if (Browser.queuedAsyncCallbacks.length > 0) {
   var callbacks = Browser.queuedAsyncCallbacks;
   Browser.queuedAsyncCallbacks = [];
   callbacks.forEach((function(func) {
    func();
   }));
  }
 }),
 safeRequestAnimationFrame: (function(func) {
  return Browser.requestAnimationFrame((function() {
   if (ABORT) return;
   if (Browser.allowAsyncCallbacks) {
    func();
   } else {
    Browser.queuedAsyncCallbacks.push(func);
   }
  }));
 }),
 safeSetTimeout: (function(func, timeout) {
  Module["noExitRuntime"] = true;
  return setTimeout((function() {
   if (ABORT) return;
   if (Browser.allowAsyncCallbacks) {
    func();
   } else {
    Browser.queuedAsyncCallbacks.push(func);
   }
  }), timeout);
 }),
 safeSetInterval: (function(func, timeout) {
  Module["noExitRuntime"] = true;
  return setInterval((function() {
   if (ABORT) return;
   if (Browser.allowAsyncCallbacks) {
    func();
   }
  }), timeout);
 }),
 getMimetype: (function(name) {
  return {
   "jpg": "image/jpeg",
   "jpeg": "image/jpeg",
   "png": "image/png",
   "bmp": "image/bmp",
   "ogg": "audio/ogg",
   "wav": "audio/wav",
   "mp3": "audio/mpeg"
  }[name.substr(name.lastIndexOf(".") + 1)];
 }),
 getUserMedia: (function(func) {
  if (!window.getUserMedia) {
   window.getUserMedia = navigator["getUserMedia"] || navigator["mozGetUserMedia"];
  }
  window.getUserMedia(func);
 }),
 getMovementX: (function(event) {
  return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0;
 }),
 getMovementY: (function(event) {
  return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0;
 }),
 getMouseWheelDelta: (function(event) {
  var delta = 0;
  switch (event.type) {
  case "DOMMouseScroll":
   delta = event.detail;
   break;
  case "mousewheel":
   delta = event.wheelDelta;
   break;
  case "wheel":
   delta = event["deltaY"];
   break;
  default:
   throw "unrecognized mouse wheel event: " + event.type;
  }
  return delta;
 }),
 mouseX: 0,
 mouseY: 0,
 mouseMovementX: 0,
 mouseMovementY: 0,
 touches: {},
 lastTouches: {},
 calculateMouseEvent: (function(event) {
  if (Browser.pointerLock) {
   if (event.type != "mousemove" && "mozMovementX" in event) {
    Browser.mouseMovementX = Browser.mouseMovementY = 0;
   } else {
    Browser.mouseMovementX = Browser.getMovementX(event);
    Browser.mouseMovementY = Browser.getMovementY(event);
   }
   if (typeof SDL != "undefined") {
    Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
    Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
   } else {
    Browser.mouseX += Browser.mouseMovementX;
    Browser.mouseY += Browser.mouseMovementY;
   }
  } else {
   var rect = Module["canvas"].getBoundingClientRect();
   var cw = Module["canvas"].width;
   var ch = Module["canvas"].height;
   var scrollX = typeof window.scrollX !== "undefined" ? window.scrollX : window.pageXOffset;
   var scrollY = typeof window.scrollY !== "undefined" ? window.scrollY : window.pageYOffset;
   if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
    var touch = event.touch;
    if (touch === undefined) {
     return;
    }
    var adjustedX = touch.pageX - (scrollX + rect.left);
    var adjustedY = touch.pageY - (scrollY + rect.top);
    adjustedX = adjustedX * (cw / rect.width);
    adjustedY = adjustedY * (ch / rect.height);
    var coords = {
     x: adjustedX,
     y: adjustedY
    };
    if (event.type === "touchstart") {
     Browser.lastTouches[touch.identifier] = coords;
     Browser.touches[touch.identifier] = coords;
    } else if (event.type === "touchend" || event.type === "touchmove") {
     var last = Browser.touches[touch.identifier];
     if (!last) last = coords;
     Browser.lastTouches[touch.identifier] = last;
     Browser.touches[touch.identifier] = coords;
    }
    return;
   }
   var x = event.pageX - (scrollX + rect.left);
   var y = event.pageY - (scrollY + rect.top);
   x = x * (cw / rect.width);
   y = y * (ch / rect.height);
   Browser.mouseMovementX = x - Browser.mouseX;
   Browser.mouseMovementY = y - Browser.mouseY;
   Browser.mouseX = x;
   Browser.mouseY = y;
  }
 }),
 xhrLoad: (function(url, onload, onerror) {
  var xhr = new XMLHttpRequest;
  xhr.open("GET", url, true);
  xhr.responseType = "arraybuffer";
  xhr.onload = function xhr_onload() {
   if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
    onload(xhr.response);
   } else {
    onerror();
   }
  };
  xhr.onerror = onerror;
  xhr.send(null);
 }),
 asyncLoad: (function(url, onload, onerror, noRunDep) {
  Browser.xhrLoad(url, (function(arrayBuffer) {
   assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
   onload(new Uint8Array(arrayBuffer));
   if (!noRunDep) removeRunDependency("al " + url);
  }), (function(event) {
   if (onerror) {
    onerror();
   } else {
    throw 'Loading data file "' + url + '" failed.';
   }
  }));
  if (!noRunDep) addRunDependency("al " + url);
 }),
 resizeListeners: [],
 updateResizeListeners: (function() {
  var canvas = Module["canvas"];
  Browser.resizeListeners.forEach((function(listener) {
   listener(canvas.width, canvas.height);
  }));
 }),
 setCanvasSize: (function(width, height, noUpdates) {
  var canvas = Module["canvas"];
  Browser.updateCanvasDimensions(canvas, width, height);
  if (!noUpdates) Browser.updateResizeListeners();
 }),
 windowedWidth: 0,
 windowedHeight: 0,
 setFullScreenCanvasSize: (function() {
  if (typeof SDL != "undefined") {
   var flags = HEAPU32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2];
   flags = flags | 8388608;
   HEAP32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2] = flags;
  }
  Browser.updateResizeListeners();
 }),
 setWindowedCanvasSize: (function() {
  if (typeof SDL != "undefined") {
   var flags = HEAPU32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2];
   flags = flags & ~8388608;
   HEAP32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2] = flags;
  }
  Browser.updateResizeListeners();
 }),
 updateCanvasDimensions: (function(canvas, wNative, hNative) {
  if (wNative && hNative) {
   canvas.widthNative = wNative;
   canvas.heightNative = hNative;
  } else {
   wNative = canvas.widthNative;
   hNative = canvas.heightNative;
  }
  var w = wNative;
  var h = hNative;
  if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
   if (w / h < Module["forcedAspectRatio"]) {
    w = Math.round(h * Module["forcedAspectRatio"]);
   } else {
    h = Math.round(w / Module["forcedAspectRatio"]);
   }
  }
  if ((document["webkitFullScreenElement"] || document["webkitFullscreenElement"] || document["mozFullScreenElement"] || document["mozFullscreenElement"] || document["fullScreenElement"] || document["fullscreenElement"] || document["msFullScreenElement"] || document["msFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvas.parentNode && typeof screen != "undefined") {
   var factor = Math.min(screen.width / w, screen.height / h);
   w = Math.round(w * factor);
   h = Math.round(h * factor);
  }
  if (Browser.resizeCanvas) {
   if (canvas.width != w) canvas.width = w;
   if (canvas.height != h) canvas.height = h;
   if (typeof canvas.style != "undefined") {
    canvas.style.removeProperty("width");
    canvas.style.removeProperty("height");
   }
  } else {
   if (canvas.width != wNative) canvas.width = wNative;
   if (canvas.height != hNative) canvas.height = hNative;
   if (typeof canvas.style != "undefined") {
    if (w != wNative || h != hNative) {
     canvas.style.setProperty("width", w + "px", "important");
     canvas.style.setProperty("height", h + "px", "important");
    } else {
     canvas.style.removeProperty("width");
     canvas.style.removeProperty("height");
    }
   }
  }
 }),
 wgetRequests: {},
 nextWgetRequestHandle: 0,
 getNextWgetRequestHandle: (function() {
  var handle = Browser.nextWgetRequestHandle;
  Browser.nextWgetRequestHandle++;
  return handle;
 })
};
function _time(ptr) {
 var ret = Date.now() / 1e3 | 0;
 if (ptr) {
  HEAP32[ptr >> 2] = ret;
 }
 return ret;
}
function _pthread_self() {
 return 0;
}
function ___syscall140(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var stream = SYSCALLS.getStreamFromFD(), offset_high = SYSCALLS.get(), offset_low = SYSCALLS.get(), result = SYSCALLS.get(), whence = SYSCALLS.get();
  var offset = offset_low;
  assert(offset_high === 0);
  FS.llseek(stream, offset, whence);
  HEAP32[result >> 2] = stream.position;
  if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
  return 0;
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
function _malloc(bytes) {
 var ptr = Runtime.dynamicAlloc(bytes + 8);
 return ptr + 8 & 4294967288;
}
Module["_malloc"] = _malloc;
function ___cxa_allocate_exception(size) {
 return _malloc(size);
}
function ___syscall54(which, varargs) {
 SYSCALLS.varargs = varargs;
 try {
  var stream = SYSCALLS.getStreamFromFD(), op = SYSCALLS.get();
  switch (op) {
  case 21505:
   {
    if (!stream.tty) return -ERRNO_CODES.ENOTTY;
    return 0;
   }
  case 21506:
   {
    if (!stream.tty) return -ERRNO_CODES.ENOTTY;
    return 0;
   }
  case 21519:
   {
    if (!stream.tty) return -ERRNO_CODES.ENOTTY;
    var argp = SYSCALLS.get();
    HEAP32[argp >> 2] = 0;
    return 0;
   }
  case 21520:
   {
    if (!stream.tty) return -ERRNO_CODES.ENOTTY;
    return -ERRNO_CODES.EINVAL;
   }
  case 21531:
   {
    var argp = SYSCALLS.get();
    return FS.ioctl(stream, op, argp);
   }
  default:
   abort("bad ioctl syscall " + op);
  }
 } catch (e) {
  if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
  return -e.errno;
 }
}
FS.staticInit();
__ATINIT__.unshift((function() {
 if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
}));
__ATMAIN__.push((function() {
 FS.ignorePermissions = false;
}));
__ATEXIT__.push((function() {
 FS.quit();
}));
Module["FS_createFolder"] = FS.createFolder;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createLink"] = FS.createLink;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
__ATINIT__.unshift((function() {
 TTY.init();
}));
__ATEXIT__.push((function() {
 TTY.shutdown();
}));
if (ENVIRONMENT_IS_NODE) {
 var fs = require("fs");
 var NODEJS_PATH = require("path");
 NODEFS.staticInit();
}
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas, vrDevice) {
 Browser.requestFullScreen(lockPointer, resizeCanvas, vrDevice);
};
Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) {
 Browser.requestAnimationFrame(func);
};
Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) {
 Browser.setCanvasSize(width, height, noUpdates);
};
Module["pauseMainLoop"] = function Module_pauseMainLoop() {
 Browser.mainLoop.pause();
};
Module["resumeMainLoop"] = function Module_resumeMainLoop() {
 Browser.mainLoop.resume();
};
Module["getUserMedia"] = function Module_getUserMedia() {
 Browser.getUserMedia();
};
Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) {
 return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes);
};
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
staticSealed = true;
STACK_MAX = STACK_BASE + TOTAL_STACK;
DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");
var cttz_i8 = allocate([ 8, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 7, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0 ], "i8", ALLOC_DYNAMIC);
function invoke_iiii(index, a1, a2, a3) {
 try {
  return Module["dynCall_iiii"](index, a1, a2, a3);
 } catch (e) {
  if (typeof e !== "number" && e !== "longjmp") throw e;
  asm["setThrew"](1, 0);
 }
}
function invoke_viiiii(index, a1, a2, a3, a4, a5) {
 try {
  Module["dynCall_viiiii"](index, a1, a2, a3, a4, a5);
 } catch (e) {
  if (typeof e !== "number" && e !== "longjmp") throw e;
  asm["setThrew"](1, 0);
 }
}
function invoke_vi(index, a1) {
 try {
  Module["dynCall_vi"](index, a1);
 } catch (e) {
  if (typeof e !== "number" && e !== "longjmp") throw e;
  asm["setThrew"](1, 0);
 }
}
function invoke_ii(index, a1) {
 try {
  return Module["dynCall_ii"](index, a1);
 } catch (e) {
  if (typeof e !== "number" && e !== "longjmp") throw e;
  asm["setThrew"](1, 0);
 }
}
function invoke_v(index) {
 try {
  Module["dynCall_v"](index);
 } catch (e) {
  if (typeof e !== "number" && e !== "longjmp") throw e;
  asm["setThrew"](1, 0);
 }
}
function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
 try {
  Module["dynCall_viiiiii"](index, a1, a2, a3, a4, a5, a6);
 } catch (e) {
  if (typeof e !== "number" && e !== "longjmp") throw e;
  asm["setThrew"](1, 0);
 }
}
function invoke_viiii(index, a1, a2, a3, a4) {
 try {
  Module["dynCall_viiii"](index, a1, a2, a3, a4);
 } catch (e) {
  if (typeof e !== "number" && e !== "longjmp") throw e;
  asm["setThrew"](1, 0);
 }
}
Module.asmGlobalArg = {
 "Math": Math,
 "Int8Array": Int8Array,
 "Int16Array": Int16Array,
 "Int32Array": Int32Array,
 "Uint8Array": Uint8Array,
 "Uint16Array": Uint16Array,
 "Uint32Array": Uint32Array,
 "Float32Array": Float32Array,
 "Float64Array": Float64Array,
 "NaN": NaN,
 "Infinity": Infinity
};
Module.asmLibraryArg = {
 "abort": abort,
 "assert": assert,
 "invoke_iiii": invoke_iiii,
 "invoke_viiiii": invoke_viiiii,
 "invoke_vi": invoke_vi,
 "invoke_ii": invoke_ii,
 "invoke_v": invoke_v,
 "invoke_viiiiii": invoke_viiiiii,
 "invoke_viiii": invoke_viiii,
 "_pthread_cleanup_pop": _pthread_cleanup_pop,
 "___syscall6": ___syscall6,
 "___setErrNo": ___setErrNo,
 "___cxa_allocate_exception": ___cxa_allocate_exception,
 "__ZSt18uncaught_exceptionv": __ZSt18uncaught_exceptionv,
 "_emscripten_set_main_loop_timing": _emscripten_set_main_loop_timing,
 "_sbrk": _sbrk,
 "_emscripten_memcpy_big": _emscripten_memcpy_big,
 "___resumeException": ___resumeException,
 "___cxa_find_matching_catch": ___cxa_find_matching_catch,
 "_sysconf": _sysconf,
 "_pthread_self": _pthread_self,
 "___syscall54": ___syscall54,
 "___unlock": ___unlock,
 "_emscripten_set_main_loop": _emscripten_set_main_loop,
 "___cxa_throw": ___cxa_throw,
 "___lock": ___lock,
 "_abort": _abort,
 "_pthread_cleanup_push": _pthread_cleanup_push,
 "_time": _time,
 "_gettimeofday": _gettimeofday,
 "___syscall140": ___syscall140,
 "___syscall146": ___syscall146,
 "STACKTOP": STACKTOP,
 "STACK_MAX": STACK_MAX,
 "tempDoublePtr": tempDoublePtr,
 "ABORT": ABORT,
 "cttz_i8": cttz_i8
};
// EMSCRIPTEN_START_ASM

var asm = (function(global,env,buffer) {

  'use asm';
  
  
  var HEAP8 = new global.Int8Array(buffer);
  var HEAP16 = new global.Int16Array(buffer);
  var HEAP32 = new global.Int32Array(buffer);
  var HEAPU8 = new global.Uint8Array(buffer);
  var HEAPU16 = new global.Uint16Array(buffer);
  var HEAPU32 = new global.Uint32Array(buffer);
  var HEAPF32 = new global.Float32Array(buffer);
  var HEAPF64 = new global.Float64Array(buffer);


  var STACKTOP=env.STACKTOP|0;
  var STACK_MAX=env.STACK_MAX|0;
  var tempDoublePtr=env.tempDoublePtr|0;
  var ABORT=env.ABORT|0;
  var cttz_i8=env.cttz_i8|0;

  var __THREW__ = 0;
  var threwValue = 0;
  var setjmpId = 0;
  var undef = 0;
  var nan = global.NaN, inf = global.Infinity;
  var tempInt = 0, tempBigInt = 0, tempBigIntP = 0, tempBigIntS = 0, tempBigIntR = 0.0, tempBigIntI = 0, tempBigIntD = 0, tempValue = 0, tempDouble = 0.0;

  var tempRet0 = 0;
  var tempRet1 = 0;
  var tempRet2 = 0;
  var tempRet3 = 0;
  var tempRet4 = 0;
  var tempRet5 = 0;
  var tempRet6 = 0;
  var tempRet7 = 0;
  var tempRet8 = 0;
  var tempRet9 = 0;
  var Math_floor=global.Math.floor;
  var Math_abs=global.Math.abs;
  var Math_sqrt=global.Math.sqrt;
  var Math_pow=global.Math.pow;
  var Math_cos=global.Math.cos;
  var Math_sin=global.Math.sin;
  var Math_tan=global.Math.tan;
  var Math_acos=global.Math.acos;
  var Math_asin=global.Math.asin;
  var Math_atan=global.Math.atan;
  var Math_atan2=global.Math.atan2;
  var Math_exp=global.Math.exp;
  var Math_log=global.Math.log;
  var Math_ceil=global.Math.ceil;
  var Math_imul=global.Math.imul;
  var Math_min=global.Math.min;
  var Math_clz32=global.Math.clz32;
  var Math_fround=global.Math.fround;
  var abort=env.abort;
  var assert=env.assert;
  var invoke_iiii=env.invoke_iiii;
  var invoke_viiiii=env.invoke_viiiii;
  var invoke_vi=env.invoke_vi;
  var invoke_ii=env.invoke_ii;
  var invoke_v=env.invoke_v;
  var invoke_viiiiii=env.invoke_viiiiii;
  var invoke_viiii=env.invoke_viiii;
  var _pthread_cleanup_pop=env._pthread_cleanup_pop;
  var ___syscall6=env.___syscall6;
  var ___setErrNo=env.___setErrNo;
  var ___cxa_allocate_exception=env.___cxa_allocate_exception;
  var __ZSt18uncaught_exceptionv=env.__ZSt18uncaught_exceptionv;
  var _emscripten_set_main_loop_timing=env._emscripten_set_main_loop_timing;
  var _sbrk=env._sbrk;
  var _emscripten_memcpy_big=env._emscripten_memcpy_big;
  var ___resumeException=env.___resumeException;
  var ___cxa_find_matching_catch=env.___cxa_find_matching_catch;
  var _sysconf=env._sysconf;
  var _pthread_self=env._pthread_self;
  var ___syscall54=env.___syscall54;
  var ___unlock=env.___unlock;
  var _emscripten_set_main_loop=env._emscripten_set_main_loop;
  var ___cxa_throw=env.___cxa_throw;
  var ___lock=env.___lock;
  var _abort=env._abort;
  var _pthread_cleanup_push=env._pthread_cleanup_push;
  var _time=env._time;
  var _gettimeofday=env._gettimeofday;
  var ___syscall140=env.___syscall140;
  var ___syscall146=env.___syscall146;
  var tempFloat = Math_fround(0);
  const f0 = Math_fround(0);

// EMSCRIPTEN_START_FUNCS

function _printf_core(i1, i2, i3, i4, i5) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 var i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0, i13 = 0, i14 = 0, i15 = 0, i16 = 0, i17 = 0, i18 = 0, i19 = 0, i20 = 0, i21 = 0, i22 = 0, i23 = 0, i24 = 0, i25 = 0, i26 = 0, i27 = 0, i28 = 0, i29 = 0, i30 = 0, i31 = 0, i32 = 0, i33 = 0, i34 = 0, i35 = 0, i36 = 0, i37 = 0, i38 = 0, i39 = 0, i40 = 0, i41 = 0, i42 = 0, i43 = 0, i44 = 0, i45 = 0, i46 = 0, i47 = 0, i48 = 0, i49 = 0, i50 = 0, i51 = 0, i52 = 0, i53 = 0, i54 = 0, i55 = 0, i56 = 0, i57 = 0, i58 = 0, i59 = 0, i60 = 0, i61 = 0, i62 = 0, i63 = 0, i64 = 0, i65 = 0, i66 = 0, i67 = 0, i68 = 0, i69 = 0, i70 = 0, i71 = 0, i72 = 0, i73 = 0, i74 = 0, i75 = 0, i76 = 0, i77 = 0, i78 = 0, i79 = 0, i80 = 0, i81 = 0, i82 = 0, i83 = 0, i84 = 0, i85 = 0, i86 = 0, i87 = 0, i88 = 0, i89 = 0, i90 = 0, i91 = 0, i92 = 0, i93 = 0, i94 = 0, i95 = 0, i96 = 0, i97 = 0, i98 = 0, i99 = 0, d100 = 0.0, d101 = 0.0, i102 = 0, i103 = 0, i104 = 0, i105 = 0, i106 = 0, d107 = 0.0, d108 = 0.0, d109 = 0.0, d110 = 0.0, i111 = 0, i112 = 0, i113 = 0, i114 = 0, i115 = 0, i116 = 0, i117 = 0, i118 = 0, d119 = 0.0, i120 = 0, i121 = 0, i122 = 0, i123 = 0, i124 = 0, i125 = 0, i126 = 0, i127 = 0, i128 = 0, i129 = 0, i130 = 0, i131 = 0, i132 = 0, i133 = 0, i134 = 0, i135 = 0, i136 = 0, i137 = 0, i138 = 0, i139 = 0, i140 = 0, i141 = 0, i142 = 0, i143 = 0, i144 = 0, i145 = 0, i146 = 0, d147 = 0.0, d148 = 0.0, d149 = 0.0, i150 = 0, i151 = 0, i152 = 0, i153 = 0, i154 = 0, i155 = 0, i156 = 0, i157 = 0, i158 = 0, i159 = 0, i160 = 0, i161 = 0, i162 = 0, i163 = 0, i164 = 0, i165 = 0, i166 = 0, i167 = 0, i168 = 0, i169 = 0, i170 = 0, i171 = 0, i172 = 0, i173 = 0, i174 = 0, i175 = 0, i176 = 0, i177 = 0, i178 = 0, i179 = 0, i180 = 0, i181 = 0, i182 = 0, i183 = 0, i184 = 0;
 i6 = STACKTOP;
 STACKTOP = STACKTOP + 624 | 0;
 i7 = i6 + 24 | 0;
 i8 = i6 + 16 | 0;
 i9 = i6 + 588 | 0;
 i10 = i6 + 576 | 0;
 i11 = i6;
 i12 = i6 + 536 | 0;
 i13 = i6 + 8 | 0;
 i14 = i6 + 528 | 0;
 i15 = (i1 | 0) != 0;
 i16 = i12 + 40 | 0;
 i17 = i16;
 i18 = i12 + 39 | 0;
 i12 = i13 + 4 | 0;
 i19 = i10 + 12 | 0;
 i20 = i10 + 11 | 0;
 i10 = i9;
 i21 = i19;
 i22 = i21 - i10 | 0;
 i23 = -2 - i10 | 0;
 i24 = i21 + 2 | 0;
 i25 = i7 + 288 | 0;
 i26 = i9 + 9 | 0;
 i27 = i26;
 i28 = i9 + 8 | 0;
 i29 = i2;
 i2 = 0;
 i30 = 0;
 i31 = 0;
 L1 : while (1) {
  do if ((i2 | 0) > -1) if ((i30 | 0) > (2147483647 - i2 | 0)) {
   HEAP32[(___errno_location() | 0) >> 2] = 75;
   i32 = -1;
   break;
  } else {
   i32 = i30 + i2 | 0;
   break;
  } else i32 = i2; while (0);
  i33 = HEAP8[i29 >> 0] | 0;
  if (!(i33 << 24 >> 24)) {
   i34 = i32;
   i35 = i31;
   i36 = 245;
   break;
  } else {
   i37 = i33;
   i38 = i29;
  }
  L9 : while (1) {
   switch (i37 << 24 >> 24) {
   case 37:
    {
     i39 = i38;
     i40 = i38;
     i36 = 9;
     break L9;
     break;
    }
   case 0:
    {
     i41 = i38;
     i42 = i38;
     break L9;
     break;
    }
   default:
    {}
   }
   i33 = i38 + 1 | 0;
   i37 = HEAP8[i33 >> 0] | 0;
   i38 = i33;
  }
  L12 : do if ((i36 | 0) == 9) while (1) {
   i36 = 0;
   if ((HEAP8[i39 + 1 >> 0] | 0) != 37) {
    i41 = i39;
    i42 = i40;
    break L12;
   }
   i33 = i40 + 1 | 0;
   i43 = i39 + 2 | 0;
   if ((HEAP8[i43 >> 0] | 0) == 37) {
    i39 = i43;
    i40 = i33;
    i36 = 9;
   } else {
    i41 = i43;
    i42 = i33;
    break;
   }
  } while (0);
  i33 = i42 - i29 | 0;
  if (i15 ? (HEAP32[i1 >> 2] & 32 | 0) == 0 : 0) ___fwritex(i29, i33, i1) | 0;
  if ((i42 | 0) != (i29 | 0)) {
   i29 = i41;
   i2 = i32;
   i30 = i33;
   continue;
  }
  i43 = i41 + 1 | 0;
  i44 = HEAP8[i43 >> 0] | 0;
  i45 = (i44 << 24 >> 24) + -48 | 0;
  if (i45 >>> 0 < 10) {
   i46 = (HEAP8[i41 + 2 >> 0] | 0) == 36;
   i47 = i46 ? i41 + 3 | 0 : i43;
   i48 = HEAP8[i47 >> 0] | 0;
   i49 = i46 ? i45 : -1;
   i50 = i46 ? 1 : i31;
   i51 = i47;
  } else {
   i48 = i44;
   i49 = -1;
   i50 = i31;
   i51 = i43;
  }
  i43 = i48 << 24 >> 24;
  L25 : do if ((i43 & -32 | 0) == 32) {
   i44 = i43;
   i47 = i48;
   i46 = 0;
   i45 = i51;
   while (1) {
    if (!(1 << i44 + -32 & 75913)) {
     i52 = i47;
     i53 = i46;
     i54 = i45;
     break L25;
    }
    i55 = 1 << (i47 << 24 >> 24) + -32 | i46;
    i56 = i45 + 1 | 0;
    i57 = HEAP8[i56 >> 0] | 0;
    i44 = i57 << 24 >> 24;
    if ((i44 & -32 | 0) != 32) {
     i52 = i57;
     i53 = i55;
     i54 = i56;
     break;
    } else {
     i47 = i57;
     i46 = i55;
     i45 = i56;
    }
   }
  } else {
   i52 = i48;
   i53 = 0;
   i54 = i51;
  } while (0);
  do if (i52 << 24 >> 24 == 42) {
   i43 = i54 + 1 | 0;
   i45 = (HEAP8[i43 >> 0] | 0) + -48 | 0;
   if (i45 >>> 0 < 10 ? (HEAP8[i54 + 2 >> 0] | 0) == 36 : 0) {
    HEAP32[i5 + (i45 << 2) >> 2] = 10;
    i58 = 1;
    i59 = i54 + 3 | 0;
    i60 = HEAP32[i4 + ((HEAP8[i43 >> 0] | 0) + -48 << 3) >> 2] | 0;
   } else {
    if (i50) {
     i61 = -1;
     break L1;
    }
    if (!i15) {
     i62 = i43;
     i63 = i53;
     i64 = 0;
     i65 = 0;
     break;
    }
    i45 = (HEAP32[i3 >> 2] | 0) + (4 - 1) & ~(4 - 1);
    i46 = HEAP32[i45 >> 2] | 0;
    HEAP32[i3 >> 2] = i45 + 4;
    i58 = 0;
    i59 = i43;
    i60 = i46;
   }
   if ((i60 | 0) < 0) {
    i62 = i59;
    i63 = i53 | 8192;
    i64 = i58;
    i65 = 0 - i60 | 0;
   } else {
    i62 = i59;
    i63 = i53;
    i64 = i58;
    i65 = i60;
   }
  } else {
   i46 = (i52 << 24 >> 24) + -48 | 0;
   if (i46 >>> 0 < 10) {
    i43 = i54;
    i45 = 0;
    i47 = i46;
    while (1) {
     i46 = (i45 * 10 | 0) + i47 | 0;
     i44 = i43 + 1 | 0;
     i47 = (HEAP8[i44 >> 0] | 0) + -48 | 0;
     if (i47 >>> 0 >= 10) {
      i66 = i46;
      i67 = i44;
      break;
     } else {
      i43 = i44;
      i45 = i46;
     }
    }
    if ((i66 | 0) < 0) {
     i61 = -1;
     break L1;
    } else {
     i62 = i67;
     i63 = i53;
     i64 = i50;
     i65 = i66;
    }
   } else {
    i62 = i54;
    i63 = i53;
    i64 = i50;
    i65 = 0;
   }
  } while (0);
  L46 : do if ((HEAP8[i62 >> 0] | 0) == 46) {
   i45 = i62 + 1 | 0;
   i43 = HEAP8[i45 >> 0] | 0;
   if (i43 << 24 >> 24 != 42) {
    i47 = (i43 << 24 >> 24) + -48 | 0;
    if (i47 >>> 0 < 10) {
     i68 = i45;
     i69 = 0;
     i70 = i47;
    } else {
     i71 = i45;
     i72 = 0;
     break;
    }
    while (1) {
     i45 = (i69 * 10 | 0) + i70 | 0;
     i47 = i68 + 1 | 0;
     i70 = (HEAP8[i47 >> 0] | 0) + -48 | 0;
     if (i70 >>> 0 >= 10) {
      i71 = i47;
      i72 = i45;
      break L46;
     } else {
      i68 = i47;
      i69 = i45;
     }
    }
   }
   i45 = i62 + 2 | 0;
   i47 = (HEAP8[i45 >> 0] | 0) + -48 | 0;
   if (i47 >>> 0 < 10 ? (HEAP8[i62 + 3 >> 0] | 0) == 36 : 0) {
    HEAP32[i5 + (i47 << 2) >> 2] = 10;
    i71 = i62 + 4 | 0;
    i72 = HEAP32[i4 + ((HEAP8[i45 >> 0] | 0) + -48 << 3) >> 2] | 0;
    break;
   }
   if (i64) {
    i61 = -1;
    break L1;
   }
   if (i15) {
    i47 = (HEAP32[i3 >> 2] | 0) + (4 - 1) & ~(4 - 1);
    i43 = HEAP32[i47 >> 2] | 0;
    HEAP32[i3 >> 2] = i47 + 4;
    i71 = i45;
    i72 = i43;
   } else {
    i71 = i45;
    i72 = 0;
   }
  } else {
   i71 = i62;
   i72 = -1;
  } while (0);
  i45 = i71;
  i43 = 0;
  while (1) {
   i47 = (HEAP8[i45 >> 0] | 0) + -65 | 0;
   if (i47 >>> 0 > 57) {
    i61 = -1;
    break L1;
   }
   i46 = i45 + 1 | 0;
   i44 = HEAP8[3972 + (i43 * 58 | 0) + i47 >> 0] | 0;
   i47 = i44 & 255;
   if ((i47 + -1 | 0) >>> 0 < 8) {
    i45 = i46;
    i43 = i47;
   } else {
    i73 = i45;
    i74 = i46;
    i75 = i44;
    i76 = i47;
    i77 = i43;
    break;
   }
  }
  if (!(i75 << 24 >> 24)) {
   i61 = -1;
   break;
  }
  i43 = (i49 | 0) > -1;
  do if (i75 << 24 >> 24 == 19) if (i43) {
   i61 = -1;
   break L1;
  } else i36 = 52; else {
   if (i43) {
    HEAP32[i5 + (i49 << 2) >> 2] = i76;
    i45 = i4 + (i49 << 3) | 0;
    i47 = HEAP32[i45 + 4 >> 2] | 0;
    i44 = i11;
    HEAP32[i44 >> 2] = HEAP32[i45 >> 2];
    HEAP32[i44 + 4 >> 2] = i47;
    i36 = 52;
    break;
   }
   if (!i15) {
    i61 = 0;
    break L1;
   }
   _pop_arg(i11, i76, i3);
  } while (0);
  if ((i36 | 0) == 52 ? (i36 = 0, !i15) : 0) {
   i29 = i74;
   i2 = i32;
   i30 = i33;
   i31 = i64;
   continue;
  }
  i43 = HEAP8[i73 >> 0] | 0;
  i47 = (i77 | 0) != 0 & (i43 & 15 | 0) == 3 ? i43 & -33 : i43;
  i43 = i63 & -65537;
  i44 = (i63 & 8192 | 0) == 0 ? i63 : i43;
  L75 : do switch (i47 | 0) {
  case 110:
   {
    switch (i77 | 0) {
    case 0:
     {
      HEAP32[HEAP32[i11 >> 2] >> 2] = i32;
      i29 = i74;
      i2 = i32;
      i30 = i33;
      i31 = i64;
      continue L1;
      break;
     }
    case 1:
     {
      HEAP32[HEAP32[i11 >> 2] >> 2] = i32;
      i29 = i74;
      i2 = i32;
      i30 = i33;
      i31 = i64;
      continue L1;
      break;
     }
    case 2:
     {
      i45 = HEAP32[i11 >> 2] | 0;
      HEAP32[i45 >> 2] = i32;
      HEAP32[i45 + 4 >> 2] = ((i32 | 0) < 0) << 31 >> 31;
      i29 = i74;
      i2 = i32;
      i30 = i33;
      i31 = i64;
      continue L1;
      break;
     }
    case 3:
     {
      HEAP16[HEAP32[i11 >> 2] >> 1] = i32;
      i29 = i74;
      i2 = i32;
      i30 = i33;
      i31 = i64;
      continue L1;
      break;
     }
    case 4:
     {
      HEAP8[HEAP32[i11 >> 2] >> 0] = i32;
      i29 = i74;
      i2 = i32;
      i30 = i33;
      i31 = i64;
      continue L1;
      break;
     }
    case 6:
     {
      HEAP32[HEAP32[i11 >> 2] >> 2] = i32;
      i29 = i74;
      i2 = i32;
      i30 = i33;
      i31 = i64;
      continue L1;
      break;
     }
    case 7:
     {
      i45 = HEAP32[i11 >> 2] | 0;
      HEAP32[i45 >> 2] = i32;
      HEAP32[i45 + 4 >> 2] = ((i32 | 0) < 0) << 31 >> 31;
      i29 = i74;
      i2 = i32;
      i30 = i33;
      i31 = i64;
      continue L1;
      break;
     }
    default:
     {
      i29 = i74;
      i2 = i32;
      i30 = i33;
      i31 = i64;
      continue L1;
     }
    }
    break;
   }
  case 112:
   {
    i78 = i44 | 8;
    i79 = i72 >>> 0 > 8 ? i72 : 8;
    i80 = 120;
    i36 = 64;
    break;
   }
  case 88:
  case 120:
   {
    i78 = i44;
    i79 = i72;
    i80 = i47;
    i36 = 64;
    break;
   }
  case 111:
   {
    i45 = i11;
    i46 = HEAP32[i45 >> 2] | 0;
    i56 = HEAP32[i45 + 4 >> 2] | 0;
    if ((i46 | 0) == 0 & (i56 | 0) == 0) i81 = i16; else {
     i45 = i16;
     i55 = i46;
     i46 = i56;
     while (1) {
      i56 = i45 + -1 | 0;
      HEAP8[i56 >> 0] = i55 & 7 | 48;
      i55 = _bitshift64Lshr(i55 | 0, i46 | 0, 3) | 0;
      i46 = tempRet0;
      if ((i55 | 0) == 0 & (i46 | 0) == 0) {
       i81 = i56;
       break;
      } else i45 = i56;
     }
    }
    if (!(i44 & 8)) {
     i82 = i81;
     i83 = i44;
     i84 = i72;
     i85 = 0;
     i86 = 4452;
     i36 = 77;
    } else {
     i45 = i17 - i81 + 1 | 0;
     i82 = i81;
     i83 = i44;
     i84 = (i72 | 0) < (i45 | 0) ? i45 : i72;
     i85 = 0;
     i86 = 4452;
     i36 = 77;
    }
    break;
   }
  case 105:
  case 100:
   {
    i45 = i11;
    i46 = HEAP32[i45 >> 2] | 0;
    i55 = HEAP32[i45 + 4 >> 2] | 0;
    if ((i55 | 0) < 0) {
     i45 = _i64Subtract(0, 0, i46 | 0, i55 | 0) | 0;
     i56 = tempRet0;
     i57 = i11;
     HEAP32[i57 >> 2] = i45;
     HEAP32[i57 + 4 >> 2] = i56;
     i87 = i45;
     i88 = i56;
     i89 = 1;
     i90 = 4452;
     i36 = 76;
     break L75;
    }
    if (!(i44 & 2048)) {
     i56 = i44 & 1;
     i87 = i46;
     i88 = i55;
     i89 = i56;
     i90 = (i56 | 0) == 0 ? 4452 : 4454;
     i36 = 76;
    } else {
     i87 = i46;
     i88 = i55;
     i89 = 1;
     i90 = 4453;
     i36 = 76;
    }
    break;
   }
  case 117:
   {
    i55 = i11;
    i87 = HEAP32[i55 >> 2] | 0;
    i88 = HEAP32[i55 + 4 >> 2] | 0;
    i89 = 0;
    i90 = 4452;
    i36 = 76;
    break;
   }
  case 99:
   {
    HEAP8[i18 >> 0] = HEAP32[i11 >> 2];
    i91 = i18;
    i92 = i43;
    i93 = 1;
    i94 = 0;
    i95 = 4452;
    i96 = i16;
    break;
   }
  case 109:
   {
    i97 = _strerror(HEAP32[(___errno_location() | 0) >> 2] | 0) | 0;
    i36 = 82;
    break;
   }
  case 115:
   {
    i55 = HEAP32[i11 >> 2] | 0;
    i97 = (i55 | 0) != 0 ? i55 : 4462;
    i36 = 82;
    break;
   }
  case 67:
   {
    HEAP32[i13 >> 2] = HEAP32[i11 >> 2];
    HEAP32[i12 >> 2] = 0;
    HEAP32[i11 >> 2] = i13;
    i98 = -1;
    i36 = 86;
    break;
   }
  case 83:
   {
    if (!i72) {
     _pad(i1, 32, i65, 0, i44);
     i99 = 0;
     i36 = 98;
    } else {
     i98 = i72;
     i36 = 86;
    }
    break;
   }
  case 65:
  case 71:
  case 70:
  case 69:
  case 97:
  case 103:
  case 102:
  case 101:
   {
    d100 = +HEAPF64[i11 >> 3];
    HEAP32[i8 >> 2] = 0;
    HEAPF64[tempDoublePtr >> 3] = d100;
    if ((HEAP32[tempDoublePtr + 4 >> 2] | 0) >= 0) if (!(i44 & 2048)) {
     i55 = i44 & 1;
     d101 = d100;
     i102 = i55;
     i103 = (i55 | 0) == 0 ? 4470 : 4475;
    } else {
     d101 = d100;
     i102 = 1;
     i103 = 4472;
    } else {
     d101 = -d100;
     i102 = 1;
     i103 = 4469;
    }
    HEAPF64[tempDoublePtr >> 3] = d101;
    i55 = HEAP32[tempDoublePtr + 4 >> 2] & 2146435072;
    do if (i55 >>> 0 < 2146435072 | (i55 | 0) == 2146435072 & 0 < 0) {
     d100 = +_frexpl(d101, i8) * 2.0;
     i46 = d100 != 0.0;
     if (i46) HEAP32[i8 >> 2] = (HEAP32[i8 >> 2] | 0) + -1;
     i56 = i47 | 32;
     if ((i56 | 0) == 97) {
      i45 = i47 & 32;
      i57 = (i45 | 0) == 0 ? i103 : i103 + 9 | 0;
      i104 = i102 | 2;
      i105 = 12 - i72 | 0;
      do if (!(i72 >>> 0 > 11 | (i105 | 0) == 0)) {
       i106 = i105;
       d107 = 8.0;
       while (1) {
        i106 = i106 + -1 | 0;
        d108 = d107 * 16.0;
        if (!i106) {
         d109 = d108;
         break;
        } else d107 = d108;
       }
       if ((HEAP8[i57 >> 0] | 0) == 45) {
        d110 = -(d109 + (-d100 - d109));
        break;
       } else {
        d110 = d100 + d109 - d109;
        break;
       }
      } else d110 = d100; while (0);
      i105 = HEAP32[i8 >> 2] | 0;
      i106 = (i105 | 0) < 0 ? 0 - i105 | 0 : i105;
      i111 = _fmt_u(i106, ((i106 | 0) < 0) << 31 >> 31, i19) | 0;
      if ((i111 | 0) == (i19 | 0)) {
       HEAP8[i20 >> 0] = 48;
       i112 = i20;
      } else i112 = i111;
      HEAP8[i112 + -1 >> 0] = (i105 >> 31 & 2) + 43;
      i105 = i112 + -2 | 0;
      HEAP8[i105 >> 0] = i47 + 15;
      i111 = (i72 | 0) < 1;
      i106 = (i44 & 8 | 0) == 0;
      d107 = d110;
      i113 = i9;
      while (1) {
       i114 = ~~d107;
       i115 = i113 + 1 | 0;
       HEAP8[i113 >> 0] = HEAPU8[4436 + i114 >> 0] | i45;
       d107 = (d107 - +(i114 | 0)) * 16.0;
       do if ((i115 - i10 | 0) == 1) {
        if (i106 & (i111 & d107 == 0.0)) {
         i116 = i115;
         break;
        }
        HEAP8[i115 >> 0] = 46;
        i116 = i113 + 2 | 0;
       } else i116 = i115; while (0);
       if (!(d107 != 0.0)) {
        i117 = i116;
        break;
       } else i113 = i116;
      }
      i113 = i117;
      i111 = (i72 | 0) != 0 & (i23 + i113 | 0) < (i72 | 0) ? i24 + i72 - i105 | 0 : i22 - i105 + i113 | 0;
      i106 = i111 + i104 | 0;
      _pad(i1, 32, i65, i106, i44);
      if (!(HEAP32[i1 >> 2] & 32)) ___fwritex(i57, i104, i1) | 0;
      _pad(i1, 48, i65, i106, i44 ^ 65536);
      i45 = i113 - i10 | 0;
      if (!(HEAP32[i1 >> 2] & 32)) ___fwritex(i9, i45, i1) | 0;
      i113 = i21 - i105 | 0;
      _pad(i1, 48, i111 - (i45 + i113) | 0, 0, 0);
      if (!(HEAP32[i1 >> 2] & 32)) ___fwritex(i105, i113, i1) | 0;
      _pad(i1, 32, i65, i106, i44 ^ 8192);
      i118 = (i106 | 0) < (i65 | 0) ? i65 : i106;
      break;
     }
     i106 = (i72 | 0) < 0 ? 6 : i72;
     if (i46) {
      i113 = (HEAP32[i8 >> 2] | 0) + -28 | 0;
      HEAP32[i8 >> 2] = i113;
      d119 = d100 * 268435456.0;
      i120 = i113;
     } else {
      d119 = d100;
      i120 = HEAP32[i8 >> 2] | 0;
     }
     i113 = (i120 | 0) < 0 ? i7 : i25;
     i45 = i113;
     d107 = d119;
     i111 = i113;
     while (1) {
      i115 = ~~d107 >>> 0;
      HEAP32[i111 >> 2] = i115;
      i114 = i111 + 4 | 0;
      d107 = (d107 - +(i115 >>> 0)) * 1.0e9;
      if (!(d107 != 0.0)) {
       i121 = i114;
       break;
      } else i111 = i114;
     }
     i111 = HEAP32[i8 >> 2] | 0;
     if ((i111 | 0) > 0) {
      i46 = i111;
      i105 = i113;
      i104 = i121;
      while (1) {
       i57 = (i46 | 0) > 29 ? 29 : i46;
       i114 = i104 + -4 | 0;
       do if (i114 >>> 0 < i105 >>> 0) i122 = i105; else {
        i115 = 0;
        i123 = i114;
        while (1) {
         i124 = _bitshift64Shl(HEAP32[i123 >> 2] | 0, 0, i57 | 0) | 0;
         i125 = _i64Add(i124 | 0, tempRet0 | 0, i115 | 0, 0) | 0;
         i124 = tempRet0;
         i126 = ___uremdi3(i125 | 0, i124 | 0, 1e9, 0) | 0;
         HEAP32[i123 >> 2] = i126;
         i126 = ___udivdi3(i125 | 0, i124 | 0, 1e9, 0) | 0;
         i123 = i123 + -4 | 0;
         if (i123 >>> 0 < i105 >>> 0) {
          i127 = i126;
          break;
         } else i115 = i126;
        }
        if (!i127) {
         i122 = i105;
         break;
        }
        i115 = i105 + -4 | 0;
        HEAP32[i115 >> 2] = i127;
        i122 = i115;
       } while (0);
       i114 = i104;
       while (1) {
        if (i114 >>> 0 <= i122 >>> 0) {
         i128 = i114;
         break;
        }
        i115 = i114 + -4 | 0;
        if (!(HEAP32[i115 >> 2] | 0)) i114 = i115; else {
         i128 = i114;
         break;
        }
       }
       i114 = (HEAP32[i8 >> 2] | 0) - i57 | 0;
       HEAP32[i8 >> 2] = i114;
       if ((i114 | 0) > 0) {
        i46 = i114;
        i105 = i122;
        i104 = i128;
       } else {
        i129 = i114;
        i130 = i122;
        i131 = i128;
        break;
       }
      }
     } else {
      i129 = i111;
      i130 = i113;
      i131 = i121;
     }
     if ((i129 | 0) < 0) {
      i104 = ((i106 + 25 | 0) / 9 | 0) + 1 | 0;
      i105 = (i56 | 0) == 102;
      i46 = i129;
      i114 = i130;
      i115 = i131;
      while (1) {
       i123 = 0 - i46 | 0;
       i126 = (i123 | 0) > 9 ? 9 : i123;
       do if (i114 >>> 0 < i115 >>> 0) {
        i123 = (1 << i126) + -1 | 0;
        i124 = 1e9 >>> i126;
        i125 = 0;
        i132 = i114;
        while (1) {
         i133 = HEAP32[i132 >> 2] | 0;
         HEAP32[i132 >> 2] = (i133 >>> i126) + i125;
         i134 = Math_imul(i133 & i123, i124) | 0;
         i132 = i132 + 4 | 0;
         if (i132 >>> 0 >= i115 >>> 0) {
          i135 = i134;
          break;
         } else i125 = i134;
        }
        i125 = (HEAP32[i114 >> 2] | 0) == 0 ? i114 + 4 | 0 : i114;
        if (!i135) {
         i136 = i125;
         i137 = i115;
         break;
        }
        HEAP32[i115 >> 2] = i135;
        i136 = i125;
        i137 = i115 + 4 | 0;
       } else {
        i136 = (HEAP32[i114 >> 2] | 0) == 0 ? i114 + 4 | 0 : i114;
        i137 = i115;
       } while (0);
       i57 = i105 ? i113 : i136;
       i125 = (i137 - i57 >> 2 | 0) > (i104 | 0) ? i57 + (i104 << 2) | 0 : i137;
       i46 = (HEAP32[i8 >> 2] | 0) + i126 | 0;
       HEAP32[i8 >> 2] = i46;
       if ((i46 | 0) >= 0) {
        i138 = i136;
        i139 = i125;
        break;
       } else {
        i114 = i136;
        i115 = i125;
       }
      }
     } else {
      i138 = i130;
      i139 = i131;
     }
     do if (i138 >>> 0 < i139 >>> 0) {
      i115 = (i45 - i138 >> 2) * 9 | 0;
      i114 = HEAP32[i138 >> 2] | 0;
      if (i114 >>> 0 < 10) {
       i140 = i115;
       break;
      } else {
       i141 = i115;
       i142 = 10;
      }
      while (1) {
       i142 = i142 * 10 | 0;
       i115 = i141 + 1 | 0;
       if (i114 >>> 0 < i142 >>> 0) {
        i140 = i115;
        break;
       } else i141 = i115;
      }
     } else i140 = 0; while (0);
     i114 = (i56 | 0) == 103;
     i126 = (i106 | 0) != 0;
     i115 = i106 - ((i56 | 0) != 102 ? i140 : 0) + ((i126 & i114) << 31 >> 31) | 0;
     if ((i115 | 0) < (((i139 - i45 >> 2) * 9 | 0) + -9 | 0)) {
      i46 = i115 + 9216 | 0;
      i115 = (i46 | 0) / 9 | 0;
      i104 = i113 + (i115 + -1023 << 2) | 0;
      i105 = ((i46 | 0) % 9 | 0) + 1 | 0;
      if ((i105 | 0) < 9) {
       i46 = 10;
       i111 = i105;
       while (1) {
        i105 = i46 * 10 | 0;
        i111 = i111 + 1 | 0;
        if ((i111 | 0) == 9) {
         i143 = i105;
         break;
        } else i46 = i105;
       }
      } else i143 = 10;
      i46 = HEAP32[i104 >> 2] | 0;
      i111 = (i46 >>> 0) % (i143 >>> 0) | 0;
      if ((i111 | 0) == 0 ? (i113 + (i115 + -1022 << 2) | 0) == (i139 | 0) : 0) {
       i144 = i138;
       i145 = i104;
       i146 = i140;
      } else i36 = 163;
      do if ((i36 | 0) == 163) {
       i36 = 0;
       d107 = (((i46 >>> 0) / (i143 >>> 0) | 0) & 1 | 0) == 0 ? 9007199254740992.0 : 9007199254740994.0;
       i56 = (i143 | 0) / 2 | 0;
       do if (i111 >>> 0 < i56 >>> 0) d147 = .5; else {
        if ((i111 | 0) == (i56 | 0) ? (i113 + (i115 + -1022 << 2) | 0) == (i139 | 0) : 0) {
         d147 = 1.0;
         break;
        }
        d147 = 1.5;
       } while (0);
       do if (!i102) {
        d148 = d107;
        d149 = d147;
       } else {
        if ((HEAP8[i103 >> 0] | 0) != 45) {
         d148 = d107;
         d149 = d147;
         break;
        }
        d148 = -d107;
        d149 = -d147;
       } while (0);
       i56 = i46 - i111 | 0;
       HEAP32[i104 >> 2] = i56;
       if (!(d148 + d149 != d148)) {
        i144 = i138;
        i145 = i104;
        i146 = i140;
        break;
       }
       i105 = i56 + i143 | 0;
       HEAP32[i104 >> 2] = i105;
       if (i105 >>> 0 > 999999999) {
        i105 = i138;
        i56 = i104;
        while (1) {
         i125 = i56 + -4 | 0;
         HEAP32[i56 >> 2] = 0;
         if (i125 >>> 0 < i105 >>> 0) {
          i57 = i105 + -4 | 0;
          HEAP32[i57 >> 2] = 0;
          i150 = i57;
         } else i150 = i105;
         i57 = (HEAP32[i125 >> 2] | 0) + 1 | 0;
         HEAP32[i125 >> 2] = i57;
         if (i57 >>> 0 > 999999999) {
          i105 = i150;
          i56 = i125;
         } else {
          i151 = i150;
          i152 = i125;
          break;
         }
        }
       } else {
        i151 = i138;
        i152 = i104;
       }
       i56 = (i45 - i151 >> 2) * 9 | 0;
       i105 = HEAP32[i151 >> 2] | 0;
       if (i105 >>> 0 < 10) {
        i144 = i151;
        i145 = i152;
        i146 = i56;
        break;
       } else {
        i153 = i56;
        i154 = 10;
       }
       while (1) {
        i154 = i154 * 10 | 0;
        i56 = i153 + 1 | 0;
        if (i105 >>> 0 < i154 >>> 0) {
         i144 = i151;
         i145 = i152;
         i146 = i56;
         break;
        } else i153 = i56;
       }
      } while (0);
      i104 = i145 + 4 | 0;
      i155 = i144;
      i156 = i146;
      i157 = i139 >>> 0 > i104 >>> 0 ? i104 : i139;
     } else {
      i155 = i138;
      i156 = i140;
      i157 = i139;
     }
     i104 = 0 - i156 | 0;
     i111 = i157;
     while (1) {
      if (i111 >>> 0 <= i155 >>> 0) {
       i158 = 0;
       i159 = i111;
       break;
      }
      i46 = i111 + -4 | 0;
      if (!(HEAP32[i46 >> 2] | 0)) i111 = i46; else {
       i158 = 1;
       i159 = i111;
       break;
      }
     }
     do if (i114) {
      i111 = (i126 & 1 ^ 1) + i106 | 0;
      if ((i111 | 0) > (i156 | 0) & (i156 | 0) > -5) {
       i160 = i47 + -1 | 0;
       i161 = i111 + -1 - i156 | 0;
      } else {
       i160 = i47 + -2 | 0;
       i161 = i111 + -1 | 0;
      }
      i111 = i44 & 8;
      if (i111) {
       i162 = i160;
       i163 = i161;
       i164 = i111;
       break;
      }
      do if (i158) {
       i111 = HEAP32[i159 + -4 >> 2] | 0;
       if (!i111) {
        i165 = 9;
        break;
       }
       if (!((i111 >>> 0) % 10 | 0)) {
        i166 = 10;
        i167 = 0;
       } else {
        i165 = 0;
        break;
       }
       while (1) {
        i166 = i166 * 10 | 0;
        i46 = i167 + 1 | 0;
        if ((i111 >>> 0) % (i166 >>> 0) | 0) {
         i165 = i46;
         break;
        } else i167 = i46;
       }
      } else i165 = 9; while (0);
      i111 = ((i159 - i45 >> 2) * 9 | 0) + -9 | 0;
      if ((i160 | 32 | 0) == 102) {
       i46 = i111 - i165 | 0;
       i115 = (i46 | 0) < 0 ? 0 : i46;
       i162 = i160;
       i163 = (i161 | 0) < (i115 | 0) ? i161 : i115;
       i164 = 0;
       break;
      } else {
       i115 = i111 + i156 - i165 | 0;
       i111 = (i115 | 0) < 0 ? 0 : i115;
       i162 = i160;
       i163 = (i161 | 0) < (i111 | 0) ? i161 : i111;
       i164 = 0;
       break;
      }
     } else {
      i162 = i47;
      i163 = i106;
      i164 = i44 & 8;
     } while (0);
     i106 = i163 | i164;
     i45 = (i106 | 0) != 0 & 1;
     i126 = (i162 | 32 | 0) == 102;
     if (i126) {
      i168 = (i156 | 0) > 0 ? i156 : 0;
      i169 = 0;
     } else {
      i114 = (i156 | 0) < 0 ? i104 : i156;
      i111 = _fmt_u(i114, ((i114 | 0) < 0) << 31 >> 31, i19) | 0;
      if ((i21 - i111 | 0) < 2) {
       i114 = i111;
       while (1) {
        i115 = i114 + -1 | 0;
        HEAP8[i115 >> 0] = 48;
        if ((i21 - i115 | 0) < 2) i114 = i115; else {
         i170 = i115;
         break;
        }
       }
      } else i170 = i111;
      HEAP8[i170 + -1 >> 0] = (i156 >> 31 & 2) + 43;
      i114 = i170 + -2 | 0;
      HEAP8[i114 >> 0] = i162;
      i168 = i21 - i114 | 0;
      i169 = i114;
     }
     i114 = i102 + 1 + i163 + i45 + i168 | 0;
     _pad(i1, 32, i65, i114, i44);
     if (!(HEAP32[i1 >> 2] & 32)) ___fwritex(i103, i102, i1) | 0;
     _pad(i1, 48, i65, i114, i44 ^ 65536);
     do if (i126) {
      i104 = i155 >>> 0 > i113 >>> 0 ? i113 : i155;
      i115 = i104;
      while (1) {
       i46 = _fmt_u(HEAP32[i115 >> 2] | 0, 0, i26) | 0;
       do if ((i115 | 0) == (i104 | 0)) {
        if ((i46 | 0) != (i26 | 0)) {
         i171 = i46;
         break;
        }
        HEAP8[i28 >> 0] = 48;
        i171 = i28;
       } else {
        if (i46 >>> 0 > i9 >>> 0) i172 = i46; else {
         i171 = i46;
         break;
        }
        while (1) {
         i105 = i172 + -1 | 0;
         HEAP8[i105 >> 0] = 48;
         if (i105 >>> 0 > i9 >>> 0) i172 = i105; else {
          i171 = i105;
          break;
         }
        }
       } while (0);
       if (!(HEAP32[i1 >> 2] & 32)) ___fwritex(i171, i27 - i171 | 0, i1) | 0;
       i46 = i115 + 4 | 0;
       if (i46 >>> 0 > i113 >>> 0) {
        i173 = i46;
        break;
       } else i115 = i46;
      }
      do if (i106) {
       if (HEAP32[i1 >> 2] & 32) break;
       ___fwritex(4504, 1, i1) | 0;
      } while (0);
      if ((i163 | 0) > 0 & i173 >>> 0 < i159 >>> 0) {
       i115 = i163;
       i104 = i173;
       while (1) {
        i46 = _fmt_u(HEAP32[i104 >> 2] | 0, 0, i26) | 0;
        if (i46 >>> 0 > i9 >>> 0) {
         i105 = i46;
         while (1) {
          i56 = i105 + -1 | 0;
          HEAP8[i56 >> 0] = 48;
          if (i56 >>> 0 > i9 >>> 0) i105 = i56; else {
           i174 = i56;
           break;
          }
         }
        } else i174 = i46;
        if (!(HEAP32[i1 >> 2] & 32)) ___fwritex(i174, (i115 | 0) > 9 ? 9 : i115, i1) | 0;
        i104 = i104 + 4 | 0;
        i105 = i115 + -9 | 0;
        if (!((i115 | 0) > 9 & i104 >>> 0 < i159 >>> 0)) {
         i175 = i105;
         break;
        } else i115 = i105;
       }
      } else i175 = i163;
      _pad(i1, 48, i175 + 9 | 0, 9, 0);
     } else {
      i115 = i158 ? i159 : i155 + 4 | 0;
      if ((i163 | 0) > -1) {
       i104 = (i164 | 0) == 0;
       i105 = i163;
       i56 = i155;
       while (1) {
        i125 = _fmt_u(HEAP32[i56 >> 2] | 0, 0, i26) | 0;
        if ((i125 | 0) == (i26 | 0)) {
         HEAP8[i28 >> 0] = 48;
         i176 = i28;
        } else i176 = i125;
        do if ((i56 | 0) == (i155 | 0)) {
         i125 = i176 + 1 | 0;
         if (!(HEAP32[i1 >> 2] & 32)) ___fwritex(i176, 1, i1) | 0;
         if (i104 & (i105 | 0) < 1) {
          i177 = i125;
          break;
         }
         if (HEAP32[i1 >> 2] & 32) {
          i177 = i125;
          break;
         }
         ___fwritex(4504, 1, i1) | 0;
         i177 = i125;
        } else {
         if (i176 >>> 0 > i9 >>> 0) i178 = i176; else {
          i177 = i176;
          break;
         }
         while (1) {
          i125 = i178 + -1 | 0;
          HEAP8[i125 >> 0] = 48;
          if (i125 >>> 0 > i9 >>> 0) i178 = i125; else {
           i177 = i125;
           break;
          }
         }
        } while (0);
        i46 = i27 - i177 | 0;
        if (!(HEAP32[i1 >> 2] & 32)) ___fwritex(i177, (i105 | 0) > (i46 | 0) ? i46 : i105, i1) | 0;
        i125 = i105 - i46 | 0;
        i56 = i56 + 4 | 0;
        if (!(i56 >>> 0 < i115 >>> 0 & (i125 | 0) > -1)) {
         i179 = i125;
         break;
        } else i105 = i125;
       }
      } else i179 = i163;
      _pad(i1, 48, i179 + 18 | 0, 18, 0);
      if (HEAP32[i1 >> 2] & 32) break;
      ___fwritex(i169, i21 - i169 | 0, i1) | 0;
     } while (0);
     _pad(i1, 32, i65, i114, i44 ^ 8192);
     i118 = (i114 | 0) < (i65 | 0) ? i65 : i114;
    } else {
     i106 = (i47 & 32 | 0) != 0;
     i113 = d101 != d101 | 0.0 != 0.0;
     i126 = i113 ? 0 : i102;
     i45 = i126 + 3 | 0;
     _pad(i1, 32, i65, i45, i43);
     i111 = HEAP32[i1 >> 2] | 0;
     if (!(i111 & 32)) {
      ___fwritex(i103, i126, i1) | 0;
      i180 = HEAP32[i1 >> 2] | 0;
     } else i180 = i111;
     if (!(i180 & 32)) ___fwritex(i113 ? (i106 ? 4496 : 4500) : i106 ? 4488 : 4492, 3, i1) | 0;
     _pad(i1, 32, i65, i45, i44 ^ 8192);
     i118 = (i45 | 0) < (i65 | 0) ? i65 : i45;
    } while (0);
    i29 = i74;
    i2 = i32;
    i30 = i118;
    i31 = i64;
    continue L1;
    break;
   }
  default:
   {
    i91 = i29;
    i92 = i44;
    i93 = i72;
    i94 = 0;
    i95 = 4452;
    i96 = i16;
   }
  } while (0);
  L313 : do if ((i36 | 0) == 64) {
   i36 = 0;
   i47 = i11;
   i33 = HEAP32[i47 >> 2] | 0;
   i55 = HEAP32[i47 + 4 >> 2] | 0;
   i47 = i80 & 32;
   if (!((i33 | 0) == 0 & (i55 | 0) == 0)) {
    i45 = i16;
    i106 = i33;
    i33 = i55;
    while (1) {
     i55 = i45 + -1 | 0;
     HEAP8[i55 >> 0] = HEAPU8[4436 + (i106 & 15) >> 0] | i47;
     i106 = _bitshift64Lshr(i106 | 0, i33 | 0, 4) | 0;
     i33 = tempRet0;
     if ((i106 | 0) == 0 & (i33 | 0) == 0) {
      i181 = i55;
      break;
     } else i45 = i55;
    }
    i45 = i11;
    if ((i78 & 8 | 0) == 0 | (HEAP32[i45 >> 2] | 0) == 0 & (HEAP32[i45 + 4 >> 2] | 0) == 0) {
     i82 = i181;
     i83 = i78;
     i84 = i79;
     i85 = 0;
     i86 = 4452;
     i36 = 77;
    } else {
     i82 = i181;
     i83 = i78;
     i84 = i79;
     i85 = 2;
     i86 = 4452 + (i80 >> 4) | 0;
     i36 = 77;
    }
   } else {
    i82 = i16;
    i83 = i78;
    i84 = i79;
    i85 = 0;
    i86 = 4452;
    i36 = 77;
   }
  } else if ((i36 | 0) == 76) {
   i36 = 0;
   i82 = _fmt_u(i87, i88, i16) | 0;
   i83 = i44;
   i84 = i72;
   i85 = i89;
   i86 = i90;
   i36 = 77;
  } else if ((i36 | 0) == 82) {
   i36 = 0;
   i45 = _memchr(i97, 0, i72) | 0;
   i33 = (i45 | 0) == 0;
   i91 = i97;
   i92 = i43;
   i93 = i33 ? i72 : i45 - i97 | 0;
   i94 = 0;
   i95 = 4452;
   i96 = i33 ? i97 + i72 | 0 : i45;
  } else if ((i36 | 0) == 86) {
   i36 = 0;
   i45 = 0;
   i33 = 0;
   i106 = HEAP32[i11 >> 2] | 0;
   while (1) {
    i47 = HEAP32[i106 >> 2] | 0;
    if (!i47) {
     i182 = i45;
     i183 = i33;
     break;
    }
    i55 = _wctomb(i14, i47) | 0;
    if ((i55 | 0) < 0 | i55 >>> 0 > (i98 - i45 | 0) >>> 0) {
     i182 = i45;
     i183 = i55;
     break;
    }
    i47 = i55 + i45 | 0;
    if (i98 >>> 0 > i47 >>> 0) {
     i45 = i47;
     i33 = i55;
     i106 = i106 + 4 | 0;
    } else {
     i182 = i47;
     i183 = i55;
     break;
    }
   }
   if ((i183 | 0) < 0) {
    i61 = -1;
    break L1;
   }
   _pad(i1, 32, i65, i182, i44);
   if (!i182) {
    i99 = 0;
    i36 = 98;
   } else {
    i106 = 0;
    i33 = HEAP32[i11 >> 2] | 0;
    while (1) {
     i45 = HEAP32[i33 >> 2] | 0;
     if (!i45) {
      i99 = i182;
      i36 = 98;
      break L313;
     }
     i55 = _wctomb(i14, i45) | 0;
     i106 = i55 + i106 | 0;
     if ((i106 | 0) > (i182 | 0)) {
      i99 = i182;
      i36 = 98;
      break L313;
     }
     if (!(HEAP32[i1 >> 2] & 32)) ___fwritex(i14, i55, i1) | 0;
     if (i106 >>> 0 >= i182 >>> 0) {
      i99 = i182;
      i36 = 98;
      break;
     } else i33 = i33 + 4 | 0;
    }
   }
  } while (0);
  if ((i36 | 0) == 98) {
   i36 = 0;
   _pad(i1, 32, i65, i99, i44 ^ 8192);
   i29 = i74;
   i2 = i32;
   i30 = (i65 | 0) > (i99 | 0) ? i65 : i99;
   i31 = i64;
   continue;
  }
  if ((i36 | 0) == 77) {
   i36 = 0;
   i43 = (i84 | 0) > -1 ? i83 & -65537 : i83;
   i33 = i11;
   i106 = (HEAP32[i33 >> 2] | 0) != 0 | (HEAP32[i33 + 4 >> 2] | 0) != 0;
   if ((i84 | 0) != 0 | i106) {
    i33 = (i106 & 1 ^ 1) + (i17 - i82) | 0;
    i91 = i82;
    i92 = i43;
    i93 = (i84 | 0) > (i33 | 0) ? i84 : i33;
    i94 = i85;
    i95 = i86;
    i96 = i16;
   } else {
    i91 = i16;
    i92 = i43;
    i93 = 0;
    i94 = i85;
    i95 = i86;
    i96 = i16;
   }
  }
  i43 = i96 - i91 | 0;
  i33 = (i93 | 0) < (i43 | 0) ? i43 : i93;
  i106 = i94 + i33 | 0;
  i55 = (i65 | 0) < (i106 | 0) ? i106 : i65;
  _pad(i1, 32, i55, i106, i92);
  if (!(HEAP32[i1 >> 2] & 32)) ___fwritex(i95, i94, i1) | 0;
  _pad(i1, 48, i55, i106, i92 ^ 65536);
  _pad(i1, 48, i33, i43, 0);
  if (!(HEAP32[i1 >> 2] & 32)) ___fwritex(i91, i43, i1) | 0;
  _pad(i1, 32, i55, i106, i92 ^ 8192);
  i29 = i74;
  i2 = i32;
  i30 = i55;
  i31 = i64;
 }
 L348 : do if ((i36 | 0) == 245) if (!i1) if (i35) {
  i64 = 1;
  while (1) {
   i31 = HEAP32[i5 + (i64 << 2) >> 2] | 0;
   if (!i31) {
    i184 = i64;
    break;
   }
   _pop_arg(i4 + (i64 << 3) | 0, i31, i3);
   i64 = i64 + 1 | 0;
   if ((i64 | 0) >= 10) {
    i61 = 1;
    break L348;
   }
  }
  if ((i184 | 0) < 10) {
   i64 = i184;
   while (1) {
    if (HEAP32[i5 + (i64 << 2) >> 2] | 0) {
     i61 = -1;
     break L348;
    }
    i64 = i64 + 1 | 0;
    if ((i64 | 0) >= 10) {
     i61 = 1;
     break;
    }
   }
  } else i61 = 1;
 } else i61 = 0; else i61 = i34; while (0);
 STACKTOP = i6;
 return i61 | 0;
}

function _malloc(i1) {
 i1 = i1 | 0;
 var i2 = 0, i3 = 0, i4 = 0, i5 = 0, i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0, i13 = 0, i14 = 0, i15 = 0, i16 = 0, i17 = 0, i18 = 0, i19 = 0, i20 = 0, i21 = 0, i22 = 0, i23 = 0, i24 = 0, i25 = 0, i26 = 0, i27 = 0, i28 = 0, i29 = 0, i30 = 0, i31 = 0, i32 = 0, i33 = 0, i34 = 0, i35 = 0, i36 = 0, i37 = 0, i38 = 0, i39 = 0, i40 = 0, i41 = 0, i42 = 0, i43 = 0, i44 = 0, i45 = 0, i46 = 0, i47 = 0, i48 = 0, i49 = 0, i50 = 0, i51 = 0, i52 = 0, i53 = 0, i54 = 0, i55 = 0, i56 = 0, i57 = 0, i58 = 0, i59 = 0, i60 = 0, i61 = 0, i62 = 0, i63 = 0, i64 = 0, i65 = 0, i66 = 0, i67 = 0, i68 = 0, i69 = 0, i70 = 0, i71 = 0, i72 = 0, i73 = 0, i74 = 0, i75 = 0, i76 = 0, i77 = 0, i78 = 0, i79 = 0, i80 = 0, i81 = 0, i82 = 0, i83 = 0, i84 = 0, i85 = 0, i86 = 0, i87 = 0, i88 = 0, i89 = 0, i90 = 0, i91 = 0, i92 = 0, i93 = 0, i94 = 0, i95 = 0, i96 = 0, i97 = 0, i98 = 0;
 do if (i1 >>> 0 < 245) {
  i2 = i1 >>> 0 < 11 ? 16 : i1 + 11 & -8;
  i3 = i2 >>> 3;
  i4 = HEAP32[90] | 0;
  i5 = i4 >>> i3;
  if (i5 & 3) {
   i6 = (i5 & 1 ^ 1) + i3 | 0;
   i7 = i6 << 1;
   i8 = 400 + (i7 << 2) | 0;
   i9 = 400 + (i7 + 2 << 2) | 0;
   i7 = HEAP32[i9 >> 2] | 0;
   i10 = i7 + 8 | 0;
   i11 = HEAP32[i10 >> 2] | 0;
   do if ((i8 | 0) != (i11 | 0)) {
    if (i11 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort();
    i12 = i11 + 12 | 0;
    if ((HEAP32[i12 >> 2] | 0) == (i7 | 0)) {
     HEAP32[i12 >> 2] = i8;
     HEAP32[i9 >> 2] = i11;
     break;
    } else _abort();
   } else HEAP32[90] = i4 & ~(1 << i6); while (0);
   i11 = i6 << 3;
   HEAP32[i7 + 4 >> 2] = i11 | 3;
   i9 = i7 + (i11 | 4) | 0;
   HEAP32[i9 >> 2] = HEAP32[i9 >> 2] | 1;
   i13 = i10;
   return i13 | 0;
  }
  i9 = HEAP32[92] | 0;
  if (i2 >>> 0 > i9 >>> 0) {
   if (i5) {
    i11 = 2 << i3;
    i8 = i5 << i3 & (i11 | 0 - i11);
    i11 = (i8 & 0 - i8) + -1 | 0;
    i8 = i11 >>> 12 & 16;
    i12 = i11 >>> i8;
    i11 = i12 >>> 5 & 8;
    i14 = i12 >>> i11;
    i12 = i14 >>> 2 & 4;
    i15 = i14 >>> i12;
    i14 = i15 >>> 1 & 2;
    i16 = i15 >>> i14;
    i15 = i16 >>> 1 & 1;
    i17 = (i11 | i8 | i12 | i14 | i15) + (i16 >>> i15) | 0;
    i15 = i17 << 1;
    i16 = 400 + (i15 << 2) | 0;
    i14 = 400 + (i15 + 2 << 2) | 0;
    i15 = HEAP32[i14 >> 2] | 0;
    i12 = i15 + 8 | 0;
    i8 = HEAP32[i12 >> 2] | 0;
    do if ((i16 | 0) != (i8 | 0)) {
     if (i8 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort();
     i11 = i8 + 12 | 0;
     if ((HEAP32[i11 >> 2] | 0) == (i15 | 0)) {
      HEAP32[i11 >> 2] = i16;
      HEAP32[i14 >> 2] = i8;
      i18 = HEAP32[92] | 0;
      break;
     } else _abort();
    } else {
     HEAP32[90] = i4 & ~(1 << i17);
     i18 = i9;
    } while (0);
    i9 = i17 << 3;
    i4 = i9 - i2 | 0;
    HEAP32[i15 + 4 >> 2] = i2 | 3;
    i8 = i15 + i2 | 0;
    HEAP32[i15 + (i2 | 4) >> 2] = i4 | 1;
    HEAP32[i15 + i9 >> 2] = i4;
    if (i18) {
     i9 = HEAP32[95] | 0;
     i14 = i18 >>> 3;
     i16 = i14 << 1;
     i3 = 400 + (i16 << 2) | 0;
     i5 = HEAP32[90] | 0;
     i10 = 1 << i14;
     if (i5 & i10) {
      i14 = 400 + (i16 + 2 << 2) | 0;
      i7 = HEAP32[i14 >> 2] | 0;
      if (i7 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort(); else {
       i19 = i14;
       i20 = i7;
      }
     } else {
      HEAP32[90] = i5 | i10;
      i19 = 400 + (i16 + 2 << 2) | 0;
      i20 = i3;
     }
     HEAP32[i19 >> 2] = i9;
     HEAP32[i20 + 12 >> 2] = i9;
     HEAP32[i9 + 8 >> 2] = i20;
     HEAP32[i9 + 12 >> 2] = i3;
    }
    HEAP32[92] = i4;
    HEAP32[95] = i8;
    i13 = i12;
    return i13 | 0;
   }
   i8 = HEAP32[91] | 0;
   if (i8) {
    i4 = (i8 & 0 - i8) + -1 | 0;
    i8 = i4 >>> 12 & 16;
    i3 = i4 >>> i8;
    i4 = i3 >>> 5 & 8;
    i9 = i3 >>> i4;
    i3 = i9 >>> 2 & 4;
    i16 = i9 >>> i3;
    i9 = i16 >>> 1 & 2;
    i10 = i16 >>> i9;
    i16 = i10 >>> 1 & 1;
    i5 = HEAP32[664 + ((i4 | i8 | i3 | i9 | i16) + (i10 >>> i16) << 2) >> 2] | 0;
    i16 = (HEAP32[i5 + 4 >> 2] & -8) - i2 | 0;
    i10 = i5;
    i9 = i5;
    while (1) {
     i5 = HEAP32[i10 + 16 >> 2] | 0;
     if (!i5) {
      i3 = HEAP32[i10 + 20 >> 2] | 0;
      if (!i3) {
       i21 = i16;
       i22 = i9;
       break;
      } else i23 = i3;
     } else i23 = i5;
     i5 = (HEAP32[i23 + 4 >> 2] & -8) - i2 | 0;
     i3 = i5 >>> 0 < i16 >>> 0;
     i16 = i3 ? i5 : i16;
     i10 = i23;
     i9 = i3 ? i23 : i9;
    }
    i9 = HEAP32[94] | 0;
    if (i22 >>> 0 < i9 >>> 0) _abort();
    i10 = i22 + i2 | 0;
    if (i22 >>> 0 >= i10 >>> 0) _abort();
    i16 = HEAP32[i22 + 24 >> 2] | 0;
    i12 = HEAP32[i22 + 12 >> 2] | 0;
    do if ((i12 | 0) == (i22 | 0)) {
     i15 = i22 + 20 | 0;
     i17 = HEAP32[i15 >> 2] | 0;
     if (!i17) {
      i3 = i22 + 16 | 0;
      i5 = HEAP32[i3 >> 2] | 0;
      if (!i5) {
       i24 = 0;
       break;
      } else {
       i25 = i5;
       i26 = i3;
      }
     } else {
      i25 = i17;
      i26 = i15;
     }
     while (1) {
      i15 = i25 + 20 | 0;
      i17 = HEAP32[i15 >> 2] | 0;
      if (i17) {
       i25 = i17;
       i26 = i15;
       continue;
      }
      i15 = i25 + 16 | 0;
      i17 = HEAP32[i15 >> 2] | 0;
      if (!i17) {
       i27 = i25;
       i28 = i26;
       break;
      } else {
       i25 = i17;
       i26 = i15;
      }
     }
     if (i28 >>> 0 < i9 >>> 0) _abort(); else {
      HEAP32[i28 >> 2] = 0;
      i24 = i27;
      break;
     }
    } else {
     i15 = HEAP32[i22 + 8 >> 2] | 0;
     if (i15 >>> 0 < i9 >>> 0) _abort();
     i17 = i15 + 12 | 0;
     if ((HEAP32[i17 >> 2] | 0) != (i22 | 0)) _abort();
     i3 = i12 + 8 | 0;
     if ((HEAP32[i3 >> 2] | 0) == (i22 | 0)) {
      HEAP32[i17 >> 2] = i12;
      HEAP32[i3 >> 2] = i15;
      i24 = i12;
      break;
     } else _abort();
    } while (0);
    do if (i16) {
     i12 = HEAP32[i22 + 28 >> 2] | 0;
     i9 = 664 + (i12 << 2) | 0;
     if ((i22 | 0) == (HEAP32[i9 >> 2] | 0)) {
      HEAP32[i9 >> 2] = i24;
      if (!i24) {
       HEAP32[91] = HEAP32[91] & ~(1 << i12);
       break;
      }
     } else {
      if (i16 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort();
      i12 = i16 + 16 | 0;
      if ((HEAP32[i12 >> 2] | 0) == (i22 | 0)) HEAP32[i12 >> 2] = i24; else HEAP32[i16 + 20 >> 2] = i24;
      if (!i24) break;
     }
     i12 = HEAP32[94] | 0;
     if (i24 >>> 0 < i12 >>> 0) _abort();
     HEAP32[i24 + 24 >> 2] = i16;
     i9 = HEAP32[i22 + 16 >> 2] | 0;
     do if (i9) if (i9 >>> 0 < i12 >>> 0) _abort(); else {
      HEAP32[i24 + 16 >> 2] = i9;
      HEAP32[i9 + 24 >> 2] = i24;
      break;
     } while (0);
     i9 = HEAP32[i22 + 20 >> 2] | 0;
     if (i9) if (i9 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort(); else {
      HEAP32[i24 + 20 >> 2] = i9;
      HEAP32[i9 + 24 >> 2] = i24;
      break;
     }
    } while (0);
    if (i21 >>> 0 < 16) {
     i16 = i21 + i2 | 0;
     HEAP32[i22 + 4 >> 2] = i16 | 3;
     i9 = i22 + (i16 + 4) | 0;
     HEAP32[i9 >> 2] = HEAP32[i9 >> 2] | 1;
    } else {
     HEAP32[i22 + 4 >> 2] = i2 | 3;
     HEAP32[i22 + (i2 | 4) >> 2] = i21 | 1;
     HEAP32[i22 + (i21 + i2) >> 2] = i21;
     i9 = HEAP32[92] | 0;
     if (i9) {
      i16 = HEAP32[95] | 0;
      i12 = i9 >>> 3;
      i9 = i12 << 1;
      i15 = 400 + (i9 << 2) | 0;
      i3 = HEAP32[90] | 0;
      i17 = 1 << i12;
      if (i3 & i17) {
       i12 = 400 + (i9 + 2 << 2) | 0;
       i5 = HEAP32[i12 >> 2] | 0;
       if (i5 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort(); else {
        i29 = i12;
        i30 = i5;
       }
      } else {
       HEAP32[90] = i3 | i17;
       i29 = 400 + (i9 + 2 << 2) | 0;
       i30 = i15;
      }
      HEAP32[i29 >> 2] = i16;
      HEAP32[i30 + 12 >> 2] = i16;
      HEAP32[i16 + 8 >> 2] = i30;
      HEAP32[i16 + 12 >> 2] = i15;
     }
     HEAP32[92] = i21;
     HEAP32[95] = i10;
    }
    i13 = i22 + 8 | 0;
    return i13 | 0;
   } else i31 = i2;
  } else i31 = i2;
 } else if (i1 >>> 0 <= 4294967231) {
  i15 = i1 + 11 | 0;
  i16 = i15 & -8;
  i9 = HEAP32[91] | 0;
  if (i9) {
   i17 = 0 - i16 | 0;
   i3 = i15 >>> 8;
   if (i3) if (i16 >>> 0 > 16777215) i32 = 31; else {
    i15 = (i3 + 1048320 | 0) >>> 16 & 8;
    i5 = i3 << i15;
    i3 = (i5 + 520192 | 0) >>> 16 & 4;
    i12 = i5 << i3;
    i5 = (i12 + 245760 | 0) >>> 16 & 2;
    i8 = 14 - (i3 | i15 | i5) + (i12 << i5 >>> 15) | 0;
    i32 = i16 >>> (i8 + 7 | 0) & 1 | i8 << 1;
   } else i32 = 0;
   i8 = HEAP32[664 + (i32 << 2) >> 2] | 0;
   L123 : do if (!i8) {
    i33 = i17;
    i34 = 0;
    i35 = 0;
    i36 = 86;
   } else {
    i5 = i17;
    i12 = 0;
    i15 = i16 << ((i32 | 0) == 31 ? 0 : 25 - (i32 >>> 1) | 0);
    i3 = i8;
    i4 = 0;
    while (1) {
     i7 = HEAP32[i3 + 4 >> 2] & -8;
     i14 = i7 - i16 | 0;
     if (i14 >>> 0 < i5 >>> 0) if ((i7 | 0) == (i16 | 0)) {
      i37 = i14;
      i38 = i3;
      i39 = i3;
      i36 = 90;
      break L123;
     } else {
      i40 = i14;
      i41 = i3;
     } else {
      i40 = i5;
      i41 = i4;
     }
     i14 = HEAP32[i3 + 20 >> 2] | 0;
     i3 = HEAP32[i3 + 16 + (i15 >>> 31 << 2) >> 2] | 0;
     i7 = (i14 | 0) == 0 | (i14 | 0) == (i3 | 0) ? i12 : i14;
     if (!i3) {
      i33 = i40;
      i34 = i7;
      i35 = i41;
      i36 = 86;
      break;
     } else {
      i5 = i40;
      i12 = i7;
      i15 = i15 << 1;
      i4 = i41;
     }
    }
   } while (0);
   if ((i36 | 0) == 86) {
    if ((i34 | 0) == 0 & (i35 | 0) == 0) {
     i8 = 2 << i32;
     i17 = i9 & (i8 | 0 - i8);
     if (!i17) {
      i31 = i16;
      break;
     }
     i8 = (i17 & 0 - i17) + -1 | 0;
     i17 = i8 >>> 12 & 16;
     i2 = i8 >>> i17;
     i8 = i2 >>> 5 & 8;
     i10 = i2 >>> i8;
     i2 = i10 >>> 2 & 4;
     i4 = i10 >>> i2;
     i10 = i4 >>> 1 & 2;
     i15 = i4 >>> i10;
     i4 = i15 >>> 1 & 1;
     i42 = HEAP32[664 + ((i8 | i17 | i2 | i10 | i4) + (i15 >>> i4) << 2) >> 2] | 0;
     i43 = 0;
    } else {
     i42 = i34;
     i43 = i35;
    }
    if (!i42) {
     i44 = i33;
     i45 = i43;
    } else {
     i37 = i33;
     i38 = i42;
     i39 = i43;
     i36 = 90;
    }
   }
   if ((i36 | 0) == 90) while (1) {
    i36 = 0;
    i4 = (HEAP32[i38 + 4 >> 2] & -8) - i16 | 0;
    i15 = i4 >>> 0 < i37 >>> 0;
    i10 = i15 ? i4 : i37;
    i4 = i15 ? i38 : i39;
    i15 = HEAP32[i38 + 16 >> 2] | 0;
    if (i15) {
     i37 = i10;
     i38 = i15;
     i39 = i4;
     i36 = 90;
     continue;
    }
    i38 = HEAP32[i38 + 20 >> 2] | 0;
    if (!i38) {
     i44 = i10;
     i45 = i4;
     break;
    } else {
     i37 = i10;
     i39 = i4;
     i36 = 90;
    }
   }
   if ((i45 | 0) != 0 ? i44 >>> 0 < ((HEAP32[92] | 0) - i16 | 0) >>> 0 : 0) {
    i9 = HEAP32[94] | 0;
    if (i45 >>> 0 < i9 >>> 0) _abort();
    i4 = i45 + i16 | 0;
    if (i45 >>> 0 >= i4 >>> 0) _abort();
    i10 = HEAP32[i45 + 24 >> 2] | 0;
    i15 = HEAP32[i45 + 12 >> 2] | 0;
    do if ((i15 | 0) == (i45 | 0)) {
     i2 = i45 + 20 | 0;
     i17 = HEAP32[i2 >> 2] | 0;
     if (!i17) {
      i8 = i45 + 16 | 0;
      i12 = HEAP32[i8 >> 2] | 0;
      if (!i12) {
       i46 = 0;
       break;
      } else {
       i47 = i12;
       i48 = i8;
      }
     } else {
      i47 = i17;
      i48 = i2;
     }
     while (1) {
      i2 = i47 + 20 | 0;
      i17 = HEAP32[i2 >> 2] | 0;
      if (i17) {
       i47 = i17;
       i48 = i2;
       continue;
      }
      i2 = i47 + 16 | 0;
      i17 = HEAP32[i2 >> 2] | 0;
      if (!i17) {
       i49 = i47;
       i50 = i48;
       break;
      } else {
       i47 = i17;
       i48 = i2;
      }
     }
     if (i50 >>> 0 < i9 >>> 0) _abort(); else {
      HEAP32[i50 >> 2] = 0;
      i46 = i49;
      break;
     }
    } else {
     i2 = HEAP32[i45 + 8 >> 2] | 0;
     if (i2 >>> 0 < i9 >>> 0) _abort();
     i17 = i2 + 12 | 0;
     if ((HEAP32[i17 >> 2] | 0) != (i45 | 0)) _abort();
     i8 = i15 + 8 | 0;
     if ((HEAP32[i8 >> 2] | 0) == (i45 | 0)) {
      HEAP32[i17 >> 2] = i15;
      HEAP32[i8 >> 2] = i2;
      i46 = i15;
      break;
     } else _abort();
    } while (0);
    do if (i10) {
     i15 = HEAP32[i45 + 28 >> 2] | 0;
     i9 = 664 + (i15 << 2) | 0;
     if ((i45 | 0) == (HEAP32[i9 >> 2] | 0)) {
      HEAP32[i9 >> 2] = i46;
      if (!i46) {
       HEAP32[91] = HEAP32[91] & ~(1 << i15);
       break;
      }
     } else {
      if (i10 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort();
      i15 = i10 + 16 | 0;
      if ((HEAP32[i15 >> 2] | 0) == (i45 | 0)) HEAP32[i15 >> 2] = i46; else HEAP32[i10 + 20 >> 2] = i46;
      if (!i46) break;
     }
     i15 = HEAP32[94] | 0;
     if (i46 >>> 0 < i15 >>> 0) _abort();
     HEAP32[i46 + 24 >> 2] = i10;
     i9 = HEAP32[i45 + 16 >> 2] | 0;
     do if (i9) if (i9 >>> 0 < i15 >>> 0) _abort(); else {
      HEAP32[i46 + 16 >> 2] = i9;
      HEAP32[i9 + 24 >> 2] = i46;
      break;
     } while (0);
     i9 = HEAP32[i45 + 20 >> 2] | 0;
     if (i9) if (i9 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort(); else {
      HEAP32[i46 + 20 >> 2] = i9;
      HEAP32[i9 + 24 >> 2] = i46;
      break;
     }
    } while (0);
    L199 : do if (i44 >>> 0 >= 16) {
     HEAP32[i45 + 4 >> 2] = i16 | 3;
     HEAP32[i45 + (i16 | 4) >> 2] = i44 | 1;
     HEAP32[i45 + (i44 + i16) >> 2] = i44;
     i10 = i44 >>> 3;
     if (i44 >>> 0 < 256) {
      i9 = i10 << 1;
      i15 = 400 + (i9 << 2) | 0;
      i2 = HEAP32[90] | 0;
      i8 = 1 << i10;
      if (i2 & i8) {
       i10 = 400 + (i9 + 2 << 2) | 0;
       i17 = HEAP32[i10 >> 2] | 0;
       if (i17 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort(); else {
        i51 = i10;
        i52 = i17;
       }
      } else {
       HEAP32[90] = i2 | i8;
       i51 = 400 + (i9 + 2 << 2) | 0;
       i52 = i15;
      }
      HEAP32[i51 >> 2] = i4;
      HEAP32[i52 + 12 >> 2] = i4;
      HEAP32[i45 + (i16 + 8) >> 2] = i52;
      HEAP32[i45 + (i16 + 12) >> 2] = i15;
      break;
     }
     i15 = i44 >>> 8;
     if (i15) if (i44 >>> 0 > 16777215) i53 = 31; else {
      i9 = (i15 + 1048320 | 0) >>> 16 & 8;
      i8 = i15 << i9;
      i15 = (i8 + 520192 | 0) >>> 16 & 4;
      i2 = i8 << i15;
      i8 = (i2 + 245760 | 0) >>> 16 & 2;
      i17 = 14 - (i15 | i9 | i8) + (i2 << i8 >>> 15) | 0;
      i53 = i44 >>> (i17 + 7 | 0) & 1 | i17 << 1;
     } else i53 = 0;
     i17 = 664 + (i53 << 2) | 0;
     HEAP32[i45 + (i16 + 28) >> 2] = i53;
     HEAP32[i45 + (i16 + 20) >> 2] = 0;
     HEAP32[i45 + (i16 + 16) >> 2] = 0;
     i8 = HEAP32[91] | 0;
     i2 = 1 << i53;
     if (!(i8 & i2)) {
      HEAP32[91] = i8 | i2;
      HEAP32[i17 >> 2] = i4;
      HEAP32[i45 + (i16 + 24) >> 2] = i17;
      HEAP32[i45 + (i16 + 12) >> 2] = i4;
      HEAP32[i45 + (i16 + 8) >> 2] = i4;
      break;
     }
     i2 = HEAP32[i17 >> 2] | 0;
     L217 : do if ((HEAP32[i2 + 4 >> 2] & -8 | 0) != (i44 | 0)) {
      i17 = i44 << ((i53 | 0) == 31 ? 0 : 25 - (i53 >>> 1) | 0);
      i8 = i2;
      while (1) {
       i9 = i8 + 16 + (i17 >>> 31 << 2) | 0;
       i15 = HEAP32[i9 >> 2] | 0;
       if (!i15) {
        i54 = i9;
        i55 = i8;
        break;
       }
       if ((HEAP32[i15 + 4 >> 2] & -8 | 0) == (i44 | 0)) {
        i56 = i15;
        break L217;
       } else {
        i17 = i17 << 1;
        i8 = i15;
       }
      }
      if (i54 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort(); else {
       HEAP32[i54 >> 2] = i4;
       HEAP32[i45 + (i16 + 24) >> 2] = i55;
       HEAP32[i45 + (i16 + 12) >> 2] = i4;
       HEAP32[i45 + (i16 + 8) >> 2] = i4;
       break L199;
      }
     } else i56 = i2; while (0);
     i2 = i56 + 8 | 0;
     i8 = HEAP32[i2 >> 2] | 0;
     i17 = HEAP32[94] | 0;
     if (i8 >>> 0 >= i17 >>> 0 & i56 >>> 0 >= i17 >>> 0) {
      HEAP32[i8 + 12 >> 2] = i4;
      HEAP32[i2 >> 2] = i4;
      HEAP32[i45 + (i16 + 8) >> 2] = i8;
      HEAP32[i45 + (i16 + 12) >> 2] = i56;
      HEAP32[i45 + (i16 + 24) >> 2] = 0;
      break;
     } else _abort();
    } else {
     i8 = i44 + i16 | 0;
     HEAP32[i45 + 4 >> 2] = i8 | 3;
     i2 = i45 + (i8 + 4) | 0;
     HEAP32[i2 >> 2] = HEAP32[i2 >> 2] | 1;
    } while (0);
    i13 = i45 + 8 | 0;
    return i13 | 0;
   } else i31 = i16;
  } else i31 = i16;
 } else i31 = -1; while (0);
 i45 = HEAP32[92] | 0;
 if (i45 >>> 0 >= i31 >>> 0) {
  i44 = i45 - i31 | 0;
  i56 = HEAP32[95] | 0;
  if (i44 >>> 0 > 15) {
   HEAP32[95] = i56 + i31;
   HEAP32[92] = i44;
   HEAP32[i56 + (i31 + 4) >> 2] = i44 | 1;
   HEAP32[i56 + i45 >> 2] = i44;
   HEAP32[i56 + 4 >> 2] = i31 | 3;
  } else {
   HEAP32[92] = 0;
   HEAP32[95] = 0;
   HEAP32[i56 + 4 >> 2] = i45 | 3;
   i44 = i56 + (i45 + 4) | 0;
   HEAP32[i44 >> 2] = HEAP32[i44 >> 2] | 1;
  }
  i13 = i56 + 8 | 0;
  return i13 | 0;
 }
 i56 = HEAP32[93] | 0;
 if (i56 >>> 0 > i31 >>> 0) {
  i44 = i56 - i31 | 0;
  HEAP32[93] = i44;
  i56 = HEAP32[96] | 0;
  HEAP32[96] = i56 + i31;
  HEAP32[i56 + (i31 + 4) >> 2] = i44 | 1;
  HEAP32[i56 + 4 >> 2] = i31 | 3;
  i13 = i56 + 8 | 0;
  return i13 | 0;
 }
 do if (!(HEAP32[208] | 0)) {
  i56 = _sysconf(30) | 0;
  if (!(i56 + -1 & i56)) {
   HEAP32[210] = i56;
   HEAP32[209] = i56;
   HEAP32[211] = -1;
   HEAP32[212] = -1;
   HEAP32[213] = 0;
   HEAP32[201] = 0;
   HEAP32[208] = (_time(0) | 0) & -16 ^ 1431655768;
   break;
  } else _abort();
 } while (0);
 i56 = i31 + 48 | 0;
 i44 = HEAP32[210] | 0;
 i45 = i31 + 47 | 0;
 i55 = i44 + i45 | 0;
 i54 = 0 - i44 | 0;
 i44 = i55 & i54;
 if (i44 >>> 0 <= i31 >>> 0) {
  i13 = 0;
  return i13 | 0;
 }
 i53 = HEAP32[200] | 0;
 if ((i53 | 0) != 0 ? (i52 = HEAP32[198] | 0, i51 = i52 + i44 | 0, i51 >>> 0 <= i52 >>> 0 | i51 >>> 0 > i53 >>> 0) : 0) {
  i13 = 0;
  return i13 | 0;
 }
 L258 : do if (!(HEAP32[201] & 4)) {
  i53 = HEAP32[96] | 0;
  L260 : do if (i53) {
   i51 = 808;
   while (1) {
    i52 = HEAP32[i51 >> 2] | 0;
    if (i52 >>> 0 <= i53 >>> 0 ? (i46 = i51 + 4 | 0, (i52 + (HEAP32[i46 >> 2] | 0) | 0) >>> 0 > i53 >>> 0) : 0) {
     i57 = i51;
     i58 = i46;
     break;
    }
    i51 = HEAP32[i51 + 8 >> 2] | 0;
    if (!i51) {
     i36 = 174;
     break L260;
    }
   }
   i51 = i55 - (HEAP32[93] | 0) & i54;
   if (i51 >>> 0 < 2147483647) {
    i46 = _sbrk(i51 | 0) | 0;
    i52 = (i46 | 0) == ((HEAP32[i57 >> 2] | 0) + (HEAP32[i58 >> 2] | 0) | 0);
    i49 = i52 ? i51 : 0;
    if (i52) if ((i46 | 0) == (-1 | 0)) i59 = i49; else {
     i60 = i46;
     i61 = i49;
     i36 = 194;
     break L258;
    } else {
     i62 = i46;
     i63 = i51;
     i64 = i49;
     i36 = 184;
    }
   } else i59 = 0;
  } else i36 = 174; while (0);
  do if ((i36 | 0) == 174) {
   i53 = _sbrk(0) | 0;
   if ((i53 | 0) != (-1 | 0)) {
    i16 = i53;
    i49 = HEAP32[209] | 0;
    i51 = i49 + -1 | 0;
    if (!(i51 & i16)) i65 = i44; else i65 = i44 - i16 + (i51 + i16 & 0 - i49) | 0;
    i49 = HEAP32[198] | 0;
    i16 = i49 + i65 | 0;
    if (i65 >>> 0 > i31 >>> 0 & i65 >>> 0 < 2147483647) {
     i51 = HEAP32[200] | 0;
     if ((i51 | 0) != 0 ? i16 >>> 0 <= i49 >>> 0 | i16 >>> 0 > i51 >>> 0 : 0) {
      i59 = 0;
      break;
     }
     i51 = _sbrk(i65 | 0) | 0;
     i16 = (i51 | 0) == (i53 | 0);
     i49 = i16 ? i65 : 0;
     if (i16) {
      i60 = i53;
      i61 = i49;
      i36 = 194;
      break L258;
     } else {
      i62 = i51;
      i63 = i65;
      i64 = i49;
      i36 = 184;
     }
    } else i59 = 0;
   } else i59 = 0;
  } while (0);
  L280 : do if ((i36 | 0) == 184) {
   i49 = 0 - i63 | 0;
   do if (i56 >>> 0 > i63 >>> 0 & (i63 >>> 0 < 2147483647 & (i62 | 0) != (-1 | 0)) ? (i51 = HEAP32[210] | 0, i53 = i45 - i63 + i51 & 0 - i51, i53 >>> 0 < 2147483647) : 0) if ((_sbrk(i53 | 0) | 0) == (-1 | 0)) {
    _sbrk(i49 | 0) | 0;
    i59 = i64;
    break L280;
   } else {
    i66 = i53 + i63 | 0;
    break;
   } else i66 = i63; while (0);
   if ((i62 | 0) == (-1 | 0)) i59 = i64; else {
    i60 = i62;
    i61 = i66;
    i36 = 194;
    break L258;
   }
  } while (0);
  HEAP32[201] = HEAP32[201] | 4;
  i67 = i59;
  i36 = 191;
 } else {
  i67 = 0;
  i36 = 191;
 } while (0);
 if ((((i36 | 0) == 191 ? i44 >>> 0 < 2147483647 : 0) ? (i59 = _sbrk(i44 | 0) | 0, i44 = _sbrk(0) | 0, i59 >>> 0 < i44 >>> 0 & ((i59 | 0) != (-1 | 0) & (i44 | 0) != (-1 | 0))) : 0) ? (i66 = i44 - i59 | 0, i44 = i66 >>> 0 > (i31 + 40 | 0) >>> 0, i44) : 0) {
  i60 = i59;
  i61 = i44 ? i66 : i67;
  i36 = 194;
 }
 if ((i36 | 0) == 194) {
  i67 = (HEAP32[198] | 0) + i61 | 0;
  HEAP32[198] = i67;
  if (i67 >>> 0 > (HEAP32[199] | 0) >>> 0) HEAP32[199] = i67;
  i67 = HEAP32[96] | 0;
  L299 : do if (i67) {
   i66 = 808;
   do {
    i44 = HEAP32[i66 >> 2] | 0;
    i59 = i66 + 4 | 0;
    i62 = HEAP32[i59 >> 2] | 0;
    if ((i60 | 0) == (i44 + i62 | 0)) {
     i68 = i44;
     i69 = i59;
     i70 = i62;
     i71 = i66;
     i36 = 204;
     break;
    }
    i66 = HEAP32[i66 + 8 >> 2] | 0;
   } while ((i66 | 0) != 0);
   if (((i36 | 0) == 204 ? (HEAP32[i71 + 12 >> 2] & 8 | 0) == 0 : 0) ? i67 >>> 0 < i60 >>> 0 & i67 >>> 0 >= i68 >>> 0 : 0) {
    HEAP32[i69 >> 2] = i70 + i61;
    i66 = (HEAP32[93] | 0) + i61 | 0;
    i62 = i67 + 8 | 0;
    i59 = (i62 & 7 | 0) == 0 ? 0 : 0 - i62 & 7;
    i62 = i66 - i59 | 0;
    HEAP32[96] = i67 + i59;
    HEAP32[93] = i62;
    HEAP32[i67 + (i59 + 4) >> 2] = i62 | 1;
    HEAP32[i67 + (i66 + 4) >> 2] = 40;
    HEAP32[97] = HEAP32[212];
    break;
   }
   i66 = HEAP32[94] | 0;
   if (i60 >>> 0 < i66 >>> 0) {
    HEAP32[94] = i60;
    i72 = i60;
   } else i72 = i66;
   i66 = i60 + i61 | 0;
   i62 = 808;
   while (1) {
    if ((HEAP32[i62 >> 2] | 0) == (i66 | 0)) {
     i73 = i62;
     i74 = i62;
     i36 = 212;
     break;
    }
    i62 = HEAP32[i62 + 8 >> 2] | 0;
    if (!i62) {
     i75 = 808;
     break;
    }
   }
   if ((i36 | 0) == 212) if (!(HEAP32[i74 + 12 >> 2] & 8)) {
    HEAP32[i73 >> 2] = i60;
    i62 = i74 + 4 | 0;
    HEAP32[i62 >> 2] = (HEAP32[i62 >> 2] | 0) + i61;
    i62 = i60 + 8 | 0;
    i66 = (i62 & 7 | 0) == 0 ? 0 : 0 - i62 & 7;
    i62 = i60 + (i61 + 8) | 0;
    i59 = (i62 & 7 | 0) == 0 ? 0 : 0 - i62 & 7;
    i62 = i60 + (i59 + i61) | 0;
    i44 = i66 + i31 | 0;
    i64 = i60 + i44 | 0;
    i63 = i62 - (i60 + i66) - i31 | 0;
    HEAP32[i60 + (i66 + 4) >> 2] = i31 | 3;
    L324 : do if ((i62 | 0) != (i67 | 0)) {
     if ((i62 | 0) == (HEAP32[95] | 0)) {
      i45 = (HEAP32[92] | 0) + i63 | 0;
      HEAP32[92] = i45;
      HEAP32[95] = i64;
      HEAP32[i60 + (i44 + 4) >> 2] = i45 | 1;
      HEAP32[i60 + (i45 + i44) >> 2] = i45;
      break;
     }
     i45 = i61 + 4 | 0;
     i56 = HEAP32[i60 + (i45 + i59) >> 2] | 0;
     if ((i56 & 3 | 0) == 1) {
      i65 = i56 & -8;
      i58 = i56 >>> 3;
      L332 : do if (i56 >>> 0 >= 256) {
       i57 = HEAP32[i60 + ((i59 | 24) + i61) >> 2] | 0;
       i54 = HEAP32[i60 + (i61 + 12 + i59) >> 2] | 0;
       do if ((i54 | 0) == (i62 | 0)) {
        i55 = i59 | 16;
        i49 = i60 + (i45 + i55) | 0;
        i53 = HEAP32[i49 >> 2] | 0;
        if (!i53) {
         i51 = i60 + (i55 + i61) | 0;
         i55 = HEAP32[i51 >> 2] | 0;
         if (!i55) {
          i76 = 0;
          break;
         } else {
          i77 = i55;
          i78 = i51;
         }
        } else {
         i77 = i53;
         i78 = i49;
        }
        while (1) {
         i49 = i77 + 20 | 0;
         i53 = HEAP32[i49 >> 2] | 0;
         if (i53) {
          i77 = i53;
          i78 = i49;
          continue;
         }
         i49 = i77 + 16 | 0;
         i53 = HEAP32[i49 >> 2] | 0;
         if (!i53) {
          i79 = i77;
          i80 = i78;
          break;
         } else {
          i77 = i53;
          i78 = i49;
         }
        }
        if (i80 >>> 0 < i72 >>> 0) _abort(); else {
         HEAP32[i80 >> 2] = 0;
         i76 = i79;
         break;
        }
       } else {
        i49 = HEAP32[i60 + ((i59 | 8) + i61) >> 2] | 0;
        if (i49 >>> 0 < i72 >>> 0) _abort();
        i53 = i49 + 12 | 0;
        if ((HEAP32[i53 >> 2] | 0) != (i62 | 0)) _abort();
        i51 = i54 + 8 | 0;
        if ((HEAP32[i51 >> 2] | 0) == (i62 | 0)) {
         HEAP32[i53 >> 2] = i54;
         HEAP32[i51 >> 2] = i49;
         i76 = i54;
         break;
        } else _abort();
       } while (0);
       if (!i57) break;
       i54 = HEAP32[i60 + (i61 + 28 + i59) >> 2] | 0;
       i49 = 664 + (i54 << 2) | 0;
       do if ((i62 | 0) != (HEAP32[i49 >> 2] | 0)) {
        if (i57 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort();
        i51 = i57 + 16 | 0;
        if ((HEAP32[i51 >> 2] | 0) == (i62 | 0)) HEAP32[i51 >> 2] = i76; else HEAP32[i57 + 20 >> 2] = i76;
        if (!i76) break L332;
       } else {
        HEAP32[i49 >> 2] = i76;
        if (i76) break;
        HEAP32[91] = HEAP32[91] & ~(1 << i54);
        break L332;
       } while (0);
       i54 = HEAP32[94] | 0;
       if (i76 >>> 0 < i54 >>> 0) _abort();
       HEAP32[i76 + 24 >> 2] = i57;
       i49 = i59 | 16;
       i51 = HEAP32[i60 + (i49 + i61) >> 2] | 0;
       do if (i51) if (i51 >>> 0 < i54 >>> 0) _abort(); else {
        HEAP32[i76 + 16 >> 2] = i51;
        HEAP32[i51 + 24 >> 2] = i76;
        break;
       } while (0);
       i51 = HEAP32[i60 + (i45 + i49) >> 2] | 0;
       if (!i51) break;
       if (i51 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort(); else {
        HEAP32[i76 + 20 >> 2] = i51;
        HEAP32[i51 + 24 >> 2] = i76;
        break;
       }
      } else {
       i51 = HEAP32[i60 + ((i59 | 8) + i61) >> 2] | 0;
       i54 = HEAP32[i60 + (i61 + 12 + i59) >> 2] | 0;
       i57 = 400 + (i58 << 1 << 2) | 0;
       do if ((i51 | 0) != (i57 | 0)) {
        if (i51 >>> 0 < i72 >>> 0) _abort();
        if ((HEAP32[i51 + 12 >> 2] | 0) == (i62 | 0)) break;
        _abort();
       } while (0);
       if ((i54 | 0) == (i51 | 0)) {
        HEAP32[90] = HEAP32[90] & ~(1 << i58);
        break;
       }
       do if ((i54 | 0) == (i57 | 0)) i81 = i54 + 8 | 0; else {
        if (i54 >>> 0 < i72 >>> 0) _abort();
        i49 = i54 + 8 | 0;
        if ((HEAP32[i49 >> 2] | 0) == (i62 | 0)) {
         i81 = i49;
         break;
        }
        _abort();
       } while (0);
       HEAP32[i51 + 12 >> 2] = i54;
       HEAP32[i81 >> 2] = i51;
      } while (0);
      i82 = i60 + ((i65 | i59) + i61) | 0;
      i83 = i65 + i63 | 0;
     } else {
      i82 = i62;
      i83 = i63;
     }
     i58 = i82 + 4 | 0;
     HEAP32[i58 >> 2] = HEAP32[i58 >> 2] & -2;
     HEAP32[i60 + (i44 + 4) >> 2] = i83 | 1;
     HEAP32[i60 + (i83 + i44) >> 2] = i83;
     i58 = i83 >>> 3;
     if (i83 >>> 0 < 256) {
      i45 = i58 << 1;
      i56 = 400 + (i45 << 2) | 0;
      i57 = HEAP32[90] | 0;
      i49 = 1 << i58;
      do if (!(i57 & i49)) {
       HEAP32[90] = i57 | i49;
       i84 = 400 + (i45 + 2 << 2) | 0;
       i85 = i56;
      } else {
       i58 = 400 + (i45 + 2 << 2) | 0;
       i53 = HEAP32[i58 >> 2] | 0;
       if (i53 >>> 0 >= (HEAP32[94] | 0) >>> 0) {
        i84 = i58;
        i85 = i53;
        break;
       }
       _abort();
      } while (0);
      HEAP32[i84 >> 2] = i64;
      HEAP32[i85 + 12 >> 2] = i64;
      HEAP32[i60 + (i44 + 8) >> 2] = i85;
      HEAP32[i60 + (i44 + 12) >> 2] = i56;
      break;
     }
     i45 = i83 >>> 8;
     do if (!i45) i86 = 0; else {
      if (i83 >>> 0 > 16777215) {
       i86 = 31;
       break;
      }
      i49 = (i45 + 1048320 | 0) >>> 16 & 8;
      i57 = i45 << i49;
      i65 = (i57 + 520192 | 0) >>> 16 & 4;
      i53 = i57 << i65;
      i57 = (i53 + 245760 | 0) >>> 16 & 2;
      i58 = 14 - (i65 | i49 | i57) + (i53 << i57 >>> 15) | 0;
      i86 = i83 >>> (i58 + 7 | 0) & 1 | i58 << 1;
     } while (0);
     i45 = 664 + (i86 << 2) | 0;
     HEAP32[i60 + (i44 + 28) >> 2] = i86;
     HEAP32[i60 + (i44 + 20) >> 2] = 0;
     HEAP32[i60 + (i44 + 16) >> 2] = 0;
     i56 = HEAP32[91] | 0;
     i58 = 1 << i86;
     if (!(i56 & i58)) {
      HEAP32[91] = i56 | i58;
      HEAP32[i45 >> 2] = i64;
      HEAP32[i60 + (i44 + 24) >> 2] = i45;
      HEAP32[i60 + (i44 + 12) >> 2] = i64;
      HEAP32[i60 + (i44 + 8) >> 2] = i64;
      break;
     }
     i58 = HEAP32[i45 >> 2] | 0;
     L418 : do if ((HEAP32[i58 + 4 >> 2] & -8 | 0) != (i83 | 0)) {
      i45 = i83 << ((i86 | 0) == 31 ? 0 : 25 - (i86 >>> 1) | 0);
      i56 = i58;
      while (1) {
       i57 = i56 + 16 + (i45 >>> 31 << 2) | 0;
       i53 = HEAP32[i57 >> 2] | 0;
       if (!i53) {
        i87 = i57;
        i88 = i56;
        break;
       }
       if ((HEAP32[i53 + 4 >> 2] & -8 | 0) == (i83 | 0)) {
        i89 = i53;
        break L418;
       } else {
        i45 = i45 << 1;
        i56 = i53;
       }
      }
      if (i87 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort(); else {
       HEAP32[i87 >> 2] = i64;
       HEAP32[i60 + (i44 + 24) >> 2] = i88;
       HEAP32[i60 + (i44 + 12) >> 2] = i64;
       HEAP32[i60 + (i44 + 8) >> 2] = i64;
       break L324;
      }
     } else i89 = i58; while (0);
     i58 = i89 + 8 | 0;
     i56 = HEAP32[i58 >> 2] | 0;
     i45 = HEAP32[94] | 0;
     if (i56 >>> 0 >= i45 >>> 0 & i89 >>> 0 >= i45 >>> 0) {
      HEAP32[i56 + 12 >> 2] = i64;
      HEAP32[i58 >> 2] = i64;
      HEAP32[i60 + (i44 + 8) >> 2] = i56;
      HEAP32[i60 + (i44 + 12) >> 2] = i89;
      HEAP32[i60 + (i44 + 24) >> 2] = 0;
      break;
     } else _abort();
    } else {
     i56 = (HEAP32[93] | 0) + i63 | 0;
     HEAP32[93] = i56;
     HEAP32[96] = i64;
     HEAP32[i60 + (i44 + 4) >> 2] = i56 | 1;
    } while (0);
    i13 = i60 + (i66 | 8) | 0;
    return i13 | 0;
   } else i75 = 808;
   while (1) {
    i44 = HEAP32[i75 >> 2] | 0;
    if (i44 >>> 0 <= i67 >>> 0 ? (i64 = HEAP32[i75 + 4 >> 2] | 0, i63 = i44 + i64 | 0, i63 >>> 0 > i67 >>> 0) : 0) {
     i90 = i44;
     i91 = i64;
     i92 = i63;
     break;
    }
    i75 = HEAP32[i75 + 8 >> 2] | 0;
   }
   i66 = i90 + (i91 + -39) | 0;
   i63 = i90 + (i91 + -47 + ((i66 & 7 | 0) == 0 ? 0 : 0 - i66 & 7)) | 0;
   i66 = i67 + 16 | 0;
   i64 = i63 >>> 0 < i66 >>> 0 ? i67 : i63;
   i63 = i64 + 8 | 0;
   i44 = i60 + 8 | 0;
   i62 = (i44 & 7 | 0) == 0 ? 0 : 0 - i44 & 7;
   i44 = i61 + -40 - i62 | 0;
   HEAP32[96] = i60 + i62;
   HEAP32[93] = i44;
   HEAP32[i60 + (i62 + 4) >> 2] = i44 | 1;
   HEAP32[i60 + (i61 + -36) >> 2] = 40;
   HEAP32[97] = HEAP32[212];
   i44 = i64 + 4 | 0;
   HEAP32[i44 >> 2] = 27;
   HEAP32[i63 >> 2] = HEAP32[202];
   HEAP32[i63 + 4 >> 2] = HEAP32[203];
   HEAP32[i63 + 8 >> 2] = HEAP32[204];
   HEAP32[i63 + 12 >> 2] = HEAP32[205];
   HEAP32[202] = i60;
   HEAP32[203] = i61;
   HEAP32[205] = 0;
   HEAP32[204] = i63;
   i63 = i64 + 28 | 0;
   HEAP32[i63 >> 2] = 7;
   if ((i64 + 32 | 0) >>> 0 < i92 >>> 0) {
    i62 = i63;
    do {
     i63 = i62;
     i62 = i62 + 4 | 0;
     HEAP32[i62 >> 2] = 7;
    } while ((i63 + 8 | 0) >>> 0 < i92 >>> 0);
   }
   if ((i64 | 0) != (i67 | 0)) {
    i62 = i64 - i67 | 0;
    HEAP32[i44 >> 2] = HEAP32[i44 >> 2] & -2;
    HEAP32[i67 + 4 >> 2] = i62 | 1;
    HEAP32[i64 >> 2] = i62;
    i63 = i62 >>> 3;
    if (i62 >>> 0 < 256) {
     i59 = i63 << 1;
     i56 = 400 + (i59 << 2) | 0;
     i58 = HEAP32[90] | 0;
     i45 = 1 << i63;
     if (i58 & i45) {
      i63 = 400 + (i59 + 2 << 2) | 0;
      i51 = HEAP32[i63 >> 2] | 0;
      if (i51 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort(); else {
       i93 = i63;
       i94 = i51;
      }
     } else {
      HEAP32[90] = i58 | i45;
      i93 = 400 + (i59 + 2 << 2) | 0;
      i94 = i56;
     }
     HEAP32[i93 >> 2] = i67;
     HEAP32[i94 + 12 >> 2] = i67;
     HEAP32[i67 + 8 >> 2] = i94;
     HEAP32[i67 + 12 >> 2] = i56;
     break;
    }
    i56 = i62 >>> 8;
    if (i56) if (i62 >>> 0 > 16777215) i95 = 31; else {
     i59 = (i56 + 1048320 | 0) >>> 16 & 8;
     i45 = i56 << i59;
     i56 = (i45 + 520192 | 0) >>> 16 & 4;
     i58 = i45 << i56;
     i45 = (i58 + 245760 | 0) >>> 16 & 2;
     i51 = 14 - (i56 | i59 | i45) + (i58 << i45 >>> 15) | 0;
     i95 = i62 >>> (i51 + 7 | 0) & 1 | i51 << 1;
    } else i95 = 0;
    i51 = 664 + (i95 << 2) | 0;
    HEAP32[i67 + 28 >> 2] = i95;
    HEAP32[i67 + 20 >> 2] = 0;
    HEAP32[i66 >> 2] = 0;
    i45 = HEAP32[91] | 0;
    i58 = 1 << i95;
    if (!(i45 & i58)) {
     HEAP32[91] = i45 | i58;
     HEAP32[i51 >> 2] = i67;
     HEAP32[i67 + 24 >> 2] = i51;
     HEAP32[i67 + 12 >> 2] = i67;
     HEAP32[i67 + 8 >> 2] = i67;
     break;
    }
    i58 = HEAP32[i51 >> 2] | 0;
    L459 : do if ((HEAP32[i58 + 4 >> 2] & -8 | 0) != (i62 | 0)) {
     i51 = i62 << ((i95 | 0) == 31 ? 0 : 25 - (i95 >>> 1) | 0);
     i45 = i58;
     while (1) {
      i59 = i45 + 16 + (i51 >>> 31 << 2) | 0;
      i56 = HEAP32[i59 >> 2] | 0;
      if (!i56) {
       i96 = i59;
       i97 = i45;
       break;
      }
      if ((HEAP32[i56 + 4 >> 2] & -8 | 0) == (i62 | 0)) {
       i98 = i56;
       break L459;
      } else {
       i51 = i51 << 1;
       i45 = i56;
      }
     }
     if (i96 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort(); else {
      HEAP32[i96 >> 2] = i67;
      HEAP32[i67 + 24 >> 2] = i97;
      HEAP32[i67 + 12 >> 2] = i67;
      HEAP32[i67 + 8 >> 2] = i67;
      break L299;
     }
    } else i98 = i58; while (0);
    i58 = i98 + 8 | 0;
    i62 = HEAP32[i58 >> 2] | 0;
    i66 = HEAP32[94] | 0;
    if (i62 >>> 0 >= i66 >>> 0 & i98 >>> 0 >= i66 >>> 0) {
     HEAP32[i62 + 12 >> 2] = i67;
     HEAP32[i58 >> 2] = i67;
     HEAP32[i67 + 8 >> 2] = i62;
     HEAP32[i67 + 12 >> 2] = i98;
     HEAP32[i67 + 24 >> 2] = 0;
     break;
    } else _abort();
   }
  } else {
   i62 = HEAP32[94] | 0;
   if ((i62 | 0) == 0 | i60 >>> 0 < i62 >>> 0) HEAP32[94] = i60;
   HEAP32[202] = i60;
   HEAP32[203] = i61;
   HEAP32[205] = 0;
   HEAP32[99] = HEAP32[208];
   HEAP32[98] = -1;
   i62 = 0;
   do {
    i58 = i62 << 1;
    i66 = 400 + (i58 << 2) | 0;
    HEAP32[400 + (i58 + 3 << 2) >> 2] = i66;
    HEAP32[400 + (i58 + 2 << 2) >> 2] = i66;
    i62 = i62 + 1 | 0;
   } while ((i62 | 0) != 32);
   i62 = i60 + 8 | 0;
   i66 = (i62 & 7 | 0) == 0 ? 0 : 0 - i62 & 7;
   i62 = i61 + -40 - i66 | 0;
   HEAP32[96] = i60 + i66;
   HEAP32[93] = i62;
   HEAP32[i60 + (i66 + 4) >> 2] = i62 | 1;
   HEAP32[i60 + (i61 + -36) >> 2] = 40;
   HEAP32[97] = HEAP32[212];
  } while (0);
  i61 = HEAP32[93] | 0;
  if (i61 >>> 0 > i31 >>> 0) {
   i60 = i61 - i31 | 0;
   HEAP32[93] = i60;
   i61 = HEAP32[96] | 0;
   HEAP32[96] = i61 + i31;
   HEAP32[i61 + (i31 + 4) >> 2] = i60 | 1;
   HEAP32[i61 + 4 >> 2] = i31 | 3;
   i13 = i61 + 8 | 0;
   return i13 | 0;
  }
 }
 HEAP32[(___errno_location() | 0) >> 2] = 12;
 i13 = 0;
 return i13 | 0;
}

function _free(i1) {
 i1 = i1 | 0;
 var i2 = 0, i3 = 0, i4 = 0, i5 = 0, i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0, i13 = 0, i14 = 0, i15 = 0, i16 = 0, i17 = 0, i18 = 0, i19 = 0, i20 = 0, i21 = 0, i22 = 0, i23 = 0, i24 = 0, i25 = 0, i26 = 0, i27 = 0, i28 = 0, i29 = 0, i30 = 0, i31 = 0, i32 = 0, i33 = 0, i34 = 0, i35 = 0, i36 = 0, i37 = 0, i38 = 0;
 if (!i1) return;
 i2 = i1 + -8 | 0;
 i3 = HEAP32[94] | 0;
 if (i2 >>> 0 < i3 >>> 0) _abort();
 i4 = HEAP32[i1 + -4 >> 2] | 0;
 i5 = i4 & 3;
 if ((i5 | 0) == 1) _abort();
 i6 = i4 & -8;
 i7 = i1 + (i6 + -8) | 0;
 do if (!(i4 & 1)) {
  i8 = HEAP32[i2 >> 2] | 0;
  if (!i5) return;
  i9 = -8 - i8 | 0;
  i10 = i1 + i9 | 0;
  i11 = i8 + i6 | 0;
  if (i10 >>> 0 < i3 >>> 0) _abort();
  if ((i10 | 0) == (HEAP32[95] | 0)) {
   i12 = i1 + (i6 + -4) | 0;
   i13 = HEAP32[i12 >> 2] | 0;
   if ((i13 & 3 | 0) != 3) {
    i14 = i10;
    i15 = i11;
    break;
   }
   HEAP32[92] = i11;
   HEAP32[i12 >> 2] = i13 & -2;
   HEAP32[i1 + (i9 + 4) >> 2] = i11 | 1;
   HEAP32[i7 >> 2] = i11;
   return;
  }
  i13 = i8 >>> 3;
  if (i8 >>> 0 < 256) {
   i8 = HEAP32[i1 + (i9 + 8) >> 2] | 0;
   i12 = HEAP32[i1 + (i9 + 12) >> 2] | 0;
   i16 = 400 + (i13 << 1 << 2) | 0;
   if ((i8 | 0) != (i16 | 0)) {
    if (i8 >>> 0 < i3 >>> 0) _abort();
    if ((HEAP32[i8 + 12 >> 2] | 0) != (i10 | 0)) _abort();
   }
   if ((i12 | 0) == (i8 | 0)) {
    HEAP32[90] = HEAP32[90] & ~(1 << i13);
    i14 = i10;
    i15 = i11;
    break;
   }
   if ((i12 | 0) != (i16 | 0)) {
    if (i12 >>> 0 < i3 >>> 0) _abort();
    i16 = i12 + 8 | 0;
    if ((HEAP32[i16 >> 2] | 0) == (i10 | 0)) i17 = i16; else _abort();
   } else i17 = i12 + 8 | 0;
   HEAP32[i8 + 12 >> 2] = i12;
   HEAP32[i17 >> 2] = i8;
   i14 = i10;
   i15 = i11;
   break;
  }
  i8 = HEAP32[i1 + (i9 + 24) >> 2] | 0;
  i12 = HEAP32[i1 + (i9 + 12) >> 2] | 0;
  do if ((i12 | 0) == (i10 | 0)) {
   i16 = i1 + (i9 + 20) | 0;
   i13 = HEAP32[i16 >> 2] | 0;
   if (!i13) {
    i18 = i1 + (i9 + 16) | 0;
    i19 = HEAP32[i18 >> 2] | 0;
    if (!i19) {
     i20 = 0;
     break;
    } else {
     i21 = i19;
     i22 = i18;
    }
   } else {
    i21 = i13;
    i22 = i16;
   }
   while (1) {
    i16 = i21 + 20 | 0;
    i13 = HEAP32[i16 >> 2] | 0;
    if (i13) {
     i21 = i13;
     i22 = i16;
     continue;
    }
    i16 = i21 + 16 | 0;
    i13 = HEAP32[i16 >> 2] | 0;
    if (!i13) {
     i23 = i21;
     i24 = i22;
     break;
    } else {
     i21 = i13;
     i22 = i16;
    }
   }
   if (i24 >>> 0 < i3 >>> 0) _abort(); else {
    HEAP32[i24 >> 2] = 0;
    i20 = i23;
    break;
   }
  } else {
   i16 = HEAP32[i1 + (i9 + 8) >> 2] | 0;
   if (i16 >>> 0 < i3 >>> 0) _abort();
   i13 = i16 + 12 | 0;
   if ((HEAP32[i13 >> 2] | 0) != (i10 | 0)) _abort();
   i18 = i12 + 8 | 0;
   if ((HEAP32[i18 >> 2] | 0) == (i10 | 0)) {
    HEAP32[i13 >> 2] = i12;
    HEAP32[i18 >> 2] = i16;
    i20 = i12;
    break;
   } else _abort();
  } while (0);
  if (i8) {
   i12 = HEAP32[i1 + (i9 + 28) >> 2] | 0;
   i16 = 664 + (i12 << 2) | 0;
   if ((i10 | 0) == (HEAP32[i16 >> 2] | 0)) {
    HEAP32[i16 >> 2] = i20;
    if (!i20) {
     HEAP32[91] = HEAP32[91] & ~(1 << i12);
     i14 = i10;
     i15 = i11;
     break;
    }
   } else {
    if (i8 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort();
    i12 = i8 + 16 | 0;
    if ((HEAP32[i12 >> 2] | 0) == (i10 | 0)) HEAP32[i12 >> 2] = i20; else HEAP32[i8 + 20 >> 2] = i20;
    if (!i20) {
     i14 = i10;
     i15 = i11;
     break;
    }
   }
   i12 = HEAP32[94] | 0;
   if (i20 >>> 0 < i12 >>> 0) _abort();
   HEAP32[i20 + 24 >> 2] = i8;
   i16 = HEAP32[i1 + (i9 + 16) >> 2] | 0;
   do if (i16) if (i16 >>> 0 < i12 >>> 0) _abort(); else {
    HEAP32[i20 + 16 >> 2] = i16;
    HEAP32[i16 + 24 >> 2] = i20;
    break;
   } while (0);
   i16 = HEAP32[i1 + (i9 + 20) >> 2] | 0;
   if (i16) if (i16 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort(); else {
    HEAP32[i20 + 20 >> 2] = i16;
    HEAP32[i16 + 24 >> 2] = i20;
    i14 = i10;
    i15 = i11;
    break;
   } else {
    i14 = i10;
    i15 = i11;
   }
  } else {
   i14 = i10;
   i15 = i11;
  }
 } else {
  i14 = i2;
  i15 = i6;
 } while (0);
 if (i14 >>> 0 >= i7 >>> 0) _abort();
 i2 = i1 + (i6 + -4) | 0;
 i20 = HEAP32[i2 >> 2] | 0;
 if (!(i20 & 1)) _abort();
 if (!(i20 & 2)) {
  if ((i7 | 0) == (HEAP32[96] | 0)) {
   i3 = (HEAP32[93] | 0) + i15 | 0;
   HEAP32[93] = i3;
   HEAP32[96] = i14;
   HEAP32[i14 + 4 >> 2] = i3 | 1;
   if ((i14 | 0) != (HEAP32[95] | 0)) return;
   HEAP32[95] = 0;
   HEAP32[92] = 0;
   return;
  }
  if ((i7 | 0) == (HEAP32[95] | 0)) {
   i3 = (HEAP32[92] | 0) + i15 | 0;
   HEAP32[92] = i3;
   HEAP32[95] = i14;
   HEAP32[i14 + 4 >> 2] = i3 | 1;
   HEAP32[i14 + i3 >> 2] = i3;
   return;
  }
  i3 = (i20 & -8) + i15 | 0;
  i23 = i20 >>> 3;
  do if (i20 >>> 0 >= 256) {
   i24 = HEAP32[i1 + (i6 + 16) >> 2] | 0;
   i22 = HEAP32[i1 + (i6 | 4) >> 2] | 0;
   do if ((i22 | 0) == (i7 | 0)) {
    i21 = i1 + (i6 + 12) | 0;
    i17 = HEAP32[i21 >> 2] | 0;
    if (!i17) {
     i5 = i1 + (i6 + 8) | 0;
     i4 = HEAP32[i5 >> 2] | 0;
     if (!i4) {
      i25 = 0;
      break;
     } else {
      i26 = i4;
      i27 = i5;
     }
    } else {
     i26 = i17;
     i27 = i21;
    }
    while (1) {
     i21 = i26 + 20 | 0;
     i17 = HEAP32[i21 >> 2] | 0;
     if (i17) {
      i26 = i17;
      i27 = i21;
      continue;
     }
     i21 = i26 + 16 | 0;
     i17 = HEAP32[i21 >> 2] | 0;
     if (!i17) {
      i28 = i26;
      i29 = i27;
      break;
     } else {
      i26 = i17;
      i27 = i21;
     }
    }
    if (i29 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort(); else {
     HEAP32[i29 >> 2] = 0;
     i25 = i28;
     break;
    }
   } else {
    i21 = HEAP32[i1 + i6 >> 2] | 0;
    if (i21 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort();
    i17 = i21 + 12 | 0;
    if ((HEAP32[i17 >> 2] | 0) != (i7 | 0)) _abort();
    i5 = i22 + 8 | 0;
    if ((HEAP32[i5 >> 2] | 0) == (i7 | 0)) {
     HEAP32[i17 >> 2] = i22;
     HEAP32[i5 >> 2] = i21;
     i25 = i22;
     break;
    } else _abort();
   } while (0);
   if (i24) {
    i22 = HEAP32[i1 + (i6 + 20) >> 2] | 0;
    i11 = 664 + (i22 << 2) | 0;
    if ((i7 | 0) == (HEAP32[i11 >> 2] | 0)) {
     HEAP32[i11 >> 2] = i25;
     if (!i25) {
      HEAP32[91] = HEAP32[91] & ~(1 << i22);
      break;
     }
    } else {
     if (i24 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort();
     i22 = i24 + 16 | 0;
     if ((HEAP32[i22 >> 2] | 0) == (i7 | 0)) HEAP32[i22 >> 2] = i25; else HEAP32[i24 + 20 >> 2] = i25;
     if (!i25) break;
    }
    i22 = HEAP32[94] | 0;
    if (i25 >>> 0 < i22 >>> 0) _abort();
    HEAP32[i25 + 24 >> 2] = i24;
    i11 = HEAP32[i1 + (i6 + 8) >> 2] | 0;
    do if (i11) if (i11 >>> 0 < i22 >>> 0) _abort(); else {
     HEAP32[i25 + 16 >> 2] = i11;
     HEAP32[i11 + 24 >> 2] = i25;
     break;
    } while (0);
    i11 = HEAP32[i1 + (i6 + 12) >> 2] | 0;
    if (i11) if (i11 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort(); else {
     HEAP32[i25 + 20 >> 2] = i11;
     HEAP32[i11 + 24 >> 2] = i25;
     break;
    }
   }
  } else {
   i11 = HEAP32[i1 + i6 >> 2] | 0;
   i22 = HEAP32[i1 + (i6 | 4) >> 2] | 0;
   i24 = 400 + (i23 << 1 << 2) | 0;
   if ((i11 | 0) != (i24 | 0)) {
    if (i11 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort();
    if ((HEAP32[i11 + 12 >> 2] | 0) != (i7 | 0)) _abort();
   }
   if ((i22 | 0) == (i11 | 0)) {
    HEAP32[90] = HEAP32[90] & ~(1 << i23);
    break;
   }
   if ((i22 | 0) != (i24 | 0)) {
    if (i22 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort();
    i24 = i22 + 8 | 0;
    if ((HEAP32[i24 >> 2] | 0) == (i7 | 0)) i30 = i24; else _abort();
   } else i30 = i22 + 8 | 0;
   HEAP32[i11 + 12 >> 2] = i22;
   HEAP32[i30 >> 2] = i11;
  } while (0);
  HEAP32[i14 + 4 >> 2] = i3 | 1;
  HEAP32[i14 + i3 >> 2] = i3;
  if ((i14 | 0) == (HEAP32[95] | 0)) {
   HEAP32[92] = i3;
   return;
  } else i31 = i3;
 } else {
  HEAP32[i2 >> 2] = i20 & -2;
  HEAP32[i14 + 4 >> 2] = i15 | 1;
  HEAP32[i14 + i15 >> 2] = i15;
  i31 = i15;
 }
 i15 = i31 >>> 3;
 if (i31 >>> 0 < 256) {
  i20 = i15 << 1;
  i2 = 400 + (i20 << 2) | 0;
  i3 = HEAP32[90] | 0;
  i30 = 1 << i15;
  if (i3 & i30) {
   i15 = 400 + (i20 + 2 << 2) | 0;
   i7 = HEAP32[i15 >> 2] | 0;
   if (i7 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort(); else {
    i32 = i15;
    i33 = i7;
   }
  } else {
   HEAP32[90] = i3 | i30;
   i32 = 400 + (i20 + 2 << 2) | 0;
   i33 = i2;
  }
  HEAP32[i32 >> 2] = i14;
  HEAP32[i33 + 12 >> 2] = i14;
  HEAP32[i14 + 8 >> 2] = i33;
  HEAP32[i14 + 12 >> 2] = i2;
  return;
 }
 i2 = i31 >>> 8;
 if (i2) if (i31 >>> 0 > 16777215) i34 = 31; else {
  i33 = (i2 + 1048320 | 0) >>> 16 & 8;
  i32 = i2 << i33;
  i2 = (i32 + 520192 | 0) >>> 16 & 4;
  i20 = i32 << i2;
  i32 = (i20 + 245760 | 0) >>> 16 & 2;
  i30 = 14 - (i2 | i33 | i32) + (i20 << i32 >>> 15) | 0;
  i34 = i31 >>> (i30 + 7 | 0) & 1 | i30 << 1;
 } else i34 = 0;
 i30 = 664 + (i34 << 2) | 0;
 HEAP32[i14 + 28 >> 2] = i34;
 HEAP32[i14 + 20 >> 2] = 0;
 HEAP32[i14 + 16 >> 2] = 0;
 i32 = HEAP32[91] | 0;
 i20 = 1 << i34;
 L199 : do if (i32 & i20) {
  i33 = HEAP32[i30 >> 2] | 0;
  L202 : do if ((HEAP32[i33 + 4 >> 2] & -8 | 0) != (i31 | 0)) {
   i2 = i31 << ((i34 | 0) == 31 ? 0 : 25 - (i34 >>> 1) | 0);
   i3 = i33;
   while (1) {
    i7 = i3 + 16 + (i2 >>> 31 << 2) | 0;
    i15 = HEAP32[i7 >> 2] | 0;
    if (!i15) {
     i35 = i7;
     i36 = i3;
     break;
    }
    if ((HEAP32[i15 + 4 >> 2] & -8 | 0) == (i31 | 0)) {
     i37 = i15;
     break L202;
    } else {
     i2 = i2 << 1;
     i3 = i15;
    }
   }
   if (i35 >>> 0 < (HEAP32[94] | 0) >>> 0) _abort(); else {
    HEAP32[i35 >> 2] = i14;
    HEAP32[i14 + 24 >> 2] = i36;
    HEAP32[i14 + 12 >> 2] = i14;
    HEAP32[i14 + 8 >> 2] = i14;
    break L199;
   }
  } else i37 = i33; while (0);
  i33 = i37 + 8 | 0;
  i3 = HEAP32[i33 >> 2] | 0;
  i2 = HEAP32[94] | 0;
  if (i3 >>> 0 >= i2 >>> 0 & i37 >>> 0 >= i2 >>> 0) {
   HEAP32[i3 + 12 >> 2] = i14;
   HEAP32[i33 >> 2] = i14;
   HEAP32[i14 + 8 >> 2] = i3;
   HEAP32[i14 + 12 >> 2] = i37;
   HEAP32[i14 + 24 >> 2] = 0;
   break;
  } else _abort();
 } else {
  HEAP32[91] = i32 | i20;
  HEAP32[i30 >> 2] = i14;
  HEAP32[i14 + 24 >> 2] = i30;
  HEAP32[i14 + 12 >> 2] = i14;
  HEAP32[i14 + 8 >> 2] = i14;
 } while (0);
 i14 = (HEAP32[98] | 0) + -1 | 0;
 HEAP32[98] = i14;
 if (!i14) i38 = 816; else return;
 while (1) {
  i14 = HEAP32[i38 >> 2] | 0;
  if (!i14) break; else i38 = i14 + 8 | 0;
 }
 HEAP32[98] = -1;
 return;
}

function __Z31calculateVerticesAndNormals_x87PK13BoneTransformiPK6VertexPK9InfluenceP10CalVector4(i1, i2, i3, i4, i5) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 var i6 = 0, i7 = 0, i8 = 0, i9 = 0, f10 = f0, f11 = f0, f12 = f0, f13 = f0, f14 = f0, f15 = f0, f16 = f0, f17 = f0, f18 = f0, f19 = f0, f20 = f0, f21 = f0, f22 = f0, f23 = f0, f24 = f0, f25 = f0, f26 = f0, f27 = f0, f28 = f0, f29 = f0, f30 = f0, f31 = f0, f32 = f0, f33 = f0, f34 = f0, f35 = f0, f36 = f0, f37 = f0, f38 = f0, f39 = f0, f40 = f0, f41 = f0, f42 = f0, f43 = f0, f44 = f0, f45 = f0, f46 = f0, i47 = 0, f48 = f0, f49 = f0, f50 = f0, f51 = f0, f52 = f0, f53 = f0, i54 = 0, f55 = f0, f56 = f0, f57 = f0, f58 = f0, f59 = f0, f60 = f0;
 if (!i2) return; else {
  i6 = i4;
  i7 = i3;
  i8 = i5;
  i9 = i2;
 }
 while (1) {
  i9 = i9 + -1 | 0;
  i2 = HEAP32[i6 >> 2] | 0;
  f10 = Math_fround(HEAPF32[i6 + 4 >> 2]);
  f11 = Math_fround(f10 * Math_fround(HEAPF32[i1 + (i2 * 48 | 0) >> 2]));
  f12 = Math_fround(f10 * Math_fround(HEAPF32[i1 + (i2 * 48 | 0) + 4 >> 2]));
  f13 = Math_fround(f10 * Math_fround(HEAPF32[i1 + (i2 * 48 | 0) + 8 >> 2]));
  f14 = Math_fround(f10 * Math_fround(HEAPF32[i1 + (i2 * 48 | 0) + 12 >> 2]));
  f15 = Math_fround(f10 * Math_fround(HEAPF32[i1 + (i2 * 48 | 0) + 16 >> 2]));
  f16 = Math_fround(f10 * Math_fround(HEAPF32[i1 + (i2 * 48 | 0) + 20 >> 2]));
  f17 = Math_fround(f10 * Math_fround(HEAPF32[i1 + (i2 * 48 | 0) + 24 >> 2]));
  f18 = Math_fround(f10 * Math_fround(HEAPF32[i1 + (i2 * 48 | 0) + 28 >> 2]));
  f19 = Math_fround(f10 * Math_fround(HEAPF32[i1 + (i2 * 48 | 0) + 32 >> 2]));
  f20 = Math_fround(f10 * Math_fround(HEAPF32[i1 + (i2 * 48 | 0) + 36 >> 2]));
  f21 = Math_fround(f10 * Math_fround(HEAPF32[i1 + (i2 * 48 | 0) + 40 >> 2]));
  f22 = Math_fround(f10 * Math_fround(HEAPF32[i1 + (i2 * 48 | 0) + 44 >> 2]));
  i2 = i6 + 12 | 0;
  if (!(HEAP32[i6 + 8 >> 2] | 0)) {
   f10 = f21;
   f23 = f22;
   i5 = i2;
   i3 = i6;
   f24 = f11;
   f25 = f12;
   f26 = f13;
   f27 = f14;
   f28 = f15;
   f29 = f16;
   f30 = f17;
   f31 = f18;
   f32 = f19;
   f33 = f20;
   while (1) {
    i4 = HEAP32[i3 + 12 >> 2] | 0;
    f34 = Math_fround(HEAPF32[i3 + 16 >> 2]);
    f35 = Math_fround(f24 + Math_fround(f34 * Math_fround(HEAPF32[i1 + (i4 * 48 | 0) >> 2])));
    f36 = Math_fround(f25 + Math_fround(f34 * Math_fround(HEAPF32[i1 + (i4 * 48 | 0) + 4 >> 2])));
    f37 = Math_fround(f26 + Math_fround(f34 * Math_fround(HEAPF32[i1 + (i4 * 48 | 0) + 8 >> 2])));
    f38 = Math_fround(f27 + Math_fround(f34 * Math_fround(HEAPF32[i1 + (i4 * 48 | 0) + 12 >> 2])));
    f39 = Math_fround(f28 + Math_fround(f34 * Math_fround(HEAPF32[i1 + (i4 * 48 | 0) + 16 >> 2])));
    f40 = Math_fround(f29 + Math_fround(f34 * Math_fround(HEAPF32[i1 + (i4 * 48 | 0) + 20 >> 2])));
    f41 = Math_fround(f30 + Math_fround(f34 * Math_fround(HEAPF32[i1 + (i4 * 48 | 0) + 24 >> 2])));
    f42 = Math_fround(f31 + Math_fround(f34 * Math_fround(HEAPF32[i1 + (i4 * 48 | 0) + 28 >> 2])));
    f43 = Math_fround(f32 + Math_fround(f34 * Math_fround(HEAPF32[i1 + (i4 * 48 | 0) + 32 >> 2])));
    f44 = Math_fround(f33 + Math_fround(f34 * Math_fround(HEAPF32[i1 + (i4 * 48 | 0) + 36 >> 2])));
    f45 = Math_fround(f10 + Math_fround(f34 * Math_fround(HEAPF32[i1 + (i4 * 48 | 0) + 40 >> 2])));
    f46 = Math_fround(f23 + Math_fround(f34 * Math_fround(HEAPF32[i1 + (i4 * 48 | 0) + 44 >> 2])));
    i4 = i5 + 12 | 0;
    if (!(HEAP32[i3 + 20 >> 2] | 0)) {
     i47 = i5;
     f10 = f45;
     f23 = f46;
     i5 = i4;
     f24 = f35;
     f25 = f36;
     f26 = f37;
     f27 = f38;
     f28 = f39;
     f29 = f40;
     f30 = f41;
     f31 = f42;
     f32 = f43;
     f33 = f44;
     i3 = i47;
    } else {
     f48 = f46;
     f49 = f39;
     f50 = f38;
     f51 = f37;
     f52 = f36;
     f53 = f35;
     i54 = i4;
     f55 = f45;
     f56 = f44;
     f57 = f43;
     f58 = f42;
     f59 = f41;
     f60 = f40;
     break;
    }
   }
  } else {
   f48 = f22;
   f49 = f15;
   f50 = f14;
   f51 = f13;
   f52 = f12;
   f53 = f11;
   i54 = i2;
   f55 = f21;
   f56 = f20;
   f57 = f19;
   f58 = f18;
   f59 = f17;
   f60 = f16;
  }
  f33 = Math_fround(f53 * Math_fround(HEAPF32[i7 >> 2]));
  i3 = i7 + 4 | 0;
  f32 = Math_fround(HEAPF32[i3 >> 2]);
  f31 = Math_fround(f33 + Math_fround(f52 * f32));
  f33 = Math_fround(HEAPF32[i7 + 8 >> 2]);
  HEAPF32[i8 >> 2] = Math_fround(f50 + Math_fround(f31 + Math_fround(f51 * f33)));
  f31 = Math_fround(HEAPF32[i7 >> 2]);
  HEAPF32[i8 + 4 >> 2] = Math_fround(f58 + Math_fround(Math_fround(f59 * f33) + Math_fround(Math_fround(f60 * f32) + Math_fround(f49 * f31))));
  f32 = Math_fround(f57 * f31);
  HEAPF32[i8 + 8 >> 2] = Math_fround(f48 + Math_fround(Math_fround(f55 * f33) + Math_fround(f32 + Math_fround(f56 * Math_fround(HEAPF32[i3 >> 2])))));
  i3 = i7 + 16 | 0;
  f32 = Math_fround(f53 * Math_fround(HEAPF32[i3 >> 2]));
  i5 = i7 + 20 | 0;
  f33 = Math_fround(HEAPF32[i5 >> 2]);
  f31 = Math_fround(f32 + Math_fround(f52 * f33));
  f32 = Math_fround(HEAPF32[i7 + 24 >> 2]);
  HEAPF32[i8 + 16 >> 2] = Math_fround(f31 + Math_fround(f51 * f32));
  f31 = Math_fround(HEAPF32[i3 >> 2]);
  HEAPF32[i8 + 20 >> 2] = Math_fround(Math_fround(f59 * f32) + Math_fround(Math_fround(f60 * f33) + Math_fround(f49 * f31)));
  f33 = Math_fround(f57 * f31);
  HEAPF32[i8 + 24 >> 2] = Math_fround(Math_fround(f55 * f32) + Math_fround(f33 + Math_fround(f56 * Math_fround(HEAPF32[i5 >> 2]))));
  if (!i9) break; else {
   i6 = i54;
   i7 = i7 + 32 | 0;
   i8 = i8 + 32 | 0;
  }
 }
 return;
}

function ___udivmoddi4(i1, i2, i3, i4, i5) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 var i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0, i13 = 0, i14 = 0, i15 = 0, i16 = 0, i17 = 0, i18 = 0, i19 = 0, i20 = 0, i21 = 0, i22 = 0, i23 = 0, i24 = 0, i25 = 0, i26 = 0, i27 = 0, i28 = 0, i29 = 0, i30 = 0, i31 = 0, i32 = 0;
 i6 = i1;
 i7 = i2;
 i8 = i7;
 i9 = i3;
 i10 = i4;
 i11 = i10;
 if (!i8) {
  i12 = (i5 | 0) != 0;
  if (!i11) {
   if (i12) {
    HEAP32[i5 >> 2] = (i6 >>> 0) % (i9 >>> 0);
    HEAP32[i5 + 4 >> 2] = 0;
   }
   i13 = 0;
   i14 = (i6 >>> 0) / (i9 >>> 0) >>> 0;
   return (tempRet0 = i13, i14) | 0;
  } else {
   if (!i12) {
    i13 = 0;
    i14 = 0;
    return (tempRet0 = i13, i14) | 0;
   }
   HEAP32[i5 >> 2] = i1 | 0;
   HEAP32[i5 + 4 >> 2] = i2 & 0;
   i13 = 0;
   i14 = 0;
   return (tempRet0 = i13, i14) | 0;
  }
 }
 i12 = (i11 | 0) == 0;
 do if (i9) {
  if (!i12) {
   i15 = (Math_clz32(i11 | 0) | 0) - (Math_clz32(i8 | 0) | 0) | 0;
   if (i15 >>> 0 <= 31) {
    i16 = i15 + 1 | 0;
    i17 = 31 - i15 | 0;
    i18 = i15 - 31 >> 31;
    i19 = i16;
    i20 = i6 >>> (i16 >>> 0) & i18 | i8 << i17;
    i21 = i8 >>> (i16 >>> 0) & i18;
    i22 = 0;
    i23 = i6 << i17;
    break;
   }
   if (!i5) {
    i13 = 0;
    i14 = 0;
    return (tempRet0 = i13, i14) | 0;
   }
   HEAP32[i5 >> 2] = i1 | 0;
   HEAP32[i5 + 4 >> 2] = i7 | i2 & 0;
   i13 = 0;
   i14 = 0;
   return (tempRet0 = i13, i14) | 0;
  }
  i17 = i9 - 1 | 0;
  if (i17 & i9) {
   i18 = (Math_clz32(i9 | 0) | 0) + 33 - (Math_clz32(i8 | 0) | 0) | 0;
   i16 = 64 - i18 | 0;
   i15 = 32 - i18 | 0;
   i24 = i15 >> 31;
   i25 = i18 - 32 | 0;
   i26 = i25 >> 31;
   i19 = i18;
   i20 = i15 - 1 >> 31 & i8 >>> (i25 >>> 0) | (i8 << i15 | i6 >>> (i18 >>> 0)) & i26;
   i21 = i26 & i8 >>> (i18 >>> 0);
   i22 = i6 << i16 & i24;
   i23 = (i8 << i16 | i6 >>> (i25 >>> 0)) & i24 | i6 << i15 & i18 - 33 >> 31;
   break;
  }
  if (i5) {
   HEAP32[i5 >> 2] = i17 & i6;
   HEAP32[i5 + 4 >> 2] = 0;
  }
  if ((i9 | 0) == 1) {
   i13 = i7 | i2 & 0;
   i14 = i1 | 0 | 0;
   return (tempRet0 = i13, i14) | 0;
  } else {
   i17 = _llvm_cttz_i32(i9 | 0) | 0;
   i13 = i8 >>> (i17 >>> 0) | 0;
   i14 = i8 << 32 - i17 | i6 >>> (i17 >>> 0) | 0;
   return (tempRet0 = i13, i14) | 0;
  }
 } else {
  if (i12) {
   if (i5) {
    HEAP32[i5 >> 2] = (i8 >>> 0) % (i9 >>> 0);
    HEAP32[i5 + 4 >> 2] = 0;
   }
   i13 = 0;
   i14 = (i8 >>> 0) / (i9 >>> 0) >>> 0;
   return (tempRet0 = i13, i14) | 0;
  }
  if (!i6) {
   if (i5) {
    HEAP32[i5 >> 2] = 0;
    HEAP32[i5 + 4 >> 2] = (i8 >>> 0) % (i11 >>> 0);
   }
   i13 = 0;
   i14 = (i8 >>> 0) / (i11 >>> 0) >>> 0;
   return (tempRet0 = i13, i14) | 0;
  }
  i17 = i11 - 1 | 0;
  if (!(i17 & i11)) {
   if (i5) {
    HEAP32[i5 >> 2] = i1 | 0;
    HEAP32[i5 + 4 >> 2] = i17 & i8 | i2 & 0;
   }
   i13 = 0;
   i14 = i8 >>> ((_llvm_cttz_i32(i11 | 0) | 0) >>> 0);
   return (tempRet0 = i13, i14) | 0;
  }
  i17 = (Math_clz32(i11 | 0) | 0) - (Math_clz32(i8 | 0) | 0) | 0;
  if (i17 >>> 0 <= 30) {
   i18 = i17 + 1 | 0;
   i15 = 31 - i17 | 0;
   i19 = i18;
   i20 = i8 << i15 | i6 >>> (i18 >>> 0);
   i21 = i8 >>> (i18 >>> 0);
   i22 = 0;
   i23 = i6 << i15;
   break;
  }
  if (!i5) {
   i13 = 0;
   i14 = 0;
   return (tempRet0 = i13, i14) | 0;
  }
  HEAP32[i5 >> 2] = i1 | 0;
  HEAP32[i5 + 4 >> 2] = i7 | i2 & 0;
  i13 = 0;
  i14 = 0;
  return (tempRet0 = i13, i14) | 0;
 } while (0);
 if (!i19) {
  i27 = i23;
  i28 = i22;
  i29 = i21;
  i30 = i20;
  i31 = 0;
  i32 = 0;
 } else {
  i2 = i3 | 0 | 0;
  i3 = i10 | i4 & 0;
  i4 = _i64Add(i2 | 0, i3 | 0, -1, -1) | 0;
  i10 = tempRet0;
  i7 = i23;
  i23 = i22;
  i22 = i21;
  i21 = i20;
  i20 = i19;
  i19 = 0;
  do {
   i1 = i7;
   i7 = i23 >>> 31 | i7 << 1;
   i23 = i19 | i23 << 1;
   i6 = i21 << 1 | i1 >>> 31 | 0;
   i1 = i21 >>> 31 | i22 << 1 | 0;
   _i64Subtract(i4, i10, i6, i1) | 0;
   i8 = tempRet0;
   i11 = i8 >> 31 | ((i8 | 0) < 0 ? -1 : 0) << 1;
   i19 = i11 & 1;
   i21 = _i64Subtract(i6, i1, i11 & i2, (((i8 | 0) < 0 ? -1 : 0) >> 31 | ((i8 | 0) < 0 ? -1 : 0) << 1) & i3) | 0;
   i22 = tempRet0;
   i20 = i20 - 1 | 0;
  } while ((i20 | 0) != 0);
  i27 = i7;
  i28 = i23;
  i29 = i22;
  i30 = i21;
  i31 = 0;
  i32 = i19;
 }
 i19 = i28;
 i28 = 0;
 if (i5) {
  HEAP32[i5 >> 2] = i30;
  HEAP32[i5 + 4 >> 2] = i29;
 }
 i13 = (i19 | 0) >>> 31 | (i27 | i28) << 1 | (i28 << 1 | i19 >>> 31) & 0 | i31;
 i14 = (i19 << 1 | 0 >>> 31) & -2 | i32;
 return (tempRet0 = i13, i14) | 0;
}

function _main(i1, i2) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 var i3 = 0, i4 = 0, i5 = 0, i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0, i13 = 0, f14 = f0, f15 = f0, f16 = f0, f17 = f0;
 i2 = STACKTOP;
 STACKTOP = STACKTOP + 80 | 0;
 i1 = i2 + 8 | 0;
 i3 = i2;
 i4 = i2 + 24 | 0;
 i5 = i2 + 16 | 0;
 i6 = i2 + 32 | 0;
 _gettimeofday(i4 | 0, 0) | 0;
 i7 = __Znaj(304e3) | 0;
 i8 = i7 + 304e3 | 0;
 i9 = i7;
 do {
  HEAPF32[i9 >> 2] = Math_fround(0.0);
  HEAPF32[i9 + 4 >> 2] = Math_fround(0.0);
  HEAPF32[i9 + 8 >> 2] = Math_fround(0.0);
  HEAPF32[i9 + 12 >> 2] = Math_fround(1.0);
  i10 = i9 + 16 | 0;
  HEAP32[i10 >> 2] = 0;
  HEAP32[i10 + 4 >> 2] = 0;
  HEAP32[i10 + 8 >> 2] = 0;
  HEAP32[i10 + 12 >> 2] = 0;
  i9 = i9 + 32 | 0;
 } while ((i9 | 0) != (i8 | 0));
 i8 = __Znaj(114e3) | 0;
 i9 = i8 + 114e3 | 0;
 i10 = i8;
 do {
  HEAP32[i10 >> 2] = -1;
  HEAPF32[i10 + 4 >> 2] = Math_fround(0.0);
  HEAP32[i10 + 8 >> 2] = 0;
  i10 = i10 + 12 | 0;
 } while ((i10 | 0) != (i9 | 0));
 i11 = 0;
 do {
  HEAPF32[i7 + (i11 << 5) + 12 >> 2] = Math_fround(1.0);
  HEAPF32[i7 + (i11 << 5) + 16 >> 2] = Math_fround(0.0);
  HEAPF32[i7 + (i11 << 5) + 20 >> 2] = Math_fround(0.0);
  HEAPF32[i7 + (i11 << 5) + 24 >> 2] = Math_fround(1.0);
  HEAPF32[i7 + (i11 << 5) + 28 >> 2] = Math_fround(0.0);
  HEAP32[i8 + (i11 * 12 | 0) >> 2] = 0;
  HEAPF32[i8 + (i11 * 12 | 0) + 4 >> 2] = Math_fround(1.0);
  HEAP32[i8 + (i11 * 12 | 0) + 8 >> 2] = 1;
  i11 = i11 + 1 | 0;
 } while ((i11 | 0) != 9500);
 i11 = i6;
 i9 = i11 + 48 | 0;
 do {
  HEAP32[i11 >> 2] = 0;
  i11 = i11 + 4 | 0;
 } while ((i11 | 0) < (i9 | 0));
 i11 = __Znaj(304e3) | 0;
 i9 = i11 + 304e3 | 0;
 i10 = i11;
 do {
  HEAP32[i10 >> 2] = 0;
  HEAP32[i10 + 4 >> 2] = 0;
  HEAP32[i10 + 8 >> 2] = 0;
  HEAP32[i10 + 12 >> 2] = 0;
  i10 = i10 + 16 | 0;
 } while ((i10 | 0) != (i9 | 0));
 i12 = 0;
 do {
  __Z31calculateVerticesAndNormals_x87PK13BoneTransformiPK6VertexPK9InfluenceP10CalVector4(i6, 9500, i7, i8, i11);
  i12 = i12 + 1 | 0;
 } while ((i12 | 0) != 1e4);
 i13 = 0;
 f14 = Math_fround(0.0);
 while (1) {
  f15 = Math_fround(HEAPF32[i11 + (i13 << 4) >> 2]);
  f16 = Math_fround(f15 + Math_fround(HEAPF32[i11 + (i13 << 4) + 4 >> 2]));
  f15 = Math_fround(f16 + Math_fround(HEAPF32[i11 + (i13 << 4) + 8 >> 2]));
  f16 = Math_fround(f14 + Math_fround(f15 + Math_fround(HEAPF32[i11 + (i13 << 4) + 12 >> 2])));
  i13 = i13 + 1 | 0;
  if ((i13 | 0) == 19e3) {
   f17 = f16;
   break;
  } else f14 = f16;
 }
 _gettimeofday(i5 | 0, 0) | 0;
 HEAPF64[i3 >> 3] = +f17;
 _printf(856, i3) | 0;
 HEAPF64[i1 >> 3] = +((HEAP32[i5 + 4 >> 2] | 0) - (HEAP32[i4 + 4 >> 2] | 0) | 0) / 1.0e6 + +((HEAP32[i5 >> 2] | 0) - (HEAP32[i4 >> 2] | 0) | 0);
 _printf(865, i1) | 0;
 STACKTOP = i2;
 return 0;
}

function _pop_arg(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 var i4 = 0, i5 = 0, i6 = 0, i7 = 0, d8 = 0.0;
 L1 : do if (i2 >>> 0 <= 20) do switch (i2 | 0) {
 case 9:
  {
   i4 = (HEAP32[i3 >> 2] | 0) + (4 - 1) & ~(4 - 1);
   i5 = HEAP32[i4 >> 2] | 0;
   HEAP32[i3 >> 2] = i4 + 4;
   HEAP32[i1 >> 2] = i5;
   break L1;
   break;
  }
 case 10:
  {
   i5 = (HEAP32[i3 >> 2] | 0) + (4 - 1) & ~(4 - 1);
   i4 = HEAP32[i5 >> 2] | 0;
   HEAP32[i3 >> 2] = i5 + 4;
   i5 = i1;
   HEAP32[i5 >> 2] = i4;
   HEAP32[i5 + 4 >> 2] = ((i4 | 0) < 0) << 31 >> 31;
   break L1;
   break;
  }
 case 11:
  {
   i4 = (HEAP32[i3 >> 2] | 0) + (4 - 1) & ~(4 - 1);
   i5 = HEAP32[i4 >> 2] | 0;
   HEAP32[i3 >> 2] = i4 + 4;
   i4 = i1;
   HEAP32[i4 >> 2] = i5;
   HEAP32[i4 + 4 >> 2] = 0;
   break L1;
   break;
  }
 case 12:
  {
   i4 = (HEAP32[i3 >> 2] | 0) + (8 - 1) & ~(8 - 1);
   i5 = i4;
   i6 = HEAP32[i5 >> 2] | 0;
   i7 = HEAP32[i5 + 4 >> 2] | 0;
   HEAP32[i3 >> 2] = i4 + 8;
   i4 = i1;
   HEAP32[i4 >> 2] = i6;
   HEAP32[i4 + 4 >> 2] = i7;
   break L1;
   break;
  }
 case 13:
  {
   i7 = (HEAP32[i3 >> 2] | 0) + (4 - 1) & ~(4 - 1);
   i4 = HEAP32[i7 >> 2] | 0;
   HEAP32[i3 >> 2] = i7 + 4;
   i7 = (i4 & 65535) << 16 >> 16;
   i4 = i1;
   HEAP32[i4 >> 2] = i7;
   HEAP32[i4 + 4 >> 2] = ((i7 | 0) < 0) << 31 >> 31;
   break L1;
   break;
  }
 case 14:
  {
   i7 = (HEAP32[i3 >> 2] | 0) + (4 - 1) & ~(4 - 1);
   i4 = HEAP32[i7 >> 2] | 0;
   HEAP32[i3 >> 2] = i7 + 4;
   i7 = i1;
   HEAP32[i7 >> 2] = i4 & 65535;
   HEAP32[i7 + 4 >> 2] = 0;
   break L1;
   break;
  }
 case 15:
  {
   i7 = (HEAP32[i3 >> 2] | 0) + (4 - 1) & ~(4 - 1);
   i4 = HEAP32[i7 >> 2] | 0;
   HEAP32[i3 >> 2] = i7 + 4;
   i7 = (i4 & 255) << 24 >> 24;
   i4 = i1;
   HEAP32[i4 >> 2] = i7;
   HEAP32[i4 + 4 >> 2] = ((i7 | 0) < 0) << 31 >> 31;
   break L1;
   break;
  }
 case 16:
  {
   i7 = (HEAP32[i3 >> 2] | 0) + (4 - 1) & ~(4 - 1);
   i4 = HEAP32[i7 >> 2] | 0;
   HEAP32[i3 >> 2] = i7 + 4;
   i7 = i1;
   HEAP32[i7 >> 2] = i4 & 255;
   HEAP32[i7 + 4 >> 2] = 0;
   break L1;
   break;
  }
 case 17:
  {
   i7 = (HEAP32[i3 >> 2] | 0) + (8 - 1) & ~(8 - 1);
   d8 = +HEAPF64[i7 >> 3];
   HEAP32[i3 >> 2] = i7 + 8;
   HEAPF64[i1 >> 3] = d8;
   break L1;
   break;
  }
 case 18:
  {
   i7 = (HEAP32[i3 >> 2] | 0) + (8 - 1) & ~(8 - 1);
   d8 = +HEAPF64[i7 >> 3];
   HEAP32[i3 >> 2] = i7 + 8;
   HEAPF64[i1 >> 3] = d8;
   break L1;
   break;
  }
 default:
  break L1;
 } while (0); while (0);
 return;
}

function ___stdio_write(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 var i4 = 0, i5 = 0, i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0, i13 = 0, i14 = 0, i15 = 0, i16 = 0, i17 = 0, i18 = 0, i19 = 0, i20 = 0, i21 = 0, i22 = 0, i23 = 0, i24 = 0;
 i4 = STACKTOP;
 STACKTOP = STACKTOP + 48 | 0;
 i5 = i4 + 16 | 0;
 i6 = i4;
 i7 = i4 + 32 | 0;
 i8 = i1 + 28 | 0;
 i9 = HEAP32[i8 >> 2] | 0;
 HEAP32[i7 >> 2] = i9;
 i10 = i1 + 20 | 0;
 i11 = (HEAP32[i10 >> 2] | 0) - i9 | 0;
 HEAP32[i7 + 4 >> 2] = i11;
 HEAP32[i7 + 8 >> 2] = i2;
 HEAP32[i7 + 12 >> 2] = i3;
 i2 = i1 + 60 | 0;
 i9 = i1 + 44 | 0;
 i12 = i7;
 i7 = 2;
 i13 = i11 + i3 | 0;
 while (1) {
  if (!(HEAP32[48] | 0)) {
   HEAP32[i5 >> 2] = HEAP32[i2 >> 2];
   HEAP32[i5 + 4 >> 2] = i12;
   HEAP32[i5 + 8 >> 2] = i7;
   i14 = ___syscall_ret(___syscall146(146, i5 | 0) | 0) | 0;
  } else {
   _pthread_cleanup_push(8, i1 | 0);
   HEAP32[i6 >> 2] = HEAP32[i2 >> 2];
   HEAP32[i6 + 4 >> 2] = i12;
   HEAP32[i6 + 8 >> 2] = i7;
   i11 = ___syscall_ret(___syscall146(146, i6 | 0) | 0) | 0;
   _pthread_cleanup_pop(0);
   i14 = i11;
  }
  if ((i13 | 0) == (i14 | 0)) {
   i15 = 6;
   break;
  }
  if ((i14 | 0) < 0) {
   i16 = i12;
   i17 = i7;
   i15 = 8;
   break;
  }
  i11 = i13 - i14 | 0;
  i18 = HEAP32[i12 + 4 >> 2] | 0;
  if (i14 >>> 0 <= i18 >>> 0) if ((i7 | 0) == 2) {
   HEAP32[i8 >> 2] = (HEAP32[i8 >> 2] | 0) + i14;
   i19 = i18;
   i20 = i14;
   i21 = i12;
   i22 = 2;
  } else {
   i19 = i18;
   i20 = i14;
   i21 = i12;
   i22 = i7;
  } else {
   i23 = HEAP32[i9 >> 2] | 0;
   HEAP32[i8 >> 2] = i23;
   HEAP32[i10 >> 2] = i23;
   i19 = HEAP32[i12 + 12 >> 2] | 0;
   i20 = i14 - i18 | 0;
   i21 = i12 + 8 | 0;
   i22 = i7 + -1 | 0;
  }
  HEAP32[i21 >> 2] = (HEAP32[i21 >> 2] | 0) + i20;
  HEAP32[i21 + 4 >> 2] = i19 - i20;
  i12 = i21;
  i7 = i22;
  i13 = i11;
 }
 if ((i15 | 0) == 6) {
  i13 = HEAP32[i9 >> 2] | 0;
  HEAP32[i1 + 16 >> 2] = i13 + (HEAP32[i1 + 48 >> 2] | 0);
  i9 = i13;
  HEAP32[i8 >> 2] = i9;
  HEAP32[i10 >> 2] = i9;
  i24 = i3;
 } else if ((i15 | 0) == 8) {
  HEAP32[i1 + 16 >> 2] = 0;
  HEAP32[i8 >> 2] = 0;
  HEAP32[i10 >> 2] = 0;
  HEAP32[i1 >> 2] = HEAP32[i1 >> 2] | 32;
  if ((i17 | 0) == 2) i24 = 0; else i24 = i3 - (HEAP32[i16 + 4 >> 2] | 0) | 0;
 }
 STACKTOP = i4;
 return i24 | 0;
}

function _memchr(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 var i4 = 0, i5 = 0, i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0, i13 = 0, i14 = 0, i15 = 0, i16 = 0, i17 = 0, i18 = 0, i19 = 0, i20 = 0, i21 = 0, i22 = 0, i23 = 0, i24 = 0, i25 = 0;
 i4 = i2 & 255;
 i5 = (i3 | 0) != 0;
 L1 : do if (i5 & (i1 & 3 | 0) != 0) {
  i6 = i2 & 255;
  i7 = i3;
  i8 = i1;
  while (1) {
   if ((HEAP8[i8 >> 0] | 0) == i6 << 24 >> 24) {
    i9 = i7;
    i10 = i8;
    i11 = 6;
    break L1;
   }
   i12 = i8 + 1 | 0;
   i13 = i7 + -1 | 0;
   i14 = (i13 | 0) != 0;
   if (i14 & (i12 & 3 | 0) != 0) {
    i7 = i13;
    i8 = i12;
   } else {
    i15 = i13;
    i16 = i14;
    i17 = i12;
    i11 = 5;
    break;
   }
  }
 } else {
  i15 = i3;
  i16 = i5;
  i17 = i1;
  i11 = 5;
 } while (0);
 if ((i11 | 0) == 5) if (i16) {
  i9 = i15;
  i10 = i17;
  i11 = 6;
 } else {
  i18 = 0;
  i19 = i17;
 }
 L8 : do if ((i11 | 0) == 6) {
  i17 = i2 & 255;
  if ((HEAP8[i10 >> 0] | 0) == i17 << 24 >> 24) {
   i18 = i9;
   i19 = i10;
  } else {
   i15 = Math_imul(i4, 16843009) | 0;
   L11 : do if (i9 >>> 0 > 3) {
    i16 = i9;
    i1 = i10;
    while (1) {
     i5 = HEAP32[i1 >> 2] ^ i15;
     if ((i5 & -2139062144 ^ -2139062144) & i5 + -16843009) {
      i20 = i16;
      i21 = i1;
      break;
     }
     i5 = i1 + 4 | 0;
     i3 = i16 + -4 | 0;
     if (i3 >>> 0 > 3) {
      i16 = i3;
      i1 = i5;
     } else {
      i22 = i3;
      i23 = i5;
      i11 = 11;
      break L11;
     }
    }
    i24 = i20;
    i25 = i21;
   } else {
    i22 = i9;
    i23 = i10;
    i11 = 11;
   } while (0);
   if ((i11 | 0) == 11) if (!i22) {
    i18 = 0;
    i19 = i23;
    break;
   } else {
    i24 = i22;
    i25 = i23;
   }
   while (1) {
    if ((HEAP8[i25 >> 0] | 0) == i17 << 24 >> 24) {
     i18 = i24;
     i19 = i25;
     break L8;
    }
    i15 = i25 + 1 | 0;
    i24 = i24 + -1 | 0;
    if (!i24) {
     i18 = 0;
     i19 = i15;
     break;
    } else i25 = i15;
   }
  }
 } while (0);
 return ((i18 | 0) != 0 ? i19 : 0) | 0;
}

function __ZNK10__cxxabiv120__si_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib(i1, i2, i3, i4, i5) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 var i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0;
 L1 : do if ((i1 | 0) == (HEAP32[i2 + 8 >> 2] | 0)) {
  if ((HEAP32[i2 + 4 >> 2] | 0) == (i3 | 0) ? (i6 = i2 + 28 | 0, (HEAP32[i6 >> 2] | 0) != 1) : 0) HEAP32[i6 >> 2] = i4;
 } else {
  if ((i1 | 0) != (HEAP32[i2 >> 2] | 0)) {
   i6 = HEAP32[i1 + 8 >> 2] | 0;
   FUNCTION_TABLE_viiiii[HEAP32[(HEAP32[i6 >> 2] | 0) + 24 >> 2] & 3](i6, i2, i3, i4, i5);
   break;
  }
  if ((HEAP32[i2 + 16 >> 2] | 0) != (i3 | 0) ? (i6 = i2 + 20 | 0, (HEAP32[i6 >> 2] | 0) != (i3 | 0)) : 0) {
   HEAP32[i2 + 32 >> 2] = i4;
   i7 = i2 + 44 | 0;
   if ((HEAP32[i7 >> 2] | 0) == 4) break;
   i8 = i2 + 52 | 0;
   HEAP8[i8 >> 0] = 0;
   i9 = i2 + 53 | 0;
   HEAP8[i9 >> 0] = 0;
   i10 = HEAP32[i1 + 8 >> 2] | 0;
   FUNCTION_TABLE_viiiiii[HEAP32[(HEAP32[i10 >> 2] | 0) + 20 >> 2] & 3](i10, i2, i3, i3, 1, i5);
   if (HEAP8[i9 >> 0] | 0) {
    if (!(HEAP8[i8 >> 0] | 0)) {
     i11 = 1;
     i12 = 13;
    }
   } else {
    i11 = 0;
    i12 = 13;
   }
   do if ((i12 | 0) == 13) {
    HEAP32[i6 >> 2] = i3;
    i8 = i2 + 40 | 0;
    HEAP32[i8 >> 2] = (HEAP32[i8 >> 2] | 0) + 1;
    if ((HEAP32[i2 + 36 >> 2] | 0) == 1 ? (HEAP32[i2 + 24 >> 2] | 0) == 2 : 0) {
     HEAP8[i2 + 54 >> 0] = 1;
     if (i11) break;
    } else i12 = 16;
    if ((i12 | 0) == 16 ? i11 : 0) break;
    HEAP32[i7 >> 2] = 4;
    break L1;
   } while (0);
   HEAP32[i7 >> 2] = 3;
   break;
  }
  if ((i4 | 0) == 1) HEAP32[i2 + 32 >> 2] = 1;
 } while (0);
 return;
}

function _vfprintf(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 var i4 = 0, i5 = 0, i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0, i13 = 0, i14 = 0, i15 = 0, i16 = 0, i17 = 0, i18 = 0;
 i4 = STACKTOP;
 STACKTOP = STACKTOP + 224 | 0;
 i5 = i4 + 80 | 0;
 i6 = i4 + 96 | 0;
 i7 = i4;
 i8 = i4 + 136 | 0;
 i9 = i6;
 i10 = i9 + 40 | 0;
 do {
  HEAP32[i9 >> 2] = 0;
  i9 = i9 + 4 | 0;
 } while ((i9 | 0) < (i10 | 0));
 HEAP32[i5 >> 2] = HEAP32[i3 >> 2];
 if ((_printf_core(0, i2, i5, i7, i6) | 0) < 0) i11 = -1; else {
  if ((HEAP32[i1 + 76 >> 2] | 0) > -1) i12 = ___lockfile(i1) | 0; else i12 = 0;
  i3 = HEAP32[i1 >> 2] | 0;
  i9 = i3 & 32;
  if ((HEAP8[i1 + 74 >> 0] | 0) < 1) HEAP32[i1 >> 2] = i3 & -33;
  i3 = i1 + 48 | 0;
  if (!(HEAP32[i3 >> 2] | 0)) {
   i10 = i1 + 44 | 0;
   i13 = HEAP32[i10 >> 2] | 0;
   HEAP32[i10 >> 2] = i8;
   i14 = i1 + 28 | 0;
   HEAP32[i14 >> 2] = i8;
   i15 = i1 + 20 | 0;
   HEAP32[i15 >> 2] = i8;
   HEAP32[i3 >> 2] = 80;
   i16 = i1 + 16 | 0;
   HEAP32[i16 >> 2] = i8 + 80;
   i8 = _printf_core(i1, i2, i5, i7, i6) | 0;
   if (!i13) i17 = i8; else {
    FUNCTION_TABLE_iiii[HEAP32[i1 + 36 >> 2] & 7](i1, 0, 0) | 0;
    i18 = (HEAP32[i15 >> 2] | 0) == 0 ? -1 : i8;
    HEAP32[i10 >> 2] = i13;
    HEAP32[i3 >> 2] = 0;
    HEAP32[i16 >> 2] = 0;
    HEAP32[i14 >> 2] = 0;
    HEAP32[i15 >> 2] = 0;
    i17 = i18;
   }
  } else i17 = _printf_core(i1, i2, i5, i7, i6) | 0;
  i6 = HEAP32[i1 >> 2] | 0;
  HEAP32[i1 >> 2] = i6 | i9;
  if (i12) ___unlockfile(i1);
  i11 = (i6 & 32 | 0) == 0 ? i17 : -1;
 }
 STACKTOP = i4;
 return i11 | 0;
}

function ___dynamic_cast(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 var i5 = 0, i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0, i13 = 0, i14 = 0, i15 = 0;
 i5 = STACKTOP;
 STACKTOP = STACKTOP + 64 | 0;
 i6 = i5;
 i7 = HEAP32[i1 >> 2] | 0;
 i8 = i1 + (HEAP32[i7 + -8 >> 2] | 0) | 0;
 i9 = HEAP32[i7 + -4 >> 2] | 0;
 HEAP32[i6 >> 2] = i3;
 HEAP32[i6 + 4 >> 2] = i1;
 HEAP32[i6 + 8 >> 2] = i2;
 HEAP32[i6 + 12 >> 2] = i4;
 i4 = i6 + 16 | 0;
 i2 = i6 + 20 | 0;
 i1 = i6 + 24 | 0;
 i7 = i6 + 28 | 0;
 i10 = i6 + 32 | 0;
 i11 = i6 + 40 | 0;
 i12 = (i9 | 0) == (i3 | 0);
 i13 = i4;
 i14 = i13 + 36 | 0;
 do {
  HEAP32[i13 >> 2] = 0;
  i13 = i13 + 4 | 0;
 } while ((i13 | 0) < (i14 | 0));
 HEAP16[i4 + 36 >> 1] = 0;
 HEAP8[i4 + 38 >> 0] = 0;
 L1 : do if (i12) {
  HEAP32[i6 + 48 >> 2] = 1;
  FUNCTION_TABLE_viiiiii[HEAP32[(HEAP32[i3 >> 2] | 0) + 20 >> 2] & 3](i3, i6, i8, i8, 1, 0);
  i15 = (HEAP32[i1 >> 2] | 0) == 1 ? i8 : 0;
 } else {
  FUNCTION_TABLE_viiiii[HEAP32[(HEAP32[i9 >> 2] | 0) + 24 >> 2] & 3](i9, i6, i8, 1, 0);
  switch (HEAP32[i6 + 36 >> 2] | 0) {
  case 0:
   {
    i15 = (HEAP32[i11 >> 2] | 0) == 1 & (HEAP32[i7 >> 2] | 0) == 1 & (HEAP32[i10 >> 2] | 0) == 1 ? HEAP32[i2 >> 2] | 0 : 0;
    break L1;
    break;
   }
  case 1:
   break;
  default:
   {
    i15 = 0;
    break L1;
   }
  }
  if ((HEAP32[i1 >> 2] | 0) != 1 ? !((HEAP32[i11 >> 2] | 0) == 0 & (HEAP32[i7 >> 2] | 0) == 1 & (HEAP32[i10 >> 2] | 0) == 1) : 0) {
   i15 = 0;
   break;
  }
  i15 = HEAP32[i4 >> 2] | 0;
 } while (0);
 STACKTOP = i5;
 return i15 | 0;
}

function ___fwritex(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 var i4 = 0, i5 = 0, i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0, i13 = 0, i14 = 0, i15 = 0;
 i4 = i3 + 16 | 0;
 i5 = HEAP32[i4 >> 2] | 0;
 if (!i5) if (!(___towrite(i3) | 0)) {
  i6 = HEAP32[i4 >> 2] | 0;
  i7 = 4;
 } else i8 = 0; else {
  i6 = i5;
  i7 = 4;
 }
 L4 : do if ((i7 | 0) == 4) {
  i5 = i3 + 20 | 0;
  i4 = HEAP32[i5 >> 2] | 0;
  if ((i6 - i4 | 0) >>> 0 < i2 >>> 0) {
   i8 = FUNCTION_TABLE_iiii[HEAP32[i3 + 36 >> 2] & 7](i3, i1, i2) | 0;
   break;
  }
  L9 : do if ((HEAP8[i3 + 75 >> 0] | 0) > -1) {
   i9 = i2;
   while (1) {
    if (!i9) {
     i10 = i2;
     i11 = i1;
     i12 = i4;
     i13 = 0;
     break L9;
    }
    i14 = i9 + -1 | 0;
    if ((HEAP8[i1 + i14 >> 0] | 0) == 10) {
     i15 = i9;
     break;
    } else i9 = i14;
   }
   if ((FUNCTION_TABLE_iiii[HEAP32[i3 + 36 >> 2] & 7](i3, i1, i15) | 0) >>> 0 < i15 >>> 0) {
    i8 = i15;
    break L4;
   }
   i10 = i2 - i15 | 0;
   i11 = i1 + i15 | 0;
   i12 = HEAP32[i5 >> 2] | 0;
   i13 = i15;
  } else {
   i10 = i2;
   i11 = i1;
   i12 = i4;
   i13 = 0;
  } while (0);
  _memcpy(i12 | 0, i11 | 0, i10 | 0) | 0;
  HEAP32[i5 >> 2] = (HEAP32[i5 >> 2] | 0) + i10;
  i8 = i13 + i10 | 0;
 } while (0);
 return i8 | 0;
}

function __ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i(i1, i2, i3, i4, i5) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 var i6 = 0, i7 = 0;
 HEAP8[i2 + 53 >> 0] = 1;
 do if ((HEAP32[i2 + 4 >> 2] | 0) == (i4 | 0)) {
  HEAP8[i2 + 52 >> 0] = 1;
  i1 = i2 + 16 | 0;
  i6 = HEAP32[i1 >> 2] | 0;
  if (!i6) {
   HEAP32[i1 >> 2] = i3;
   HEAP32[i2 + 24 >> 2] = i5;
   HEAP32[i2 + 36 >> 2] = 1;
   if (!((i5 | 0) == 1 ? (HEAP32[i2 + 48 >> 2] | 0) == 1 : 0)) break;
   HEAP8[i2 + 54 >> 0] = 1;
   break;
  }
  if ((i6 | 0) != (i3 | 0)) {
   i6 = i2 + 36 | 0;
   HEAP32[i6 >> 2] = (HEAP32[i6 >> 2] | 0) + 1;
   HEAP8[i2 + 54 >> 0] = 1;
   break;
  }
  i6 = i2 + 24 | 0;
  i1 = HEAP32[i6 >> 2] | 0;
  if ((i1 | 0) == 2) {
   HEAP32[i6 >> 2] = i5;
   i7 = i5;
  } else i7 = i1;
  if ((i7 | 0) == 1 ? (HEAP32[i2 + 48 >> 2] | 0) == 1 : 0) HEAP8[i2 + 54 >> 0] = 1;
 } while (0);
 return;
}

function _fflush(i1) {
 i1 = i1 | 0;
 var i2 = 0, i3 = 0, i4 = 0, i5 = 0, i6 = 0, i7 = 0, i8 = 0;
 do if (i1) {
  if ((HEAP32[i1 + 76 >> 2] | 0) <= -1) {
   i2 = ___fflush_unlocked(i1) | 0;
   break;
  }
  i3 = (___lockfile(i1) | 0) == 0;
  i4 = ___fflush_unlocked(i1) | 0;
  if (i3) i2 = i4; else {
   ___unlockfile(i1);
   i2 = i4;
  }
 } else {
  if (!(HEAP32[60] | 0)) i5 = 0; else i5 = _fflush(HEAP32[60] | 0) | 0;
  ___lock(220);
  i4 = HEAP32[54] | 0;
  if (!i4) i6 = i5; else {
   i3 = i4;
   i4 = i5;
   while (1) {
    if ((HEAP32[i3 + 76 >> 2] | 0) > -1) i7 = ___lockfile(i3) | 0; else i7 = 0;
    if ((HEAP32[i3 + 20 >> 2] | 0) >>> 0 > (HEAP32[i3 + 28 >> 2] | 0) >>> 0) i8 = ___fflush_unlocked(i3) | 0 | i4; else i8 = i4;
    if (i7) ___unlockfile(i3);
    i3 = HEAP32[i3 + 56 >> 2] | 0;
    if (!i3) {
     i6 = i8;
     break;
    } else i4 = i8;
   }
  }
  ___unlock(220);
  i2 = i6;
 } while (0);
 return i2 | 0;
}

function _pad(i1, i2, i3, i4, i5) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 var i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0, i13 = 0, i14 = 0, i15 = 0;
 i6 = STACKTOP;
 STACKTOP = STACKTOP + 256 | 0;
 i7 = i6;
 do if ((i3 | 0) > (i4 | 0) & (i5 & 73728 | 0) == 0) {
  i8 = i3 - i4 | 0;
  _memset(i7 | 0, i2 | 0, (i8 >>> 0 > 256 ? 256 : i8) | 0) | 0;
  i9 = HEAP32[i1 >> 2] | 0;
  i10 = (i9 & 32 | 0) == 0;
  if (i8 >>> 0 > 255) {
   i11 = i3 - i4 | 0;
   i12 = i8;
   i13 = i9;
   i9 = i10;
   while (1) {
    if (i9) {
     ___fwritex(i7, 256, i1) | 0;
     i14 = HEAP32[i1 >> 2] | 0;
    } else i14 = i13;
    i12 = i12 + -256 | 0;
    i9 = (i14 & 32 | 0) == 0;
    if (i12 >>> 0 <= 255) break; else i13 = i14;
   }
   if (i9) i15 = i11 & 255; else break;
  } else if (i10) i15 = i8; else break;
  ___fwritex(i7, i15, i1) | 0;
 } while (0);
 STACKTOP = i6;
 return;
}

function _fmt_u(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 var i4 = 0, i5 = 0, i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0;
 if (i2 >>> 0 > 0 | (i2 | 0) == 0 & i1 >>> 0 > 4294967295) {
  i4 = i3;
  i5 = i1;
  i6 = i2;
  while (1) {
   i2 = ___uremdi3(i5 | 0, i6 | 0, 10, 0) | 0;
   i7 = i4 + -1 | 0;
   HEAP8[i7 >> 0] = i2 | 48;
   i2 = ___udivdi3(i5 | 0, i6 | 0, 10, 0) | 0;
   if (i6 >>> 0 > 9 | (i6 | 0) == 9 & i5 >>> 0 > 4294967295) {
    i4 = i7;
    i5 = i2;
    i6 = tempRet0;
   } else {
    i8 = i7;
    i9 = i2;
    break;
   }
  }
  i10 = i8;
  i11 = i9;
 } else {
  i10 = i3;
  i11 = i1;
 }
 if (!i11) i12 = i10; else {
  i1 = i10;
  i10 = i11;
  while (1) {
   i11 = i1 + -1 | 0;
   HEAP8[i11 >> 0] = (i10 >>> 0) % 10 | 0 | 48;
   if (i10 >>> 0 < 10) {
    i12 = i11;
    break;
   } else {
    i1 = i11;
    i10 = (i10 >>> 0) / 10 | 0;
   }
  }
 }
 return i12 | 0;
}

function __ZNK10__cxxabiv117__class_type_info9can_catchEPKNS_16__shim_type_infoERPv(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 var i4 = 0, i5 = 0, i6 = 0, i7 = 0, i8 = 0, i9 = 0;
 i4 = STACKTOP;
 STACKTOP = STACKTOP + 64 | 0;
 i5 = i4;
 if ((i1 | 0) != (i2 | 0)) if ((i2 | 0) != 0 ? (i6 = ___dynamic_cast(i2, 40, 56, 0) | 0, (i6 | 0) != 0) : 0) {
  i2 = i5;
  i7 = i2 + 56 | 0;
  do {
   HEAP32[i2 >> 2] = 0;
   i2 = i2 + 4 | 0;
  } while ((i2 | 0) < (i7 | 0));
  HEAP32[i5 >> 2] = i6;
  HEAP32[i5 + 8 >> 2] = i1;
  HEAP32[i5 + 12 >> 2] = -1;
  HEAP32[i5 + 48 >> 2] = 1;
  FUNCTION_TABLE_viiii[HEAP32[(HEAP32[i6 >> 2] | 0) + 28 >> 2] & 3](i6, i5, HEAP32[i3 >> 2] | 0, 1);
  if ((HEAP32[i5 + 24 >> 2] | 0) == 1) {
   HEAP32[i3 >> 2] = HEAP32[i5 + 16 >> 2];
   i8 = 1;
  } else i8 = 0;
  i9 = i8;
 } else i9 = 0; else i9 = 1;
 STACKTOP = i4;
 return i9 | 0;
}

function _wcrtomb(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 var i4 = 0;
 do if (i1) {
  if (i2 >>> 0 < 128) {
   HEAP8[i1 >> 0] = i2;
   i4 = 1;
   break;
  }
  if (i2 >>> 0 < 2048) {
   HEAP8[i1 >> 0] = i2 >>> 6 | 192;
   HEAP8[i1 + 1 >> 0] = i2 & 63 | 128;
   i4 = 2;
   break;
  }
  if (i2 >>> 0 < 55296 | (i2 & -8192 | 0) == 57344) {
   HEAP8[i1 >> 0] = i2 >>> 12 | 224;
   HEAP8[i1 + 1 >> 0] = i2 >>> 6 & 63 | 128;
   HEAP8[i1 + 2 >> 0] = i2 & 63 | 128;
   i4 = 3;
   break;
  }
  if ((i2 + -65536 | 0) >>> 0 < 1048576) {
   HEAP8[i1 >> 0] = i2 >>> 18 | 240;
   HEAP8[i1 + 1 >> 0] = i2 >>> 12 & 63 | 128;
   HEAP8[i1 + 2 >> 0] = i2 >>> 6 & 63 | 128;
   HEAP8[i1 + 3 >> 0] = i2 & 63 | 128;
   i4 = 4;
   break;
  } else {
   HEAP32[(___errno_location() | 0) >> 2] = 84;
   i4 = -1;
   break;
  }
 } else i4 = 1; while (0);
 return i4 | 0;
}

function __ZNK10__cxxabiv117__class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib(i1, i2, i3, i4, i5) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 do if ((i1 | 0) == (HEAP32[i2 + 8 >> 2] | 0)) {
  if ((HEAP32[i2 + 4 >> 2] | 0) == (i3 | 0) ? (i5 = i2 + 28 | 0, (HEAP32[i5 >> 2] | 0) != 1) : 0) HEAP32[i5 >> 2] = i4;
 } else if ((i1 | 0) == (HEAP32[i2 >> 2] | 0)) {
  if ((HEAP32[i2 + 16 >> 2] | 0) != (i3 | 0) ? (i5 = i2 + 20 | 0, (HEAP32[i5 >> 2] | 0) != (i3 | 0)) : 0) {
   HEAP32[i2 + 32 >> 2] = i4;
   HEAP32[i5 >> 2] = i3;
   i5 = i2 + 40 | 0;
   HEAP32[i5 >> 2] = (HEAP32[i5 >> 2] | 0) + 1;
   if ((HEAP32[i2 + 36 >> 2] | 0) == 1 ? (HEAP32[i2 + 24 >> 2] | 0) == 2 : 0) HEAP8[i2 + 54 >> 0] = 1;
   HEAP32[i2 + 44 >> 2] = 4;
   break;
  }
  if ((i4 | 0) == 1) HEAP32[i2 + 32 >> 2] = 1;
 } while (0);
 return;
}

function _frexp(d1, i2) {
 d1 = +d1;
 i2 = i2 | 0;
 var i3 = 0, i4 = 0, i5 = 0, i6 = 0, d7 = 0.0, d8 = 0.0, i9 = 0, d10 = 0.0;
 HEAPF64[tempDoublePtr >> 3] = d1;
 i3 = HEAP32[tempDoublePtr >> 2] | 0;
 i4 = HEAP32[tempDoublePtr + 4 >> 2] | 0;
 i5 = _bitshift64Lshr(i3 | 0, i4 | 0, 52) | 0;
 i6 = i5 & 2047;
 switch (i6 | 0) {
 case 0:
  {
   if (d1 != 0.0) {
    d7 = +_frexp(d1 * 18446744073709551616.0, i2);
    d8 = d7;
    i9 = (HEAP32[i2 >> 2] | 0) + -64 | 0;
   } else {
    d8 = d1;
    i9 = 0;
   }
   HEAP32[i2 >> 2] = i9;
   d10 = d8;
   break;
  }
 case 2047:
  {
   d10 = d1;
   break;
  }
 default:
  {
   HEAP32[i2 >> 2] = i6 + -1022;
   HEAP32[tempDoublePtr >> 2] = i3;
   HEAP32[tempDoublePtr + 4 >> 2] = i4 & -2146435073 | 1071644672;
   d10 = +HEAPF64[tempDoublePtr >> 3];
  }
 }
 return +d10;
}

function ___remdi3(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 var i5 = 0, i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0;
 i5 = STACKTOP;
 STACKTOP = STACKTOP + 16 | 0;
 i6 = i5 | 0;
 i7 = i2 >> 31 | ((i2 | 0) < 0 ? -1 : 0) << 1;
 i8 = ((i2 | 0) < 0 ? -1 : 0) >> 31 | ((i2 | 0) < 0 ? -1 : 0) << 1;
 i9 = i4 >> 31 | ((i4 | 0) < 0 ? -1 : 0) << 1;
 i10 = ((i4 | 0) < 0 ? -1 : 0) >> 31 | ((i4 | 0) < 0 ? -1 : 0) << 1;
 i11 = _i64Subtract(i7 ^ i1, i8 ^ i2, i7, i8) | 0;
 i2 = tempRet0;
 ___udivmoddi4(i11, i2, _i64Subtract(i9 ^ i3, i10 ^ i4, i9, i10) | 0, tempRet0, i6) | 0;
 i10 = _i64Subtract(HEAP32[i6 >> 2] ^ i7, HEAP32[i6 + 4 >> 2] ^ i8, i7, i8) | 0;
 i8 = tempRet0;
 STACKTOP = i5;
 return (tempRet0 = i8, i10) | 0;
}

function _strerror(i1) {
 i1 = i1 | 0;
 var i2 = 0, i3 = 0, i4 = 0, i5 = 0, i6 = 0, i7 = 0, i8 = 0;
 i2 = 0;
 while (1) {
  if ((HEAPU8[1048 + i2 >> 0] | 0) == (i1 | 0)) {
   i3 = i2;
   i4 = 2;
   break;
  }
  i2 = i2 + 1 | 0;
  if ((i2 | 0) == 87) {
   i5 = 87;
   i6 = 1136;
   i4 = 5;
   break;
  }
 }
 if ((i4 | 0) == 2) if (!i3) i7 = 1136; else {
  i5 = i3;
  i6 = 1136;
  i4 = 5;
 }
 if ((i4 | 0) == 5) while (1) {
  i4 = 0;
  i3 = i6;
  while (1) {
   i2 = i3 + 1 | 0;
   if (!(HEAP8[i3 >> 0] | 0)) {
    i8 = i2;
    break;
   } else i3 = i2;
  }
  i5 = i5 + -1 | 0;
  if (!i5) {
   i7 = i8;
   break;
  } else {
   i6 = i8;
   i4 = 5;
  }
 }
 return i7 | 0;
}

function ___fflush_unlocked(i1) {
 i1 = i1 | 0;
 var i2 = 0, i3 = 0, i4 = 0, i5 = 0, i6 = 0, i7 = 0, i8 = 0;
 i2 = i1 + 20 | 0;
 i3 = i1 + 28 | 0;
 if ((HEAP32[i2 >> 2] | 0) >>> 0 > (HEAP32[i3 >> 2] | 0) >>> 0 ? (FUNCTION_TABLE_iiii[HEAP32[i1 + 36 >> 2] & 7](i1, 0, 0) | 0, (HEAP32[i2 >> 2] | 0) == 0) : 0) i4 = -1; else {
  i5 = i1 + 4 | 0;
  i6 = HEAP32[i5 >> 2] | 0;
  i7 = i1 + 8 | 0;
  i8 = HEAP32[i7 >> 2] | 0;
  if (i6 >>> 0 < i8 >>> 0) FUNCTION_TABLE_iiii[HEAP32[i1 + 40 >> 2] & 7](i1, i6 - i8 | 0, 1) | 0;
  HEAP32[i1 + 16 >> 2] = 0;
  HEAP32[i3 >> 2] = 0;
  HEAP32[i2 >> 2] = 0;
  HEAP32[i7 >> 2] = 0;
  HEAP32[i5 >> 2] = 0;
  i4 = 0;
 }
 return i4 | 0;
}

function _memcpy(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 var i4 = 0;
 if ((i3 | 0) >= 4096) return _emscripten_memcpy_big(i1 | 0, i2 | 0, i3 | 0) | 0;
 i4 = i1 | 0;
 if ((i1 & 3) == (i2 & 3)) {
  while (i1 & 3) {
   if (!i3) return i4 | 0;
   HEAP8[i1 >> 0] = HEAP8[i2 >> 0] | 0;
   i1 = i1 + 1 | 0;
   i2 = i2 + 1 | 0;
   i3 = i3 - 1 | 0;
  }
  while ((i3 | 0) >= 4) {
   HEAP32[i1 >> 2] = HEAP32[i2 >> 2];
   i1 = i1 + 4 | 0;
   i2 = i2 + 4 | 0;
   i3 = i3 - 4 | 0;
  }
 }
 while ((i3 | 0) > 0) {
  HEAP8[i1 >> 0] = HEAP8[i2 >> 0] | 0;
  i1 = i1 + 1 | 0;
  i2 = i2 + 1 | 0;
  i3 = i3 - 1 | 0;
 }
 return i4 | 0;
}

function __ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 var i5 = 0, i6 = 0;
 i1 = i2 + 16 | 0;
 i5 = HEAP32[i1 >> 2] | 0;
 do if (i5) {
  if ((i5 | 0) != (i3 | 0)) {
   i6 = i2 + 36 | 0;
   HEAP32[i6 >> 2] = (HEAP32[i6 >> 2] | 0) + 1;
   HEAP32[i2 + 24 >> 2] = 2;
   HEAP8[i2 + 54 >> 0] = 1;
   break;
  }
  i6 = i2 + 24 | 0;
  if ((HEAP32[i6 >> 2] | 0) == 2) HEAP32[i6 >> 2] = i4;
 } else {
  HEAP32[i1 >> 2] = i3;
  HEAP32[i2 + 24 >> 2] = i4;
  HEAP32[i2 + 36 >> 2] = 1;
 } while (0);
 return;
}

function ___divdi3(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 var i5 = 0, i6 = 0, i7 = 0, i8 = 0, i9 = 0;
 i5 = i2 >> 31 | ((i2 | 0) < 0 ? -1 : 0) << 1;
 i6 = ((i2 | 0) < 0 ? -1 : 0) >> 31 | ((i2 | 0) < 0 ? -1 : 0) << 1;
 i7 = i4 >> 31 | ((i4 | 0) < 0 ? -1 : 0) << 1;
 i8 = ((i4 | 0) < 0 ? -1 : 0) >> 31 | ((i4 | 0) < 0 ? -1 : 0) << 1;
 i9 = _i64Subtract(i5 ^ i1, i6 ^ i2, i5, i6) | 0;
 i2 = tempRet0;
 i1 = i7 ^ i5;
 i5 = i8 ^ i6;
 return _i64Subtract((___udivmoddi4(i9, i2, _i64Subtract(i7 ^ i3, i8 ^ i4, i7, i8) | 0, tempRet0, 0) | 0) ^ i1, tempRet0 ^ i5, i1, i5) | 0;
}

function _memset(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 var i4 = 0, i5 = 0, i6 = 0, i7 = 0;
 i4 = i1 + i3 | 0;
 if ((i3 | 0) >= 20) {
  i2 = i2 & 255;
  i5 = i1 & 3;
  i6 = i2 | i2 << 8 | i2 << 16 | i2 << 24;
  i7 = i4 & ~3;
  if (i5) {
   i5 = i1 + 4 - i5 | 0;
   while ((i1 | 0) < (i5 | 0)) {
    HEAP8[i1 >> 0] = i2;
    i1 = i1 + 1 | 0;
   }
  }
  while ((i1 | 0) < (i7 | 0)) {
   HEAP32[i1 >> 2] = i6;
   i1 = i1 + 4 | 0;
  }
 }
 while ((i1 | 0) < (i4 | 0)) {
  HEAP8[i1 >> 0] = i2;
  i1 = i1 + 1 | 0;
 }
 return i1 - i3 | 0;
}

function __ZNK10__cxxabiv120__si_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib(i1, i2, i3, i4, i5, i6) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 i6 = i6 | 0;
 var i7 = 0;
 if ((i1 | 0) == (HEAP32[i2 + 8 >> 2] | 0)) __ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i(0, i2, i3, i4, i5); else {
  i7 = HEAP32[i1 + 8 >> 2] | 0;
  FUNCTION_TABLE_viiiiii[HEAP32[(HEAP32[i7 >> 2] | 0) + 20 >> 2] & 3](i7, i2, i3, i4, i5, i6);
 }
 return;
}

function ___stdio_seek(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 var i4 = 0, i5 = 0, i6 = 0, i7 = 0;
 i4 = STACKTOP;
 STACKTOP = STACKTOP + 32 | 0;
 i5 = i4;
 i6 = i4 + 20 | 0;
 HEAP32[i5 >> 2] = HEAP32[i1 + 60 >> 2];
 HEAP32[i5 + 4 >> 2] = 0;
 HEAP32[i5 + 8 >> 2] = i2;
 HEAP32[i5 + 12 >> 2] = i6;
 HEAP32[i5 + 16 >> 2] = i3;
 if ((___syscall_ret(___syscall140(140, i5 | 0) | 0) | 0) < 0) {
  HEAP32[i6 >> 2] = -1;
  i7 = -1;
 } else i7 = HEAP32[i6 >> 2] | 0;
 STACKTOP = i4;
 return i7 | 0;
}

function __ZNK10__cxxabiv120__si_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 var i5 = 0;
 if ((i1 | 0) == (HEAP32[i2 + 8 >> 2] | 0)) __ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi(0, i2, i3, i4); else {
  i5 = HEAP32[i1 + 8 >> 2] | 0;
  FUNCTION_TABLE_viiii[HEAP32[(HEAP32[i5 >> 2] | 0) + 28 >> 2] & 3](i5, i2, i3, i4);
 }
 return;
}

function ___towrite(i1) {
 i1 = i1 | 0;
 var i2 = 0, i3 = 0, i4 = 0;
 i2 = i1 + 74 | 0;
 i3 = HEAP8[i2 >> 0] | 0;
 HEAP8[i2 >> 0] = i3 + 255 | i3;
 i3 = HEAP32[i1 >> 2] | 0;
 if (!(i3 & 8)) {
  HEAP32[i1 + 8 >> 2] = 0;
  HEAP32[i1 + 4 >> 2] = 0;
  i2 = HEAP32[i1 + 44 >> 2] | 0;
  HEAP32[i1 + 28 >> 2] = i2;
  HEAP32[i1 + 20 >> 2] = i2;
  HEAP32[i1 + 16 >> 2] = i2 + (HEAP32[i1 + 48 >> 2] | 0);
  i4 = 0;
 } else {
  HEAP32[i1 >> 2] = i3 | 32;
  i4 = -1;
 }
 return i4 | 0;
}

function ___stdout_write(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 var i4 = 0, i5 = 0;
 i4 = STACKTOP;
 STACKTOP = STACKTOP + 80 | 0;
 i5 = i4;
 HEAP32[i1 + 36 >> 2] = 4;
 if ((HEAP32[i1 >> 2] & 64 | 0) == 0 ? (HEAP32[i5 >> 2] = HEAP32[i1 + 60 >> 2], HEAP32[i5 + 4 >> 2] = 21505, HEAP32[i5 + 8 >> 2] = i4 + 12, (___syscall54(54, i5 | 0) | 0) != 0) : 0) HEAP8[i1 + 75 >> 0] = -1;
 i5 = ___stdio_write(i1, i2, i3) | 0;
 STACKTOP = i4;
 return i5 | 0;
}

function copyTempDouble(i1) {
 i1 = i1 | 0;
 HEAP8[tempDoublePtr >> 0] = HEAP8[i1 >> 0];
 HEAP8[tempDoublePtr + 1 >> 0] = HEAP8[i1 + 1 >> 0];
 HEAP8[tempDoublePtr + 2 >> 0] = HEAP8[i1 + 2 >> 0];
 HEAP8[tempDoublePtr + 3 >> 0] = HEAP8[i1 + 3 >> 0];
 HEAP8[tempDoublePtr + 4 >> 0] = HEAP8[i1 + 4 >> 0];
 HEAP8[tempDoublePtr + 5 >> 0] = HEAP8[i1 + 5 >> 0];
 HEAP8[tempDoublePtr + 6 >> 0] = HEAP8[i1 + 6 >> 0];
 HEAP8[tempDoublePtr + 7 >> 0] = HEAP8[i1 + 7 >> 0];
}

function __Znwj(i1) {
 i1 = i1 | 0;
 var i2 = 0, i3 = 0, i4 = 0;
 i2 = (i1 | 0) == 0 ? 1 : i1;
 i1 = _malloc(i2) | 0;
 L1 : do if (!i1) {
  while (1) {
   i3 = __ZSt15get_new_handlerv() | 0;
   if (!i3) break;
   FUNCTION_TABLE_v[i3 & 0]();
   i3 = _malloc(i2) | 0;
   if (i3) {
    i4 = i3;
    break L1;
   }
  }
  i3 = ___cxa_allocate_exception(4) | 0;
  HEAP32[i3 >> 2] = 96;
  ___cxa_throw(i3 | 0, 8, 1);
 } else i4 = i1; while (0);
 return i4 | 0;
}

function ___muldsi3(i1, i2) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 var i3 = 0, i4 = 0, i5 = 0, i6 = 0;
 i3 = i1 & 65535;
 i4 = i2 & 65535;
 i5 = Math_imul(i4, i3) | 0;
 i6 = i1 >>> 16;
 i1 = (i5 >>> 16) + (Math_imul(i4, i6) | 0) | 0;
 i4 = i2 >>> 16;
 i2 = Math_imul(i4, i3) | 0;
 return (tempRet0 = (i1 >>> 16) + (Math_imul(i4, i6) | 0) + (((i1 & 65535) + i2 | 0) >>> 16) | 0, i1 + i2 << 16 | i5 & 65535 | 0) | 0;
}

function __ZNK10__cxxabiv117__class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib(i1, i2, i3, i4, i5, i6) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 i6 = i6 | 0;
 if ((i1 | 0) == (HEAP32[i2 + 8 >> 2] | 0)) __ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i(0, i2, i3, i4, i5);
 return;
}

function _llvm_cttz_i32(i1) {
 i1 = i1 | 0;
 var i2 = 0;
 i2 = HEAP8[cttz_i8 + (i1 & 255) >> 0] | 0;
 if ((i2 | 0) < 8) return i2 | 0;
 i2 = HEAP8[cttz_i8 + (i1 >> 8 & 255) >> 0] | 0;
 if ((i2 | 0) < 8) return i2 + 8 | 0;
 i2 = HEAP8[cttz_i8 + (i1 >> 16 & 255) >> 0] | 0;
 if ((i2 | 0) < 8) return i2 + 16 | 0;
 return (HEAP8[cttz_i8 + (i1 >>> 24) >> 0] | 0) + 24 | 0;
}

function __ZNK10__cxxabiv117__class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 if ((i1 | 0) == (HEAP32[i2 + 8 >> 2] | 0)) __ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi(0, i2, i3, i4);
 return;
}

function ___uremdi3(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 var i5 = 0, i6 = 0;
 i5 = STACKTOP;
 STACKTOP = STACKTOP + 16 | 0;
 i6 = i5 | 0;
 ___udivmoddi4(i1, i2, i3, i4, i6) | 0;
 STACKTOP = i5;
 return (tempRet0 = HEAP32[i6 + 4 >> 2] | 0, HEAP32[i6 >> 2] | 0) | 0;
}

function ___muldi3(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 var i5 = 0, i6 = 0;
 i5 = i1;
 i1 = i3;
 i3 = ___muldsi3(i5, i1) | 0;
 i6 = tempRet0;
 return (tempRet0 = (Math_imul(i2, i1) | 0) + (Math_imul(i4, i5) | 0) + i6 | i6 & 0, i3 | 0 | 0) | 0;
}

function runPostSets() {}
function _i64Subtract(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 var i5 = 0;
 i5 = i2 - i4 >>> 0;
 i5 = i2 - i4 - (i3 >>> 0 > i1 >>> 0 | 0) >>> 0;
 return (tempRet0 = i5, i1 - i3 >>> 0 | 0) | 0;
}

function ___stdio_close(i1) {
 i1 = i1 | 0;
 var i2 = 0, i3 = 0;
 i2 = STACKTOP;
 STACKTOP = STACKTOP + 16 | 0;
 i3 = i2;
 HEAP32[i3 >> 2] = HEAP32[i1 + 60 >> 2];
 i1 = ___syscall_ret(___syscall6(6, i3 | 0) | 0) | 0;
 STACKTOP = i2;
 return i1 | 0;
}

function copyTempFloat(i1) {
 i1 = i1 | 0;
 HEAP8[tempDoublePtr >> 0] = HEAP8[i1 >> 0];
 HEAP8[tempDoublePtr + 1 >> 0] = HEAP8[i1 + 1 >> 0];
 HEAP8[tempDoublePtr + 2 >> 0] = HEAP8[i1 + 2 >> 0];
 HEAP8[tempDoublePtr + 3 >> 0] = HEAP8[i1 + 3 >> 0];
}

function _bitshift64Ashr(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 if ((i3 | 0) < 32) {
  tempRet0 = i2 >> i3;
  return i1 >>> i3 | (i2 & (1 << i3) - 1) << 32 - i3;
 }
 tempRet0 = (i2 | 0) < 0 ? -1 : 0;
 return i2 >> i3 - 32 | 0;
}

function dynCall_viiiiii(i1, i2, i3, i4, i5, i6, i7) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 i6 = i6 | 0;
 i7 = i7 | 0;
 FUNCTION_TABLE_viiiiii[i1 & 3](i2 | 0, i3 | 0, i4 | 0, i5 | 0, i6 | 0, i7 | 0);
}

function _printf(i1, i2) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 var i3 = 0, i4 = 0;
 i3 = STACKTOP;
 STACKTOP = STACKTOP + 16 | 0;
 i4 = i3;
 HEAP32[i4 >> 2] = i2;
 i2 = _vfprintf(HEAP32[59] | 0, i1, i4) | 0;
 STACKTOP = i3;
 return i2 | 0;
}

function _bitshift64Shl(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 if ((i3 | 0) < 32) {
  tempRet0 = i2 << i3 | (i1 & (1 << i3) - 1 << 32 - i3) >>> 32 - i3;
  return i1 << i3;
 }
 tempRet0 = i1 << i3 - 32;
 return 0;
}

function _bitshift64Lshr(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 if ((i3 | 0) < 32) {
  tempRet0 = i2 >>> i3;
  return i1 >>> i3 | (i2 & (1 << i3) - 1) << 32 - i3;
 }
 tempRet0 = 0;
 return i2 >>> i3 - 32 | 0;
}

function dynCall_viiiii(i1, i2, i3, i4, i5, i6) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 i6 = i6 | 0;
 FUNCTION_TABLE_viiiii[i1 & 3](i2 | 0, i3 | 0, i4 | 0, i5 | 0, i6 | 0);
}

function _i64Add(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 var i5 = 0;
 i5 = i1 + i3 >>> 0;
 return (tempRet0 = i2 + i4 + (i5 >>> 0 < i1 >>> 0 | 0) >>> 0, i5 | 0) | 0;
}

function ___syscall_ret(i1) {
 i1 = i1 | 0;
 var i2 = 0;
 if (i1 >>> 0 > 4294963200) {
  HEAP32[(___errno_location() | 0) >> 2] = 0 - i1;
  i2 = -1;
 } else i2 = i1;
 return i2 | 0;
}

function dynCall_viiii(i1, i2, i3, i4, i5) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 FUNCTION_TABLE_viiii[i1 & 3](i2 | 0, i3 | 0, i4 | 0, i5 | 0);
}

function dynCall_iiii(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 return FUNCTION_TABLE_iiii[i1 & 7](i2 | 0, i3 | 0, i4 | 0) | 0;
}

function ___errno_location() {
 var i1 = 0;
 if (!(HEAP32[48] | 0)) i1 = 244; else i1 = HEAP32[(_pthread_self() | 0) + 60 >> 2] | 0;
 return i1 | 0;
}
function stackAlloc(i1) {
 i1 = i1 | 0;
 var i2 = 0;
 i2 = STACKTOP;
 STACKTOP = STACKTOP + i1 | 0;
 STACKTOP = STACKTOP + 15 & -16;
 return i2 | 0;
}

function ___udivdi3(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 return ___udivmoddi4(i1, i2, i3, i4, 0) | 0;
}

function _wctomb(i1, i2) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 var i3 = 0;
 if (!i1) i3 = 0; else i3 = _wcrtomb(i1, i2, 0) | 0;
 return i3 | 0;
}

function b5(i1, i2, i3, i4, i5, i6) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 i6 = i6 | 0;
 abort(5);
}

function setThrew(i1, i2) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 if (!__THREW__) {
  __THREW__ = i1;
  threwValue = i2;
 }
}

function b1(i1, i2, i3, i4, i5) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 abort(1);
}

function __ZSt15get_new_handlerv() {
 var i1 = 0;
 i1 = HEAP32[27] | 0;
 HEAP32[27] = i1 + 0;
 return i1 | 0;
}

function dynCall_ii(i1, i2) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 return FUNCTION_TABLE_ii[i1 & 3](i2 | 0) | 0;
}

function _cleanup339(i1) {
 i1 = i1 | 0;
 if (!(HEAP32[i1 + 68 >> 2] | 0)) ___unlockfile(i1);
 return;
}

function establishStackSpace(i1, i2) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 STACKTOP = i1;
 STACK_MAX = i2;
}

function b6(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 abort(6);
}

function dynCall_vi(i1, i2) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 FUNCTION_TABLE_vi[i1 & 15](i2 | 0);
}

function __ZN10__cxxabiv120__si_class_type_infoD0Ev(i1) {
 i1 = i1 | 0;
 __ZdlPv(i1);
 return;
}

function __ZN10__cxxabiv117__class_type_infoD0Ev(i1) {
 i1 = i1 | 0;
 __ZdlPv(i1);
 return;
}

function b0(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 abort(0);
 return 0;
}

function __ZNK10__cxxabiv116__shim_type_info5noop2Ev(i1) {
 i1 = i1 | 0;
 return;
}

function __ZNK10__cxxabiv116__shim_type_info5noop1Ev(i1) {
 i1 = i1 | 0;
 return;
}

function _frexpl(d1, i2) {
 d1 = +d1;
 i2 = i2 | 0;
 return +(+_frexp(d1, i2));
}

function __ZN10__cxxabiv116__shim_type_infoD2Ev(i1) {
 i1 = i1 | 0;
 return;
}

function __ZNSt9bad_allocD0Ev(i1) {
 i1 = i1 | 0;
 __ZdlPv(i1);
 return;
}

function dynCall_v(i1) {
 i1 = i1 | 0;
 FUNCTION_TABLE_v[i1 & 0]();
}

function __ZNKSt9bad_alloc4whatEv(i1) {
 i1 = i1 | 0;
 return 1033;
}

function __Znaj(i1) {
 i1 = i1 | 0;
 return __Znwj(i1) | 0;
}

function __ZNSt9type_infoD2Ev(i1) {
 i1 = i1 | 0;
 return;
}

function __ZNSt9exceptionD2Ev(i1) {
 i1 = i1 | 0;
 return;
}

function __ZNSt9bad_allocD2Ev(i1) {
 i1 = i1 | 0;
 return;
}

function stackRestore(i1) {
 i1 = i1 | 0;
 STACKTOP = i1;
}

function __ZdlPv(i1) {
 i1 = i1 | 0;
 _free(i1);
 return;
}

function setTempRet0(i1) {
 i1 = i1 | 0;
 tempRet0 = i1;
}

function b3(i1) {
 i1 = i1 | 0;
 abort(3);
 return 0;
}

function ___unlockfile(i1) {
 i1 = i1 | 0;
 return;
}

function ___lockfile(i1) {
 i1 = i1 | 0;
 return 0;
}

function getTempRet0() {
 return tempRet0 | 0;
}

function stackSave() {
 return STACKTOP | 0;
}

function b2(i1) {
 i1 = i1 | 0;
 abort(2);
}

function b4() {
 abort(4);
}

// EMSCRIPTEN_END_FUNCS
var FUNCTION_TABLE_iiii = [b0,__ZNK10__cxxabiv117__class_type_info9can_catchEPKNS_16__shim_type_infoERPv,___stdout_write,___stdio_seek,___stdio_write,b0,b0,b0];
var FUNCTION_TABLE_viiiii = [b1,__ZNK10__cxxabiv117__class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib,__ZNK10__cxxabiv120__si_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib,b1];
var FUNCTION_TABLE_vi = [b2,__ZNSt9bad_allocD2Ev,__ZNSt9bad_allocD0Ev,__ZN10__cxxabiv116__shim_type_infoD2Ev,__ZN10__cxxabiv117__class_type_infoD0Ev,__ZNK10__cxxabiv116__shim_type_info5noop1Ev,__ZNK10__cxxabiv116__shim_type_info5noop2Ev,__ZN10__cxxabiv120__si_class_type_infoD0Ev,_cleanup339,b2,b2,b2,b2,b2,b2,b2];
var FUNCTION_TABLE_ii = [b3,__ZNKSt9bad_alloc4whatEv,___stdio_close,b3];
var FUNCTION_TABLE_v = [b4];
var FUNCTION_TABLE_viiiiii = [b5,__ZNK10__cxxabiv117__class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib,__ZNK10__cxxabiv120__si_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib,b5];
var FUNCTION_TABLE_viiii = [b6,__ZNK10__cxxabiv117__class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi,__ZNK10__cxxabiv120__si_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi,b6];

  return { _i64Subtract: _i64Subtract, _free: _free, _main: _main, _i64Add: _i64Add, _memset: _memset, _malloc: _malloc, _memcpy: _memcpy, _bitshift64Lshr: _bitshift64Lshr, _fflush: _fflush, ___errno_location: ___errno_location, _bitshift64Shl: _bitshift64Shl, runPostSets: runPostSets, stackAlloc: stackAlloc, stackSave: stackSave, stackRestore: stackRestore, establishStackSpace: establishStackSpace, setThrew: setThrew, setTempRet0: setTempRet0, getTempRet0: getTempRet0, dynCall_iiii: dynCall_iiii, dynCall_viiiii: dynCall_viiiii, dynCall_vi: dynCall_vi, dynCall_ii: dynCall_ii, dynCall_v: dynCall_v, dynCall_viiiiii: dynCall_viiiiii, dynCall_viiii: dynCall_viiii };
})
// EMSCRIPTEN_END_ASM
(Module.asmGlobalArg, Module.asmLibraryArg, buffer);
var _i64Subtract = Module["_i64Subtract"] = asm["_i64Subtract"];
var _free = Module["_free"] = asm["_free"];
var _main = Module["_main"] = asm["_main"];
var _i64Add = Module["_i64Add"] = asm["_i64Add"];
var _memset = Module["_memset"] = asm["_memset"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var _bitshift64Lshr = Module["_bitshift64Lshr"] = asm["_bitshift64Lshr"];
var _fflush = Module["_fflush"] = asm["_fflush"];
var ___errno_location = Module["___errno_location"] = asm["___errno_location"];
var _bitshift64Shl = Module["_bitshift64Shl"] = asm["_bitshift64Shl"];
var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
var dynCall_viiiii = Module["dynCall_viiiii"] = asm["dynCall_viiiii"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_viiiiii = Module["dynCall_viiiiii"] = asm["dynCall_viiiiii"];
var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];
Runtime.stackAlloc = asm["stackAlloc"];
Runtime.stackSave = asm["stackSave"];
Runtime.stackRestore = asm["stackRestore"];
Runtime.establishStackSpace = asm["establishStackSpace"];
Runtime.setTempRet0 = asm["setTempRet0"];
Runtime.getTempRet0 = asm["getTempRet0"];
if (memoryInitializer) {
 if (typeof Module["locateFile"] === "function") {
  memoryInitializer = Module["locateFile"](memoryInitializer);
 } else if (Module["memoryInitializerPrefixURL"]) {
  memoryInitializer = Module["memoryInitializerPrefixURL"] + memoryInitializer;
 }
 if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
  var data = Module["readBinary"](memoryInitializer);
  HEAPU8.set(data, Runtime.GLOBAL_BASE);
 } else {
  addRunDependency("memory initializer");
  var applyMemoryInitializer = (function(data) {
   if (data.byteLength) data = new Uint8Array(data);
   HEAPU8.set(data, Runtime.GLOBAL_BASE);
   removeRunDependency("memory initializer");
  });
  function doBrowserLoad() {
   Browser.asyncLoad(memoryInitializer, applyMemoryInitializer, (function() {
    throw "could not load memory initializer " + memoryInitializer;
   }));
  }
  var request = Module["memoryInitializerRequest"];
  if (request) {
   function useRequest() {
    if (request.status !== 200 && request.status !== 0) {
     console.warn("a problem seems to have happened with Module.memoryInitializerRequest, status: " + request.status + ", retrying " + memoryInitializer);
     doBrowserLoad();
     return;
    }
    applyMemoryInitializer(request.response);
   }
   if (request.response) {
    setTimeout(useRequest, 0);
   } else {
    request.addEventListener("load", useRequest);
   }
  } else {
   doBrowserLoad();
  }
 }
}
function ExitStatus(status) {
 this.name = "ExitStatus";
 this.message = "Program terminated with exit(" + status + ")";
 this.status = status;
}
ExitStatus.prototype = new Error;
ExitStatus.prototype.constructor = ExitStatus;
var initialStackTop;
var preloadStartTime = null;
var calledMain = false;
dependenciesFulfilled = function runCaller() {
 if (!Module["calledRun"]) run();
 if (!Module["calledRun"]) dependenciesFulfilled = runCaller;
};
Module["callMain"] = Module.callMain = function callMain(args) {
 assert(runDependencies == 0, "cannot call main when async dependencies remain! (listen on __ATMAIN__)");
 assert(__ATPRERUN__.length == 0, "cannot call main when preRun functions remain to be called");
 args = args || [];
 ensureInitRuntime();
 var argc = args.length + 1;
 function pad() {
  for (var i = 0; i < 4 - 1; i++) {
   argv.push(0);
  }
 }
 var argv = [ allocate(intArrayFromString(Module["thisProgram"]), "i8", ALLOC_NORMAL) ];
 pad();
 for (var i = 0; i < argc - 1; i = i + 1) {
  argv.push(allocate(intArrayFromString(args[i]), "i8", ALLOC_NORMAL));
  pad();
 }
 argv.push(0);
 argv = allocate(argv, "i32", ALLOC_NORMAL);
 try {
  var ret = Module["_main"](argc, argv, 0);
  exit(ret, true);
 } catch (e) {
  if (e instanceof ExitStatus) {
   return;
  } else if (e == "SimulateInfiniteLoop") {
   Module["noExitRuntime"] = true;
   return;
  } else {
   if (e && typeof e === "object" && e.stack) Module.printErr("exception thrown: " + [ e, e.stack ]);
   throw e;
  }
 } finally {
  calledMain = true;
 }
};
function run(args) {
 args = args || Module["arguments"];
 if (preloadStartTime === null) preloadStartTime = Date.now();
 if (runDependencies > 0) {
  return;
 }
 preRun();
 if (runDependencies > 0) return;
 if (Module["calledRun"]) return;
 function doRun() {
  if (Module["calledRun"]) return;
  Module["calledRun"] = true;
  if (ABORT) return;
  ensureInitRuntime();
  preMain();
  if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
  if (Module["_main"] && shouldRunNow) Module["callMain"](args);
  postRun();
 }
 if (Module["setStatus"]) {
  Module["setStatus"]("Running...");
  setTimeout((function() {
   setTimeout((function() {
    Module["setStatus"]("");
   }), 1);
   doRun();
  }), 1);
 } else {
  doRun();
 }
}
Module["run"] = Module.run = run;
function exit(status, implicit) {
 if (implicit && Module["noExitRuntime"]) {
  return;
 }
 if (Module["noExitRuntime"]) {} else {
  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;
  exitRuntime();
  if (Module["onExit"]) Module["onExit"](status);
 }
 if (ENVIRONMENT_IS_NODE) {
  process["stdout"]["once"]("drain", (function() {
   process["exit"](status);
  }));
  console.log(" ");
  setTimeout((function() {
   process["exit"](status);
  }), 500);
 } else if (ENVIRONMENT_IS_SHELL && typeof quit === "function") {
  quit(status);
 }
 throw new ExitStatus(status);
}
Module["exit"] = Module.exit = exit;
var abortDecorators = [];
function abort(what) {
 if (what !== undefined) {
  Module.print(what);
  Module.printErr(what);
  what = JSON.stringify(what);
 } else {
  what = "";
 }
 ABORT = true;
 EXITSTATUS = 1;
 var extra = "\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";
 var output = "abort(" + what + ") at " + stackTrace() + extra;
 if (abortDecorators) {
  abortDecorators.forEach((function(decorator) {
   output = decorator(output, what);
  }));
 }
 throw output;
}
Module["abort"] = Module.abort = abort;
if (Module["preInit"]) {
 if (typeof Module["preInit"] == "function") Module["preInit"] = [ Module["preInit"] ];
 while (Module["preInit"].length > 0) {
  Module["preInit"].pop()();
 }
}
var shouldRunNow = true;
if (Module["noInitialRun"]) {
 shouldRunNow = false;
}
run();



