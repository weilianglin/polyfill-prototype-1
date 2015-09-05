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
// Usigned
function $w(k,l){
k=k|0;
l=l|0;
return k>l|0
}
function $x(k,l){
k=k|0;
l=l|0;
return k<l|0;
}
function $y(k,l){
k=k|0;
l=l|0;
return k>=l|0;
}
function $z(k,l){
k=k|0;
l=l|0;
return k<=l|0;
}
function $aa(k,l){
k=k|0;
l=l|0;
return k==l|0;
}
function $ab(k,l){
k=k|0;
l=l|0;
return k!=l|0;
}

// Signed
function $ac(k,l){
k=k|0;
l=l|0;
return (k|0)>(l|0)|0
}
function $ad(k,l){
k=k|0;
l=l|0;
return (k|0)<(l|0)|0
}
function $ae(k,l){
k=k|0;
l=l|0;
return (k|0)>=(l|0)|0
}
function $af(k,l){
k=k|0;
l=l|0;
return (k|0)<=(l|0)|0
}
function $ag(k,l){
k=k|0;
l=l|0;
return (k|0)==(l|0)|0
}
function $ah(k,l){
k=k|0;
l=l|0;
return (k|0)!=(l|0)|0
}

// Double
function $ai(k,l){
k=+k;
l=+l;
return k>l|0
}
function $aj(k,l){
k=+k;
l=+l;
return k<l|0;
}
function $ak(k,l){
k=+k;
l=+l;
return k>=l|0;
}
function $al(k,l){
k=+k;
l=+l;
return k<=l|0;
}
function $am(k,l){
k=+k;
l=+l;
return k==l|0;
}
function $an(k,l){
k=+k;
l=+l;
return k!=l|0;
}

// Float
function $ao(k,l){
k=j(k);
l=j(l);
return k>l|0
}
function $ap(k,l){
k=j(k);
l=j(l);
return k<l|0;
}
function $aq(k,l){
k=j(k);
l=j(l);
return k>=l|0;
}
function $ar(k,l){
k=j(k);
l=j(l);
return k<=l|0;
}
function $as(k,l){
k=j(k);
l=j(l);
return k==l|0;
}
function $at(k,l){
k=j(k);
l=j(l);
return k!=l|0;
}

return {igt1:$w,ilt1:$x,ige1:$y,ile1:$z,ieq1:$aa,ine1:$ab, igt2:$ac,ilt2:$ad,ige2:$ae,ile2:$af,ieq2:$ag,ine2:$ah, dgt:$ai,dlt:$aj,dge:$ak,dle:$al,deq:$am,dne:$an, fgt:$ao,flt:$ap,fge:$aq,fle:$ar,feq:$as,fne:$at};
}
