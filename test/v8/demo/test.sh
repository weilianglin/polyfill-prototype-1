if [ $# -lt 1 ]; then
  echo "test.sh test_name"
  exit 1
fi
case=$1
d8=~/work/v8/out/x64.release/d8

if [ -e "${case}.cpp" ]; then
  echo "=== c++ ==="
  g++ -std=c++11 -O2 -o ${case} ${case}.cpp
  ./${case}
fi

if [ -e "${case}.js" ]; then
  echo "=== asm.js ==="
  cp ${case}.js demo.js
  $d8 test-asm.js
fi

if [ -e "${case}.wasm" ]; then
  echo "=== wasm ==="
  cp ${case}.wasm demo.wasm
  $d8 test-wasm.js
fi
