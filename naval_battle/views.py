# -*- coding: utf-8 -*-
#------------------------------------------------------------
# views
#------------------------------------------------------------

from flask import render_template, request, make_response, jsonify
from naval_battle import app
from naval_battle.utils2 import randstring
from naval_battle.utils import add_user_in_db, add_new_game, get_wait_users \
,add_new_field, get_user_id, get_begin_games

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
        if request.cookies.has_key('session_id'):
            cookie_session = request.cookies.get('session_id')
        else:
            cookie_session = randstring()
        field = add_new_field()
        game = add_new_game(field)
        if add_user_in_db(cookie_session, username, game, field):
            return jsonify(username=username,
                           user_id=get_user_id(cookie_session),
                           new_user=1)
        else:
            return jsonify(new_user=0)

@app.route("/add_second_user/", methods=['GET', 'POST'])
def add_second_user():
    """registration second user for play
    """
    if request.method == 'POST': 
        pass
    else: 
        return render_template('main_page.html', 
                               user_wait=False)

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
        users = get_wait_users()
        list_username = {}
        for user in users:
            list_username[str(user.id)] = user.user_name
        games = get_begin_games()
        return jsonify(users=list_username, games=games)

@app.route("/configure/", methods=['GET', 'POST'])
def configure():
    """a page for configere field battle
    """
    current_page = u'Настроить расположение фрегатов'
    response = make_response(render_template('configure.html', current_page=current_page))
    return response


@app.route("/move_games/")
def move_game():
    """page for watch game
    """
    pass

@app.route("/archive/")
def archive():
    """page with results old games
    """
    pass
