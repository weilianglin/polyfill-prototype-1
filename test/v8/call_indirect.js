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
function iadd(x, y){
x=x|0;
y=y|0;
return (x+y)|0;
}
function isub(x, y){
x=x|0;
y=y|0;
return (x-y)|0;
}
function imul(x, y){
x=x|0;
y=y|0;
return (x*y)|0;
}
function idiv(x, y){
x=x|0;
y=y|0;
return (x/y)|0;
}

function call(index, x, y) {
index=index|0;
x=x|0;
y=y|0;
if (index == 0) return ft1[index&1](x, y)|0;
if (index == 1) return ft1[index&1](x, y)|0;
if (index == 2) return ft2[(index%2)&1](x, y)|0;
if (index == 3) return ft2[(index%2)&1](x, y)|0;
return -1;
}

var ft1=[iadd, isub];
var ft2=[imul, idiv];
return {call:call};
}
