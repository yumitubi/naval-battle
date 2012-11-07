# -*- coding: utf-8 -*-
#------------------------------------------------------------
# views
#------------------------------------------------------------

from flask import render_template, request, session, make_response
from naval_battle import app
from naval_battle.utils2 import randstring
from naval_battle.utils import get_fields, add_user_in_db

@app.route("/", methods=['GET', 'POST'])
def main_page():
    """main page
    """
    list_fields = get_fields()
    current_page = u'Главная страница'
    headers = request.cookies['sessionid']
    return render_template('main_page.html', 
                           list_fields=list_fields,
                           current_page=current_page,
                           headers=headers)

@app.route("/add_new_user/", methods=['GET', 'POST'])
def add_new_user():
    """registration user in database
    """
    if request.method == 'POST':
        session['username'] = request.form['username']
        cookie_session = randstring()
        game = None
        field = None
        add_user_in_db(session['username'], cookie_session, game, field)
        registration = render_template('', user_wait=True)
        response = make_response(registration)
        response.set_cookie('session_id', cookie_session)
        return response
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
