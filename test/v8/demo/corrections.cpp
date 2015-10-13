#include<iostream>
#include <chrono>
#include <ctime>
using namespace std;

int main() {
  chrono::time_point<std::chrono::system_clock> start, end;
  start = chrono::system_clock::now();
  int N = 20000, M = 7000;

  unsigned int f = 0;
  unsigned short s = 0;
  for (int t = 0; t < M; t++) {
    for (int i = 0; i < N; i++) {
      f += i / ((t % 5)+1);
      if (f > 1000) f /= (t % 3)+1;
      if (i % 4 == 0) f += i * (i % 8 == 0 ? 1 : -1);
      s += (short(f)*short(f)) % 256;
    }
  }
  end = chrono::system_clock::now();
  chrono::duration<double> elapsed_seconds = end-start;
  cout << "  time: " << elapsed_seconds.count() * 1000 << " ms"<< endl;
  cout << "  result: " << f + s<< endl;
  return f + s;
}

