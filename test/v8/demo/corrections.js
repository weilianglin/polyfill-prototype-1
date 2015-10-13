function asmModule(global,env,buffer) {

  "use asm";
  var a = new global.Int8Array(buffer);
  var b = new global.Int16Array(buffer);
  var c = new global.Int32Array(buffer);
  var d = new global.Uint8Array(buffer);
  var e = new global.Uint16Array(buffer);
  var f = new global.Uint32Array(buffer);
  var g = new global.Float32Array(buffer);
  var h = new global.Float64Array(buffer);
  var m = 0;
  var n = 0;
  var o = 0;
  var p = 0;
  var s = 0, t = 0, u = 0, v = 0, w = 0.0, x = 0, y = 0, z = 0, A = 0.0;
  var B = 0;
  var C = 0;
  var D = 0;
  var E = 0;
  var F = 0;
  var G = 0;
  var H = 0;
  var I = 0;
  var J = 0;
  var K = 0;
  var L = global.Math.floor;
  var M = global.Math.abs;
  var N = global.Math.sqrt;
  var O = global.Math.pow;
  var P = global.Math.cos;
  var Q = global.Math.sin;
  var R = global.Math.tan;
  var S = global.Math.acos;
  var T = global.Math.asin;
  var U = global.Math.atan;
  var V = global.Math.atan2;
  var W = global.Math.exp;
  var X = global.Math.log;
  var Y = global.Math.ceil;
  var Z = global.Math.imul;
  var va = 0.0;

  function ua() {
    var a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0, j = 0;
    h = 0;
    f = 0;
    d = 0;
    while (1) {
      c = ((d | 0) % 5 | 0) + 1 | 0;
      b = ((d | 0) % 3 | 0) + 1 | 0;
      e = 0;
      while (1) {
        h = ((e | 0) / (c | 0) | 0) + h | 0;
        if (h >>> 0 > 1e3) h = (h >>> 0) / (b >>> 0) | 0;
        if (!(e & 3)) h = h + (Z((e & 7 | 0) == 0 ? 1 : -1, e) | 0) | 0;
        j = h << 16 >> 16;
        j = (Z(j, j) | 0) & 255;
        g = j + (f & 65535) | 0;
        e = e + 1 | 0;
        if ((e | 0) == 2e4) break; else f = g;
      }
      d = d + 1 | 0;
      if ((d | 0) == 7e3) break; else f = g;
    }
    return (f + j & 65535) + h | 0;
  }

  return {
    _main: ua,
  };
}
