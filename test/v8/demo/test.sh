d8=~/work/v8/out/x64.release/d8
packer=/home/user/work/wasm/ssg_webpup-wasmpolyfillv8/tools/pack-asmjs-v8

function run() {
  if [ $# -lt 1 ]; then
    echo "test.sh test_name"
    exit 1
  fi
  case=$1

  echo "====== $case ======"
  if [ -e "${case}.cpp" ]; then
    echo "  === c++ ==="
    #TODO: use LLVM
    g++ -Wno-div-by-zero -O2 -o ${case} ${case}.cpp
    ./${case}
  fi

  if [ -e "${case}.js" ]; then
    cp ${case}.runtime.js emscripten-runtime.js
    echo "  === asm.js ==="
    cp ${case}.js demo.js
    $d8 run-asm.js

    echo "  === wasm ==="
    $packer ${case}.js ${case}.wasm
    cp ${case}.wasm demo.wasm
    $d8 run-wasm.js
  fi
  echo
}

cases="primes
copy
corrections
memops
fannkuch
fasta
skinning
raytrace"

if [ $# -eq 1 ]; then
  cases=$1
fi

for case in $cases
do
  run $case
done
