function PrintBuffer(buffer) {
  var view = new Uint8Array(buffer);
  for (var i = 0; i < view.length; i++) {
    print(view[i]);
  }
}

print("test name_access.wasm");
var module = WASM.instantiateModule(readbuffer("name_access.wasm"));

assertEquals(100, module.one(100));
assertEquals(3.1415926, module.two(3.1415926));
assertEqualsDelta(3.14, module.three(3.14), 0.001);
assertEquals(100, module.four());
assertEquals(100.1, module.five());
assertEquals(123, module.six());
assertEquals(1.23, module.seven());
assertEquals(123, module.eight());


print("test call.wasm");
var module = WASM.instantiateModule(readbuffer("call.wasm"));
assertEquals(100, module.one(100));


var ffi = new Object();
ffi.foo = function(k) {
  return k * 2;
}
ffi._sin = Math.sin;
ffi._cos = Math.cos;
print("test call_import.wasm");
var module = WASM.instantiateModule(readbuffer("call_import.wasm"), ffi);
assertEquals(200, module.one(100));
assertEquals(0.0015926529164868282, module.sin(3.14));
assertEquals(-0.9999987317275395, module.cos(3.14));


print("test if.wasm");
var module = WASM.instantiateModule(readbuffer("if.wasm"));
assertEquals(200, module.max(-100, 200));
assertEquals(200, module.max(200, -100));
assertEquals(-100, module.min(-100, 200));
assertEquals(-100, module.min(200, -100));

print("test while.wasm");
var module = WASM.instantiateModule(readbuffer("while.wasm"));
assertEquals(5050, module.sum(100));

print("test do.wasm");
var module = WASM.instantiateModule(readbuffer("do.wasm"));
assertEquals(5050, module.sum(100));

print("test literal.wasm");
var module = WASM.instantiateModule(readbuffer("literal.wasm"));
assertEquals(2147483647, module.max_int32());
assertEquals(3.1415926, module.pid());
assertEqualsDelta(3.14, module.pif(), 0.001);

print("test int32.wasm");
var module = WASM.instantiateModule(readbuffer("int32.wasm"));
assertEquals(105, module.add(100, 5));
assertEquals(95, module.sub(100, 5));
assertEquals(500, module.mul(100, 5));
assertEquals(20, module.udiv(100, 5));
assertEquals(-20, module.sdiv(100, -5));
assertEquals(2, module.umod(17,3));
assertEquals(-2, module.smod(-17,-3));
assertEquals(100, module.neg(-100));
assertEquals(0, module.neg(0));
assertEquals(100, module.abs(-100));
assertEquals(100, module.abs(100));
//assertEquals(29, module.clz(5));

print("test break.wasm");
var module = WASM.instantiateModule(readbuffer("break.wasm"));
assertEquals(3, module.one(100));
assertEquals(3, module.two(100));
assertEquals(3, module.three(100));
assertEquals(3, module.four(100));
assertEquals(0, module.five(100));

print("test continue.wasm");
var module = WASM.instantiateModule(readbuffer("continue.wasm"));
assertEquals(7, module.one(5));
assertEquals(7, module.two(5));
assertEquals(7, module.three(5));
assertEquals(3, module.four(5));
assertEquals(7, module.five(5));

print("IGNORE switch.wasm");
/*
print("test switch.wasm");
var module = WASM.instantiateModule(readbuffer("switch.wasm"));
assertEquals(5, module.one(5));
assertEquals(0, module.two(0));
assertEquals(1, module.two(1));
assertEquals(30, module.two(2));
assertEquals(30, module.two(3));
assertEquals(40, module.two(4));
assertEquals(50, module.two(5));
assertEquals(-1, module.two(-1));
*/

print("test compare.wasm");
var module = WASM.instantiateModule(readbuffer("compare.wasm"));
assertEquals(1, module.igt1(5,4));
assertEquals(1, module.ilt1(5,6));
assertEquals(1, module.ige1(5,4));
assertEquals(1, module.ige1(5,5));
assertEquals(1, module.ile1(5,6));
assertEquals(1, module.ile1(5,5));
assertEquals(1, module.ieq1(5,5));
assertEquals(1, module.ine1(5,6));

assertEquals(1, module.igt2(5,-4));
assertEquals(1, module.ilt2(-5,6));
assertEquals(1, module.ige2(-5,-6));
assertEquals(1, module.ige2(-5,-5));
assertEquals(1, module.ile2(-5,-4));
assertEquals(1, module.ile2(-5,-5));
assertEquals(1, module.ieq2(-5,-5));
assertEquals(1, module.ine2(5,-5));

assertEquals(1, module.dgt(5.1,-4.1));
assertEquals(1, module.dlt(-5.1,6.1));
assertEquals(1, module.dge(-5.1,-6.1));
assertEquals(1, module.dge(-5.1,-5.1));
assertEquals(1, module.dle(-5.1,-4.1));
assertEquals(1, module.dle(-5.1,-5.1));
assertEquals(1, module.deq(-5.1,-5.1));
assertEquals(1, module.dne(5.1,-5.1));

assertEquals(1, module.fgt(5.1,-4.1));
assertEquals(1, module.flt(-5.1,6.1));
assertEquals(1, module.fge(-5.1,-6.1));
assertEquals(1, module.fge(-5.1,-5.1));
assertEquals(1, module.fle(-5.1,-4.1));
assertEquals(1, module.fle(-5.1,-5.1));
assertEquals(1, module.feq(-5.1,-5.1));
assertEquals(1, module.fne(5.1,-5.1));

