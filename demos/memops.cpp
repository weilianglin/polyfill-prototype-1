#include<stdio.h>
#include<string.h>
#include<stdlib.h>
#include<sys/time.h>

int main(int argc, char **argv) {
  struct timeval tv1, tv2;
  gettimeofday(&tv1, NULL);
  int N = 1024*1024, M = 800;

  int ret = 0;
  char *buf = (char*)malloc(N);
  for (int t = 0; t < M; t++) {
    for (int i = 0; i < N; i++)
      buf[i] = (i + ret)%256;
    for (int i = 0; i < N; i++)
      ret += buf[i] & 1;
    ret = ret % 1000;
  }
  gettimeofday(&tv2, NULL);
  printf("ret: %d.\n", ret);
  printf ("Total time = %f seconds\n",
      (double) (tv2.tv_usec - tv1.tv_usec) / 1000000 +
      (double) (tv2.tv_sec - tv1.tv_sec));
  return 0;
}
