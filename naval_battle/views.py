# -*- coding: utf-8 -*-
#------------------------------------------------------------
# views
#------------------------------------------------------------

from flask import render_template, request
from naval_battle import app
from naval_battle.utils import get_fields

@app.route("/", methods=['GET', 'POST'])
def main_page():
    """main page
    """
    list_fields = get_fields()
    current_page = u'Главная страница'
    test = dir(request)
    test2 = request.cookies
    return render_template('main_page.html', 
                           list_fields=list_fields,
                           current_page=current_page, 
                           test=test,
                           test2=test2)

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
