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

def get_around_cells(x, y):
    """ return list with coords
    
    // | 1 | 2 | 3 |
    // |---+---+---|
    // | 8 | x | 4 |
    // |---+---+---|
    // | 7 | 6 | 5 |

    Arguments:
    - `x, y`:  coordinates
    """
    field = []
    coordinates = []
    valid_coords = []
    for i in range(10):
        for m in range(10):
           field.append(str(i)+str(m))
    coordinates.append(str(x-1)+str(y-1))
    coordinates.append(x2y2 = str(x-1)+str(y))
    coordinates.append(x3y3 = str(x-1)+str(y+1))
    coordinates.append(x4y4 = str(x)+str(y+1))
    coordinates.append(x5y5 = str(x+1)+str(y+1))
    coordinates.append(x6y6 = str(x+1)+str(y))
    coordinates.append(x7y7 = str(x+1)+str(y-1))
    coordinates.append(x8y8 = str(x)+str(y-1))

    for coord in coordinates:
        if coord in field:
            valid_coords.append(coord)

    print valid_coords
    return valid_coords
