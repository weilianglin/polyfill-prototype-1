#!/bin/bash

PACKER=../tools/pack-asmjs-v8
if [ $# -lt 1 ]; then
  echo post.sh js_file
  exit 0
fi
NAME=${1%.js}
FILE="${NAME}.asm_module.js"
RUNFILE="${NAME}.wasm.js"
WASM="${NAME}.wasm"
POS="runtime"
PRE=""
CUR=""
INIT=false
echo > $FILE
echo > $RUNFILE

# 1. preprocess
if [ -f "$1" ]; then
  while read -r LINE
  do
    PRE=$CUR
    CUR=$LINE
    if [ "$POS" = "runtime" ];then
      echo "$PRE" >> ${RUNFILE}
    elif [ "$POS" = "start" ]; then
      POS="module"
    elif [ "$POS" = "end" ]; then
      echo "$PRE" >> $FILE
      POS="arguments"
      continue
    elif [ "$POS" = "arguments" ]; then
      echo "
// some helper functions for imported variables
Module.asmLibraryArg.getSTACKTOP = function getSTACKTOP() { return STACKTOP; };
Module.asmLibraryArg.getSTACK_MAX = function getSTACK_MAX() { return STACK_MAX; }
Module.asmLibraryArg.getTempDoublePtr = function getTempDoublePtr() { return tempDoublePtr; }
Module.asmLibraryArg.getABORT = function getABORT() { return ABORT; }
Module.asmLibraryArg.getInf = function getInf() { return Infinity; }
Module.asmLibraryArg.getCttz_i8 = function getCttz_i8() { return cttz_i8; }

// wasm module
var wasm_buffer = readbuffer(\"${NAME}.wasm\");
_WASMEXP_.verifyModule(wasm_buffer, Module.asmLibraryArg, buffer);
var asm = _WASMEXP_.instantiateModule(wasm_buffer, Module.asmLibraryArg, buffer);
" >> $RUNFILE
      POS="runtime"
      continue
    elif [ "$POS" = "func_start" ]; then
      echo "\
var getSTACKTOP = env.getSTACKTOP;
var getSTACK_MAX = env.getSTACK_MAX;
var getTempDoublePtr = env.getTempDoublePtr;
var getABORT = env.getABORT;
var getCttz_i8 = env.getCttz_i8;

${PRE}
function _env_init() {
  STACKTOP = getSTACKTOP()|0;
  STACK_MAX=getSTACK_MAX()|0;
  tempDoublePtr=getTempDoublePtr()|0;
  ABORT=getABORT()|0;
  cttz_i8 = getCttz_i8()|0;
}" >> $FILE
      POS="module"
    
    elif [ "$POS" = "module" ]; then
      echo "$PRE" >> $FILE
    fi

    if [ "$CUR" = '// EMSCRIPTEN_START_ASM' ]; then
      POS="start"
    elif [ "$CUR" = '// EMSCRIPTEN_END_ASM' ]; then
      POS="end"
    elif [ "$CUR" = '// EMSCRIPTEN_START_FUNCS' ]; then
      POS="func_start"
    else
      if [ "${CUR#var asm =}" != "$CUR" ]; then
        CUR="function asmModule(global,env,buffer) {"
        continue
      fi
      if [ "$CUR" = "})" -a "$POS" = "module" ]; then
        CUR="}"
        continue
      fi
      if [ "${CUR#function _main}" != "$CUR" ]; then
        INIT=true
        continue
      fi
      if [ "$INIT" = true ]; then
        if [ "${CUR#*= STACKTOP;}" != "$CUR" ]; then
          echo "_env_init();" >> $FILE
          INIT=false
        fi
      fi
    fi
  done < $1
fi

# 2. conversion
if [ -f "$FILE" ]; then
  $PACKER $FILE $WASM
fi
