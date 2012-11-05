# -*- coding: utf-8 -*-

from random import choice
from string import letters, digits
from models import Fields, Users

def get_fields():
    """return fields
    """
    return Fields.objects()

def add_user_in_db(session, user, game, field, status):
    """create user in database for registration in game
    
    Arguments:
    - `session`: uniq session 
    - `user`: name user from form
    - `game`: id game
    - `field`: id fields
    - `status`: status of user on site
    """
    new_user = Users(user_name=user, 
                     session=session,
                     game=game,
                     field_battle=field,
                     status=status)
    new_user.save()

def randstring(length=32):
    """ return string with random symbols
    
    author:         Dan Crosta
    repositories:   https://github.com/dcrosta/plog/blob/master/plog/utils.py#L43
    """
    return ''.join(choice(letters + digits) for x in xrange(length))    
