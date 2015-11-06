// EMSCRIPTEN_START_ASM

function asmModule(global,env,buffer) {

  'use asm';

  var HEAP8 = new global.Int8Array(buffer);
  var HEAP16 = new global.Int16Array(buffer);
  var HEAP32 = new global.Int32Array(buffer);
  var HEAPU8 = new global.Uint8Array(buffer);
  var HEAPU16 = new global.Uint16Array(buffer);
  var HEAPU32 = new global.Uint32Array(buffer);
  var HEAPF32 = new global.Float32Array(buffer);
  var HEAPF64 = new global.Float64Array(buffer);


  var STACKTOP=env.STACKTOP|0;
  var STACK_MAX=env.STACK_MAX|0;
  var tempDoublePtr=env.tempDoublePtr|0;
  var ABORT=env.ABORT|0;

  var __THREW__ = 0;
  var threwValue = 0;
  var setjmpId = 0;
  var undef = 0;
  var nan = +env.NaN, inf = +env.Infinity;
  var tempInt = 0, tempBigInt = 0, tempBigIntP = 0, tempBigIntS = 0, tempBigIntR = 0.0, tempBigIntI = 0, tempBigIntD = 0, tempValue = 0, tempDouble = 0.0;

  var tempRet0 = 0;
  var tempRet1 = 0;
  var tempRet2 = 0;
  var tempRet3 = 0;
  var tempRet4 = 0;
  var tempRet5 = 0;
  var tempRet6 = 0;
  var tempRet7 = 0;
  var tempRet8 = 0;
  var tempRet9 = 0;
  var Math_floor=global.Math.floor;
  var Math_abs=global.Math.abs;
  var Math_sqrt=global.Math.sqrt;
  var Math_pow=global.Math.pow;
  var Math_cos=global.Math.cos;
  var Math_sin=global.Math.sin;
  var Math_tan=global.Math.tan;
  var Math_acos=global.Math.acos;
  var Math_asin=global.Math.asin;
  var Math_atan=global.Math.atan;
  var Math_atan2=global.Math.atan2;
  var Math_exp=global.Math.exp;
  var Math_log=global.Math.log;
  var Math_ceil=global.Math.ceil;
  var Math_imul=global.Math.imul;
  var abort=env.abort;
  var assert=env.assert;
  var Math_min=env.min;
  var invoke_iiii=env.invoke_iiii;
  var invoke_viiiii=env.invoke_viiiii;
  var invoke_vi=env.invoke_vi;
  var invoke_ii=env.invoke_ii;
  var invoke_v=env.invoke_v;
  var invoke_viiiiii=env.invoke_viiiiii;
  var invoke_viiii=env.invoke_viiii;
  var _send=env._send;
  var _emscripten_set_main_loop_timing=env._emscripten_set_main_loop_timing;
  var ___cxa_allocate_exception=env.___cxa_allocate_exception;
  var __ZSt18uncaught_exceptionv=env.__ZSt18uncaught_exceptionv;
  var _fflush=env._fflush;
  var _pwrite=env._pwrite;
  var ___setErrNo=env.___setErrNo;
  var _sbrk=env._sbrk;
  var _emscripten_memcpy_big=env._emscripten_memcpy_big;
  var _fileno=env._fileno;
  var ___resumeException=env.___resumeException;
  var ___cxa_find_matching_catch=env.___cxa_find_matching_catch;
  var _sysconf=env._sysconf;
  var _printf=env._printf;
  var __reallyNegative=env.__reallyNegative;
  var _write=env._write;
  var _emscripten_set_main_loop=env._emscripten_set_main_loop;
  var ___errno_location=env.___errno_location;
  var _mkport=env._mkport;
  var ___cxa_throw=env.___cxa_throw;
  var _abort=env._abort;
  var _fwrite=env._fwrite;
  var _time=env._time;
  var _fprintf=env._fprintf;
  var _gettimeofday=env._gettimeofday;
  var __formatString=env.__formatString;
  var tempFloat = 0.0;

  var getSTACKTOP = env.getSTACKTOP;
  var getSTACK_MAX = env.getSTACK_MAX;
  var getTempDoublePtr = env.getTempDoublePtr;
  var getABORT = env.getABORT;

// EMSCRIPTEN_START_FUNCS
function _env_init() {
  STACKTOP = getSTACKTOP()|0;
  STACK_MAX=getSTACK_MAX()|0;
  tempDoublePtr=getTempDoublePtr()|0;
  ABORT=getABORT()|0;
}
function _malloc(i1) {
 i1 = i1 | 0;
 var i2 = 0, i3 = 0, i4 = 0, i5 = 0, i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0, i13 = 0, i14 = 0, i15 = 0, i16 = 0, i17 = 0, i18 = 0, i19 = 0, i20 = 0, i21 = 0, i22 = 0, i23 = 0, i24 = 0, i25 = 0, i26 = 0, i27 = 0, i28 = 0, i29 = 0, i30 = 0, i31 = 0, i32 = 0, i33 = 0, i34 = 0, i35 = 0, i36 = 0, i37 = 0, i38 = 0, i39 = 0, i40 = 0, i41 = 0, i42 = 0, i43 = 0, i44 = 0, i45 = 0, i46 = 0, i47 = 0, i48 = 0, i49 = 0, i50 = 0, i51 = 0, i52 = 0, i53 = 0, i54 = 0, i55 = 0, i56 = 0, i57 = 0, i58 = 0, i59 = 0, i60 = 0, i61 = 0, i62 = 0, i63 = 0, i64 = 0, i65 = 0, i66 = 0, i67 = 0, i68 = 0, i69 = 0, i70 = 0, i71 = 0, i72 = 0, i73 = 0, i74 = 0, i75 = 0, i76 = 0, i77 = 0, i78 = 0, i79 = 0, i80 = 0, i81 = 0, i82 = 0, i83 = 0, i84 = 0, i85 = 0, i86 = 0, i87 = 0, i88 = 0, i89 = 0, i90 = 0;
 i2 = STACKTOP;
 do if (i1 >>> 0 < 245) {
  if (i1 >>> 0 < 11) i3 = 16; else i3 = i1 + 11 & -8;
  i4 = i3 >>> 3;
  i5 = HEAP32[260] | 0;
  i6 = i5 >>> i4;
  if (i6 & 3) {
   i7 = (i6 & 1 ^ 1) + i4 | 0;
   i8 = i7 << 1;
   i9 = 1080 + (i8 << 2) | 0;
   i10 = 1080 + (i8 + 2 << 2) | 0;
   i8 = HEAP32[i10 >> 2] | 0;
   i11 = i8 + 8 | 0;
   i12 = HEAP32[i11 >> 2] | 0;
   do if ((i9 | 0) != (i12 | 0)) {
    if (i12 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort();
    i13 = i12 + 12 | 0;
    if ((HEAP32[i13 >> 2] | 0) == (i8 | 0)) {
     HEAP32[i13 >> 2] = i9;
     HEAP32[i10 >> 2] = i12;
     break;
    } else _abort();
   } else HEAP32[260] = i5 & ~(1 << i7); while (0);
   i12 = i7 << 3;
   HEAP32[i8 + 4 >> 2] = i12 | 3;
   i10 = i8 + (i12 | 4) | 0;
   HEAP32[i10 >> 2] = HEAP32[i10 >> 2] | 1;
   i14 = i11;
   STACKTOP = i2;
   return i14 | 0;
  }
  i10 = HEAP32[262] | 0;
  if (i3 >>> 0 > i10 >>> 0) {
   if (i6) {
    i12 = 2 << i4;
    i9 = i6 << i4 & (i12 | 0 - i12);
    i12 = (i9 & 0 - i9) + -1 | 0;
    i9 = i12 >>> 12 & 16;
    i13 = i12 >>> i9;
    i12 = i13 >>> 5 & 8;
    i15 = i13 >>> i12;
    i13 = i15 >>> 2 & 4;
    i16 = i15 >>> i13;
    i15 = i16 >>> 1 & 2;
    i17 = i16 >>> i15;
    i16 = i17 >>> 1 & 1;
    i18 = (i12 | i9 | i13 | i15 | i16) + (i17 >>> i16) | 0;
    i16 = i18 << 1;
    i17 = 1080 + (i16 << 2) | 0;
    i15 = 1080 + (i16 + 2 << 2) | 0;
    i16 = HEAP32[i15 >> 2] | 0;
    i13 = i16 + 8 | 0;
    i9 = HEAP32[i13 >> 2] | 0;
    do if ((i17 | 0) != (i9 | 0)) {
     if (i9 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort();
     i12 = i9 + 12 | 0;
     if ((HEAP32[i12 >> 2] | 0) == (i16 | 0)) {
      HEAP32[i12 >> 2] = i17;
      HEAP32[i15 >> 2] = i9;
      i19 = HEAP32[262] | 0;
      break;
     } else _abort();
    } else {
     HEAP32[260] = i5 & ~(1 << i18);
     i19 = i10;
    } while (0);
    i10 = i18 << 3;
    i5 = i10 - i3 | 0;
    HEAP32[i16 + 4 >> 2] = i3 | 3;
    i9 = i16 + i3 | 0;
    HEAP32[i16 + (i3 | 4) >> 2] = i5 | 1;
    HEAP32[i16 + i10 >> 2] = i5;
    if (i19) {
     i10 = HEAP32[265] | 0;
     i15 = i19 >>> 3;
     i17 = i15 << 1;
     i4 = 1080 + (i17 << 2) | 0;
     i6 = HEAP32[260] | 0;
     i11 = 1 << i15;
     if (i6 & i11) {
      i15 = 1080 + (i17 + 2 << 2) | 0;
      i8 = HEAP32[i15 >> 2] | 0;
      if (i8 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort(); else {
       i20 = i15;
       i21 = i8;
      }
     } else {
      HEAP32[260] = i6 | i11;
      i20 = 1080 + (i17 + 2 << 2) | 0;
      i21 = i4;
     }
     HEAP32[i20 >> 2] = i10;
     HEAP32[i21 + 12 >> 2] = i10;
     HEAP32[i10 + 8 >> 2] = i21;
     HEAP32[i10 + 12 >> 2] = i4;
    }
    HEAP32[262] = i5;
    HEAP32[265] = i9;
    i14 = i13;
    STACKTOP = i2;
    return i14 | 0;
   }
   i9 = HEAP32[261] | 0;
   if (i9) {
    i5 = (i9 & 0 - i9) + -1 | 0;
    i9 = i5 >>> 12 & 16;
    i4 = i5 >>> i9;
    i5 = i4 >>> 5 & 8;
    i10 = i4 >>> i5;
    i4 = i10 >>> 2 & 4;
    i17 = i10 >>> i4;
    i10 = i17 >>> 1 & 2;
    i11 = i17 >>> i10;
    i17 = i11 >>> 1 & 1;
    i6 = HEAP32[1344 + ((i5 | i9 | i4 | i10 | i17) + (i11 >>> i17) << 2) >> 2] | 0;
    i17 = (HEAP32[i6 + 4 >> 2] & -8) - i3 | 0;
    i11 = i6;
    i10 = i6;
    while (1) {
     i6 = HEAP32[i11 + 16 >> 2] | 0;
     if (!i6) {
      i4 = HEAP32[i11 + 20 >> 2] | 0;
      if (!i4) break; else i22 = i4;
     } else i22 = i6;
     i6 = (HEAP32[i22 + 4 >> 2] & -8) - i3 | 0;
     i4 = i6 >>> 0 < i17 >>> 0;
     i17 = i4 ? i6 : i17;
     i11 = i22;
     i10 = i4 ? i22 : i10;
    }
    i11 = HEAP32[264] | 0;
    if (i10 >>> 0 < i11 >>> 0) _abort();
    i13 = i10 + i3 | 0;
    if (i10 >>> 0 >= i13 >>> 0) _abort();
    i16 = HEAP32[i10 + 24 >> 2] | 0;
    i18 = HEAP32[i10 + 12 >> 2] | 0;
    do if ((i18 | 0) == (i10 | 0)) {
     i4 = i10 + 20 | 0;
     i6 = HEAP32[i4 >> 2] | 0;
     if (!i6) {
      i9 = i10 + 16 | 0;
      i5 = HEAP32[i9 >> 2] | 0;
      if (!i5) {
       i23 = 0;
       break;
      } else {
       i24 = i5;
       i25 = i9;
      }
     } else {
      i24 = i6;
      i25 = i4;
     }
     while (1) {
      i4 = i24 + 20 | 0;
      i6 = HEAP32[i4 >> 2] | 0;
      if (i6) {
       i24 = i6;
       i25 = i4;
       continue;
      }
      i4 = i24 + 16 | 0;
      i6 = HEAP32[i4 >> 2] | 0;
      if (!i6) break; else {
       i24 = i6;
       i25 = i4;
      }
     }
     if (i25 >>> 0 < i11 >>> 0) _abort(); else {
      HEAP32[i25 >> 2] = 0;
      i23 = i24;
      break;
     }
    } else {
     i4 = HEAP32[i10 + 8 >> 2] | 0;
     if (i4 >>> 0 < i11 >>> 0) _abort();
     i6 = i4 + 12 | 0;
     if ((HEAP32[i6 >> 2] | 0) != (i10 | 0)) _abort();
     i9 = i18 + 8 | 0;
     if ((HEAP32[i9 >> 2] | 0) == (i10 | 0)) {
      HEAP32[i6 >> 2] = i18;
      HEAP32[i9 >> 2] = i4;
      i23 = i18;
      break;
     } else _abort();
    } while (0);
    do if (i16) {
     i18 = HEAP32[i10 + 28 >> 2] | 0;
     i11 = 1344 + (i18 << 2) | 0;
     if ((i10 | 0) == (HEAP32[i11 >> 2] | 0)) {
      HEAP32[i11 >> 2] = i23;
      if (!i23) {
       HEAP32[261] = HEAP32[261] & ~(1 << i18);
       break;
      }
     } else {
      if (i16 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort();
      i18 = i16 + 16 | 0;
      if ((HEAP32[i18 >> 2] | 0) == (i10 | 0)) HEAP32[i18 >> 2] = i23; else HEAP32[i16 + 20 >> 2] = i23;
      if (!i23) break;
     }
     i18 = HEAP32[264] | 0;
     if (i23 >>> 0 < i18 >>> 0) _abort();
     HEAP32[i23 + 24 >> 2] = i16;
     i11 = HEAP32[i10 + 16 >> 2] | 0;
     do if (i11) if (i11 >>> 0 < i18 >>> 0) _abort(); else {
      HEAP32[i23 + 16 >> 2] = i11;
      HEAP32[i11 + 24 >> 2] = i23;
      break;
     } while (0);
     i11 = HEAP32[i10 + 20 >> 2] | 0;
     if (i11) if (i11 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort(); else {
      HEAP32[i23 + 20 >> 2] = i11;
      HEAP32[i11 + 24 >> 2] = i23;
      break;
     }
    } while (0);
    if (i17 >>> 0 < 16) {
     i16 = i17 + i3 | 0;
     HEAP32[i10 + 4 >> 2] = i16 | 3;
     i11 = i10 + (i16 + 4) | 0;
     HEAP32[i11 >> 2] = HEAP32[i11 >> 2] | 1;
    } else {
     HEAP32[i10 + 4 >> 2] = i3 | 3;
     HEAP32[i10 + (i3 | 4) >> 2] = i17 | 1;
     HEAP32[i10 + (i17 + i3) >> 2] = i17;
     i11 = HEAP32[262] | 0;
     if (i11) {
      i16 = HEAP32[265] | 0;
      i18 = i11 >>> 3;
      i11 = i18 << 1;
      i4 = 1080 + (i11 << 2) | 0;
      i9 = HEAP32[260] | 0;
      i6 = 1 << i18;
      if (i9 & i6) {
       i18 = 1080 + (i11 + 2 << 2) | 0;
       i5 = HEAP32[i18 >> 2] | 0;
       if (i5 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort(); else {
        i26 = i18;
        i27 = i5;
       }
      } else {
       HEAP32[260] = i9 | i6;
       i26 = 1080 + (i11 + 2 << 2) | 0;
       i27 = i4;
      }
      HEAP32[i26 >> 2] = i16;
      HEAP32[i27 + 12 >> 2] = i16;
      HEAP32[i16 + 8 >> 2] = i27;
      HEAP32[i16 + 12 >> 2] = i4;
     }
     HEAP32[262] = i17;
     HEAP32[265] = i13;
    }
    i14 = i10 + 8 | 0;
    STACKTOP = i2;
    return i14 | 0;
   } else i28 = i3;
  } else i28 = i3;
 } else if (i1 >>> 0 <= 4294967231) {
  i4 = i1 + 11 | 0;
  i16 = i4 & -8;
  i11 = HEAP32[261] | 0;
  if (i11) {
   i6 = 0 - i16 | 0;
   i9 = i4 >>> 8;
   if (i9) if (i16 >>> 0 > 16777215) i29 = 31; else {
    i4 = (i9 + 1048320 | 0) >>> 16 & 8;
    i5 = i9 << i4;
    i9 = (i5 + 520192 | 0) >>> 16 & 4;
    i18 = i5 << i9;
    i5 = (i18 + 245760 | 0) >>> 16 & 2;
    i8 = 14 - (i9 | i4 | i5) + (i18 << i5 >>> 15) | 0;
    i29 = i16 >>> (i8 + 7 | 0) & 1 | i8 << 1;
   } else i29 = 0;
   i8 = HEAP32[1344 + (i29 << 2) >> 2] | 0;
   L126 : do if (!i8) {
    i30 = i6;
    i31 = 0;
    i32 = 0;
   } else {
    if ((i29 | 0) == 31) i33 = 0; else i33 = 25 - (i29 >>> 1) | 0;
    i5 = i6;
    i18 = 0;
    i4 = i16 << i33;
    i9 = i8;
    i15 = 0;
    while (1) {
     i7 = HEAP32[i9 + 4 >> 2] & -8;
     i12 = i7 - i16 | 0;
     if (i12 >>> 0 < i5 >>> 0) if ((i7 | 0) == (i16 | 0)) {
      i30 = i12;
      i31 = i9;
      i32 = i9;
      break L126;
     } else {
      i34 = i12;
      i35 = i9;
     } else {
      i34 = i5;
      i35 = i15;
     }
     i12 = HEAP32[i9 + 20 >> 2] | 0;
     i9 = HEAP32[i9 + (i4 >>> 31 << 2) + 16 >> 2] | 0;
     i7 = (i12 | 0) == 0 | (i12 | 0) == (i9 | 0) ? i18 : i12;
     if (!i9) {
      i30 = i34;
      i31 = i7;
      i32 = i35;
      break;
     } else {
      i5 = i34;
      i18 = i7;
      i4 = i4 << 1;
      i15 = i35;
     }
    }
   } while (0);
   if ((i31 | 0) == 0 & (i32 | 0) == 0) {
    i8 = 2 << i29;
    i6 = i11 & (i8 | 0 - i8);
    if (!i6) {
     i28 = i16;
     break;
    }
    i8 = (i6 & 0 - i6) + -1 | 0;
    i6 = i8 >>> 12 & 16;
    i10 = i8 >>> i6;
    i8 = i10 >>> 5 & 8;
    i13 = i10 >>> i8;
    i10 = i13 >>> 2 & 4;
    i17 = i13 >>> i10;
    i13 = i17 >>> 1 & 2;
    i15 = i17 >>> i13;
    i17 = i15 >>> 1 & 1;
    i36 = HEAP32[1344 + ((i8 | i6 | i10 | i13 | i17) + (i15 >>> i17) << 2) >> 2] | 0;
   } else i36 = i31;
   if (!i36) {
    i37 = i30;
    i38 = i32;
   } else {
    i17 = i30;
    i15 = i36;
    i13 = i32;
    while (1) {
     i10 = (HEAP32[i15 + 4 >> 2] & -8) - i16 | 0;
     i6 = i10 >>> 0 < i17 >>> 0;
     i8 = i6 ? i10 : i17;
     i10 = i6 ? i15 : i13;
     i6 = HEAP32[i15 + 16 >> 2] | 0;
     if (i6) {
      i17 = i8;
      i15 = i6;
      i13 = i10;
      continue;
     }
     i15 = HEAP32[i15 + 20 >> 2] | 0;
     if (!i15) {
      i37 = i8;
      i38 = i10;
      break;
     } else {
      i17 = i8;
      i13 = i10;
     }
    }
   }
   if ((i38 | 0) != 0 ? i37 >>> 0 < ((HEAP32[262] | 0) - i16 | 0) >>> 0 : 0) {
    i13 = HEAP32[264] | 0;
    if (i38 >>> 0 < i13 >>> 0) _abort();
    i17 = i38 + i16 | 0;
    if (i38 >>> 0 >= i17 >>> 0) _abort();
    i15 = HEAP32[i38 + 24 >> 2] | 0;
    i11 = HEAP32[i38 + 12 >> 2] | 0;
    do if ((i11 | 0) == (i38 | 0)) {
     i10 = i38 + 20 | 0;
     i8 = HEAP32[i10 >> 2] | 0;
     if (!i8) {
      i6 = i38 + 16 | 0;
      i4 = HEAP32[i6 >> 2] | 0;
      if (!i4) {
       i39 = 0;
       break;
      } else {
       i40 = i4;
       i41 = i6;
      }
     } else {
      i40 = i8;
      i41 = i10;
     }
     while (1) {
      i10 = i40 + 20 | 0;
      i8 = HEAP32[i10 >> 2] | 0;
      if (i8) {
       i40 = i8;
       i41 = i10;
       continue;
      }
      i10 = i40 + 16 | 0;
      i8 = HEAP32[i10 >> 2] | 0;
      if (!i8) break; else {
       i40 = i8;
       i41 = i10;
      }
     }
     if (i41 >>> 0 < i13 >>> 0) _abort(); else {
      HEAP32[i41 >> 2] = 0;
      i39 = i40;
      break;
     }
    } else {
     i10 = HEAP32[i38 + 8 >> 2] | 0;
     if (i10 >>> 0 < i13 >>> 0) _abort();
     i8 = i10 + 12 | 0;
     if ((HEAP32[i8 >> 2] | 0) != (i38 | 0)) _abort();
     i6 = i11 + 8 | 0;
     if ((HEAP32[i6 >> 2] | 0) == (i38 | 0)) {
      HEAP32[i8 >> 2] = i11;
      HEAP32[i6 >> 2] = i10;
      i39 = i11;
      break;
     } else _abort();
    } while (0);
    do if (i15) {
     i11 = HEAP32[i38 + 28 >> 2] | 0;
     i13 = 1344 + (i11 << 2) | 0;
     if ((i38 | 0) == (HEAP32[i13 >> 2] | 0)) {
      HEAP32[i13 >> 2] = i39;
      if (!i39) {
       HEAP32[261] = HEAP32[261] & ~(1 << i11);
       break;
      }
     } else {
      if (i15 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort();
      i11 = i15 + 16 | 0;
      if ((HEAP32[i11 >> 2] | 0) == (i38 | 0)) HEAP32[i11 >> 2] = i39; else HEAP32[i15 + 20 >> 2] = i39;
      if (!i39) break;
     }
     i11 = HEAP32[264] | 0;
     if (i39 >>> 0 < i11 >>> 0) _abort();
     HEAP32[i39 + 24 >> 2] = i15;
     i13 = HEAP32[i38 + 16 >> 2] | 0;
     do if (i13) if (i13 >>> 0 < i11 >>> 0) _abort(); else {
      HEAP32[i39 + 16 >> 2] = i13;
      HEAP32[i13 + 24 >> 2] = i39;
      break;
     } while (0);
     i13 = HEAP32[i38 + 20 >> 2] | 0;
     if (i13) if (i13 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort(); else {
      HEAP32[i39 + 20 >> 2] = i13;
      HEAP32[i13 + 24 >> 2] = i39;
      break;
     }
    } while (0);
    L204 : do if (i37 >>> 0 >= 16) {
     HEAP32[i38 + 4 >> 2] = i16 | 3;
     HEAP32[i38 + (i16 | 4) >> 2] = i37 | 1;
     HEAP32[i38 + (i37 + i16) >> 2] = i37;
     i15 = i37 >>> 3;
     if (i37 >>> 0 < 256) {
      i13 = i15 << 1;
      i11 = 1080 + (i13 << 2) | 0;
      i10 = HEAP32[260] | 0;
      i6 = 1 << i15;
      do if (!(i10 & i6)) {
       HEAP32[260] = i10 | i6;
       i42 = 1080 + (i13 + 2 << 2) | 0;
       i43 = i11;
      } else {
       i15 = 1080 + (i13 + 2 << 2) | 0;
       i8 = HEAP32[i15 >> 2] | 0;
       if (i8 >>> 0 >= (HEAP32[264] | 0) >>> 0) {
        i42 = i15;
        i43 = i8;
        break;
       }
       _abort();
      } while (0);
      HEAP32[i42 >> 2] = i17;
      HEAP32[i43 + 12 >> 2] = i17;
      HEAP32[i38 + (i16 + 8) >> 2] = i43;
      HEAP32[i38 + (i16 + 12) >> 2] = i11;
      break;
     }
     i13 = i37 >>> 8;
     if (i13) if (i37 >>> 0 > 16777215) i44 = 31; else {
      i6 = (i13 + 1048320 | 0) >>> 16 & 8;
      i10 = i13 << i6;
      i13 = (i10 + 520192 | 0) >>> 16 & 4;
      i8 = i10 << i13;
      i10 = (i8 + 245760 | 0) >>> 16 & 2;
      i15 = 14 - (i13 | i6 | i10) + (i8 << i10 >>> 15) | 0;
      i44 = i37 >>> (i15 + 7 | 0) & 1 | i15 << 1;
     } else i44 = 0;
     i15 = 1344 + (i44 << 2) | 0;
     HEAP32[i38 + (i16 + 28) >> 2] = i44;
     HEAP32[i38 + (i16 + 20) >> 2] = 0;
     HEAP32[i38 + (i16 + 16) >> 2] = 0;
     i10 = HEAP32[261] | 0;
     i8 = 1 << i44;
     if (!(i10 & i8)) {
      HEAP32[261] = i10 | i8;
      HEAP32[i15 >> 2] = i17;
      HEAP32[i38 + (i16 + 24) >> 2] = i15;
      HEAP32[i38 + (i16 + 12) >> 2] = i17;
      HEAP32[i38 + (i16 + 8) >> 2] = i17;
      break;
     }
     i8 = HEAP32[i15 >> 2] | 0;
     if ((i44 | 0) == 31) i45 = 0; else i45 = 25 - (i44 >>> 1) | 0;
     L225 : do if ((HEAP32[i8 + 4 >> 2] & -8 | 0) != (i37 | 0)) {
      i15 = i37 << i45;
      i10 = i8;
      while (1) {
       i46 = i10 + (i15 >>> 31 << 2) + 16 | 0;
       i6 = HEAP32[i46 >> 2] | 0;
       if (!i6) break;
       if ((HEAP32[i6 + 4 >> 2] & -8 | 0) == (i37 | 0)) {
        i47 = i6;
        break L225;
       } else {
        i15 = i15 << 1;
        i10 = i6;
       }
      }
      if (i46 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort(); else {
       HEAP32[i46 >> 2] = i17;
       HEAP32[i38 + (i16 + 24) >> 2] = i10;
       HEAP32[i38 + (i16 + 12) >> 2] = i17;
       HEAP32[i38 + (i16 + 8) >> 2] = i17;
       break L204;
      }
     } else i47 = i8; while (0);
     i8 = i47 + 8 | 0;
     i11 = HEAP32[i8 >> 2] | 0;
     i15 = HEAP32[264] | 0;
     if (i47 >>> 0 >= i15 >>> 0 & i11 >>> 0 >= i15 >>> 0) {
      HEAP32[i11 + 12 >> 2] = i17;
      HEAP32[i8 >> 2] = i17;
      HEAP32[i38 + (i16 + 8) >> 2] = i11;
      HEAP32[i38 + (i16 + 12) >> 2] = i47;
      HEAP32[i38 + (i16 + 24) >> 2] = 0;
      break;
     } else _abort();
    } else {
     i11 = i37 + i16 | 0;
     HEAP32[i38 + 4 >> 2] = i11 | 3;
     i8 = i38 + (i11 + 4) | 0;
     HEAP32[i8 >> 2] = HEAP32[i8 >> 2] | 1;
    } while (0);
    i14 = i38 + 8 | 0;
    STACKTOP = i2;
    return i14 | 0;
   } else i28 = i16;
  } else i28 = i16;
 } else i28 = -1; while (0);
 i38 = HEAP32[262] | 0;
 if (i38 >>> 0 >= i28 >>> 0) {
  i37 = i38 - i28 | 0;
  i47 = HEAP32[265] | 0;
  if (i37 >>> 0 > 15) {
   HEAP32[265] = i47 + i28;
   HEAP32[262] = i37;
   HEAP32[i47 + (i28 + 4) >> 2] = i37 | 1;
   HEAP32[i47 + i38 >> 2] = i37;
   HEAP32[i47 + 4 >> 2] = i28 | 3;
  } else {
   HEAP32[262] = 0;
   HEAP32[265] = 0;
   HEAP32[i47 + 4 >> 2] = i38 | 3;
   i37 = i47 + (i38 + 4) | 0;
   HEAP32[i37 >> 2] = HEAP32[i37 >> 2] | 1;
  }
  i14 = i47 + 8 | 0;
  STACKTOP = i2;
  return i14 | 0;
 }
 i47 = HEAP32[263] | 0;
 if (i47 >>> 0 > i28 >>> 0) {
  i37 = i47 - i28 | 0;
  HEAP32[263] = i37;
  i47 = HEAP32[266] | 0;
  HEAP32[266] = i47 + i28;
  HEAP32[i47 + (i28 + 4) >> 2] = i37 | 1;
  HEAP32[i47 + 4 >> 2] = i28 | 3;
  i14 = i47 + 8 | 0;
  STACKTOP = i2;
  return i14 | 0;
 }
 do if (!(HEAP32[378] | 0)) {
  i47 = _sysconf(30) | 0;
  if (!(i47 + -1 & i47)) {
   HEAP32[380] = i47;
   HEAP32[379] = i47;
   HEAP32[381] = -1;
   HEAP32[382] = -1;
   HEAP32[383] = 0;
   HEAP32[371] = 0;
   HEAP32[378] = (_time(0) | 0) & -16 ^ 1431655768;
   break;
  } else _abort();
 } while (0);
 i47 = i28 + 48 | 0;
 i37 = HEAP32[380] | 0;
 i38 = i28 + 47 | 0;
 i46 = i37 + i38 | 0;
 i45 = 0 - i37 | 0;
 i37 = i46 & i45;
 if (i37 >>> 0 <= i28 >>> 0) {
  i14 = 0;
  STACKTOP = i2;
  return i14 | 0;
 }
 i44 = HEAP32[370] | 0;
 if ((i44 | 0) != 0 ? (i43 = HEAP32[368] | 0, i42 = i43 + i37 | 0, i42 >>> 0 <= i43 >>> 0 | i42 >>> 0 > i44 >>> 0) : 0) {
  i14 = 0;
  STACKTOP = i2;
  return i14 | 0;
 }
 L266 : do if (!(HEAP32[371] & 4)) {
  i44 = HEAP32[266] | 0;
  L268 : do if (i44) {
   i42 = 1488 | 0;
   while (1) {
    i43 = HEAP32[i42 >> 2] | 0;
    if (i43 >>> 0 <= i44 >>> 0 ? (i48 = i42 + 4 | 0, (i43 + (HEAP32[i48 >> 2] | 0) | 0) >>> 0 > i44 >>> 0) : 0) break;
    i43 = HEAP32[i42 + 8 >> 2] | 0;
    if (!i43) {
     i49 = 181;
     break L268;
    } else i42 = i43;
   }
   if (i42) {
    i43 = i46 - (HEAP32[263] | 0) & i45;
    if (i43 >>> 0 < 2147483647) {
     i39 = _sbrk(i43 | 0) | 0;
     if ((i39 | 0) == ((HEAP32[i42 >> 2] | 0) + (HEAP32[i48 >> 2] | 0) | 0)) {
      i50 = i39;
      i51 = i43;
      i49 = 190;
     } else {
      i52 = i39;
      i53 = i43;
      i49 = 191;
     }
    } else i54 = 0;
   } else i49 = 181;
  } else i49 = 181; while (0);
  do if ((i49 | 0) == 181) {
   i44 = _sbrk(0) | 0;
   if ((i44 | 0) != (-1 | 0)) {
    i16 = i44;
    i43 = HEAP32[379] | 0;
    i39 = i43 + -1 | 0;
    if (!(i39 & i16)) i55 = i37; else i55 = i37 - i16 + (i39 + i16 & 0 - i43) | 0;
    i43 = HEAP32[368] | 0;
    i16 = i43 + i55 | 0;
    if (i55 >>> 0 > i28 >>> 0 & i55 >>> 0 < 2147483647) {
     i39 = HEAP32[370] | 0;
     if ((i39 | 0) != 0 ? i16 >>> 0 <= i43 >>> 0 | i16 >>> 0 > i39 >>> 0 : 0) {
      i54 = 0;
      break;
     }
     i39 = _sbrk(i55 | 0) | 0;
     if ((i39 | 0) == (i44 | 0)) {
      i50 = i44;
      i51 = i55;
      i49 = 190;
     } else {
      i52 = i39;
      i53 = i55;
      i49 = 191;
     }
    } else i54 = 0;
   } else i54 = 0;
  } while (0);
  L288 : do if ((i49 | 0) == 190) if ((i50 | 0) == (-1 | 0)) i54 = i51; else {
   i56 = i50;
   i57 = i51;
   i49 = 201;
   break L266;
  } else if ((i49 | 0) == 191) {
   i39 = 0 - i53 | 0;
   do if ((i52 | 0) != (-1 | 0) & i53 >>> 0 < 2147483647 & i47 >>> 0 > i53 >>> 0 ? (i44 = HEAP32[380] | 0, i16 = i38 - i53 + i44 & 0 - i44, i16 >>> 0 < 2147483647) : 0) if ((_sbrk(i16 | 0) | 0) == (-1 | 0)) {
    _sbrk(i39 | 0) | 0;
    i54 = 0;
    break L288;
   } else {
    i58 = i16 + i53 | 0;
    break;
   } else i58 = i53; while (0);
   if ((i52 | 0) == (-1 | 0)) i54 = 0; else {
    i56 = i52;
    i57 = i58;
    i49 = 201;
    break L266;
   }
  } while (0);
  HEAP32[371] = HEAP32[371] | 4;
  i59 = i54;
  i49 = 198;
 } else {
  i59 = 0;
  i49 = 198;
 } while (0);
 if ((((i49 | 0) == 198 ? i37 >>> 0 < 2147483647 : 0) ? (i54 = _sbrk(i37 | 0) | 0, i37 = _sbrk(0) | 0, (i54 | 0) != (-1 | 0) & (i37 | 0) != (-1 | 0) & i54 >>> 0 < i37 >>> 0) : 0) ? (i58 = i37 - i54 | 0, i37 = i58 >>> 0 > (i28 + 40 | 0) >>> 0, i37) : 0) {
  i56 = i54;
  i57 = i37 ? i58 : i59;
  i49 = 201;
 }
 if ((i49 | 0) == 201) {
  i59 = (HEAP32[368] | 0) + i57 | 0;
  HEAP32[368] = i59;
  if (i59 >>> 0 > (HEAP32[369] | 0) >>> 0) HEAP32[369] = i59;
  i59 = HEAP32[266] | 0;
  L308 : do if (i59) {
   i58 = 1488 | 0;
   while (1) {
    i60 = HEAP32[i58 >> 2] | 0;
    i61 = i58 + 4 | 0;
    i62 = HEAP32[i61 >> 2] | 0;
    if ((i56 | 0) == (i60 + i62 | 0)) {
     i49 = 213;
     break;
    }
    i37 = HEAP32[i58 + 8 >> 2] | 0;
    if (!i37) break; else i58 = i37;
   }
   if (((i49 | 0) == 213 ? (HEAP32[i58 + 12 >> 2] & 8 | 0) == 0 : 0) ? i59 >>> 0 >= i60 >>> 0 & i59 >>> 0 < i56 >>> 0 : 0) {
    HEAP32[i61 >> 2] = i62 + i57;
    i37 = (HEAP32[263] | 0) + i57 | 0;
    i54 = i59 + 8 | 0;
    if (!(i54 & 7)) i63 = 0; else i63 = 0 - i54 & 7;
    i54 = i37 - i63 | 0;
    HEAP32[266] = i59 + i63;
    HEAP32[263] = i54;
    HEAP32[i59 + (i63 + 4) >> 2] = i54 | 1;
    HEAP32[i59 + (i37 + 4) >> 2] = 40;
    HEAP32[267] = HEAP32[382];
    break;
   }
   i37 = HEAP32[264] | 0;
   if (i56 >>> 0 < i37 >>> 0) {
    HEAP32[264] = i56;
    i64 = i56;
   } else i64 = i37;
   i37 = i56 + i57 | 0;
   i54 = 1488 | 0;
   while (1) {
    if ((HEAP32[i54 >> 2] | 0) == (i37 | 0)) {
     i49 = 223;
     break;
    }
    i52 = HEAP32[i54 + 8 >> 2] | 0;
    if (!i52) break; else i54 = i52;
   }
   if ((i49 | 0) == 223 ? (HEAP32[i54 + 12 >> 2] & 8 | 0) == 0 : 0) {
    HEAP32[i54 >> 2] = i56;
    i37 = i54 + 4 | 0;
    HEAP32[i37 >> 2] = (HEAP32[i37 >> 2] | 0) + i57;
    i37 = i56 + 8 | 0;
    if (!(i37 & 7)) i65 = 0; else i65 = 0 - i37 & 7;
    i37 = i56 + (i57 + 8) | 0;
    if (!(i37 & 7)) i66 = 0; else i66 = 0 - i37 & 7;
    i37 = i56 + (i66 + i57) | 0;
    i58 = i65 + i28 | 0;
    i52 = i56 + i58 | 0;
    i53 = i37 - (i56 + i65) - i28 | 0;
    HEAP32[i56 + (i65 + 4) >> 2] = i28 | 3;
    L345 : do if ((i37 | 0) != (i59 | 0)) {
     if ((i37 | 0) == (HEAP32[265] | 0)) {
      i38 = (HEAP32[262] | 0) + i53 | 0;
      HEAP32[262] = i38;
      HEAP32[265] = i52;
      HEAP32[i56 + (i58 + 4) >> 2] = i38 | 1;
      HEAP32[i56 + (i38 + i58) >> 2] = i38;
      break;
     }
     i38 = i57 + 4 | 0;
     i47 = HEAP32[i56 + (i38 + i66) >> 2] | 0;
     if ((i47 & 3 | 0) == 1) {
      i51 = i47 & -8;
      i50 = i47 >>> 3;
      L353 : do if (i47 >>> 0 >= 256) {
       i55 = HEAP32[i56 + ((i66 | 24) + i57) >> 2] | 0;
       i48 = HEAP32[i56 + (i57 + 12 + i66) >> 2] | 0;
       do if ((i48 | 0) == (i37 | 0)) {
        i45 = i66 | 16;
        i46 = i56 + (i38 + i45) | 0;
        i39 = HEAP32[i46 >> 2] | 0;
        if (!i39) {
         i42 = i56 + (i45 + i57) | 0;
         i45 = HEAP32[i42 >> 2] | 0;
         if (!i45) {
          i67 = 0;
          break;
         } else {
          i68 = i45;
          i69 = i42;
         }
        } else {
         i68 = i39;
         i69 = i46;
        }
        while (1) {
         i46 = i68 + 20 | 0;
         i39 = HEAP32[i46 >> 2] | 0;
         if (i39) {
          i68 = i39;
          i69 = i46;
          continue;
         }
         i46 = i68 + 16 | 0;
         i39 = HEAP32[i46 >> 2] | 0;
         if (!i39) break; else {
          i68 = i39;
          i69 = i46;
         }
        }
        if (i69 >>> 0 < i64 >>> 0) _abort(); else {
         HEAP32[i69 >> 2] = 0;
         i67 = i68;
         break;
        }
       } else {
        i46 = HEAP32[i56 + ((i66 | 8) + i57) >> 2] | 0;
        if (i46 >>> 0 < i64 >>> 0) _abort();
        i39 = i46 + 12 | 0;
        if ((HEAP32[i39 >> 2] | 0) != (i37 | 0)) _abort();
        i42 = i48 + 8 | 0;
        if ((HEAP32[i42 >> 2] | 0) == (i37 | 0)) {
         HEAP32[i39 >> 2] = i48;
         HEAP32[i42 >> 2] = i46;
         i67 = i48;
         break;
        } else _abort();
       } while (0);
       if (!i55) break;
       i48 = HEAP32[i56 + (i57 + 28 + i66) >> 2] | 0;
       i10 = 1344 + (i48 << 2) | 0;
       do if ((i37 | 0) != (HEAP32[i10 >> 2] | 0)) {
        if (i55 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort();
        i46 = i55 + 16 | 0;
        if ((HEAP32[i46 >> 2] | 0) == (i37 | 0)) HEAP32[i46 >> 2] = i67; else HEAP32[i55 + 20 >> 2] = i67;
        if (!i67) break L353;
       } else {
        HEAP32[i10 >> 2] = i67;
        if (i67) break;
        HEAP32[261] = HEAP32[261] & ~(1 << i48);
        break L353;
       } while (0);
       i48 = HEAP32[264] | 0;
       if (i67 >>> 0 < i48 >>> 0) _abort();
       HEAP32[i67 + 24 >> 2] = i55;
       i10 = i66 | 16;
       i46 = HEAP32[i56 + (i10 + i57) >> 2] | 0;
       do if (i46) if (i46 >>> 0 < i48 >>> 0) _abort(); else {
        HEAP32[i67 + 16 >> 2] = i46;
        HEAP32[i46 + 24 >> 2] = i67;
        break;
       } while (0);
       i46 = HEAP32[i56 + (i38 + i10) >> 2] | 0;
       if (!i46) break;
       if (i46 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort(); else {
        HEAP32[i67 + 20 >> 2] = i46;
        HEAP32[i46 + 24 >> 2] = i67;
        break;
       }
      } else {
       i46 = HEAP32[i56 + ((i66 | 8) + i57) >> 2] | 0;
       i48 = HEAP32[i56 + (i57 + 12 + i66) >> 2] | 0;
       i55 = 1080 + (i50 << 1 << 2) | 0;
       do if ((i46 | 0) != (i55 | 0)) {
        if (i46 >>> 0 < i64 >>> 0) _abort();
        if ((HEAP32[i46 + 12 >> 2] | 0) == (i37 | 0)) break;
        _abort();
       } while (0);
       if ((i48 | 0) == (i46 | 0)) {
        HEAP32[260] = HEAP32[260] & ~(1 << i50);
        break;
       }
       do if ((i48 | 0) == (i55 | 0)) i70 = i48 + 8 | 0; else {
        if (i48 >>> 0 < i64 >>> 0) _abort();
        i10 = i48 + 8 | 0;
        if ((HEAP32[i10 >> 2] | 0) == (i37 | 0)) {
         i70 = i10;
         break;
        }
        _abort();
       } while (0);
       HEAP32[i46 + 12 >> 2] = i48;
       HEAP32[i70 >> 2] = i46;
      } while (0);
      i71 = i56 + ((i51 | i66) + i57) | 0;
      i72 = i51 + i53 | 0;
     } else {
      i71 = i37;
      i72 = i53;
     }
     i50 = i71 + 4 | 0;
     HEAP32[i50 >> 2] = HEAP32[i50 >> 2] & -2;
     HEAP32[i56 + (i58 + 4) >> 2] = i72 | 1;
     HEAP32[i56 + (i72 + i58) >> 2] = i72;
     i50 = i72 >>> 3;
     if (i72 >>> 0 < 256) {
      i38 = i50 << 1;
      i47 = 1080 + (i38 << 2) | 0;
      i55 = HEAP32[260] | 0;
      i10 = 1 << i50;
      do if (!(i55 & i10)) {
       HEAP32[260] = i55 | i10;
       i73 = 1080 + (i38 + 2 << 2) | 0;
       i74 = i47;
      } else {
       i50 = 1080 + (i38 + 2 << 2) | 0;
       i42 = HEAP32[i50 >> 2] | 0;
       if (i42 >>> 0 >= (HEAP32[264] | 0) >>> 0) {
        i73 = i50;
        i74 = i42;
        break;
       }
       _abort();
      } while (0);
      HEAP32[i73 >> 2] = i52;
      HEAP32[i74 + 12 >> 2] = i52;
      HEAP32[i56 + (i58 + 8) >> 2] = i74;
      HEAP32[i56 + (i58 + 12) >> 2] = i47;
      break;
     }
     i38 = i72 >>> 8;
     do if (!i38) i75 = 0; else {
      if (i72 >>> 0 > 16777215) {
       i75 = 31;
       break;
      }
      i10 = (i38 + 1048320 | 0) >>> 16 & 8;
      i55 = i38 << i10;
      i51 = (i55 + 520192 | 0) >>> 16 & 4;
      i42 = i55 << i51;
      i55 = (i42 + 245760 | 0) >>> 16 & 2;
      i50 = 14 - (i51 | i10 | i55) + (i42 << i55 >>> 15) | 0;
      i75 = i72 >>> (i50 + 7 | 0) & 1 | i50 << 1;
     } while (0);
     i38 = 1344 + (i75 << 2) | 0;
     HEAP32[i56 + (i58 + 28) >> 2] = i75;
     HEAP32[i56 + (i58 + 20) >> 2] = 0;
     HEAP32[i56 + (i58 + 16) >> 2] = 0;
     i47 = HEAP32[261] | 0;
     i50 = 1 << i75;
     if (!(i47 & i50)) {
      HEAP32[261] = i47 | i50;
      HEAP32[i38 >> 2] = i52;
      HEAP32[i56 + (i58 + 24) >> 2] = i38;
      HEAP32[i56 + (i58 + 12) >> 2] = i52;
      HEAP32[i56 + (i58 + 8) >> 2] = i52;
      break;
     }
     i50 = HEAP32[i38 >> 2] | 0;
     if ((i75 | 0) == 31) i76 = 0; else i76 = 25 - (i75 >>> 1) | 0;
     L442 : do if ((HEAP32[i50 + 4 >> 2] & -8 | 0) != (i72 | 0)) {
      i38 = i72 << i76;
      i47 = i50;
      while (1) {
       i77 = i47 + (i38 >>> 31 << 2) + 16 | 0;
       i55 = HEAP32[i77 >> 2] | 0;
       if (!i55) break;
       if ((HEAP32[i55 + 4 >> 2] & -8 | 0) == (i72 | 0)) {
        i78 = i55;
        break L442;
       } else {
        i38 = i38 << 1;
        i47 = i55;
       }
      }
      if (i77 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort(); else {
       HEAP32[i77 >> 2] = i52;
       HEAP32[i56 + (i58 + 24) >> 2] = i47;
       HEAP32[i56 + (i58 + 12) >> 2] = i52;
       HEAP32[i56 + (i58 + 8) >> 2] = i52;
       break L345;
      }
     } else i78 = i50; while (0);
     i50 = i78 + 8 | 0;
     i38 = HEAP32[i50 >> 2] | 0;
     i46 = HEAP32[264] | 0;
     if (i78 >>> 0 >= i46 >>> 0 & i38 >>> 0 >= i46 >>> 0) {
      HEAP32[i38 + 12 >> 2] = i52;
      HEAP32[i50 >> 2] = i52;
      HEAP32[i56 + (i58 + 8) >> 2] = i38;
      HEAP32[i56 + (i58 + 12) >> 2] = i78;
      HEAP32[i56 + (i58 + 24) >> 2] = 0;
      break;
     } else _abort();
    } else {
     i38 = (HEAP32[263] | 0) + i53 | 0;
     HEAP32[263] = i38;
     HEAP32[266] = i52;
     HEAP32[i56 + (i58 + 4) >> 2] = i38 | 1;
    } while (0);
    i14 = i56 + (i65 | 8) | 0;
    STACKTOP = i2;
    return i14 | 0;
   }
   i58 = 1488 | 0;
   while (1) {
    i79 = HEAP32[i58 >> 2] | 0;
    if (i79 >>> 0 <= i59 >>> 0 ? (i80 = HEAP32[i58 + 4 >> 2] | 0, i81 = i79 + i80 | 0, i81 >>> 0 > i59 >>> 0) : 0) break;
    i58 = HEAP32[i58 + 8 >> 2] | 0;
   }
   i58 = i79 + (i80 + -39) | 0;
   if (!(i58 & 7)) i82 = 0; else i82 = 0 - i58 & 7;
   i58 = i79 + (i80 + -47 + i82) | 0;
   i52 = i58 >>> 0 < (i59 + 16 | 0) >>> 0 ? i59 : i58;
   i58 = i52 + 8 | 0;
   i53 = i56 + 8 | 0;
   if (!(i53 & 7)) i83 = 0; else i83 = 0 - i53 & 7;
   i53 = i57 + -40 - i83 | 0;
   HEAP32[266] = i56 + i83;
   HEAP32[263] = i53;
   HEAP32[i56 + (i83 + 4) >> 2] = i53 | 1;
   HEAP32[i56 + (i57 + -36) >> 2] = 40;
   HEAP32[267] = HEAP32[382];
   HEAP32[i52 + 4 >> 2] = 27;
   HEAP32[i58 + 0 >> 2] = HEAP32[372];
   HEAP32[i58 + 4 >> 2] = HEAP32[373];
   HEAP32[i58 + 8 >> 2] = HEAP32[374];
   HEAP32[i58 + 12 >> 2] = HEAP32[375];
   HEAP32[372] = i56;
   HEAP32[373] = i57;
   HEAP32[375] = 0;
   HEAP32[374] = i58;
   i58 = i52 + 28 | 0;
   HEAP32[i58 >> 2] = 7;
   if ((i52 + 32 | 0) >>> 0 < i81 >>> 0) {
    i53 = i58;
    do {
     i58 = i53;
     i53 = i53 + 4 | 0;
     HEAP32[i53 >> 2] = 7;
    } while ((i58 + 8 | 0) >>> 0 < i81 >>> 0);
   }
   if ((i52 | 0) != (i59 | 0)) {
    i53 = i52 - i59 | 0;
    i58 = i59 + (i53 + 4) | 0;
    HEAP32[i58 >> 2] = HEAP32[i58 >> 2] & -2;
    HEAP32[i59 + 4 >> 2] = i53 | 1;
    HEAP32[i59 + i53 >> 2] = i53;
    i58 = i53 >>> 3;
    if (i53 >>> 0 < 256) {
     i37 = i58 << 1;
     i54 = 1080 + (i37 << 2) | 0;
     i38 = HEAP32[260] | 0;
     i50 = 1 << i58;
     do if (!(i38 & i50)) {
      HEAP32[260] = i38 | i50;
      i84 = 1080 + (i37 + 2 << 2) | 0;
      i85 = i54;
     } else {
      i58 = 1080 + (i37 + 2 << 2) | 0;
      i46 = HEAP32[i58 >> 2] | 0;
      if (i46 >>> 0 >= (HEAP32[264] | 0) >>> 0) {
       i84 = i58;
       i85 = i46;
       break;
      }
      _abort();
     } while (0);
     HEAP32[i84 >> 2] = i59;
     HEAP32[i85 + 12 >> 2] = i59;
     HEAP32[i59 + 8 >> 2] = i85;
     HEAP32[i59 + 12 >> 2] = i54;
     break;
    }
    i37 = i53 >>> 8;
    if (i37) if (i53 >>> 0 > 16777215) i86 = 31; else {
     i50 = (i37 + 1048320 | 0) >>> 16 & 8;
     i38 = i37 << i50;
     i37 = (i38 + 520192 | 0) >>> 16 & 4;
     i52 = i38 << i37;
     i38 = (i52 + 245760 | 0) >>> 16 & 2;
     i46 = 14 - (i37 | i50 | i38) + (i52 << i38 >>> 15) | 0;
     i86 = i53 >>> (i46 + 7 | 0) & 1 | i46 << 1;
    } else i86 = 0;
    i46 = 1344 + (i86 << 2) | 0;
    HEAP32[i59 + 28 >> 2] = i86;
    HEAP32[i59 + 20 >> 2] = 0;
    HEAP32[i59 + 16 >> 2] = 0;
    i38 = HEAP32[261] | 0;
    i52 = 1 << i86;
    if (!(i38 & i52)) {
     HEAP32[261] = i38 | i52;
     HEAP32[i46 >> 2] = i59;
     HEAP32[i59 + 24 >> 2] = i46;
     HEAP32[i59 + 12 >> 2] = i59;
     HEAP32[i59 + 8 >> 2] = i59;
     break;
    }
    i52 = HEAP32[i46 >> 2] | 0;
    if ((i86 | 0) == 31) i87 = 0; else i87 = 25 - (i86 >>> 1) | 0;
    L493 : do if ((HEAP32[i52 + 4 >> 2] & -8 | 0) != (i53 | 0)) {
     i46 = i53 << i87;
     i38 = i52;
     while (1) {
      i88 = i38 + (i46 >>> 31 << 2) + 16 | 0;
      i50 = HEAP32[i88 >> 2] | 0;
      if (!i50) break;
      if ((HEAP32[i50 + 4 >> 2] & -8 | 0) == (i53 | 0)) {
       i89 = i50;
       break L493;
      } else {
       i46 = i46 << 1;
       i38 = i50;
      }
     }
     if (i88 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort(); else {
      HEAP32[i88 >> 2] = i59;
      HEAP32[i59 + 24 >> 2] = i38;
      HEAP32[i59 + 12 >> 2] = i59;
      HEAP32[i59 + 8 >> 2] = i59;
      break L308;
     }
    } else i89 = i52; while (0);
    i52 = i89 + 8 | 0;
    i53 = HEAP32[i52 >> 2] | 0;
    i54 = HEAP32[264] | 0;
    if (i89 >>> 0 >= i54 >>> 0 & i53 >>> 0 >= i54 >>> 0) {
     HEAP32[i53 + 12 >> 2] = i59;
     HEAP32[i52 >> 2] = i59;
     HEAP32[i59 + 8 >> 2] = i53;
     HEAP32[i59 + 12 >> 2] = i89;
     HEAP32[i59 + 24 >> 2] = 0;
     break;
    } else _abort();
   }
  } else {
   i53 = HEAP32[264] | 0;
   if ((i53 | 0) == 0 | i56 >>> 0 < i53 >>> 0) HEAP32[264] = i56;
   HEAP32[372] = i56;
   HEAP32[373] = i57;
   HEAP32[375] = 0;
   HEAP32[269] = HEAP32[378];
   HEAP32[268] = -1;
   i53 = 0;
   do {
    i52 = i53 << 1;
    i54 = 1080 + (i52 << 2) | 0;
    HEAP32[1080 + (i52 + 3 << 2) >> 2] = i54;
    HEAP32[1080 + (i52 + 2 << 2) >> 2] = i54;
    i53 = i53 + 1 | 0;
   } while ((i53 | 0) != 32);
   i53 = i56 + 8 | 0;
   if (!(i53 & 7)) i90 = 0; else i90 = 0 - i53 & 7;
   i53 = i57 + -40 - i90 | 0;
   HEAP32[266] = i56 + i90;
   HEAP32[263] = i53;
   HEAP32[i56 + (i90 + 4) >> 2] = i53 | 1;
   HEAP32[i56 + (i57 + -36) >> 2] = 40;
   HEAP32[267] = HEAP32[382];
  } while (0);
  i57 = HEAP32[263] | 0;
  if (i57 >>> 0 > i28 >>> 0) {
   i56 = i57 - i28 | 0;
   HEAP32[263] = i56;
   i57 = HEAP32[266] | 0;
   HEAP32[266] = i57 + i28;
   HEAP32[i57 + (i28 + 4) >> 2] = i56 | 1;
   HEAP32[i57 + 4 >> 2] = i28 | 3;
   i14 = i57 + 8 | 0;
   STACKTOP = i2;
   return i14 | 0;
  }
 }
 HEAP32[(___errno_location() | 0) >> 2] = 12;
 i14 = 0;
 STACKTOP = i2;
 return i14 | 0;
}
function _free(i1) {
 i1 = i1 | 0;
 var i2 = 0, i3 = 0, i4 = 0, i5 = 0, i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0, i13 = 0, i14 = 0, i15 = 0, i16 = 0, i17 = 0, i18 = 0, i19 = 0, i20 = 0, i21 = 0, i22 = 0, i23 = 0, i24 = 0, i25 = 0, i26 = 0, i27 = 0, i28 = 0, i29 = 0, i30 = 0, i31 = 0, i32 = 0, i33 = 0, i34 = 0, i35 = 0;
 i2 = STACKTOP;
 if (!i1) {
  STACKTOP = i2;
  return;
 }
 i3 = i1 + -8 | 0;
 i4 = HEAP32[264] | 0;
 if (i3 >>> 0 < i4 >>> 0) _abort();
 i5 = HEAP32[i1 + -4 >> 2] | 0;
 i6 = i5 & 3;
 if ((i6 | 0) == 1) _abort();
 i7 = i5 & -8;
 i8 = i1 + (i7 + -8) | 0;
 do if (!(i5 & 1)) {
  i9 = HEAP32[i3 >> 2] | 0;
  if (!i6) {
   STACKTOP = i2;
   return;
  }
  i10 = -8 - i9 | 0;
  i11 = i1 + i10 | 0;
  i12 = i9 + i7 | 0;
  if (i11 >>> 0 < i4 >>> 0) _abort();
  if ((i11 | 0) == (HEAP32[265] | 0)) {
   i13 = i1 + (i7 + -4) | 0;
   i14 = HEAP32[i13 >> 2] | 0;
   if ((i14 & 3 | 0) != 3) {
    i15 = i11;
    i16 = i12;
    break;
   }
   HEAP32[262] = i12;
   HEAP32[i13 >> 2] = i14 & -2;
   HEAP32[i1 + (i10 + 4) >> 2] = i12 | 1;
   HEAP32[i8 >> 2] = i12;
   STACKTOP = i2;
   return;
  }
  i14 = i9 >>> 3;
  if (i9 >>> 0 < 256) {
   i9 = HEAP32[i1 + (i10 + 8) >> 2] | 0;
   i13 = HEAP32[i1 + (i10 + 12) >> 2] | 0;
   i17 = 1080 + (i14 << 1 << 2) | 0;
   if ((i9 | 0) != (i17 | 0)) {
    if (i9 >>> 0 < i4 >>> 0) _abort();
    if ((HEAP32[i9 + 12 >> 2] | 0) != (i11 | 0)) _abort();
   }
   if ((i13 | 0) == (i9 | 0)) {
    HEAP32[260] = HEAP32[260] & ~(1 << i14);
    i15 = i11;
    i16 = i12;
    break;
   }
   if ((i13 | 0) != (i17 | 0)) {
    if (i13 >>> 0 < i4 >>> 0) _abort();
    i17 = i13 + 8 | 0;
    if ((HEAP32[i17 >> 2] | 0) == (i11 | 0)) i18 = i17; else _abort();
   } else i18 = i13 + 8 | 0;
   HEAP32[i9 + 12 >> 2] = i13;
   HEAP32[i18 >> 2] = i9;
   i15 = i11;
   i16 = i12;
   break;
  }
  i9 = HEAP32[i1 + (i10 + 24) >> 2] | 0;
  i13 = HEAP32[i1 + (i10 + 12) >> 2] | 0;
  do if ((i13 | 0) == (i11 | 0)) {
   i17 = i1 + (i10 + 20) | 0;
   i14 = HEAP32[i17 >> 2] | 0;
   if (!i14) {
    i19 = i1 + (i10 + 16) | 0;
    i20 = HEAP32[i19 >> 2] | 0;
    if (!i20) {
     i21 = 0;
     break;
    } else {
     i22 = i20;
     i23 = i19;
    }
   } else {
    i22 = i14;
    i23 = i17;
   }
   while (1) {
    i17 = i22 + 20 | 0;
    i14 = HEAP32[i17 >> 2] | 0;
    if (i14) {
     i22 = i14;
     i23 = i17;
     continue;
    }
    i17 = i22 + 16 | 0;
    i14 = HEAP32[i17 >> 2] | 0;
    if (!i14) break; else {
     i22 = i14;
     i23 = i17;
    }
   }
   if (i23 >>> 0 < i4 >>> 0) _abort(); else {
    HEAP32[i23 >> 2] = 0;
    i21 = i22;
    break;
   }
  } else {
   i17 = HEAP32[i1 + (i10 + 8) >> 2] | 0;
   if (i17 >>> 0 < i4 >>> 0) _abort();
   i14 = i17 + 12 | 0;
   if ((HEAP32[i14 >> 2] | 0) != (i11 | 0)) _abort();
   i19 = i13 + 8 | 0;
   if ((HEAP32[i19 >> 2] | 0) == (i11 | 0)) {
    HEAP32[i14 >> 2] = i13;
    HEAP32[i19 >> 2] = i17;
    i21 = i13;
    break;
   } else _abort();
  } while (0);
  if (i9) {
   i13 = HEAP32[i1 + (i10 + 28) >> 2] | 0;
   i17 = 1344 + (i13 << 2) | 0;
   if ((i11 | 0) == (HEAP32[i17 >> 2] | 0)) {
    HEAP32[i17 >> 2] = i21;
    if (!i21) {
     HEAP32[261] = HEAP32[261] & ~(1 << i13);
     i15 = i11;
     i16 = i12;
     break;
    }
   } else {
    if (i9 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort();
    i13 = i9 + 16 | 0;
    if ((HEAP32[i13 >> 2] | 0) == (i11 | 0)) HEAP32[i13 >> 2] = i21; else HEAP32[i9 + 20 >> 2] = i21;
    if (!i21) {
     i15 = i11;
     i16 = i12;
     break;
    }
   }
   i13 = HEAP32[264] | 0;
   if (i21 >>> 0 < i13 >>> 0) _abort();
   HEAP32[i21 + 24 >> 2] = i9;
   i17 = HEAP32[i1 + (i10 + 16) >> 2] | 0;
   do if (i17) if (i17 >>> 0 < i13 >>> 0) _abort(); else {
    HEAP32[i21 + 16 >> 2] = i17;
    HEAP32[i17 + 24 >> 2] = i21;
    break;
   } while (0);
   i17 = HEAP32[i1 + (i10 + 20) >> 2] | 0;
   if (i17) if (i17 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort(); else {
    HEAP32[i21 + 20 >> 2] = i17;
    HEAP32[i17 + 24 >> 2] = i21;
    i15 = i11;
    i16 = i12;
    break;
   } else {
    i15 = i11;
    i16 = i12;
   }
  } else {
   i15 = i11;
   i16 = i12;
  }
 } else {
  i15 = i3;
  i16 = i7;
 } while (0);
 if (i15 >>> 0 >= i8 >>> 0) _abort();
 i3 = i1 + (i7 + -4) | 0;
 i21 = HEAP32[i3 >> 2] | 0;
 if (!(i21 & 1)) _abort();
 if (!(i21 & 2)) {
  if ((i8 | 0) == (HEAP32[266] | 0)) {
   i4 = (HEAP32[263] | 0) + i16 | 0;
   HEAP32[263] = i4;
   HEAP32[266] = i15;
   HEAP32[i15 + 4 >> 2] = i4 | 1;
   if ((i15 | 0) != (HEAP32[265] | 0)) {
    STACKTOP = i2;
    return;
   }
   HEAP32[265] = 0;
   HEAP32[262] = 0;
   STACKTOP = i2;
   return;
  }
  if ((i8 | 0) == (HEAP32[265] | 0)) {
   i4 = (HEAP32[262] | 0) + i16 | 0;
   HEAP32[262] = i4;
   HEAP32[265] = i15;
   HEAP32[i15 + 4 >> 2] = i4 | 1;
   HEAP32[i15 + i4 >> 2] = i4;
   STACKTOP = i2;
   return;
  }
  i4 = (i21 & -8) + i16 | 0;
  i22 = i21 >>> 3;
  do if (i21 >>> 0 >= 256) {
   i23 = HEAP32[i1 + (i7 + 16) >> 2] | 0;
   i18 = HEAP32[i1 + (i7 | 4) >> 2] | 0;
   do if ((i18 | 0) == (i8 | 0)) {
    i6 = i1 + (i7 + 12) | 0;
    i5 = HEAP32[i6 >> 2] | 0;
    if (!i5) {
     i17 = i1 + (i7 + 8) | 0;
     i13 = HEAP32[i17 >> 2] | 0;
     if (!i13) {
      i24 = 0;
      break;
     } else {
      i25 = i13;
      i26 = i17;
     }
    } else {
     i25 = i5;
     i26 = i6;
    }
    while (1) {
     i6 = i25 + 20 | 0;
     i5 = HEAP32[i6 >> 2] | 0;
     if (i5) {
      i25 = i5;
      i26 = i6;
      continue;
     }
     i6 = i25 + 16 | 0;
     i5 = HEAP32[i6 >> 2] | 0;
     if (!i5) break; else {
      i25 = i5;
      i26 = i6;
     }
    }
    if (i26 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort(); else {
     HEAP32[i26 >> 2] = 0;
     i24 = i25;
     break;
    }
   } else {
    i6 = HEAP32[i1 + i7 >> 2] | 0;
    if (i6 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort();
    i5 = i6 + 12 | 0;
    if ((HEAP32[i5 >> 2] | 0) != (i8 | 0)) _abort();
    i17 = i18 + 8 | 0;
    if ((HEAP32[i17 >> 2] | 0) == (i8 | 0)) {
     HEAP32[i5 >> 2] = i18;
     HEAP32[i17 >> 2] = i6;
     i24 = i18;
     break;
    } else _abort();
   } while (0);
   if (i23) {
    i18 = HEAP32[i1 + (i7 + 20) >> 2] | 0;
    i12 = 1344 + (i18 << 2) | 0;
    if ((i8 | 0) == (HEAP32[i12 >> 2] | 0)) {
     HEAP32[i12 >> 2] = i24;
     if (!i24) {
      HEAP32[261] = HEAP32[261] & ~(1 << i18);
      break;
     }
    } else {
     if (i23 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort();
     i18 = i23 + 16 | 0;
     if ((HEAP32[i18 >> 2] | 0) == (i8 | 0)) HEAP32[i18 >> 2] = i24; else HEAP32[i23 + 20 >> 2] = i24;
     if (!i24) break;
    }
    i18 = HEAP32[264] | 0;
    if (i24 >>> 0 < i18 >>> 0) _abort();
    HEAP32[i24 + 24 >> 2] = i23;
    i12 = HEAP32[i1 + (i7 + 8) >> 2] | 0;
    do if (i12) if (i12 >>> 0 < i18 >>> 0) _abort(); else {
     HEAP32[i24 + 16 >> 2] = i12;
     HEAP32[i12 + 24 >> 2] = i24;
     break;
    } while (0);
    i12 = HEAP32[i1 + (i7 + 12) >> 2] | 0;
    if (i12) if (i12 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort(); else {
     HEAP32[i24 + 20 >> 2] = i12;
     HEAP32[i12 + 24 >> 2] = i24;
     break;
    }
   }
  } else {
   i12 = HEAP32[i1 + i7 >> 2] | 0;
   i18 = HEAP32[i1 + (i7 | 4) >> 2] | 0;
   i23 = 1080 + (i22 << 1 << 2) | 0;
   if ((i12 | 0) != (i23 | 0)) {
    if (i12 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort();
    if ((HEAP32[i12 + 12 >> 2] | 0) != (i8 | 0)) _abort();
   }
   if ((i18 | 0) == (i12 | 0)) {
    HEAP32[260] = HEAP32[260] & ~(1 << i22);
    break;
   }
   if ((i18 | 0) != (i23 | 0)) {
    if (i18 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort();
    i23 = i18 + 8 | 0;
    if ((HEAP32[i23 >> 2] | 0) == (i8 | 0)) i27 = i23; else _abort();
   } else i27 = i18 + 8 | 0;
   HEAP32[i12 + 12 >> 2] = i18;
   HEAP32[i27 >> 2] = i12;
  } while (0);
  HEAP32[i15 + 4 >> 2] = i4 | 1;
  HEAP32[i15 + i4 >> 2] = i4;
  if ((i15 | 0) == (HEAP32[265] | 0)) {
   HEAP32[262] = i4;
   STACKTOP = i2;
   return;
  } else i28 = i4;
 } else {
  HEAP32[i3 >> 2] = i21 & -2;
  HEAP32[i15 + 4 >> 2] = i16 | 1;
  HEAP32[i15 + i16 >> 2] = i16;
  i28 = i16;
 }
 i16 = i28 >>> 3;
 if (i28 >>> 0 < 256) {
  i21 = i16 << 1;
  i3 = 1080 + (i21 << 2) | 0;
  i4 = HEAP32[260] | 0;
  i27 = 1 << i16;
  if (i4 & i27) {
   i16 = 1080 + (i21 + 2 << 2) | 0;
   i8 = HEAP32[i16 >> 2] | 0;
   if (i8 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort(); else {
    i29 = i16;
    i30 = i8;
   }
  } else {
   HEAP32[260] = i4 | i27;
   i29 = 1080 + (i21 + 2 << 2) | 0;
   i30 = i3;
  }
  HEAP32[i29 >> 2] = i15;
  HEAP32[i30 + 12 >> 2] = i15;
  HEAP32[i15 + 8 >> 2] = i30;
  HEAP32[i15 + 12 >> 2] = i3;
  STACKTOP = i2;
  return;
 }
 i3 = i28 >>> 8;
 if (i3) if (i28 >>> 0 > 16777215) i31 = 31; else {
  i30 = (i3 + 1048320 | 0) >>> 16 & 8;
  i29 = i3 << i30;
  i3 = (i29 + 520192 | 0) >>> 16 & 4;
  i21 = i29 << i3;
  i29 = (i21 + 245760 | 0) >>> 16 & 2;
  i27 = 14 - (i3 | i30 | i29) + (i21 << i29 >>> 15) | 0;
  i31 = i28 >>> (i27 + 7 | 0) & 1 | i27 << 1;
 } else i31 = 0;
 i27 = 1344 + (i31 << 2) | 0;
 HEAP32[i15 + 28 >> 2] = i31;
 HEAP32[i15 + 20 >> 2] = 0;
 HEAP32[i15 + 16 >> 2] = 0;
 i29 = HEAP32[261] | 0;
 i21 = 1 << i31;
 L199 : do if (i29 & i21) {
  i30 = HEAP32[i27 >> 2] | 0;
  if ((i31 | 0) == 31) i32 = 0; else i32 = 25 - (i31 >>> 1) | 0;
  L205 : do if ((HEAP32[i30 + 4 >> 2] & -8 | 0) != (i28 | 0)) {
   i3 = i28 << i32;
   i4 = i30;
   while (1) {
    i33 = i4 + (i3 >>> 31 << 2) + 16 | 0;
    i8 = HEAP32[i33 >> 2] | 0;
    if (!i8) break;
    if ((HEAP32[i8 + 4 >> 2] & -8 | 0) == (i28 | 0)) {
     i34 = i8;
     break L205;
    } else {
     i3 = i3 << 1;
     i4 = i8;
    }
   }
   if (i33 >>> 0 < (HEAP32[264] | 0) >>> 0) _abort(); else {
    HEAP32[i33 >> 2] = i15;
    HEAP32[i15 + 24 >> 2] = i4;
    HEAP32[i15 + 12 >> 2] = i15;
    HEAP32[i15 + 8 >> 2] = i15;
    break L199;
   }
  } else i34 = i30; while (0);
  i30 = i34 + 8 | 0;
  i3 = HEAP32[i30 >> 2] | 0;
  i8 = HEAP32[264] | 0;
  if (i34 >>> 0 >= i8 >>> 0 & i3 >>> 0 >= i8 >>> 0) {
   HEAP32[i3 + 12 >> 2] = i15;
   HEAP32[i30 >> 2] = i15;
   HEAP32[i15 + 8 >> 2] = i3;
   HEAP32[i15 + 12 >> 2] = i34;
   HEAP32[i15 + 24 >> 2] = 0;
   break;
  } else _abort();
 } else {
  HEAP32[261] = i29 | i21;
  HEAP32[i27 >> 2] = i15;
  HEAP32[i15 + 24 >> 2] = i27;
  HEAP32[i15 + 12 >> 2] = i15;
  HEAP32[i15 + 8 >> 2] = i15;
 } while (0);
 i15 = (HEAP32[268] | 0) + -1 | 0;
 HEAP32[268] = i15;
 if (!i15) i35 = 1496 | 0; else {
  STACKTOP = i2;
  return;
 }
 while (1) {
  i15 = HEAP32[i35 >> 2] | 0;
  if (!i15) break; else i35 = i15 + 8 | 0;
 }
 HEAP32[268] = -1;
 STACKTOP = i2;
 return;
}
function _main(i1, i2) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 var i3 = 0, i4 = 0, i5 = 0, i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0, i13 = 0, i14 = 0, i15 = 0, d16 = 0.0, d17 = 0.0, i18 = 0, i19 = 0;
 _env_init();
 i2 = STACKTOP;
 STACKTOP = STACKTOP + 4272 | 0;
 i1 = i2;
 i3 = i2 + 4256 | 0;
 i4 = i2 + 4248 | 0;
 i5 = i2 + 2128 | 0;
 i6 = i2 + 8 | 0;
 _gettimeofday(i3 | 0, 0) | 0;
 i7 = __Znaj(347) | 0;
 _memcpy(i7 | 0, 280, 287) | 0;
 i8 = i7 + 287 | 0;
 i9 = 280 | 0;
 i10 = i8 + 60 | 0;
 do {
  HEAP8[i8 >> 0] = HEAP8[i9 >> 0] | 0;
  i8 = i8 + 1 | 0;
  i9 = i9 + 1 | 0;
 } while ((i8 | 0) < (i10 | 0));
 i9 = 38e6;
 i8 = 0;
 while (1) {
  i10 = i9 >>> 0 < 60 ? i9 : 60;
  i11 = __Znaj(i10 + 2 | 0) | 0;
  _memcpy(i11 | 0, i7 + i8 | 0, i10 | 0) | 0;
  HEAP8[i11 + i10 >> 0] = 0;
  i12 = _strlen(i11 | 0) | 0;
  i13 = HEAP32[2] | 0;
  if ((i13 | 0) < (i12 | 0)) {
   if ((i13 | 0) > 0) HEAP32[2] = 0;
  } else HEAP32[2] = i13 - i12;
  __ZdlPv(i11);
  i11 = i10 + i8 | 0;
  if ((i9 | 0) == (i10 | 0)) break; else {
   i9 = i9 - i10 | 0;
   i8 = i11 >>> 0 > 287 ? i11 + -287 | 0 : i11;
  }
 }
 __ZdaPv(i7);
 if (!(HEAP32[6] | 0)) {
  i14 = 24;
  i15 = 0;
 } else {
  i7 = 24;
  d16 = 0.0;
  do {
   i8 = i7 + 4 | 0;
   d16 = d16 + +HEAPF32[i8 >> 2];
   d17 = d16 < 1.0 ? d16 : 1.0;
   HEAPF32[i8 >> 2] = d17;
   HEAP32[i7 + 8 >> 2] = ~~(d17 * 512.0) >>> 0;
   i7 = i7 + 12 | 0;
  } while ((HEAP32[i7 >> 2] | 0) != 0);
  i14 = 24;
  i15 = 0;
 }
 while (1) {
  i7 = i14;
  while (1) {
   i8 = HEAP32[i7 + 8 >> 2] | 0;
   if (i15 >>> 0 > i8 >>> 0 & (i8 | 0) != 0) i7 = i7 + 12 | 0; else break;
  }
  HEAP32[i5 + (i15 << 2) >> 2] = i7;
  i15 = i15 + 1 | 0;
  if ((i15 | 0) == 513) break; else i14 = i7;
 }
 HEAP32[i5 + 2116 >> 2] = 0;
 __ZN10Randomized3runEPKcS1_j(i5, 568, 576, 57e6);
 if (!(HEAP32[54] | 0)) {
  i18 = 216;
  i19 = 0;
 } else {
  i5 = 216;
  d16 = 0.0;
  do {
   i14 = i5 + 4 | 0;
   d16 = d16 + +HEAPF32[i14 >> 2];
   d17 = d16 < 1.0 ? d16 : 1.0;
   HEAPF32[i14 >> 2] = d17;
   HEAP32[i5 + 8 >> 2] = ~~(d17 * 512.0) >>> 0;
   i5 = i5 + 12 | 0;
  } while ((HEAP32[i5 >> 2] | 0) != 0);
  i18 = 216;
  i19 = 0;
 }
 while (1) {
  i5 = i18;
  while (1) {
   i14 = HEAP32[i5 + 8 >> 2] | 0;
   if (i19 >>> 0 > i14 >>> 0 & (i14 | 0) != 0) i5 = i5 + 12 | 0; else break;
  }
  HEAP32[i6 + (i19 << 2) >> 2] = i5;
  i19 = i19 + 1 | 0;
  if ((i19 | 0) == 513) break; else i18 = i5;
 }
 HEAP32[i6 + 2116 >> 2] = 0;
 __ZN10Randomized3runEPKcS1_j(i6, 600, 608, 95e6);
 _gettimeofday(i4 | 0, 0) | 0;
 HEAPF64[tempDoublePtr >> 3] = +((HEAP32[i4 + 4 >> 2] | 0) - (HEAP32[i3 + 4 >> 2] | 0) | 0) / 1.0e6 + +((HEAP32[i4 >> 2] | 0) - (HEAP32[i3 >> 2] | 0) | 0);
 HEAP32[i1 >> 2] = HEAP32[tempDoublePtr >> 2];
 HEAP32[i1 + 4 >> 2] = HEAP32[tempDoublePtr + 4 >> 2];
 _printf(632, i1 | 0) | 0;
 STACKTOP = i2;
 return 0;
}
function __ZNK10__cxxabiv120__si_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib(i1, i2, i3, i4, i5) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 var i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0, i13 = 0;
 i6 = STACKTOP;
 if ((i1 | 0) == (HEAP32[i2 + 8 >> 2] | 0)) {
  if ((HEAP32[i2 + 4 >> 2] | 0) != (i3 | 0)) {
   STACKTOP = i6;
   return;
  }
  i7 = i2 + 28 | 0;
  if ((HEAP32[i7 >> 2] | 0) == 1) {
   STACKTOP = i6;
   return;
  }
  HEAP32[i7 >> 2] = i4;
  STACKTOP = i6;
  return;
 }
 if ((i1 | 0) != (HEAP32[i2 >> 2] | 0)) {
  i7 = HEAP32[i1 + 8 >> 2] | 0;
  FUNCTION_TABLE_viiiii[HEAP32[(HEAP32[i7 >> 2] | 0) + 24 >> 2] & 3](i7, i2, i3, i4, i5);
  STACKTOP = i6;
  return;
 }
 if ((HEAP32[i2 + 16 >> 2] | 0) != (i3 | 0) ? (i7 = i2 + 20 | 0, (HEAP32[i7 >> 2] | 0) != (i3 | 0)) : 0) {
  HEAP32[i2 + 32 >> 2] = i4;
  i8 = i2 + 44 | 0;
  if ((HEAP32[i8 >> 2] | 0) == 4) {
   STACKTOP = i6;
   return;
  }
  i9 = i2 + 52 | 0;
  HEAP8[i9 >> 0] = 0;
  i10 = i2 + 53 | 0;
  HEAP8[i10 >> 0] = 0;
  i11 = HEAP32[i1 + 8 >> 2] | 0;
  FUNCTION_TABLE_viiiiii[HEAP32[(HEAP32[i11 >> 2] | 0) + 20 >> 2] & 3](i11, i2, i3, i3, 1, i5);
  if (HEAP8[i10 >> 0] | 0) {
   if (!(HEAP8[i9 >> 0] | 0)) {
    i12 = 1;
    i13 = 13;
   }
  } else {
   i12 = 0;
   i13 = 13;
  }
  do if ((i13 | 0) == 13) {
   HEAP32[i7 >> 2] = i3;
   i9 = i2 + 40 | 0;
   HEAP32[i9 >> 2] = (HEAP32[i9 >> 2] | 0) + 1;
   if ((HEAP32[i2 + 36 >> 2] | 0) == 1 ? (HEAP32[i2 + 24 >> 2] | 0) == 2 : 0) {
    HEAP8[i2 + 54 >> 0] = 1;
    if (i12) break;
   } else i13 = 16;
   if ((i13 | 0) == 16 ? i12 : 0) break;
   HEAP32[i8 >> 2] = 4;
   STACKTOP = i6;
   return;
  } while (0);
  HEAP32[i8 >> 2] = 3;
  STACKTOP = i6;
  return;
 }
 if ((i4 | 0) != 1) {
  STACKTOP = i6;
  return;
 }
 HEAP32[i2 + 32 >> 2] = 1;
 STACKTOP = i6;
 return;
}
function ___dynamic_cast(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 var i5 = 0, i6 = 0, i7 = 0, i8 = 0, i9 = 0, i10 = 0, i11 = 0, i12 = 0, i13 = 0, i14 = 0;
 i5 = STACKTOP;
 STACKTOP = STACKTOP + 64 | 0;
 i6 = i5;
 i7 = HEAP32[i1 >> 2] | 0;
 i8 = i1 + (HEAP32[i7 + -8 >> 2] | 0) | 0;
 i9 = HEAP32[i7 + -4 >> 2] | 0;
 HEAP32[i6 >> 2] = i3;
 HEAP32[i6 + 4 >> 2] = i1;
 HEAP32[i6 + 8 >> 2] = i2;
 HEAP32[i6 + 12 >> 2] = i4;
 i4 = i6 + 16 | 0;
 i2 = i6 + 20 | 0;
 i1 = i6 + 24 | 0;
 i7 = i6 + 28 | 0;
 i10 = i6 + 32 | 0;
 i11 = i6 + 40 | 0;
 i12 = (i9 | 0) == (i3 | 0);
 i3 = i4 + 0 | 0;
 i13 = i3 + 36 | 0;
 do {
  HEAP32[i3 >> 2] = 0;
  i3 = i3 + 4 | 0;
 } while ((i3 | 0) < (i13 | 0));
 HEAP16[i4 + 36 >> 1] = 0;
 HEAP8[i4 + 38 >> 0] = 0;
 if (i12) {
  HEAP32[i6 + 48 >> 2] = 1;
  FUNCTION_TABLE_viiiiii[HEAP32[(HEAP32[i9 >> 2] | 0) + 20 >> 2] & 3](i9, i6, i8, i8, 1, 0);
  i14 = (HEAP32[i1 >> 2] | 0) == 1 ? i8 : 0;
  STACKTOP = i5;
  return i14 | 0;
 }
 FUNCTION_TABLE_viiiii[HEAP32[(HEAP32[i9 >> 2] | 0) + 24 >> 2] & 3](i9, i6, i8, 1, 0);
 i8 = HEAP32[i6 + 36 >> 2] | 0;
 if (!i8) {
  i14 = (HEAP32[i11 >> 2] | 0) == 1 & (HEAP32[i7 >> 2] | 0) == 1 & (HEAP32[i10 >> 2] | 0) == 1 ? HEAP32[i2 >> 2] | 0 : 0;
  STACKTOP = i5;
  return i14 | 0;
 } else if ((i8 | 0) == 1) {
  if ((HEAP32[i1 >> 2] | 0) != 1 ? !((HEAP32[i11 >> 2] | 0) == 0 & (HEAP32[i7 >> 2] | 0) == 1 & (HEAP32[i10 >> 2] | 0) == 1) : 0) {
   i14 = 0;
   STACKTOP = i5;
   return i14 | 0;
  }
  i14 = HEAP32[i4 >> 2] | 0;
  STACKTOP = i5;
  return i14 | 0;
 } else {
  i14 = 0;
  STACKTOP = i5;
  return i14 | 0;
 }
 // return 0;
}
function __ZN10Randomized3runEPKcS1_j(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 var i5 = 0, i6 = 0, i7 = 0, i8 = 0, d9 = 0.0, i10 = 0;
 i3 = STACKTOP;
 if (!i4) {
  STACKTOP = i3;
  return;
 }
 i2 = i1 + 2116 | 0;
 i5 = i1 + 2052 | 0;
 i6 = i4;
 while (1) {
  i4 = i6 >>> 0 < 60 ? i6 : 60;
  if (i4) {
   i7 = 0;
   do {
    i8 = ((((HEAP32[4] | 0) * 3877 | 0) + 29573 | 0) >>> 0) % 139968 | 0;
    HEAP32[4] = i8;
    d9 = +(i8 >>> 0) / 139968.0;
    i8 = HEAP32[i1 + (~~(d9 * 512.0) >>> 0 << 2) >> 2] | 0;
    while (1) if (+HEAPF32[i8 + 4 >> 2] < d9) i8 = i8 + 12 | 0; else break;
    HEAP8[i1 + i7 + 2052 >> 0] = HEAP32[i8 >> 2];
    i7 = i7 + 1 | 0;
   } while ((i7 | 0) != (i4 | 0));
  }
  HEAP8[i1 + i4 + 2052 >> 0] = 10;
  i7 = i4 + 1 | 0;
  HEAP8[i1 + i7 + 2052 >> 0] = 0;
  HEAP32[i2 >> 2] = i7;
  i7 = _strlen(i5 | 0) | 0;
  i10 = HEAP32[2] | 0;
  if ((i10 | 0) < (i7 | 0)) {
   if ((i10 | 0) > 0) {
    HEAP8[i1 + i10 + 2052 >> 0] = 0;
    HEAP8[i1 + (HEAP32[2] | 0) + 2052 >> 0] = 122;
    HEAP32[2] = 0;
   }
  } else HEAP32[2] = i10 - i7;
  if ((i6 | 0) == (i4 | 0)) break; else i6 = i6 - i4 | 0;
 }
 STACKTOP = i3;
 return;
}
function __ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i(i1, i2, i3, i4, i5) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 var i6 = 0, i7 = 0;
 i1 = STACKTOP;
 HEAP8[i2 + 53 >> 0] = 1;
 if ((HEAP32[i2 + 4 >> 2] | 0) != (i4 | 0)) {
  STACKTOP = i1;
  return;
 }
 HEAP8[i2 + 52 >> 0] = 1;
 i4 = i2 + 16 | 0;
 i6 = HEAP32[i4 >> 2] | 0;
 if (!i6) {
  HEAP32[i4 >> 2] = i3;
  HEAP32[i2 + 24 >> 2] = i5;
  HEAP32[i2 + 36 >> 2] = 1;
  if (!((i5 | 0) == 1 ? (HEAP32[i2 + 48 >> 2] | 0) == 1 : 0)) {
   STACKTOP = i1;
   return;
  }
  HEAP8[i2 + 54 >> 0] = 1;
  STACKTOP = i1;
  return;
 }
 if ((i6 | 0) != (i3 | 0)) {
  i3 = i2 + 36 | 0;
  HEAP32[i3 >> 2] = (HEAP32[i3 >> 2] | 0) + 1;
  HEAP8[i2 + 54 >> 0] = 1;
  STACKTOP = i1;
  return;
 }
 i3 = i2 + 24 | 0;
 i6 = HEAP32[i3 >> 2] | 0;
 if ((i6 | 0) == 2) {
  HEAP32[i3 >> 2] = i5;
  i7 = i5;
 } else i7 = i6;
 if (!((i7 | 0) == 1 ? (HEAP32[i2 + 48 >> 2] | 0) == 1 : 0)) {
  STACKTOP = i1;
  return;
 }
 HEAP8[i2 + 54 >> 0] = 1;
 STACKTOP = i1;
 return;
}
function __ZNK10__cxxabiv117__class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib(i1, i2, i3, i4, i5) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 var i6 = 0;
 i5 = STACKTOP;
 if ((HEAP32[i2 + 8 >> 2] | 0) == (i1 | 0)) {
  if ((HEAP32[i2 + 4 >> 2] | 0) != (i3 | 0)) {
   STACKTOP = i5;
   return;
  }
  i6 = i2 + 28 | 0;
  if ((HEAP32[i6 >> 2] | 0) == 1) {
   STACKTOP = i5;
   return;
  }
  HEAP32[i6 >> 2] = i4;
  STACKTOP = i5;
  return;
 }
 if ((HEAP32[i2 >> 2] | 0) != (i1 | 0)) {
  STACKTOP = i5;
  return;
 }
 if ((HEAP32[i2 + 16 >> 2] | 0) != (i3 | 0) ? (i1 = i2 + 20 | 0, (HEAP32[i1 >> 2] | 0) != (i3 | 0)) : 0) {
  HEAP32[i2 + 32 >> 2] = i4;
  HEAP32[i1 >> 2] = i3;
  i3 = i2 + 40 | 0;
  HEAP32[i3 >> 2] = (HEAP32[i3 >> 2] | 0) + 1;
  if ((HEAP32[i2 + 36 >> 2] | 0) == 1 ? (HEAP32[i2 + 24 >> 2] | 0) == 2 : 0) HEAP8[i2 + 54 >> 0] = 1;
  HEAP32[i2 + 44 >> 2] = 4;
  STACKTOP = i5;
  return;
 }
 if ((i4 | 0) != 1) {
  STACKTOP = i5;
  return;
 }
 HEAP32[i2 + 32 >> 2] = 1;
 STACKTOP = i5;
 return;
}
function __ZNK10__cxxabiv117__class_type_info9can_catchEPKNS_16__shim_type_infoERPv(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 var i4 = 0, i5 = 0, i6 = 0, i7 = 0, i8 = 0;
 i4 = STACKTOP;
 STACKTOP = STACKTOP + 64 | 0;
 i5 = i4;
 if ((i1 | 0) == (i2 | 0)) {
  i6 = 1;
  STACKTOP = i4;
  return i6 | 0;
 }
 if (!i2) {
  i6 = 0;
  STACKTOP = i4;
  return i6 | 0;
 }
 i7 = ___dynamic_cast(i2, 832, 888, 0) | 0;
 if (!i7) {
  i6 = 0;
  STACKTOP = i4;
  return i6 | 0;
 }
 i2 = i5 + 0 | 0;
 i8 = i2 + 56 | 0;
 do {
  HEAP32[i2 >> 2] = 0;
  i2 = i2 + 4 | 0;
 } while ((i2 | 0) < (i8 | 0));
 HEAP32[i5 >> 2] = i7;
 HEAP32[i5 + 8 >> 2] = i1;
 HEAP32[i5 + 12 >> 2] = -1;
 HEAP32[i5 + 48 >> 2] = 1;
 FUNCTION_TABLE_viiii[HEAP32[(HEAP32[i7 >> 2] | 0) + 28 >> 2] & 3](i7, i5, HEAP32[i3 >> 2] | 0, 1);
 if ((HEAP32[i5 + 24 >> 2] | 0) != 1) {
  i6 = 0;
  STACKTOP = i4;
  return i6 | 0;
 }
 HEAP32[i3 >> 2] = HEAP32[i5 + 16 >> 2];
 i6 = 1;
 STACKTOP = i4;
 return i6 | 0;
}
function __ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 var i5 = 0, i6 = 0;
 i1 = STACKTOP;
 i5 = i2 + 16 | 0;
 i6 = HEAP32[i5 >> 2] | 0;
 if (!i6) {
  HEAP32[i5 >> 2] = i3;
  HEAP32[i2 + 24 >> 2] = i4;
  HEAP32[i2 + 36 >> 2] = 1;
  STACKTOP = i1;
  return;
 }
 if ((i6 | 0) != (i3 | 0)) {
  i3 = i2 + 36 | 0;
  HEAP32[i3 >> 2] = (HEAP32[i3 >> 2] | 0) + 1;
  HEAP32[i2 + 24 >> 2] = 2;
  HEAP8[i2 + 54 >> 0] = 1;
  STACKTOP = i1;
  return;
 }
 i3 = i2 + 24 | 0;
 if ((HEAP32[i3 >> 2] | 0) != 2) {
  STACKTOP = i1;
  return;
 }
 HEAP32[i3 >> 2] = i4;
 STACKTOP = i1;
 return;
}
function _memcpy(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 var i4 = 0;
 if ((i3 | 0) >= 4096) return _emscripten_memcpy_big(i1 | 0, i2 | 0, i3 | 0) | 0;
 i4 = i1 | 0;
 if ((i1 & 3) == (i2 & 3)) {
  while (i1 & 3) {
   if (!i3) return i4 | 0;
   HEAP8[i1 >> 0] = HEAP8[i2 >> 0] | 0;
   i1 = i1 + 1 | 0;
   i2 = i2 + 1 | 0;
   i3 = i3 - 1 | 0;
  }
  while ((i3 | 0) >= 4) {
   HEAP32[i1 >> 2] = HEAP32[i2 >> 2];
   i1 = i1 + 4 | 0;
   i2 = i2 + 4 | 0;
   i3 = i3 - 4 | 0;
  }
 }
 while ((i3 | 0) > 0) {
  HEAP8[i1 >> 0] = HEAP8[i2 >> 0] | 0;
  i1 = i1 + 1 | 0;
  i2 = i2 + 1 | 0;
  i3 = i3 - 1 | 0;
 }
 return i4 | 0;
}
function __ZNK10__cxxabiv120__si_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib(i1, i2, i3, i4, i5, i6) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 i6 = i6 | 0;
 var i7 = 0, i8 = 0;
 i7 = STACKTOP;
 if ((i1 | 0) == (HEAP32[i2 + 8 >> 2] | 0)) {
  __ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i(0, i2, i3, i4, i5);
  STACKTOP = i7;
  return;
 } else {
  i8 = HEAP32[i1 + 8 >> 2] | 0;
  FUNCTION_TABLE_viiiiii[HEAP32[(HEAP32[i8 >> 2] | 0) + 20 >> 2] & 3](i8, i2, i3, i4, i5, i6);
  STACKTOP = i7;
  return;
 }
}
function __Znwj(i1) {
 i1 = i1 | 0;
 var i2 = 0, i3 = 0, i4 = 0, i5 = 0;
 i2 = STACKTOP;
 i3 = (i1 | 0) == 0 ? 1 : i1;
 i1 = _malloc(i3) | 0;
 if (i1) {
  i4 = i1;
  STACKTOP = i2;
  return i4 | 0;
 }
 while (1) {
  i1 = __ZSt15get_new_handlerv() | 0;
  if (!i1) {
   i5 = 4;
   break;
  }
  FUNCTION_TABLE_v[i1 & 0]();
  i1 = _malloc(i3) | 0;
  if (i1) {
   i4 = i1;
   i5 = 5;
   break;
  }
 }
 if ((i5 | 0) == 4) {
  i3 = ___cxa_allocate_exception(4) | 0;
  HEAP32[i3 >> 2] = 672;
  ___cxa_throw(i3 | 0, 720, 1);
 } else if ((i5 | 0) == 5) {
  STACKTOP = i2;
  return i4 | 0;
 }
 return 0;
}
function __ZNK10__cxxabiv120__si_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 var i5 = 0, i6 = 0;
 i5 = STACKTOP;
 if ((i1 | 0) == (HEAP32[i2 + 8 >> 2] | 0)) {
  __ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi(0, i2, i3, i4);
  STACKTOP = i5;
  return;
 } else {
  i6 = HEAP32[i1 + 8 >> 2] | 0;
  FUNCTION_TABLE_viiii[HEAP32[(HEAP32[i6 >> 2] | 0) + 28 >> 2] & 3](i6, i2, i3, i4);
  STACKTOP = i5;
  return;
 }
}
function _memset(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 var i4 = 0, i5 = 0, i6 = 0, i7 = 0;
 i4 = i1 + i3 | 0;
 if ((i3 | 0) >= 20) {
  i2 = i2 & 255;
  i5 = i1 & 3;
  i6 = i2 | i2 << 8 | i2 << 16 | i2 << 24;
  i7 = i4 & ~3;
  if (i5) {
   i5 = i1 + 4 - i5 | 0;
   while ((i1 | 0) < (i5 | 0)) {
    HEAP8[i1 >> 0] = i2;
    i1 = i1 + 1 | 0;
   }
  }
  while ((i1 | 0) < (i7 | 0)) {
   HEAP32[i1 >> 2] = i6;
   i1 = i1 + 4 | 0;
  }
 }
 while ((i1 | 0) < (i4 | 0)) {
  HEAP8[i1 >> 0] = i2;
  i1 = i1 + 1 | 0;
 }
 return i1 - i3 | 0;
}
function copyTempDouble(i1) {
 i1 = i1 | 0;
 HEAP8[tempDoublePtr >> 0] = HEAP8[i1 >> 0];
 HEAP8[tempDoublePtr + 1 >> 0] = HEAP8[i1 + 1 >> 0];
 HEAP8[tempDoublePtr + 2 >> 0] = HEAP8[i1 + 2 >> 0];
 HEAP8[tempDoublePtr + 3 >> 0] = HEAP8[i1 + 3 >> 0];
 HEAP8[tempDoublePtr + 4 >> 0] = HEAP8[i1 + 4 >> 0];
 HEAP8[tempDoublePtr + 5 >> 0] = HEAP8[i1 + 5 >> 0];
 HEAP8[tempDoublePtr + 6 >> 0] = HEAP8[i1 + 6 >> 0];
 HEAP8[tempDoublePtr + 7 >> 0] = HEAP8[i1 + 7 >> 0];
}
function __ZNK10__cxxabiv117__class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib(i1, i2, i3, i4, i5, i6) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 i6 = i6 | 0;
 i6 = STACKTOP;
 if ((HEAP32[i2 + 8 >> 2] | 0) != (i1 | 0)) {
  STACKTOP = i6;
  return;
 }
 __ZNK10__cxxabiv117__class_type_info29process_static_type_above_dstEPNS_19__dynamic_cast_infoEPKvS4_i(0, i2, i3, i4, i5);
 STACKTOP = i6;
 return;
}
function __ZNK10__cxxabiv117__class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 var i5 = 0;
 i5 = STACKTOP;
 if ((HEAP32[i2 + 8 >> 2] | 0) != (i1 | 0)) {
  STACKTOP = i5;
  return;
 }
 __ZNK10__cxxabiv117__class_type_info24process_found_base_classEPNS_19__dynamic_cast_infoEPvi(0, i2, i3, i4);
 STACKTOP = i5;
 return;
}
function copyTempFloat(i1) {
 i1 = i1 | 0;
 HEAP8[tempDoublePtr >> 0] = HEAP8[i1 >> 0];
 HEAP8[tempDoublePtr + 1 >> 0] = HEAP8[i1 + 1 >> 0];
 HEAP8[tempDoublePtr + 2 >> 0] = HEAP8[i1 + 2 >> 0];
 HEAP8[tempDoublePtr + 3 >> 0] = HEAP8[i1 + 3 >> 0];
}
function dynCall_viiiiii(i1, i2, i3, i4, i5, i6, i7) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 i6 = i6 | 0;
 i7 = i7 | 0;
 FUNCTION_TABLE_viiiiii[i1 & 3](i2 | 0, i3 | 0, i4 | 0, i5 | 0, i6 | 0, i7 | 0);
}
function dynCall_viiiii(i1, i2, i3, i4, i5, i6) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 i6 = i6 | 0;
 FUNCTION_TABLE_viiiii[i1 & 3](i2 | 0, i3 | 0, i4 | 0, i5 | 0, i6 | 0);
}
function dynCall_viiii(i1, i2, i3, i4, i5) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 FUNCTION_TABLE_viiii[i1 & 3](i2 | 0, i3 | 0, i4 | 0, i5 | 0);
}
function dynCall_iiii(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 return FUNCTION_TABLE_iiii[i1 & 1](i2 | 0, i3 | 0, i4 | 0) | 0;
}
function runPostSets() {}
function _strlen(i1) {
 i1 = i1 | 0;
 var i2 = 0;
 i2 = i1;
 while (HEAP8[i2 >> 0] | 0) i2 = i2 + 1 | 0;
 return i2 - i1 | 0;
}
function stackAlloc(i1) {
 i1 = i1 | 0;
 var i2 = 0;
 i2 = STACKTOP;
 STACKTOP = STACKTOP + i1 | 0;
 STACKTOP = STACKTOP + 15 & -16;
 return i2 | 0;
}
function __ZN10__cxxabiv120__si_class_type_infoD0Ev(i1) {
 i1 = i1 | 0;
 var i2 = 0;
 i2 = STACKTOP;
 __ZdlPv(i1);
 STACKTOP = i2;
 return;
}
function __ZN10__cxxabiv117__class_type_infoD0Ev(i1) {
 i1 = i1 | 0;
 var i2 = 0;
 i2 = STACKTOP;
 __ZdlPv(i1);
 STACKTOP = i2;
 return;
}
function b5(i1, i2, i3, i4, i5, i6) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 i6 = i6 | 0;
 abort(5);
}
function __Znaj(i1) {
 i1 = i1 | 0;
 var i2 = 0, i3 = 0;
 i2 = STACKTOP;
 i3 = __Znwj(i1) | 0;
 STACKTOP = i2;
 return i3 | 0;
}
function __ZNSt9bad_allocD0Ev(i1) {
 i1 = i1 | 0;
 var i2 = 0;
 i2 = STACKTOP;
 __ZdlPv(i1);
 STACKTOP = i2;
 return;
}
function setThrew(i1, i2) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 if (!__THREW__) {
  __THREW__ = i1;
  threwValue = i2;
 }
}
function b1(i1, i2, i3, i4, i5) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 i5 = i5 | 0;
 abort(1);
}
function __ZSt15get_new_handlerv() {
 var i1 = 0;
 i1 = HEAP32[184] | 0;
 HEAP32[184] = i1 + 0;
 return i1 | 0;
}
function dynCall_ii(i1, i2) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 return FUNCTION_TABLE_ii[i1 & 1](i2 | 0) | 0;
}
function __ZdaPv(i1) {
 i1 = i1 | 0;
 var i2 = 0;
 i2 = STACKTOP;
 __ZdlPv(i1);
 STACKTOP = i2;
 return;
}
function __ZdlPv(i1) {
 i1 = i1 | 0;
 var i2 = 0;
 i2 = STACKTOP;
 _free(i1);
 STACKTOP = i2;
 return;
}
function b6(i1, i2, i3, i4) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 i4 = i4 | 0;
 abort(6);
}
function dynCall_vi(i1, i2) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 FUNCTION_TABLE_vi[i1 & 7](i2 | 0);
}
function b0(i1, i2, i3) {
 i1 = i1 | 0;
 i2 = i2 | 0;
 i3 = i3 | 0;
 abort(0);
 return 0;
}
function __ZNK10__cxxabiv116__shim_type_info5noop2Ev(i1) {
 i1 = i1 | 0;
 return;
}
function __ZNK10__cxxabiv116__shim_type_info5noop1Ev(i1) {
 i1 = i1 | 0;
 return;
}
function __ZN10__cxxabiv116__shim_type_infoD2Ev(i1) {
 i1 = i1 | 0;
 return;
}
function dynCall_v(i1) {
 i1 = i1 | 0;
 FUNCTION_TABLE_v[i1 & 0]();
}
function __ZNKSt9bad_alloc4whatEv(i1) {
 i1 = i1 | 0;
 return 688;
}
function __ZNSt9type_infoD2Ev(i1) {
 i1 = i1 | 0;
 return;
}
function __ZNSt9exceptionD2Ev(i1) {
 i1 = i1 | 0;
 return;
}
function __ZNSt9bad_allocD2Ev(i1) {
 i1 = i1 | 0;
 return;
}
function stackRestore(i1) {
 i1 = i1 | 0;
 STACKTOP = i1;
}
function setTempRet0(i1) {
 i1 = i1 | 0;
 tempRet0 = i1;
}
function b3(i1) {
 i1 = i1 | 0;
 abort(3);
 return 0;
}
function getTempRet0() {
 return tempRet0 | 0;
}
function stackSave() {
 return STACKTOP | 0;
}
function b2(i1) {
 i1 = i1 | 0;
 abort(2);
}
function b4() {
 abort(4);
}

// EMSCRIPTEN_END_FUNCS
  var FUNCTION_TABLE_iiii = [b0,__ZNK10__cxxabiv117__class_type_info9can_catchEPKNS_16__shim_type_infoERPv];
  var FUNCTION_TABLE_viiiii = [b1,__ZNK10__cxxabiv117__class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib,__ZNK10__cxxabiv120__si_class_type_info16search_below_dstEPNS_19__dynamic_cast_infoEPKvib,b1];
  var FUNCTION_TABLE_vi = [b2,__ZNSt9bad_allocD2Ev,__ZNSt9bad_allocD0Ev,__ZN10__cxxabiv116__shim_type_infoD2Ev,__ZN10__cxxabiv117__class_type_infoD0Ev,__ZNK10__cxxabiv116__shim_type_info5noop1Ev,__ZNK10__cxxabiv116__shim_type_info5noop2Ev,__ZN10__cxxabiv120__si_class_type_infoD0Ev];
  var FUNCTION_TABLE_ii = [b3,__ZNKSt9bad_alloc4whatEv];
  var FUNCTION_TABLE_v = [b4];
  var FUNCTION_TABLE_viiiiii = [b5,__ZNK10__cxxabiv117__class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib,__ZNK10__cxxabiv120__si_class_type_info16search_above_dstEPNS_19__dynamic_cast_infoEPKvS4_ib,b5];
  var FUNCTION_TABLE_viiii = [b6,__ZNK10__cxxabiv117__class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi,__ZNK10__cxxabiv120__si_class_type_info27has_unambiguous_public_baseEPNS_19__dynamic_cast_infoEPvi,b6];

  return { _strlen: _strlen, _free: _free, _main: _main, _memset: _memset, _malloc: _malloc, _memcpy: _memcpy, runPostSets: runPostSets, stackAlloc: stackAlloc, stackSave: stackSave, stackRestore: stackRestore, setThrew: setThrew, setTempRet0: setTempRet0, getTempRet0: getTempRet0, dynCall_iiii: dynCall_iiii, dynCall_viiiii: dynCall_viiiii, dynCall_vi: dynCall_vi, dynCall_ii: dynCall_ii, dynCall_v: dynCall_v, dynCall_viiiiii: dynCall_viiiiii, dynCall_viiii: dynCall_viiii };
}
