from flask import Blueprint, request

from nc_lab.nc_getter import create_dict, request_nc
from nc_lab.pdf_generator import generate_pdf, generate_random_filename

views = Blueprint("views", __name__)


@views.route("/api/get_user_interest", methods=["GET"])
def get_user_interest():

    data = request.json
    date = data.get("date")
    land = data.get("land")

    user_dict = create_dict(date = date, land = land)
    random_file_name = generate_random_filename()
    nc_file = request_nc(initial_dict=user_dict, file_name=random_file_name)

    pdf_file = generate_pdf(nc_file)

    return


@views.route("/api/deliver", methods=["POST"])
def deliver_pdf():
    
    return