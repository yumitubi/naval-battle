# -*- coding: utf-8 -*-

import datetime
from models import Fields, Users, Games, Logs, Watchusers
from utils2 import get_around_cells
from mongoengine.queryset import Q

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
    now = datetime.datetime.now()
    time_old = now + datetime.timedelta(minutes = -2)
    users_wait = Users.objects(status=0, last_time__gte=time_old)
    for user in users_wait:
        try:
            field = Fields.objects.get(id=user.field_battle.id)
        except:
            field = Fields()
            field.save()
        try:
            game = Games.objects.get(id=user.game.id)
            game.fields = [field]
            game.save()
        except:
            game = Games(fields=[field])
            game.save()
        user.field_battle = field
        user.game = game
        user.save()
    return users_wait


def get_begin_games():
    """return list begin games
    
    the structure of dictionary is:
    { 'id_game':['user1', 'user2'],
      'id_game':['user1', 'user2']}
    """
    games_begin = Games.objects(Q(status=1) | Q(status=3))
    users = Users.objects(game__in=games_begin)
    games = {}
    for user in users:
        game = user.game
        id_game = str(game.id)
        if games.has_key(id_game):
            games[id_game].append(user.user_name)
        else:
            games[id_game] = [user.user_name]
    return games


def get_user_id(session_id):
    """return user with id
    
    Arguments:
    - `session_id`: session_id
    """
    try:
        user = Users.objects.get(session=session_id)
        return str(user.id)
    except:
        return None

def get_user_status(session_id):
    """return user status
    
    Arguments:
    - `session_id`:
    """
    try:
        user = Users.objects.get(session=session_id)
        opponent = get_opponent(session_id)
        if opponent:
            last_time = datetime.datetime.now() + datetime.timedelta(minutes = -2)
            if opponent.last_time > last_time: 
                return user.status
            else:
                drop_user(str(opponent.session))
                field = add_new_field()
                game = add_new_game(field)
                new_data_user = { 'game': game,
                                  'field': field,
                                  'session_id': session_id,
                                  'status': 0,
                                  'time': True}
                update_user(**new_data_user)
                return 7
        else:
            new_data_user = { 'session_id': session_id,
                              'time': True}
            update_user(**new_data_user)
            return user.status
    except:
        # if user not found database
        # this use when user is new man on the site
        return 8

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

def get_user_by_session(session_id):
    """return objects user 
    
    Arguments:
    - `session_id`: session
    """
    try:
        return Users.objects.get(session=session_id)
    except:
        return False

