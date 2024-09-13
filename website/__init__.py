from __future__ import annotations
from datetime import timedelta, datetime, timezone
from os import path
import json

from flask import Flask, request, Response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()
DB_NAME = "database.db"

def create_app() -> Flask:
    app = Flask(__name__)
    
    app.config["SECRET_KEY"] = "a random string"
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_NAME}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SESSION_COOKIE_NAME'] = "cookie_name"
    app.config["SESSION_COOKIE_SECURE"] = True
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

    db.init_app(app)
    CORS(app, supports_credentials=True)

    from .views import views

    app.register_blueprint(views, url_prefix='/')

    create_database(app)
    
    return app

def create_database(app: Flask) -> None:
    if not path.exists("website/" + DB_NAME):
        with app.app_context():
            db.create_all()
            print("Database Created")
    else:
        print("db exists")