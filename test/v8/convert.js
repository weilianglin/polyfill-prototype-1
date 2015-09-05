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

function uitod(a){
  a=a|0;
  return +(a>>>0);
}

function sitod(a){
  a=a|0;
  return +(a|0);
}

function ftod(a) {
  a=j(a);
  return +a;
}

function ftoi(a) {
  a=j(a);
  return ~~a|0;
}

function dtoi(a) {
  a=+a;
  return ~~a|0;
}

function uitof(a) {
  a=a|0;
  return j(a>>>0);
}

function sitof(a) {
  a=a|0;
  return j(a|0);
}

function dtof(a) {
  a=+a;
  return j(a);
}

return {uitod : uitod, sitod : sitod, ftod : ftod, ftoi : ftoi, dtoi : dtoi, uitof : uitof, sitof : sitof, dtof : dtof};
}
