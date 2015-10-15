function asmModule($a,$b,$c){'use asm';
var a=new $a.Int8Array($c);
var b=new $a.Uint8Array($c);
var c=new $a.Int16Array($c);
var d=new $a.Uint16Array($c);
var e=new $a.Int32Array($c);
var f=new $a.Uint32Array($c);
var g=new $a.Float32Array($c);
var h=new $a.Float64Array($c);
var i=$a.Math.imul;
var j=$a.Math.fround;
var $d=$a.Math.acos;
var $e=$a.Math.asin;
var $f=$a.Math.atan;
var $g=$a.Math.cos;
var $h=$a.Math.sin;
var $i=$a.Math.tan;
var $j=$a.Math.exp;
var $k=$a.Math.log;
var $l=$a.Math.ceil;
var $m=$a.Math.floor;
var $n=$a.Math.sqrt;
var $o=$a.Math.abs;
var $p=$a.Math.min;
var $q=$a.Math.max;
var $r=$a.Math.atan2;
var $s=$a.Math.pow;
var $t=$a.Math.clz32;
var $u=$a.NaN;
var $v=$a.Infinity;
var $vi = 0;
var $vd = 0.;
function setI32(index, value){
  index=index|0;
  value=value|0;
  e[index>>2] = value;
}

function getI32(index){
  index=index|0;
  return e[index>>2]|0;
}

function setI8(index, value){
  index=index|0;
  value=value|0;
  a[index] = value;
}

function getI8(index){
  index=index|0;
  return a[index]|0;
}

function getUI8(index){
  index=index|0;
  return b[index]|0;
}

function setI16(index, value){
  index=index|0;
  value=value|0;
  c[index>>1] = value;
}

function getI16(index){
  index=index|0;
  return c[index>>1]|0;
}

function getUI16(index){
  index=index|0;
  return d[index>>1]|0;
}

function setF32(index, value){
  index=index|0;
  value=j(value);
  g[index>>2] = value;
}

function getF32(index){
  index=index|0;
  return +g[index>>2];
}

function setF64(index, value){
  index=index|0;
  value=+value;
  h[index>>3] = value;
}

function getF64(index){
  index=index|0;
  return +h[index>>3];
}

return {setI32:setI32, getI32:getI32,
        setI8 :setI8,  getI8 :getI8,
        setI16:setI16, getI16:getI16,
        getUI8:getUI8, getUI16:getUI16,
        setF32:setF32, getF32:getF32,
        setF64:setF64, getF64:getF64};
}
