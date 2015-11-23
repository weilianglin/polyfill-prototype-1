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
function setI32Off(index, value){
  index=index|0;
  value=value|0;
  e[index+10000>>2] = value;
}

function getI32Off(index){
  index=index|0;
  return e[index+10000>>2]|0;
}

function setI8Off(index, value){
  index=index|0;
  value=value|0;
  a[index+10000] = value;
}

function getI8Off(index){
  index=index|0;
  return a[index+10000]|0;
}

function getUI8Off(index){
  index=index|0;
  return b[index+10000]|0;
}

function setI16Off(index, value){
  index=index|0;
  value=value|0;
  c[index+10000>>1] = value;
}

function getI16Off(index){
  index=index|0;
  return c[index+10000>>1]|0;
}

function getUI16Off(index){
  index=index|0;
  return d[index+10000>>1]|0;
}

function setF32Off(index, value){
  index=index|0;
  value=j(value);
  g[index+10000>>2] = value;
}

function getF32Off(index){
  index=index|0;
  return +g[index+10000>>2];
}

function setF64Off(index, value){
  index=index|0;
  value=+value;
  h[index+10000>>3] = value;
}

function getF64Off(index){
  index=index|0;
  return +h[index+10000>>3];
}

return {setI32Off:setI32Off, getI32Off :getI32Off,
        setI8Off :setI8Off,  getI8Off  :getI8Off,
        setI16Off:setI16Off, getI16Off :getI16Off,
        getUI8Off:getUI8Off, getUI16Off:getUI16Off,
        setF32Off:setF32Off, getF32Off :getF32Off,
        setF64Off:setF64Off, getF64Off :getF64Off};
}
