# -*- coding: utf-8 -*-
#------------------------------------------------------------
# views
#------------------------------------------------------------

import json

from flask import render_template, request, make_response, jsonify, redirect
from naval_battle import app
from naval_battle.utils2 import randstring
from naval_battle.utils import add_user_in_db, add_new_game, get_wait_users \
, add_new_field, get_user_id, get_begin_games, get_field_dictionary, update_field \
, add_field_in_game, get_user_status, drop_user, update_user, get_move \
, get_value_coordinata, get_field_opponent, get_user_by_session, get_opponent \
, get_session_by_user_id, get_game_status, get_game_by_session, get_watch_users \
, get_list_archive_game, get_info_battle, get_all_moves, update_watch_users

@app.route("/", methods=['GET', 'POST'])
def main_page():
    """main page, install cookie for new users
    """
    current_page = u'Главная страница'
    users_wait = get_wait_users()
    if not request.cookies.has_key('session_id'):
        cookie_session = randstring()
        response = make_response(render_template('main_page.html', 
                                                 current_page=current_page,
                                                 users_wait=users_wait))
        response.set_cookie('session_id', cookie_session)
        return response
    else:
        return make_response(render_template('main_page.html', 
                                             current_page=current_page,
                                             users_wait=users_wait))
        

@app.route("/add_new_user/", methods=['GET', 'POST'])
def add_new_user():
    """registration user in database for game

    jsonify: 
     - `username` : username from form 
     - `user_id` : set user.id for uniq
     - `new_user`: `1` - this new user
                   `0` - this old user, dont hand
    """
    if request.method == 'POST':
        username = request.form.values()[0].encode('utf8')
        # check session
        if request.cookies.has_key('session_id'):
            cookie_session = request.cookies.get('session_id')
        else:
            cookie_session = randstring()
        user = get_user_by_session(cookie_session)
        # if user exist
        if user:
            update_user(**{'session_id': cookie_session, 'time': True })
            # if already have a server
            if user.status == 0:
                return jsonify(new_user=0)
            # if game was finished
            if user.status == 5 or user.status == 6 or user.status == 7:
                field = add_new_field()
                game = add_new_game(field)
                if add_user_in_db(cookie_session, username, game, field):
                    return jsonify(username=username,
                                   user_id=get_user_id(cookie_session),
                                   user_status=0, 
                                   new_user=1)
            # if in game play now
            if user.status == 3 or user.status == 4:
                return jsonify(new_user=2)
        else:
            field = add_new_field()
            game = add_new_game(field)
            if add_user_in_db(cookie_session, username, game, field):
                return jsonify(username=username,
                               user_id=get_user_id(cookie_session),
                               user_status=0, 
                               new_user=1)

@app.route("/add_second_user/", methods=['GET', 'POST'])
def add_second_user():
    """registration second user for play
    """
    if request.method == 'POST': 
        wait_user = request.form['user_id'].encode('utf8')
        username = request.form['username'].encode('utf8')
        if request.cookies.has_key('session_id'):
            cookie_session = request.cookies.get('session_id')
        # TODO: this is bottleneck
        # add exception here!
        current_user = get_user_by_session(cookie_session)
        if current_user and str(current_user.id) == wait_user:
            return jsonify(result="0")
        field = add_new_field()
        game = add_field_in_game(wait_user, field)
        add_user = add_user_in_db(cookie_session, username, game, field, status=1, status_first=2)
        session_wait_user = get_session_by_user_id(wait_user)
        new_data_user = { 'session_id' : session_wait_user,
                          'status': 1 }
        update_status = update_user(**new_data_user)
        if add_user and update_status:
            return jsonify(result="1")
            

@app.route("/update_data_for_main_page/", methods=['GET', 'POST'])
def update_data_main_page():
    """return json with information about:

    - users who wait second player
    - games which does now

    the structure of dictionary is:
    { 'users':{ 'id1':'username1',
                'id2':'username2'},

      'games': { 'id':[user1, user2],
                 'id':[user1, user2]}}
    """
    if request.method == 'POST':
        current_user = "0"
        if request.cookies.has_key('session_id'):
            cookie_session = request.cookies.get('session_id')
            update_user(**{ 'session_id': cookie_session, 'time': True })
            user_status = get_user_status(cookie_session)
            if user_status == 1:
                return jsonify(user_status=user_status)
            if user_status == 0:
                user = get_user_by_session(cookie_session)
                if user:
                    current_user = user.user_name
        users = get_wait_users()
        list_username = {}
        for user in users:
            list_username[str(user.id)] = user.user_name
        games = get_begin_games()
        user_server = get_user_id(cookie_session)
        return jsonify(users=list_username, 
                       games=games, 
                       current_user=current_user, 
                       user_server=user_server)

