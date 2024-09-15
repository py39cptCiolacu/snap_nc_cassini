import pdfkit
from jinja2 import Template
from datetime import datetime
import random
import os
import string
import shutil

from .nc_analyzer import calc_min_max_by_day

def html_to_pdf(html_content: str, output_pdf_path) -> bool:

    options = {
        "page-size" : "A4",
        "encoding" : "UTF-8",
        "no-outline": True,
    }

    pdfkit.from_string(html_content, 
                       output_pdf_path, 
                       options=options)
    
    return True
    

def generate_html(min_val_table_data: list[float], max_val_table_data: list[float]) -> str:\

    current_dir = os.path.dirname(os.path.abspath(__file__))
    TEMPLATE_PATH= os.path.join(current_dir, "templates", "2m_temperature.html")

    # TEMPLATE_PATH = "./nc_lab/tempaltes/2m_temperature.html"

    with open(TEMPLATE_PATH, 'r', encoding='utf-8') as file:
        html_content= file.read()
    
    template = Template(html_content)

    return template.render(
        parameter = "random"
    )


def generate_random_filename() -> str:
    """
    Generates a random file name with the following format:
    YYYYMMDD_XXXX
    """
    current_date = datetime.now().strftime("%Y%m%d")
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    filename = f"{current_date}_{random_suffix}"

    return filename

def generate_pdf(nc_file_name: str) -> str:

    current_dir = os.path.dirname(os.path.abspath(__file__))
    nc_file_path = os.path.join(current_dir, "..", "results", nc_file_name)

    min_val_table_data, max_val_table_data = calc_min_max_by_day("t2m", nc_file_path)
    print(min_val_table_data)
    html = generate_html(min_val_table_data, max_val_table_data)
    pdf_name = nc_file_name[:-3] + ".pdf"
    pdf = html_to_pdf(html, pdf_name)

    
    # current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir)

    source = os.path.join(parent_dir, pdf_name)
    destination = os.path.join(parent_dir, "results" , pdf_name)
    shutil.move(source, destination)

    if pdf:
        return pdf_name 

    return "Unkown error"