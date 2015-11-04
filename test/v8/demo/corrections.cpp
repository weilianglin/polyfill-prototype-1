#include<stdio.h>
#include<math.h>
#include<sys/time.h>
int main(int argc, char **argv) {
  struct timeval tv1, tv2;
  gettimeofday(&tv1, NULL);
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
  gettimeofday(&tv2, NULL);
  printf("final: %d:%d.\n", f, s);
  printf ("Total time = %f seconds\n",
      (double) (tv2.tv_usec - tv1.tv_usec) / 1000000 +
      (double) (tv2.tv_sec - tv1.tv_sec));
  return 0;
}

