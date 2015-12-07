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

function neg(a){
  a=+a;
  return -a;
}

function add(a, b){
  a=+a;
  b=+b;
  return +(a+b);
}

function sub(a, b){
  a=+a;
  b=+b;
  return +(a-b);
}

function mul(a, b){
  a=+a;
  b=+b;
  return +(a*b);
}

function div(a, b){
  a=+a;
  b=+b;
  return +(a/b);
}

function min(a, b){
  a=+a;
  b=+b;
  return +$p(a, b);
}

function min_unary(a){
  a=+a;
  return +$p(a);
}

function min_nary(a, b, c, d, e){
  a=+a;
  b=+b;
  c=+c;
  d=+d;
  e=+e;
  return +$p(a, b, c, d, e);
}

function max(a, b){
  a=+a;
  b=+b;
  return +$q(a, b);
}

function max_unary(a){
  a=+a;
  return +$q(a);
}

function max_nary(a, b, c, d, e){
  a=+a;
  b=+b;
  c=+c;
  d=+d;
  e=+e;
  return +$q(a, b, c, d, e);
}

function abs(a){
  a=+a;
  return +$o(a);
}

function ceil(a){
  a=+a;
  return +$l(a);
}

function floor(a){
  a=+a;
  return +$m(a);
}

function sqrt(a){
  a=+a;
  return +$n(a);
}

return {neg:neg, add:add, sub:sub, mul:mul, div:div, min:min, min_unary:min_unary, min_nary:min_nary, max:max, max_unary:max_unary, max_nary:max_nary, abs:abs, ceil:ceil, floor:floor, sqrt:sqrt};
}
