pushd test/v8
rm -fr *.wasm

testcases="call call_import name_access if while do literal int32 break continue switch compare comma float64 float32 bitwise ternary not convert load-store call_indirect load-store-offset empty"
for file in `echo $testcases`
do
  echo "generate $file wasm"
  ../../tools/pack-asmjs-v8 ${file}.js ${file}.wasm
done

~/work/v8/out/x64.release/d8  assert.js test-wasm.js
popd
