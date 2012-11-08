# -*- coding: utf-8 -*-
#------------------------------------------------------------
# views
#------------------------------------------------------------

from flask import render_template, request, make_response, jsonify
from naval_battle import app
from naval_battle.utils2 import randstring
from naval_battle.utils import add_user_in_db, add_new_game \
,add_new_field

@app.route("/", methods=['GET', 'POST'])
def main_page():
    """main page, install cookie for new users
    """
    current_page = u'Главная страница'
    if not request.cookies.has_key('session_id'):
        cookie_session = randstring()
        response = make_response(render_template('main_page.html', current_page=current_page))
        response.set_cookie('session_id', cookie_session)
        return response
    else:
        return make_response(render_template('main_page.html', current_page=current_page))
        

@app.route("/add_new_user/", methods=['GET', 'POST'])
def add_new_user():
    """registration user in database
    """
    if request.method == 'POST':
        username = request.form.keys()[0]
        if request.cookies.has_key('session_id'):
            cookie_session = request.cookies.get('session_id')
        else:
            cookie_session = randstring()
        field = add_new_field()
        game = add_new_game(field)
        if add_user_in_db(cookie_session, username, game, field):
            return jsonify(username=username,
                               new_user=True)
        else:
            # TODO 
            # return empty dictionary with code None
            return jsonify()
    else:
        return render_template('main_page.html', 
                               user_wait=False)

@app.route("/add_second_user", methods=['GET', 'POST'])
def add_second_user():
    """registration second user for play
    """
    if request.method == 'POST': 
        pass
    else: 
        return render_template('main_page.html', 
                               user_wait=False)

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
