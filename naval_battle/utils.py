# -*- coding: utf-8 -*-

from models import Fields, Users, Games

#------------------------------------------------------------
# get database section
#------------------------------------------------------------
def get_fields():
    """return fields from database
    """
    return Fields.objects()

def check_cookie(cookie):
    """check cookie-session in database
    
    Arguments:
    - `cookie`: dictionary with cookie {'session_id':'5OD0Xlt6EYhsW4vzXIe3HF8kvABHRNTg'}
    """
    pass

#------------------------------------------------------------
# add database section
#------------------------------------------------------------
def add_user_in_db(session, user, game, field, status=0):
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
    return new_user

def add_new_field():
    """add new field in database
    """
    new_field = Fields()
    new_field.save()
    return new_field

def add_new_game(new_field):
    """add new game in database
    
    - `new_field`: object field
    """
    new_game = Games(fields=[new_field])
    new_game.save()
    return new_game

