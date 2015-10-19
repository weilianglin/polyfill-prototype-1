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
function $add(k,l){
k=k|0;
l=l|0;
return k+l|0;
}
function $sub(k,l){
k=k|0;
l=l|0;
return k-l|0;
}
function $mul(k,l){
k=k|0;
l=l|0;
return k*l|0;
}
function $udiv(k,l){
k=k|0;
l=l|0;
return k/l|0;
}
function $sdiv(k,l){
k=k|0;
l=l|0;
return (k|0)/(l|0)|0;
}
function $umod(k,l){
k=k|0;
l=l|0;
return k%l|0;
}
function $smod(k,l){
k=k|0;
l=l|0;
return (k|0)%(l|0)|0;
}
function $neg(k){
k=k|0;
return -k|0;
}
function $abs(k){
k=k|0;
return $o(k|0)|0;
}
/*function $clz(k){
k=k|0;
return $t(k)|0;
}*/

return {add:$add,sub:$sub,mul:$mul,udiv:$udiv,sdiv:$sdiv,umod:$umod,smod:$smod,neg:$neg,abs:$abs/*,clz:$clz*/};
}
