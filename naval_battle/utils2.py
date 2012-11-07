# -*- coding: utf-8 -*-
#------------------------------------------------------------
# other utilits
#------------------------------------------------------------
from random import choice
from string import letters, digits

def randstring(length=32):
    """ return string with random symbols
    
    author:         Dan Crosta
    repositories:   https://github.com/dcrosta/plog/blob/master/plog/utils.py#L43
    """
    return ''.join(choice(letters + digits) for x in xrange(length))    

def gen_dict():
    """generate empty dict for class fields
    """
    horizontal_coord = ('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j')
    battle_field = {}
    for i in range(10):
        horizont = {}
        for p in horizontal_coord:
            horizont[p] = 0
        battle_field[str(i+1)] = horizont
    return battle_field
