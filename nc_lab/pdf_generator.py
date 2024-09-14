import pdfkit
from jinja2 import Template

def html_to_pdf(html_content: str, output_pdf_path) -> None:

    options = {
        "page-size" : "A4",
        "encoding" : "UTF-8",
        "no-outline": True,
    }

    pdfkit.from_string(html_content, 
                       output_pdf_path, 
                       options=options)
    

def generate_html() -> str:

    with open("./templates/2m_temperature.html", 'r', encoding='utf-8') as file:
        html_content= file.read()
    
    template = Template(html_content)

    return template.render(
        parameter = "random"
    )


output_pdf_path = "output.pdf"
html = generate_html() 
print(type(html))
html_to_pdf(html ,output_pdf_path)