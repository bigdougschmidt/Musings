#!/usr/bin/env python
# Calculate nth Fibonacci Number using Iteration; O(n)
import string
 
def fib(n):
  a, b = 0, 1
  for i in range(n):
    a, b = b, a+b
  return a

def main():
  try:
    while True:
      n = int(raw_input("Enter the Nth Fibonnaci to compute (Enter '0' to Quit): "))
      if n == 0:
        break
      else:
        print fib(n)
  except IOError, e:
    print 'IO Error: ', e
    
if __name__ == '__main__':
  main()