def get_value_coordinata(session_id, coordinata):
    """ return value cell from database

    if user.status == 4, then user wait move
    if user.status == 3, then user go
    
    Arguments:
    - `session_id`: session id shooter
    - `coordinata`: coordinata
    """
    user = Users.objects.get(session = session_id)
    game = user.game
    for field in game.fields:
        # find opponent
        if user.field_battle != field:
            coordict = field.snapshot
            other_user = Users.objects.get(field_battle=field)
            if coordict[coordinata] == u"0":
                coordict[coordinata] = u"1"
                user.status = 4
                user.save()
                other_user.status = 3
                other_user.save()
                field.snapshot = coordict
            if coordict[coordinata] == u"2":
                not_kill_flag = False
                x = coordinata[0]
                y = coordinata[1]
                graycells = []
                # for self cell
                cells = get_around_cells(int(x), int(y))
                for cell in cells:
                    if coordict[cell] == "1" or coordict[cell] == "0":
                        graycells.append(cell)
                # REFACTOR IT!
                # top cells
                # and yes, I know about range(x)!
                for i in [1, 2, 3]:
                    if not_kill_flag:
                        break
                    if coordict.has_key(str(int(x)-i)+y): 
                        if coordict[str(int(x)-i)+y] == "0" or coordict[str(int(x)-i)+y] == "1":
                            break
                        if coordict[str(int(x)-i)+y] == "2":
                            not_kill_flag = True
                            break
                        if coordict[str(int(x)-i)+y] == "3":
                            cells = get_around_cells((int(x)-i), int(y))
                            for cell in cells:
                                if coordict[cell] == "1" or coordict[cell] == "0":
                                    graycells.append(cell)
                # bottom cells
                for i in [1, 2, 3]:
                    if not_kill_flag:
                        break
                    if coordict.has_key(str(int(x)+i)+y): 
                        if coordict[str(int(x)+i)+y] == "0" or coordict[str(int(x)+i)+y] == "0":
                            break
                        if coordict[str(int(x)+i)+y] == "2":
                            not_kill_flag = True
                            break
                        if coordict[str(int(x)+i)+y] == "3":
                            cells = get_around_cells((int(x)+i), int(y))
                            for cell in cells:
                                if coordict[cell] == "1" or coordict[cell] == "0":
                                    graycells.append(cell)
                # left cells
                for i in [1, 2, 3]:
                    if not_kill_flag:
                        break
                    if coordict.has_key(x+str(int(y)-i)): 
                        if coordict[x+str(int(y)-i)] == "0" or coordict[x+str(int(y)-i)] == "1":
                            break
                        if coordict[x+str(int(y)-i)] == "2":
                            not_kill_flag = True
                            break
                        if coordict[x+str(int(y)-i)] ==  "3":
                            cells = get_around_cells(int(x), int(y)-i)
                            for cell in cells:
                                if coordict[cell] == "1" or coordict[cell] == "0":
                                    graycells.append(cell)
                # right cells
                for i in [1, 2, 3]:
                    if not_kill_flag:
                        break
                    if coordict.has_key(x+str(int(y)+i)): 
                        if coordict[x+str(int(y)+i)] == "0" or coordict[x+str(int(y)+i)] == "1":
                            break
                        if coordict[x+str(int(y)+i)] == "2":
                            not_kill_flag = True
                            break
                        if coordict[x+str(int(y)+i)] == "3":
                            cells = get_around_cells(int(x), int(y)+i)
                            for cell in cells:
                                if coordict[cell] == "1" or coordict[cell] == "0":
                                    graycells.append(cell)
                
                # get uniq cells
                graycells = list(set(graycells))

                # push results calculates in db
                if not not_kill_flag:
                    for i in graycells:
                        coordict[i] = u"1"
                coordict[coordinata] = u"3"
                field.snapshot = coordict


            field.save();

            # TODO: return the gray and black cells if a game go now
            # add the note in Logs collections       
            if user.status_first == 1:
                add_to_log(game, 
                           user.field_battle.snapshot, 
                           user.user_name, 
                           str(user.id),
                           other_user.field_battle.snapshot,
                           other_user.user_name)
            # replace user and his opponent
            if user.status_first == 2:
                add_to_log(game, 
                           other_user.field_battle.snapshot,
                           other_user.user_name,
                           str(other_user.id),
                           user.field_battle.snapshot, 
                           user.user_name)

            # check that were kill all cells
            kill_cells = 0
            for key in coordict.keys():
                if coordict[key] == "3":
                    kill_cells += 1

            if kill_cells >= 20:
                user.status = 5
                user.save()
                other_user.status = 6
                other_user.save()
                game.status = 2
                game.time_end = datetime.datetime.now()
                game.save()
                # return u"4", means finish game
                return u"4"
            # graycells return in function get_field_opponent(session_id)
            return coordict[coordinata]

def get_field_opponent(session_id):
    """ return field by opponent
    
    Arguments:
    - `session_id`:
    """
    try:
        user = Users.objects.get(session=session_id)
    except:
        return False
    for u in Users.objects(game=user.game):
        if u.session != session_id:
            field = u.field_battle
            snapshot = field.snapshot
            visible_snapshot = {}
            for key, val in snapshot.iteritems():
                if val == u"2":
                    visible_snapshot[key] = u"0"
                else:
                    visible_snapshot[key] = val
            game = u.game
            game.time_end = datetime.datetime.now()
            game.save()
            return visible_snapshot

def get_opponent(session_id):
    """ return opponent

    Arguments:
    - `session_id`:
    """
    try:
        user = Users.objects.get(session=session_id)
        for u in Users.objects(game=user.game):
            if str(u.session) != session_id:
                return u
    except:
        return False

def get_session_by_user_id(user_id):
    """return session user
    
    Arguments:
    - `user_id`: user.id in mongodb
    """
    user = Users.objects.get(id=user_id)
    return str(user.session)

def get_time_begin(id_game):
    """return time of begin game
    
    Arguments:
    - `id_game`: session
    """
    game = Games.objects.get(id=id_game)
    diff = game.time_end - game.time_begin
    minutes, seconds = divmod(diff.total_seconds(), 60)
    return str(minutes) + ' минут ' + str(seconds) + ' секунд'

