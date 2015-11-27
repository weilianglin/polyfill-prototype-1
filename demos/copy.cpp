
#include<stdio.h>
#include<sys/time.h>
struct vec {
  int x, y, z;
  int r, g, b;
  vec(int x_, int y_, int z_, int r_, int g_, int b_) : x(x_), y(y_), z(z_), r(r_), g(g_), b(b_) {}
  static vec add(vec a, vec b) {
    return vec(a.x+b.x, a.y+b.y, a.z+b.z, a.r+b.r, a.g+b.g, a.b+b.b);
  }
  void norm() {
    x %= 1024;
    y %= 1024;
    z %= 1024;
    r %= 1024;
    b %= 1024;
    g %= 1024;
  }
  int sum() { return x + y + z + r + g + b; }
};
int main(int argc, char **argv) {
  struct timeval tv1, tv2;
  gettimeofday(&tv1, NULL);
  int arg = 1250;

  int total = 0;
  for (int i = 0; i < arg; i++) {
    for (int j = 0; j < 50000; j++) {
      vec c(i, i+i%10, j*2, i%255, j%120, i%15);
      vec d(j+i%10, j*2, j%255, i%120, j%15, j);
      vec e = c;
      c.norm();
      d.norm();
      vec f = vec::add(c, d);
      f = vec::add(e, f);
      f.norm();
      f = vec::add(d, f);
      total += f.sum() % 100;
      total %= 10240;
    }
  }
  gettimeofday(&tv2, NULL);
  printf("sum:%d\n", total);
  printf ("Total time = %f seconds\n",
      (double) (tv2.tv_usec - tv1.tv_usec) / 1000000 +
      (double) (tv2.tv_sec - tv1.tv_sec));
  return 0;
}

