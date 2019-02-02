# print "Hello World!"
# print "Hello Again"
# print "Pat woz ere!"
# print "This is fun."
# print "Yay! Pringint."
# print "I'd much rather you 'not'."
# print 'I "said" do not touch this.'
# print 'I am enjoying Pythons.'

# print "I will now count my chickens:"

# print "Hens", 25 + 30 /    6
# print "Roosters", 100 - 25 * 3 % 4

# print 3 + 2 + 1 - 5 + 4 - 1 / 4 + 6

# print "Is it true that 3 + 2 < 5 - 7?"

# print 3 + 2 < 5 - 7

# print "3 + 2", 3 + 2
# print "5 - 7", 5 - 7

# print "Is it greater?", 5 > -2
# print "Is it greater or equal?", 5 >= -2
# print "Is it less or equal?", 5 <= -2


# my_name = 'Pat Hadley'
# my_age = 33 # not a lie
# my_height = 74 # inches
# my_weight = 180 # lbs
# my_eyes = 'Blue'
# my_teeth = 'White'
# my_hair = 'Brown'

# print "Let's talk about %s." % my_name
# print "He's %d inches tall." % my_height
# print "He's %d pounds heavy." % my_weight
# print "Actually that's not too heavy."
# print "He's got %s eyes and %s hair." % (my_eyes, my_hair)
# print "His teeth are usually %s depending on the coffee." % my_teeth

# # this line is tricky, try to get it exactly right
# print "If I add %d, %d, and %d I get %d." % (
#     my_age, my_height, my_weight, my_age + my_height + my_weight)

# end1 = "C"
# end2 = "h"
# end3 = "e"
# end4 = "e"
# end5 = "s"
# end6 = "e"
# end7 = "B"
# end8 = "u"
# end9 = "r"
# end10 = "g"
# end11 = "e"
# end12 = "r"


# print end1 + end2 + end3 + end4 + end5 + end6
# print end7 + end8 + end9 + end10 + end11 + end12

# print "." * 10  # what'd that do?

# print "How old are you?",
# age = raw_input()
# print "How tall are you?",
# height = raw_input()
# print "How much do you weigh?",
# weight = raw_input()

# print "So, you're %r old, %r tall and %r heavy." % (
#     age, height, weight)

from sys import argv

script, first, second, third = argv

print "The script is called:", script
print "Your first variable is:", first
print "Your second variable is:", second
print "Your third variable is:", third