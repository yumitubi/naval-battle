# -*- coding: utf-8 -*-

import datetime 
from naval_battle import db

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

class fields(db.EmbeddedDocument):
    """model contain snapshot fields
    """
    stapshot = db.DictField(default=gen_dict(), required=True)

class games(db.Document):
    """model contain info about games
    """
    fields = db.ListField(db.ReferenceField(fields))
    time_begin = db.DateTimeField(default=datetime.datetime.now, required=True)
    time_end = db.DateTimeField(default=datetime.datetime.now, required=True)
    status = db.IntField()

    def __unicode__(self):
        return self.status
        
class users(db.Document):
    """model contain info about users
    """
    user_name = db.StringField(max_length=255, required=True)
    session = db.StringField(max_length=255, required=True)
    game = db.ReferenceField(games)
    field_battle = db.ReferenceField(fields)
    status = db.IntField()

    def __unicode__(self):
        return self.user_name
        
class logs(db.Document):
    """model contain info about all move of players
    """
    game = db.ReferenceField(games)
    snapshot = db.DictField(default=gen_dict(), required=True)
    move_user = db.ReferenceField(users)
    time = db.DateTimeField(default=datetime.datetime.now, required=True)
