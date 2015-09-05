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
function $w(k){
k=k|0;
return k;
}
function $x(l){
l=+l;
return l;
}
function $y(m){
m=j(m);
return m;
}
function $z() {
var a=0;
a=100;
return a|0;
}
function $aa() {
var a=0.;
a=100.1;
return +a;
}
function $ab() {
$vi = 123;
return $vi|0;
}
function $ac() {
$vd = 1.23;
return +$vd;
}
return {one:$w,two:$x,three:$y,four:$z,five:$aa,six:$ab,seven:$ac};
}
