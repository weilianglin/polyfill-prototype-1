d8=~/work/v8/out/x64.release/d8
packer=/home/user/work/wasm/ssg_webpup-wasmpolyfillv8/tools/pack-asmjs-v8

function run() {
  if [ $# -lt 1 ]; then
    echo "info.sh test_name"
    exit 1
  fi
  case=$1

  echo "====== $case ======"
  if [ -e "${case}.cpp" ]; then
    echo "  === c++ ==="
    g++ -O2 -o ${case} ${case}.cpp
    g++ -s -Os -o ${case}-s ${case}.cpp
    g++ -m32 -O2 -o ${case}-32 ${case}.cpp
    g++ -s -Os -o ${case}-32-s ${case}.cpp
    ls -l ${case}
    ls -l ${case}-s
    ls -l ${case}-32
    ls -l ${case}-32-s
    ./${case}
    ./${case}-s
    ./${case}-32
    ./${case}-32-s
  fi

  if [ -e "${case}.js" ]; then
    echo "  === asm.js ==="
    ls -l ${case}.js
    $d8 --noturbo_osr --trace_parse run.js -- asm.js ${case}.js
    $d8 --noturbo_osr run.js -- asm.js ${case}.js

    echo "  === asm-m.js ==="
    yui-compressor ${case}.js > ${case}-m.js
    ls -l ${case}-m.js
    # $d8 --noturbo_osr --trace_parse run.js -- asm.js ${case}.js
    # $d8 --noturbo_osr run.js -- asm.js ${case}.js

    echo "  === wasm ==="
    $packer ${case}.js ${case}.wasm
    $d8 --trace_wasm_decode_time verify-wasm.js -- ${case}.wasm
    $d8 --trace_wasm_decode_time run.js -- wasm ${case}.wasm
    $d8 run.js -- wasm ${case}.wasm

  fi
  echo
}

cases="primes
copy
corrections
memops
fannkuch
fasta
skinning"

for case in $cases
do
  run $case
done
