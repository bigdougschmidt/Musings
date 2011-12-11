#!/usr/bin/env python
# Subet-sum is NP-Complete, similar to knapsack or rucksack problem.
import string
import sys
import cPickle # Python object serialization, marshalling, de-serialization

""" Pickling is the process whereby a Python object hierarchy is converted into a 
    byte stream, and unpickling is the inverse operation, whereby a byte stream is 
    converted back into an object hierarchy. Pickling (and unpickling) is alternatively 
    known as serialization, marshalling, [1] or flattening, however, to avoid 
    confusion, the terms used here are pickling and unpickling. """

class MemoizeMutable:
  """ Memoize(fn) - an instance which acts like fn but memoizes its arguments
      Will work on functions with mutable arguments (slower than Memoize) """
  def __init__(self, fn):
      self.fn = fn
      self.memo = {}
  def __call__(self, *args):
      import cPickle
      str = cPickle.dumps(args) # dumps(obj, protocol=0) Return a string containing an object in pickle format
      if not self.memo.has_key(str):
          self.memo[str] = self.fn(*args)
      return self.memo[str]

class Memoize:
  """Memoize(fn) - an instance which acts like fn but memoizes its arguments
     Will only work on functions with non-mutable arguments. """
  def __init__(self, fn):
      self.fn = fn
      self.memo = {} # Creation of a 1:Many Dictionary called memo
  def __call__(self, *args):  # *args passes the parameters to the function as a tuple
      print "Entering", self.fn.__name__
      if not self.memo.has_key(args):
          self.memo[args] = self.fn(*args)  # *args passes the parameters to the function as a tuple
      print "Exited", self.fn.__name__
      return self.memo[args]

def subsetsum(nums, target):  #http://pastebin.com/pyHEXVVK
  """ Explanation:
  We define cansum(i,s) = can we select a subset of nums[0:i] that sums to s?
  Note that if s==0 then we can just select the empty subset, 
  so cansum(anything, 0) = true.
  Otherwise, it's true if we still have numbers (i >= 0) and we can can 
  create s without using the current number, 
  or we can create s-nums[i] with using the current number. """
  @Memoize  # Decorator Function using Class Memoize. For info see URL: http://bit.ly/qW0ak
  # @ means to pass a function object through another function and assign the result to the original function.
  def cansum(i, s): # Can we select a subset of nums from 0 to i that sum to s?
    print "Inside cansum()"
    return s==0 or (i>=0 and (cansum(i-1,s) or cansum(i-1, s-nums[i])))
  return cansum(len(nums)-1, target)
  
def main():
  Xnums=[3, 4, 9, 14, 15, 19, 28, 37, 47, 50, 54, 56, 59, 61, 70, 73, 78, 81, 92, 95, 97, 99]
  nums=[2, 3, 4]
  for x in nums:
    print "Target = ",x, " ", subsetsum(nums,x)

if __name__ == '__main__':
  main()