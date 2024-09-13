import cdsapi


c = cdsapi.Client()


VALID_VARIABLES = {
    "2m_temperature" : "description for t2m"
}


def check_request(initial_dict: dict) -> dict | None:
    
    pass


def request_nc(initial_dict: dict) -> str | bool : 

    checked_dict = check_request(initial_dict=initial_dict)

    if not checked_dict:
        print("Something went worng, sorry!")
        return

    file_name = "ce nume punem?"

    c.retrieve(
        "reanalysis-era5-single-levels",  # Dataset-ul pe care vrei să-l accesezi
        {
            "product_type": 'reanalysis',
            "variable": checked_dict["parameters"],
            "year": checked_dict["year"],
            "month": checked_dict["month"],
            "day": ["12", "13"],
            "time": ["00:00", "04:00", "08:00",
                     "12:00", "16:00","17:00", "20:00"],
            'area': checked_dict["land"],
            'format': 'netcdf'
        },
        f"{file_name}.nc")