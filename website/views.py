from flask import Blueprint

views = Blueprint("views", __name__)

@views.route("/test")
def test():

    return "<h1> Salut </h1>"


@views.route("/api/get_user_interest", methods=["GET"])
def get_user_interest():
    
    return


@views.route("/api/deliver", methods=["POST"])
def deliver_pdf():
    
    return