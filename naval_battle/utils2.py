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
    battle_field = {}
    for i in range(9):
        for p in range(9):
            battle_field[str(i)+str(p)] = '0'
    return battle_field
