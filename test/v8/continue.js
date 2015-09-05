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
  var ret = 0;
  while(a > 0) {
    a = (a-1)|0;
    if(a == 3) {
      continue;
    }
    ret = (ret + a)|0;
  }
  return ret|0;
}

function $x(a){
  a=a|0;
  var ret = 0;
  do {
    a = (a-1)|0;
    if(a == 3)
      continue;
    ret = (ret + a)|0;
  }while(a > 0)
  return ret|0;
}

function $y(a){
  a=a|0;
  var ret = 0;
  loop:
  while(a > 0) {
    a = (a-1)|0;
    if(a == 3)
      continue loop;
    ret = (ret + a)|0;
  }
  return ret|0;
}

function $z(a){
  a=a|0;
  var ret = 0;
  loop1:
  while(a > 0) {
    ret = 0;
    loop2:
    while(a >0) {
      a = (a-1)|0;
      if(a == 3)
        continue loop1;
      ret = (ret + a)|0;
    }
  }
  return ret|0;
}

function $aa(a){
  a=a|0;
  var ret = 0;
  loop1:
  while(a > 0) {
    ret = 0;
    loop2:
    while(a >0) {
      a = (a-1)|0;
      if(a == 3)
        continue loop2;
      ret = (ret + a)|0;
    }
  }
  return ret|0;
}

return {one:$w,two:$x,three:$y,four:$z,five:$aa};
}
