# -*- coding: utf-8 -*-

from flask import Flask
from flask.ext.mongoengine import MongoEngine

app = Flask(__name__)
app.config["MONGODB_DB"] = "naval_battle"
app.debug = True
# app.config["SECRET_KEY"] = "KeepThisS3cr3t"

# generate key
app.secret_key = '\xdc\xc2O\x98\xf3M\x90h\xabN<+\x01Cvj\xbe6\x1d\x04\xea\x05\x11\xd5'
# initialization class for works with database
db = MongoEngine(app)

import naval_battle.views

if __name__ == '__main__':
    app.run()

