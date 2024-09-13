import cdsapi
from constants import ALL_DAY, VALID_VARIABLES

c = cdsapi.Client()


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

    # checked_dict = check_request(initial_dict=initial_dict)

    checked_dict = check_request(initial_dict)

    if not checked_dict:
        print("Something went worng, sorry!")
        return

    c.retrieve(
        name = "reanalysis-era5-single-levels",  
        request= {
            "product_type": 'reanalysis',
            "variable": "total_precipitation",
            "year": checked_dict["year"],
            "month": checked_dict["month"],
            "day": checked_dict["day"], 
            "time": ALL_DAY,
            'area': checked_dict["area"],
            'format': 'netcdf'
        },
        target = f"{file_name}.nc")
    
    return f"{file_name}.nc"


def test_download_nc(file_name: str) -> None:


    test_dict = {
        "parameters": ["2m_temperature"],
        "year": "2024",
        "month": ["5"],
        "day": ["20"],
        "area": [45, 25, 43, 28]
    }


    request_nc(test_dict, file_name)

    print("All good")


# test_download_nc("a_random_name_2")