print("test comma.wasm");
var module = WASM.instantiateModule(readbuffer("comma.wasm"));
assertEquals(200, module.one(100, 200));
assertEquals(2.2, module.two(1.1, 2.2));
assertEqualsDelta(2.2, module.three(1.1, 2.2), 0.00001);
assertEquals(106, module.four(100, 200));

print("test float64.wasm");
var module = WASM.instantiateModule(readbuffer("float64.wasm"));
assertEquals(-1.1, module.neg(1.1));
assertEqualsDelta(3.3, module.add(2.2, 1.1), 0.00001);
assertEqualsDelta(1.1, module.sub(2.2, 1.1), 0.00001);
assertEqualsDelta(2.42, module.mul(2.2, 1.1), 0.00001);
assertEqualsDelta(2, module.div(2.2, 1.1), 0.00001);
// assertEquals(1.1, module.min(2.2, 1.1));
// assertEquals(2.2, module.max(2.2, 1.1));
assertEquals(2.2, module.abs(-2.2));
// assertEquals(3, module.ceil(2.2));
// assertEquals(2, module.floor(2.2));
assertEqualsDelta(1.414213, module.sqrt(2), 0.00001);

print("test float32.wasm");
var module = WASM.instantiateModule(readbuffer("float32.wasm"));
assertEqualsDelta(-1.1, module.neg(1.1), 0.00001);
assertEqualsDelta(3.3, module.add(2.2, 1.1), 0.00001);
assertEqualsDelta(1.1, module.sub(2.2, 1.1), 0.00001);
assertEqualsDelta(2.42, module.mul(2.2, 1.1), 0.00001);
assertEqualsDelta(2, module.div(2.2, 1.1), 0.00001);
assertEqualsDelta(2.2, module.abs(-2.2), 0.00001);
// assertEquals(3, module.ceil(2.2));
// assertEquals(2, module.floor(2.2));
assertEqualsDelta(1.414213, module.sqrt(2), 0.00001);

print("test bitwise.wasm");
var module = WASM.instantiateModule(readbuffer("bitwise.wasm"));
assertEquals(11, module.bitor(11,8));
assertEquals(8, module.bitand(11,8));
assertEquals(3, module.bitxor(11,8));
assertEquals(44, module.shl(11,2));
assertEquals(2, module.shr(11,2));
assertEquals(-3, module.sar(-11,2));
assertEquals(5, module.bitnot(-6));

print("test ternary.wasm");
var module = WASM.instantiateModule(readbuffer("ternary.wasm"));
assertEquals(20, module.one(0,10,20));
assertEquals(10, module.one(77,10,20));
assertEquals(3.3, module.two(0,2.2,3.3));
assertEqualsDelta(2.2, module.three(77,2.2,3.3), 0.00001);

print("test not.wasm");
var module = WASM.instantiateModule(readbuffer("not.wasm"));
assertEquals(0, module.one(100));
assertEquals(1, module.one(0));

print("test convert.wasm");
var module = WASM.instantiateModule(readbuffer("convert.wasm"));
assertEquals(0xffffffff, module.uitod(0xffffffff));
assertEquals(-123, module.sitod(-123));
assertEqualsDelta(3.14, module.ftod(3.14), 0.00001);
assertEquals(-123, module.ftoi(-123.1));
assertEquals(123, module.dtoi(123.1));
//assertEquals(0xffffffff, module.uitof(0xffffffff));
assertEquals(123, module.uitof(123));
assertEquals(-123, module.sitof(-123));
assertEqualsDelta(3.14, module.dtof(3.14), 0.00001);

print("test load-store.wasm");
var module = WASM.instantiateModule(readbuffer("load-store.wasm"));
module.setI32(4, 4294967296);
assertEquals(0, module.getI32(4));
module.setI32(8, 4294967295);
assertEquals(-1, module.getI32(8));
module.setI32(12, 2147483647);
assertEquals(2147483647, module.getI32(12));

module.setI8(0, 256);
assertEquals(0, module.getI8(0));
module.setI8(1, 255);
assertEquals(-1, module.getI8(1));
assertEquals(255, module.getUI8(1));
module.setI8(2, 127);
assertEquals(127, module.getI8(2));
module.setI8(3, 128);
assertEquals(-128, module.getI8(3));
assertEquals(128, module.getUI8(3));

module.setI16(0, 65536);
assertEquals(0, module.getI16(0));
module.setI16(2, 65535);
assertEquals(-1, module.getI16(2));
assertEquals(65535, module.getUI16(2));
module.setI16(4, 32767);
assertEquals(32767, module.getI16(4));
module.setI16(6, 32768);
assertEquals(-32768, module.getI16(6));
assertEquals(32768, module.getUI16(6));

module.setF32(0, 3.14);
assertEqualsDelta(3.14, module.getF32(0), 0.00001);

module.setF64(0, 3.1415926);
assertEquals(3.1415926, module.getF64(0));

print("test call_indirect.wasm");
var module = WASM.instantiateModule(readbuffer("call_indirect.wasm"));
assertEquals(120, module.call(0, 100, 20));
assertEquals(80, module.call(1, 100, 20));
assertEquals(2000, module.call(2, 100, 20));
assertEquals(5, module.call(3, 100, 20));
