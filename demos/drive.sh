if [ $# -lt 1 ]; then
  echo `basename $0` create run size case-list
  exit 0
fi

CREATE=false
RUN=false
SIZE=false

NATIVE=false

D8=~/work/v8/out/x64.release/d8
CASE=""


# handle parameters
for var in "$@"
do
  case $var in
    "create")
      CREATE=true
      ;;
    "run")
      RUN=true
      ;;
    "size")
      SIZE=true
      ;;
    "native")
      NATIVE=true
      ;;
    *)
      CASES="$CASES $var"
      ;;
  esac
done

if [ -z "$CASES" ]; then
  for i in `ls *.cpp`
  do
    CASES="$CASES `basename $i .cpp`"
  done
fi

function create () {
  case=$1
  EXTRA_OPTIONS=""
  if [ "$NATIVE" = true ]; then
    echo "== create native =="
    compile $case
  fi

  if [ $case = "raytrace" ]; then
    EXTRA_OPTIONS="-s TOTAL_MEMORY=134217728"
  fi
  echo "== create f64 =="
  emcc -O2 --profiling -g2 ${case}.cpp -o ${case}.js ${EXTRA_OPTIONS}
  bash translate.sh ${case}.js

  echo "== create f32 =="
  emcc -O2 --profiling -g2 ${case}.cpp -o ${case}.f32.js  -s PRECISE_F32=1 ${EXTRA_OPTIONS}
  bash translate.sh ${case}.f32.js
}

function run () {
  case=$1
  if [ "$NATIVE" = true ]; then
    echo "== native x64 =="
    ./${case}
    echo "== native ia32 =="
    ./${case}-32
  fi

  echo "== f64 asm.js =="
  $D8 ${case}.js

  echo "== f64 wasm =="
  $D8 --expose_wasm ${case}.wasm.js

  echo "== f32 asm.js =="
  $D8 ${case}.f32.js

  echo "== f32 wasm =="
  $D8 --expose_wasm ${case}.f32.wasm.js
}
function compile() {
  case=$1
  g++ -O2 -o ${case} ${case}.cpp
  g++ -s -Os -o ${case}-s ${case}.cpp
  g++ -m32 -O2 -o ${case}-32 ${case}.cpp
  g++ -s -Os -o ${case}-32-s ${case}.cpp
}

function size() {
  case=$1
  if [ "$NATIVE" = true ]; then
    echo "=== native size ==="
    ls -l ${case}
    ls -l ${case}-s
    ls -l ${case}-32
    ls -l ${case}-32-s
  fi

  echo "=== asm.js size ==="
  yui-compressor ${case}.asm_module.js > ${case}-m.js
  ls -l ${case}-m.js
  yui-compressor ${case}.f32.asm_module.js > ${case}.f32-m.js
  ls -l ${case}.f32-m.js

  echo "=== wasm size ==="
  ls -l ${case}.wasm
  ls -l ${case}.f32.wasm

}

for case in $CASES
do
  echo ""
  echo "= $case ="
  [ "$CREATE" = true ] && create $case
  [ "$SIZE" = true ] && size $case
  [ "$RUN" = true ] && run $case
done
