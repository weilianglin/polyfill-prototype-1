#include<iostream>
#include<cmath>
#include <chrono>
#include <ctime>

using namespace std;

int main() {
  chrono::time_point<std::chrono::system_clock> start, end;
  start = chrono::system_clock::now();
  int arg = 220000;

  int primes = 0, curri = 2;
  while (primes < arg) {
    int ok = true;
    for (int j = 2; j < sqrtf(curri); j++) {
      if (curri % j == 0) {
        ok = false;
        break;
      }
    }
    if (ok) {
      primes++;
    }
    curri++;
  }

  int ret = curri - 1;
  end = chrono::system_clock::now();
  chrono::duration<double> elapsed_seconds = end-start;
  cout << "  time: " << elapsed_seconds.count() * 1000 << " ms"  << endl;
  cout << "  result: " << ret << endl;
  return ret;
}

