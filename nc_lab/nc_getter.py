import cdsapi
from .constants import ALL_DAY, VALID_VARIABLES, DAYS_PER_MONTH
import shutil
import os

c = cdsapi.Client()


def create_dict(date: str, land: list[float]) -> dict:

    template_dict = {
        "parameters" : ["2m_temperature"],
        "year": "xxxx",
        "month" : "xx",
        "day" : ["xx", "yy"],
        "area": land
    }

    year = date[0:4]
    template_dict["year"] = year
    month = date[4:6]
    template_dict["month"] = [month]

    days = ["01", "02", "03", "04", "05", "06",
            "07", "08", "09", "10", "11", "12",
            "13", "14", "15", "16", "17", "18",
            "19", "20", "21", "22", "23", "24",
            "26", "27", "28"]

    if int(year) % 4 == 0 and month == "02":
        days.append("29")

    if month in ["04", "06", "09", "11", 
                 "01", "03", "05", "07", "08", "10", "12"]:
        days.append("29")
        days.append("30")

    if month in ["01", "03", "05", "07", "08", "10", "12"]:
        days.append("31")

    template_dict["day"] = days

    return template_dict


def check_request(initial_dict: dict) -> dict | None:
    
    must_have_keys = ["parameters",
                      "year",
                      "month",
                      "day",
                      "area"]


    for must_have_key in must_have_keys:
        if must_have_key not in initial_dict.keys():
            return

    for var in initial_dict["parameters"]:
        if var not in VALID_VARIABLES:
            return None

    return initial_dict

def request_nc(initial_dict: dict, file_name: str) -> str | None : 

    checked_dict = check_request(initial_dict)

    if not checked_dict:
        print("Something went worng, sorry!")
        return

    c.retrieve(
        name = "reanalysis-era5-single-levels",  
        request= {
            "product_type": 'reanalysis',
            "variable": checked_dict["parameters"],
            "year": checked_dict["year"],
            "month": checked_dict["month"],
            "day": checked_dict["day"], 
            "time": ALL_DAY,
            'area': checked_dict["area"],
            'format': 'netcdf'
        },
        target = f"{file_name}.nc")
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir)

    source = os.path.join(parent_dir, f"{file_name}.nc")
    destination = os.path.join(parent_dir, "results" ,f"{file_name}.nc")

    shutil.move(source, destination)

    return f"{file_name}.nc"


def test_download_nc(file_name: str) -> None:


    # test_dict = {
    #     "parameters": ["2m_temperature"],
    #     "year": "2024",
    #     "month": ["5"],
    #     "day": ["20"],
    #     "area": [45, 25, 43, 28]
    # }


    test_dict = create_dict("202306", [45, 25, 43, 28])
    print(test_dict)

    request_nc(test_dict, file_name)
    print("All good")


# test_download_nc("a_random_name_2")