@app.route("/configure/", methods=['GET', 'POST'])
def configure():
    """the page for configure field battle
    """
    current_page = u'Настроить расположение фрегатов'
    response = make_response(render_template('configure.html', current_page=current_page))
    return response

@app.route("/send_state_field/", methods=['GET', 'POST'])
def send_state_field():
    """return the current snapshot field from database
    """
    if request.method == 'POST':
        if request.cookies.has_key('session_id'):
            cookie_session = request.cookies.get('session_id')
            update_user(**{ 'session_id': cookie_session, 'time': True })
            field = get_field_dictionary(cookie_session)
            user_status = get_user_status(cookie_session)
            number_watch_user = get_watch_users(cookie_session)
            return jsonify(field=field,
                           status=user_status,
                           number_watch_user=number_watch_user)

@app.route("/get_state_field/", methods=['GET', 'POST'])
def get_state_field():
    """get data about field from js
    """
    if request.method == 'POST':
        if request.cookies.has_key('session_id'):
            cookie_session = request.cookies.get('session_id')
            update_user(**{ 'session_id': cookie_session, 'time': True })
            field = json.loads(request.form.keys()[0])
            if update_field(cookie_session, field):
                return jsonify(result='1')
            else:
                return jsonify(result='0')

@app.route("/get_names_players/", methods=['GET', 'POST'])
def get_names_players():
    """get names user and his opponent
    """
    if request.method == 'POST':
        if request.cookies.has_key('session_id'):
            cookie_session = request.cookies.get('session_id')
            username = get_user_by_session(cookie_session)
            opponent = get_opponent(cookie_session)
            return jsonify(username=username.user_name,
                           opponent=opponent.user_name)

@app.route("/all_cancel/", methods=['GET', 'POST'])
def all_cancel():
    """reset all data for current game by user
    """
    if request.method == 'POST':
        if request.cookies.has_key('session_id'):
            cookie_session = request.cookies.get('session_id')
            if drop_user(cookie_session):
                return jsonify(result=True)

@app.route("/reset_game/", methods=['GET', 'POST'])
def reset_game():
    """reset current games
    """
    if request.method == 'POST':
        if request.cookies.has_key('session_id'):
            cookie_session = request.cookies.get('session_id')
            field = add_new_field()
            game = add_new_game(field)
            new_data_user = { 'game': game,
                              'field': field,
                              'session_id': cookie_session,
                              'status': 0,
                              'time': True}
            username = update_user(**new_data_user)
            if username:
                return jsonify(username=username,
                           user_id=get_user_id(cookie_session),
                           user_status=0, 
                           new_user=1)

@app.route("/battle/", methods=['GET', 'POST'])            
def battle():
    """a page for configure field battle
    """
    current_page = u'Битва!'
    response = make_response(render_template('battle.html', current_page=current_page))
    return response

@app.route("/move_battle/", methods=['GET', 'POST'])            
def move_battle():
    """move to battle
    """
    if request.method == 'POST':
        if request.cookies.has_key('session_id'):
            cookie_session = request.cookies.get('session_id')
            new_data_user = {'session_id':cookie_session,
                             'status': 4,
                             'time': True}
            update_user(**new_data_user)
            return jsonify(result=1)

@app.route("/go_move_battle/<id_game>/", methods=['GET'])            
def go_move_battle(id_game):
    """move to battle
    """
    current_page = u'Ход игры'
    response = make_response(render_template('move_game.html', 
                                             current_page=current_page,
                                             id_game=id_game))
    return response

    


@app.route("/check_shot/", methods=['GET', 'POST'])            
def check_shot():
    """check a shot and return result of shot
    """
    if request.method == 'POST':
        if request.cookies.has_key('session_id'):
            cookie_session = request.cookies.get('session_id')
            update_user(**{ 'session_id': cookie_session, 'time': True })
            coordinata = request.form['coordinata'].encode('utf8')
            result = get_value_coordinata(cookie_session, coordinata)
            field_opponent = get_field_opponent(cookie_session)
            return jsonify(result=result,
                           coordinata=coordinata,
                           field_opponent=field_opponent)

@app.route("/get_field_second/", methods=['GET', 'POST'])            
def get_field_second():
    """return field by opponent
    """
    if request.method == 'POST':
        if request.cookies.has_key('session_id'):
            cookie_session = request.cookies.get('session_id')
            field_opponent = get_field_opponent(cookie_session)    
            return jsonify(field_opponent=field_opponent)

