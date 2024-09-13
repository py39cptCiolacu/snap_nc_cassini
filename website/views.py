from flask import Blueprint

views = Blueprint("views", __name__)

@views.route("/test")
def test():

    return "<h1> Salut </h1>"