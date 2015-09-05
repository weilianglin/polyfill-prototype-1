#ifndef UTILS_V8_H_
#define UTILS_V8_H_

namespace v8 {

// import from v8/src/base/macros.h
template <class Dest, class Source>
inline Dest bit_cast(Source const& source) {
  //COMPILE_ASSERT(sizeof(Dest) == sizeof(Source), VerifySizesAreEqual);

  Dest dest;
  memcpy(&dest, &source, sizeof(dest));
  return dest;
}
}

#endif  // UTILS_V8_H_
