# -*- coding: utf-8 -*-

import datetime 
from naval_battle import db
from naval_battle.utils2 import gen_dict

class Fields(db.Document):
    """model contain snapshot fields

    - field `snapshot`: contain dict for record current status in 
                        coordinate field
                  `0` - empty, not shot
                  `1` - empty, shot
                  `2` - ship. not shot
                  `3` - ship, shot
    """
    snapshot = db.DictField(default=gen_dict(), required=True)
    
class Games(db.Document):
    """model contain info about games
    
    - field `fields`: list fields
    - field `time_begin`: the begin time game
    - field `time_end`: the begin time end game
    - field `status`: status of game, default 0
                `0` - game wait
                `1` - game begin
                `2` - game end
                `3` - game conf
    """
    fields = db.ListField(db.ReferenceField(Fields, dbref=True))
    time_begin = db.DateTimeField(default=datetime.datetime.now, required=True)
    time_end = db.DateTimeField(default=datetime.datetime.now, required=True)
    status = db.IntField(default=0)

    def __unicode__(self):
        return str(self.status)
        
class Users(db.Document):
    """model contain info about users

    - field `session`: uniq session 
    - field `user`: name user from form
    - field `game`: id game
    - field `field_battle`: id fields
    - field `status`: status of user
                `0` - user wait oponent
                `1` - user build power on field
                `2` - user in games
                `3` - user go
                `4` - user wait move 
                `5` - user final game - win
                `6` - user final game - lose
                `7` - user ran
    """
    user_name = db.StringField(max_length=255, required=True)
    session = db.StringField(max_length=255, required=True)
    game = db.ReferenceField(Games, dbref=True)
    field_battle = db.ReferenceField(Fields, dbref=True)
    status = db.IntField()
    status_first = db.IntField()

    def __unicode__(self):
        return str(self.user_name)

class Logs(db.Document):
    """model contain info about all move of players
    """
    game = db.ReferenceField(Games, dbref=True)
    snapshot = db.DictField(default=gen_dict(), required=True)
    snapshot_opponent = db.DictField(default=gen_dict(), required=True)
    move_user = db.StringField(max_length=255, required=True)
    move_user_id = db.StringField(max_length=255, required=True)
    opponent = db.StringField(max_length=255, required=True)
    time = db.DateTimeField(default=datetime.datetime.now, required=True)

    def __unicode__(self):
        return str(self.move_user)

    meta = {
        'ordering': ['-time']
    }
        

class Watchusers(db.Document):
    """model contain users which watch games"""
    user = db.ReferenceField(Users, dbref=True)
    game = db.ReferenceField(Games, dbref=True)
    time = db.DateTimeField(default=datetime.datetime.now, required=True)

    def __unicode__(self):
        return str(self.user)
        
