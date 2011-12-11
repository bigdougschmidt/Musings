#!/usr/bin/env python
# Calculate nth Fibonacci Number using Iteration; O(n)
import string
import sys
import random
 
def fib(n):
  a, b = 0, 1
  for i in range(n):
    a, b = b, a+b
  return a


def toBinary(n):
  r = []
  while (n > 0):
    r.append(n % 2)
    n = n / 2
  return r


def complextest(a, n):
  """
  test(a, n) -> bool Tests whether n is complex.
  complex numbers are of the form a+bi where a and b are real numbers, i is imaginary
  Returns:
    - True, if n is complex.
    - False, if n is probably prime.
  """
  b = toBinary(n - 1)
  d = 1
  for i in xrange(len(b) - 1, -1, -1):
    x = d
    d = (d * d) % n
    if d == 1 and x != 1 and x != n - 1:
      return True # Complex
    if b[i] == 1:
      d = (d * a) % n
  if d != 1:
    return True # Complex
  return False # Prime


def MillerRabin(n, s = 50):
  """
    MillerRabin(n, s = 1000) -> bool Checks whether n is prime or not
    s = 50 originally, DS changed to 1000 (don't understand why)
    Returns:
      - True, if n is probably prime.
      - False, if n is complex.
  """
  for j in xrange(1, s + 1):
    a = random.randint(1, n - 1)
    if (complextest(a, n)):
      return False # n is complex
  return True # n is prime


# Divisor Generator
def divgen(n):
  for i in xrange(1,n/2+1):
    if n%i == 0:yield i #Yield makes this a Generator Function
  yield n
  
# Divisorator
def divisorator(n, dup = False):
    divisors = []
    i = 0
    if n == 1:
        return {1: 1}
    while 1:
        i += 1
        if dup:
            break
        if i == n:
            break
        if n % i == 0:
            divisors[i:i+1] = [i]
    return divisors


def isprime(n):
  '''check if integer n is a prime'''
  #n = abs(int(n))  # make sure n is a positive integer
  if n < 2:  # 0 and 1 are not primes
    return False
  if n == 2:  # 2 is the only even prime number
    return True
  if n % 2 == 0:
    return False
  max = n**0.5+1
  i = 3
  while i <= max:
    if n % i == 0:
      return False
    i+=2
  return True
  

def main():
  try:
    while True:
      primesum = 0
      primesumtemp = 0
      print '--------------------------'
      n = int(raw_input("Find divisors for any number? (Enter '0' to Quit): "))
      if n == 0:
        break
      else:
        #if MillerRabin(int(n)):
        if isprime(int(n)):
          print 'The number you entered is PRIME.'
        # Get the divisors of the input number "n"
        for i in xrange(1,(n/2)+1):
          if n%i == 0:
            print "Is a Divisor: ",i
            if isprime(int(i)):
              print "____Divisor is Prime: ",i
              primesumtemp = int(i)
              # print "Primesumtemp = ", primesumtemp # Debug
              primesum = primesum + primesumtemp
              # print "Primesum = ", primesum # Debug
      print "The sum of the prime divisors (excluding 1) is: ", primesum    
  except IOError, e:
    print 'IO Error: ', e


if __name__ == '__main__':
  main()