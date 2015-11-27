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

function $w(a){
  a=a|0;
  switch(a) {
  }
  return a|0;
}

function $x(a){
  a=a|0;
  switch(a) {
  case 0:
  case 1:
    break;
  case 2:
    a = 20;
  case 3:
    a = 30;
    break;
  case 4:
    {
      a = 40;
      break;
    }
  case 5:
    {
      a= 50;
    }
  }
  return a|0;
}

function $y(a){
  a=a|0;
  switch(a) {
  case 3:
  case 10:
    a = 30;
    break;
  case 1:
    break;
  default:
    a = 100;
  }
  return a|0;
}

function $z(a){
  a=a|0;
  switch(a) {
  case 3:
  case 10:
    a = 30;
    break;
  case 50:
  }
  return a|0;
}

function $aa(a){
  a=a|0;
  switch(a) {
  case 3:
  case 10:
    a = 30;
    break;
  default: {}
  }
  return a|0;
}
return {one:$w,two:$x,three:$y,four:$z,five:$aa};
}
