#!/usr/bin/env python
# Manacher's Alogrithm for detecting largest sub-string s of S such that the revers of s is exactly the same as S
import string
problemString = 'FourscoreandsevenyearsagoourfaathersbroughtforthonthiscontainentanewnationconceivedinzLibertyanddedicatedtothepropositionthatallmenarecreatedequalNowweareengagedinagreahtcivilwartestingwhetherthatnaptionoranynartionsoconceivedandsodedicatedcanlongendureWeareqmetonagreatbattlefiemldoftzhatwarWehavecometodedicpateaportionofthatfieldasafinalrestingplaceforthosewhoheregavetheirlivesthatthatnationmightliveItisaltogetherfangandproperthatweshoulddothisButinalargersensewecannotdedicatewecannotconsecratewecannothallowthisgroundThebravelmenlivinganddeadwhostruggledherehaveconsecrateditfaraboveourpoorponwertoaddordetractTgheworldadswfilllittlenotlenorlongrememberwhatwesayherebutitcanneverforgetwhattheydidhereItisforusthelivingrathertobededicatedheretotheulnfinishedworkwhichtheywhofoughtherehavethusfarsonoblyadvancedItisratherforustobeherededicatedtothegreattdafskremainingbeforeusthatfromthesehonoreddeadwetakeincreaseddevotiontothatcauseforwhichtheygavethelastpfullmeasureofdevotionthatweherehighlyresolvethatthesedeadshallnothavediedinvainthatthisnationunsderGodshallhaveanewbirthoffreedomandthatgovernmentofthepeoplebythepeopleforthepeopleshallnotperishfromtheearth'
problemString0 = 'Four score and seven years ago our faathersbroughtforthonthiscontainentanewnationconceivedinzLibertyanddedicatedtothepropositionthatallmenarecreatedequalNowweareengagedinagreahtcivilwartestingwhetherthatnaptionoranynartionsoconceivedandsodedicatedcanlongendureWeareqmetonagreatbattlefiemldoftzhatwarWehavecometodedicpateaportionofthatfieldasafinalrestingplaceforthosewhoheregavetheirlivesthatthatnationmightliveItisaltogetherfangandproperthatweshoulddothisButinalargersensewecannotdedicatewecannotconsecratewecannothallowthisgroundThebravelmenlivinganddeadwhostruggledherehaveconsecrateditfaraboveourpoorponwertoaddordetractTgheworldadswfilllittlenotlenorlongrememberwhatwesayherebutitcanneverforgetwhattheydidhereItisforusthelivingrathertobededicatedheretotheulnfinishedworkwhichtheywhofoughtherehavethusfarsonoblyadvancedItisratherforustobeherededicatedtothegreattdafskremainingbeforeusthatfromthesehonoreddeadwetakeincreaseddevotiontothatcauseforwhichtheygavethelastpfullmeasureofdevotionthatweherehighlyresolvethatthesedeadshallnothavediedinvainthatthisnationunsderGodshallhaveanewbirthoffreedomandthatgovernmentofthepeoplebythepeopleforthepeopleshallnotperishfromtheearth'
problemString1 = 'Four RACECAR and seven years ago'
problemString2 = 'aca'

# FIRST: CLEANUP THE STRING
# Make it lower case to compare letters properly
problemString = problemString.lower()
# Eliminate any spaces
problemString = string.replace(problemString, " ", "")
# Print out the problem string for viewing purposes
## print '\nThe original problem string is: \n' + problemString + '\n'

# IMPORTANT FUNCTION: TEST if a WORD is a Palindrome; Returns TRUE 
def isPalindrome(word):
  return word == word[::-1]
  
problemStringLength = len(problemString) # Get length
int(problemStringLength) # Convert str to int for later range usage
print "The Problem String length is: %i" % problemStringLength + "\n"

# First, check the problem string itself, just in case
print 'Is the problem string itself a Palindrome? '  
print isPalindrome(problemString)
print "\n"

# Create the list to hold all the palindromes you find!
palindromelist = []

# OUTER LOOP to get baseletter
count = 0
while (count < problemStringLength): # FIX THIS: Should probably be <= to get to the last letter
  baseletter = problemString[count]  # The letter at the index position equal to count
  print "The baseletter is ", baseletter
  
  # Indicate baseletter to have something to compare against
  # Get base letter from OUTER LOOP, but for now set it manually
  ##baseletter = 'r'
  
  # Iterate through the problemString looking for 'pairs' aka other instances of current letter, then checking isPalindrome()
  for i in range(count+1, len(problemString), 1): # i is int; This delimits a range from 1..1, 1..2, 1..3, 1..length of problemString
    # Show problemString as it's traversed from start to end
    print "problemString so far: %s" % problemString[:i] # FIX THIS: needs to include LAST LETTER!
    print "Length of problemString: %i" %i # i is the length of the problemString at this point in the for-loop
  
  
    # Only care about Length of problemString to get letterindex; Indexes from 0..len(string)-1
    letterindex = i-1
    # print "Letter Index is: %i" % letterindex

  
    # Indicate next letter in the loop being examined
    stringincludingnextletter = problemString[:i+1] # Basically the value of i
    lastletterofsubstring = stringincludingnextletter[-1]
    print "problemString w/next letter being examined: %s" % stringincludingnextletter
    print "Next letter to compare: %s" % lastletterofsubstring
    print "Comparing Baseletter (%s) with Nextletter (%s)" % (baseletter, lastletterofsubstring)
  
  
    # Compare the two letters against each other, aka: check for match
    if baseletter == lastletterofsubstring:
      print "PAIR DETECTED! SCANNING FOR PALINDROME..."
      # Recreate substring from baseletter to lastletterofsubstring
      # Need the index position for the baseletter of the OUTER LOOP
      #   to the index position of lastletterof substring.
      ##pairsubstring = problemString[count:letterindex]
      IndexPositionOfbaseletter = count
      IndexPositionOflastletterofsubstring = i+1
      palindromesubstring = problemString[IndexPositionOfbaseletter:IndexPositionOflastletterofsubstring]
    
  	  # Check this substring for isPalindrome
      if isPalindrome(palindromesubstring):
        print "PALINDROME FOUND: ", palindromesubstring
        palindromelist.append(palindromesubstring)
      else:
        print "PALINDROME NOT FOUND."
    print "\n"
  
  count += 1
  # End While Loop

# Release the palindromes!
print "\n"
print "---HERE ARE YOUR PALINDROMES---"
print palindromelist
f = open('PAL.txt', 'w+')
f.writelines(palindromelist)
f.close()
print "---LIST WRITTEN TO PAL.txt-----"
print "\n"