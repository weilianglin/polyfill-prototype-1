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
  var la = 0.0;


  function ua() {
    var a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0;
    j = 0;
    k = 0;
    do {
      f = (j | 0) % 10 | 0;
      e = f + j | 0;
      a = (j | 0) % 255 | 0;
      g = (j | 0) % 15 | 0;
      c = ((j | 0) % 120 | 0 | 0) % 1024 | 0;
      d = ((j | 0) % 1024 | 0) + j | 0;
      e = ((e | 0) % 1024 | 0) + e | 0;
      g = ((g | 0) % 1024 | 0) + g | 0;
      a = (((a | 0) % 1024 | 0) + a + c | 0) % 1024 | 0;
      h = 0;
      do {
        p = h << 1;
        m = (h | 0) % 120 | 0;
        q = (p | 0) % 1024 | 0;
        r = (f + h | 0) % 1024 | 0;
        o = ((h | 0) % 255 | 0 | 0) % 1024 | 0;
        n = (h | 0) % 1024 | 0;
        l = ((h | 0) % 15 | 0 | 0) % 1024 | 0;
        k = (((r + q + o + c + n + l + ((d + r | 0) % 1024 | 0) + ((e + q | 0) % 1024 | 0) + ((q + p + o | 0) % 1024 | 0) + a + ((g + n | 0) % 1024 | 0) + ((((m | 0) % 1024 | 0) + m + l | 0) % 1024 | 0) | 0) % 100 | 0) + k | 0) % 10240 | 0;
        h = h + 1 | 0;
      } while ((h | 0) != 5e4);
      j = j + 1 | 0;
    } while ((j | 0) != 1250);
    return k | 0;
  }

  return {
    _main: ua,
  };
}