def get_list_archive_game(firstdate, seconddate):
    """ returh list archive games

    - return dictionary in format:
              { 'date' : date,
                'players': user VS user }

    - `firstdate`: date from first field on archive.html
    - `seconddate`: date from second field on archive.html
    """
    if firstdate == '' and seconddate == '':
        games = Games.objects(status=2)
    elif seconddate == '' or firstdate == '':
        try:
            if firstdate and len(firstdate) == 10:
                year = int(firstdate[-4:])
                month = int(firstdate[3:5])
                day = int(firstdate[:2])
                dt = datetime.datetime(year, month, day)
                games = Games.objects(status=2, time_begin__gte=dt)
            elif seconddate and len(seconddate) == 10:
                year = int(seconddate[-4:])
                month = int(seconddate[3:5])
                day = int(seconddate[:2])
                dt = datetime.datetime(year, month, day)
                games = Games.objects(status=2, time_begin__gte=dt)
            else:
                return False
        except: 
            return False
    else:
        if len(firstdate) != 10 and len(seconddate) != 10:
            return False
        try:
            year_f = int(firstdate[-4:])
            month_f = int(firstdate[3:5])
            day_f = int(firstdate[:2])
            dt_first = datetime.datetime(year_f, month_f, day_f)
            year_s = int(seconddate[-4:])
            month_s = int(seconddate[3:5])
            day_s = int(seconddate[:2])
            dt_second = datetime.datetime(year_s, month_s, day_s)
            if dt_first < dt_second:
                dt_second = datetime.datetime(year_s, month_s, day_s, 23, 59, 59)
                games = Games.objects( Q(status=2) & (Q(time_begin__gte=dt_first) & Q(time_begin__lte=dt_second)))
            else:
                dt_first = datetime.datetime(year_f, month_f, day_f, 23, 59, 59)
                games = Games.objects( Q(status=2) & (Q(time_begin__lte=dt_first) & Q(time_begin__gte=dt_second)))
        except:
            return False
    if games:
        dict_game = {}
        for game in games:
            note = Logs.objects(game=game)[0]
            dict_game[str(note.game.id)] = { 'date' : note.game.time_begin.strftime('%d-%m-%Y'),
                                             'players': note.move_user + ' VS ' + note.opponent }
        return dict_game
    return True

def get_info_battle(game_id):
    """return dict:
    
    { 'user_field': field,
      'opponent_field': field ,
      'username': user_name ,
      'opponentname': user_name ,
      'game_status': status ,
      'time_begin': time_begin }
    
    Arguments:
    - `game_id`: id game
    """
    game = Games.objects.get(id=game_id)
    try:
        note = Logs.objects(game=game).order_by('-time')[0]
    except: 
        return False
    return get_info(note)

def get_info(note):
    """return data about moves
    
    Arguments:
    - `note`:
    """
    user_field_dict = {}
    opponent_field_dict = {}
    game = Games.objects.get(id=str(note.game.id))
    for i in range(10):
        for m in range(10):
            user_field_dict[str(i)+str(m)] = "0"
    for i in range(10):
        for m in range(10):
            opponent_field_dict[str(i)+str(m)] = "0"
    if game.status == 1 or game.status == 3:
        for key, val in note.snapshot.iteritems():
            if note.snapshot[key] == "1" or note.snapshot[key] == "3":
                user_field_dict[key] = note.snapshot[key]
        for key, val in note.snapshot_opponent.iteritems():
            if note.snapshot_opponent[key] == "1" or note.snapshot_opponent[key] == "3":
                opponent_field_dict[key] = note.snapshot_opponent[key]
    if game.status == 2:
        user_field_dict = note.snapshot
        opponent_field_dict = note.snapshot_opponent
    info_battle = { 'user_field': user_field_dict,
                    'opponent_field': opponent_field_dict,
                    'username':  note.move_user,
                    'user_id': note.move_user_id,
                    'opponentname': note.opponent,
                    'game_status': note.game.status,
                    'time_begin': note.time,
                    'game_duration': get_time_begin(str(game.id))}
    return info_battle    

def get_game_status(id_game):
    """return game status
    
    Arguments:
    - `id_game`: id game
    """
    game = Games.objects.get(id=id_game)
    return game.status

def get_all_moves(id_game):
    """return list moves for game move
    
    Arguments:
    - `id_game`: id game
    """
    game = Games.objects.get(id=id_game)
    notes = Logs.objects(game=game).order_by('time')
    moves = {}
    count = 1
    for note in notes:
        moves[count] = str(note.id)
        count += 1
    return moves

def get_move(id_move):
    """return fields snapshot for current user
    
    Arguments:
    - `id_move`: id move
    """
    return get_info(Logs.objects.get(id=id_move))

def get_game_by_session(session_id):
    """return game
    
    Arguments:
    - `session_id`:
    """
    try:
        user = Users.objects.get(session=session_id)
        return user.game
    except:
        return False

