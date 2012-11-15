# -*- coding: utf-8 -*-

from models import Fields, Users, Games

#------------------------------------------------------------
# get database section
#------------------------------------------------------------
def get_fields():
    """return fields from database
    """
    return Fields.objects()

def get_wait_users():
    """return list of users who are waiting game
    """
    return Users.objects(status=0)


def get_begin_games():
    """return list begin games
    
    the structure of dictionary is:
    { 'id_game':['user1', 'user2'],
      'id_game':['user1', 'user2']}
    """
    games_begin = Games.objects(status=1)
    users = Users.objects(game__in=games_begin)
    games = {}
    for user in users:
        id_game = str(user.game)
        if games.haskey(id_game):
            games[id_game].append(user.user_name)
        else:
            games[id_game] = [user.user_name]
    return games


def get_user_id(session_id):
    """return user with id
    
    Arguments:
    - `session_id`: session_id
    """
    user = Users.objects.get(session=session_id)
    return str(user.id)

def get_field_dictionary(session_id):
    """ return the current snapshot field
    by session_id from cookies
    
    Arguments:
    - `session_id`: session id of user
    """
    try:
        user = Users.objects.get(session=session_id)
        return user.field_battle.snapshot
    except:
        return False

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
    # check session_id in database
    if not Users.objects(session=session):
        new_user = Users(user_name=user, 
                         session=session,
                         game=game,
                         field_battle=field,
                     status=status)
        new_user.save()
        return True
    else:
        return False

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

def update_field(session_id, field_dict):
    """update data in field
    
    Arguments:
    - `session_id`: session current user
    - `field_dict`: new data in field
    """
    try:
        # if use:
        # user = Users.objects.get(session=session_id)
        # user.battle_field.snapshot = field_dict
        # then flask report about:
        # "FutureWarning: Cascading saves will default to off in 0.8, please  explicitly set `.save(cascade=True)`"
        # I rewrote the code ----->
        user = Users.objects.get(session=session_id)
        field = Fields.objects.get(id=user.field_battle.id)
        field.snapshot = field_dict
        field.save()
        return True
    except:
        print 'проверить utils.update_field'
        return False