@app.route("/get_fields/", methods=['GET', 'POST'])            
def get_fields():
    """return fields of two plaing users
    """
    # return result
    if request.method == 'POST':
        if request.form['id_game'].encode('utf8'):
            kwargs = { 'id_game': request.form['id_game'].encode('utf8')}
            result = return_data_field(**kwargs)
            if result: 
                return result
            game_status = get_game_status(request.form['id_game'].encode('utf8'))
            if game_status == 3 or game_status == 1:
                return jsonify(result="1",
                               game_status=game_status)
            return jsonify(result="0")
        else:
            if request.cookies.has_key('session_id'):
                cookie_session = request.cookies.get('session_id')
                user = get_user_by_session(cookie_session)
                kwargs = { 'id_game': str(user.game.id)}
                result = return_data_field(str(user.id), **kwargs )
                if result:
                    return result
                game_status = get_game_status(kwargs['id_game'])
                if game_status == 3 or game_status == 1:
                    return jsonify(result="1",
                                   game_status=game_status)
                return jsonify(result="0")
            return jsonify(result="0")
        return jsonify(result="0")

        
@app.route("/move_game/", methods=['GET', 'POST'])
def move_game():
    """page for watch game
    """
    current_page = u'Ход игры'
    if request.cookies.has_key('session_id'):
        cookie_session = request.cookies['session_id'].encode('utf8')
        if get_user_by_session(cookie_session) and get_game_by_session(cookie_session):
            game = get_game_by_session(cookie_session)
            response = make_response(render_template('move_game.html', 
                                                     current_page=current_page,
                                                     id_game=str(game.id)))
            return response
        else:
            return redirect('/')
    else:
        return redirect('/')

@app.route("/archive/", methods=['GET', 'POST'])
def archive():
    """page with results old games
    """
    current_page = u'Архив игр'
    response = make_response(render_template('archive.html', 
                                             current_page=current_page))
    return response

@app.route("/get_archive_game/", methods=['GET', 'POST'])            
def get_archive_game():
    """response list of archive games
    """
    if request.method == 'POST':
        list_games = get_list_archive_game(request.form['firstdate'], request.form['seconddate'])
        if list_games:
            return jsonify(games=list_games,
                           result="1")
        else:
            return jsonify(result="0")

@app.route("/get_list_moves/", methods=['GET', 'POST'])            
def get_list_moves():
    """return list moves
    """
    if request.method == 'POST':
        if request.form['id_game'].encode('utf8'):
            moves = get_all_moves(request.form['id_game'].encode('utf8'))
            update_watch_users(request.form['id_game'].encode('utf8'), request.cookies['session_id'].encode('utf8'))
            return jsonify(moves=moves)

@app.route("/get_fields_move/", methods=['GET', 'POST'])            
def get_fields_move():
    """return snapshot fields for current move
    """
    if request.method == 'POST':
        if request.form['id_move'].encode('utf8'):
            kwargs = { 'id_move': request.form['id_move'].encode('utf8')}
            result = return_data_field(**kwargs)
            if result: 
                return result
        return jsonify(result="0")

def return_data_field(user_id=0, **kwargs):
    """response for request
    
    Arguments:
    - `cookie_session`: session of user
    """
    
    months = { '01': 'января',
               '02': 'февраля',
               '03': 'марта',
               '04': 'апреля',
               '05': 'мая',
               '06': 'июня',
               '07': 'июля',
               '08': 'августа',
               '09': 'сентября',
               '10': 'октября',
               '11': 'ноября',
               '12': 'декабря'
               }

    info_battle = False
    if kwargs.has_key('id_move'):
        info_battle = get_move(kwargs['id_move'])
    if kwargs.has_key('id_game'):
        info_battle = get_info_battle(kwargs['id_game'])
    if info_battle:
        if info_battle['user_id'] == user_id:
            return jsonify(user_field=info_battle['user_field'], 
                           opponent_field=info_battle['opponent_field'],
                           username=info_battle['username'], 
                           opponentname=info_battle['opponentname'],
                           game_status=info_battle['game_status'],
                           time_begin=info_battle['time_begin'].strftime('%H:%M %d ') + months[info_battle['time_begin'].strftime('%m')]+ info_battle['time_begin'].strftime(' %Y') + 'г.',
                           game_duration = info_battle['game_duration'],
                           result="1")
        else:
            return jsonify(user_field=info_battle['opponent_field'], 
                           opponent_field=info_battle['user_field'],
                           username=info_battle['opponentname'], 
                           opponentname=info_battle['username'],
                           game_status=info_battle['game_status'],
                           time_begin=info_battle['time_begin'].strftime('%H:%M %d ') + months[info_battle['time_begin'].strftime('%m')]+ info_battle['time_begin'].strftime(' %Y') + 'г.',
                           game_duration = info_battle['game_duration'],
                           result="1")
    else:
        return False
