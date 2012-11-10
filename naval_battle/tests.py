# -*- coding: utf-8 -*-
#------------------------------------------------------------
# tests
#------------------------------------------------------------

import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from naval_battle import app
from naval_battle.utils import add_new_field, add_new_game, get_begin_games, get_wait_users

class NavalTest:
    """testing naval battle app
    """
    def __init__(self):
        self.count = 0
        
    def test_add_feild(self):
        new_field = add_new_field()
        self.count += 1
        return new_field
    
    def test_add_game(self, new_field):
        print add_new_game(new_field)
        self.count += 1
        
    def test_update_main_page(self):
        print get_wait_users()
        print str(get_begin_games())

test = NavalTest()

if __name__ == '__main__':
    # id_field = test.test_add_feild()
    # test.test_add_game(id_field)
    print 'Проверка get_wait_users()'
    test.test_update_main_page()
        
        
