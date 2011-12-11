#!/usr/bin/env python
# Manacher's Alogrithm for detecting largest sub-string s of S such that the revers of s is exactly the same as S
import string
problemString = 'Four score and seven years ago our faathersbroughtforthonthiscontainentanewnationconceivedinzLibertyanddedicatedtothepropositionthatallmenarecreatedequalNowweareengagedinagreahtcivilwartestingwhetherthatnaptionoranynartionsoconceivedandsodedicatedcanlongendureWeareqmetonagreatbattlefiemldoftzhatwarWehavecometodedicpateaportionofthatfieldasafinalrestingplaceforthosewhoheregavetheirlivesthatthatnationmightliveItisaltogetherfangandproperthatweshoulddothisButinalargersensewecannotdedicatewecannotconsecratewecannothallowthisgroundThebravelmenlivinganddeadwhostruggledherehaveconsecrateditfaraboveourpoorponwertoaddordetractTgheworldadswfilllittlenotlenorlongrememberwhatwesayherebutitcanneverforgetwhattheydidhereItisforusthelivingrathertobededicatedheretotheulnfinishedworkwhichtheywhofoughtherehavethusfarsonoblyadvancedItisratherforustobeherededicatedtothegreattdafskremainingbeforeusthatfromthesehonoreddeadwetakeincreaseddevotiontothatcauseforwhichtheygavethelastpfullmeasureofdevotionthatweherehighlyresolvethatthesedeadshallnothavediedinvainthatthisnationunsderGodshallhaveanewbirthoffreedomandthatgovernmentofthepeoplebythepeopleforthepeopleshallnotperishfromtheearth'

# FIRST: CLEANUP THE STIRING
# Make it lower case to compare letters properly
problemString = problemString.lower()
# Eliminate any spaces
problemString = string.replace(problemString, " ", "")
# Print out the problem string for viewing purposes
## print '\nThe original problem string is: \n' + problemString + '\n'

# IMPORTANT FUNCTION: TEST if a WORD is a Palindrome; Returns TRUE 
def isPalindrome(word):
  return word == word[::-1]
  
# ALGO: Insert special character '#' between each pair of adjacent characters of S, in front of S and at the back of S
# ALGO: Walk through string from 0 - (length-1)
# ALGO: Iterate through the string one letter at a time, use current letter to look for next instance of same letter
# ALGO: When find 2 of same letters, check to see isPalindrome(substring)?
# ALGO: If Palindrome, store VALUE and LENGTH in a list[ ]
# ALGO: When finished iterating through all letters, find longest item in list. This is the solution!

# enumerate() numbers each char in the string
#for letterString, anypairString in enumerate(problemString):
#  print letterString, anypairString

# Get length
problemStringLength = len(problemString)
# Convert str to int for later range usage
int(problemStringLength)
print "The Problem String length is: %i" % problemStringLength + "\n"

# First, check the problem string itself, just in case
print 'Is the problem string itself a Palindrome? '  
print isPalindrome(problemString)
print "\n"

# Outer Interate through the entire string one letter at a time
for thisletter, thisletterindex in enumerate(problemString):

  # Base letter to compare against
  checkletter = thisletter #str
  # Index position of the checkletter
  checkletterindex = int(thisletterindex) #int

  # Inner Iterate through the remainder of the string to find a matching letter in rest of string
  for checkletter, checkletterindex in range(checkletterindex+1, problemStringLength, 1): #The range arguments require int's
    print thisletter, thisletterindex
  
nameList = ['Doug', 'Colleen', 'Jackson', 'Kathryn']
for item, index in enumerate(nameList):
  print 'Number %d %s Schmidt' % (item+1, index)