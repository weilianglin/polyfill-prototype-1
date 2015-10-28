d8=~/Work/v8/out/x64.release/d8

function run() {
  if [ $# -lt 1 ]; then
    echo "info.sh test_name"
    exit 1
  fi
  case=$1

  echo "====== $case ======"
  if [ -e "${case}.cpp" ]; then
    echo "  === c++ ==="
    g++ -std=c++11 -O2 -o ${case} ${case}.cpp
    g++ -std=c++11 -s -Os -o ${case}-s ${case}.cpp
    ls -l ${case}
    ls -l ${case}-s
    ./${case}
  fi

  if [ -e "${case}.js" ]; then
    echo "  === asm.js ==="
    ls -l ${case}.js
    cp ${case}.js demo.js
    $d8 test-asm.js --noturbo_osr --trace_parse
  fi

  if [ -e "${case}.wasm" ]; then
    echo "  === wasm ==="
    ls -l ${case}.wasm
    cp ${case}.wasm demo.wasm
    $d8 verify-wasm.js --trace_wasm_decode_time
    $d8 test-wasm.js
  fi
  echo
}

cases="primes
copy
corrections"

for case in $cases
do
  run $case
done
