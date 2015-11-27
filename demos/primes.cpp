#include<stdio.h>
#include<math.h>
#include<stdlib.h>
#include<sys/time.h>

int main(int argc, char **argv) {
  struct timeval tv1, tv2;
  gettimeofday(&tv1, NULL);
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
  gettimeofday(&tv2, NULL);
  printf("ret: %d.\n", ret);
  printf ("Total time = %f seconds\n",
      (double) (tv2.tv_usec - tv1.tv_usec) / 1000000 +
      (double) (tv2.tv_sec - tv1.tv_sec));
  return ret;
}