def get_watch_users(session_id):
    """return number user which watch game
    
    Arguments:
    - `session_id`: session_id
    """
    try:
        user = Users.objects.get(session=session_id)
    except:
        return 0
    game = user.game
    now = datetime.datetime.now()
    time_old = now + datetime.timedelta(minutes = -1)
    return Watchusers.objects(game=game, time__gte=time_old).count()

#------------------------------------------------------------
# add and update database section
#------------------------------------------------------------
def add_user_in_db(session_id, username, game, field, status=0, status_first=1):
    """create user in database for registration in game
    
    Arguments:
    - `session`: uniq session 
    - `user`: name user from form
    - `game`: id game
    - `field`: id fields
    - `status`: status of user on site
    """
    # check session_id in database
    users = Users.objects(session=session_id) 
    if not users:
        new_user = Users(user_name=username, 
                         session=session_id,
                         game=game,
                         field_battle=field,
                         status=status,
                         status_first=status_first)
        new_user.save()
    else:
        user = Users.objects.get(session=session_id)
        user.game = game
        user.user_name = username
        user.field_battle = field
        user.status = status
        user.status_first = status_first
        user.save()
        game.time_begin = datetime.datetime.now()
        game.time_end = datetime.datetime.now()
        game.save()
    return True

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

def add_field_in_game(user_id, field):
    """ add second field in create game other user
    
    Arguments:
    - `user_id`: first user
    - `field`: second field
    """
    first_user = Users.objects.get(id=user_id)
    game = Games.objects.get(id=first_user.game.id)
    game.fields.append(field)
    game.save(cascade=True)
    return game

def add_to_log(game, field, user, id_user, field_opponent, opponent):
    """add note to collection Logs 
    
    Arguments:
    - `game`:
    - `field`:
    - `user`:
    """
    note = Logs(game=game,
                snapshot=field,
                snapshot_opponent=field_opponent,
                move_user=user,
                move_user_id = id_user,
                opponent=opponent,
                time=datetime.datetime.now())
    note.save(cascade=True)

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
        field.save(cascade=True)
        return True
    except:
        print 'проверить utils.update_field'
        return False

# TODO: check unuse and delet this function
def update_status_user(user_id, status):
    """ make update the status of user
    
    Arguments:
    - `user_id`: user in Users
    - `status`: status in user.status 
    """
    try:
        user = Users.objects.get(id=user_id)
        user.status = status
        user.save(cascade=True)
        return True
    except:
        return False

def update_user(**kwargs):
    """ update data for current user
    
    Arguments:
    - `*kwargs`: may be ---->
                 { 'session_id': ...,
                   'game': ...,
                   'field': ...,
                   'status': ...,
                   'time': ...}
    """
    if  kwargs.has_key('session_id'):
        try:
            user = Users.objects.get(session=kwargs['session_id'])
        except:
            return False
        if kwargs.has_key('game'):
            user.game = kwargs['game']
        if kwargs.has_key('field'):
            field = user.field_battle
            field.delete()
            field.save()
            user.field_battle = kwargs['field']
        if kwargs.has_key('status'):
            if kwargs['status'] == 4:
                users = Users.objects(game=user.game)
                for u in users:
                    if u.session != user.session and u.status == 4:
                        u.status = 3
                        u.save()
                        game = u.game
                        game.status = 1
                        game.save()
            if kwargs['status'] == 1:
                game = user.game
                game.status = 3
            user.status = kwargs['status']
        if kwargs.has_key('time'):
            user.last_time = datetime.datetime.now()
        user.save()
        return user.user_name
    else:
        return False
        
def update_watch_users(id_game, session_id):
    """update information about users which watch game
    
    Arguments:
    - `id_game`: id game
    - `session_id`: session id
    """
    now = datetime.datetime.now()
    time_old = now + datetime.timedelta(minutes = -1 )
    watch_user = None
    try:
        Watchusers.objects(time__lte=time_old).delete()
        user = Users.objects.get(session=session_id)
        game = Games.objects.get(id=id_game)
        watch_user = Watchusers.objects(user=user, game=game)
    except:
        return False
    if watch_user:
        watch_user[0].time = now
        watch_user[0].save()
    else:
        new_watch = Watchusers(user=user, game=game)
        new_watch.save()
    return True

#------------------------------------------------------------
# delete database section
#------------------------------------------------------------

def drop_user(session_id):
    """delete user from db, clear game, delete field
    
    Arguments:
    - `session_id`:
    """
    try:
        user = Users.objects.get(session=session_id)
        game = user.game
        users = Users.objects(game=game)
        for u in users:
            if u != user:
                u.status = 7
            else:
                u.status = 0;
            u.save()
        user.delete()
        return True
    except:
        return False
