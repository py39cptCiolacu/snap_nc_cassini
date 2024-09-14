VALID_VARIABLES = {
    "2m_temperature" : "Air temperature at 2 meters above the ground.",
    "2m_dewpoint_temperature" : "Temperature where air becomes saturated with moisture (condensation begins).",
    "total_precipitation" : "Total amount of rain, snow, etc., measured over a period.",
    "surface_solar_radiation_downwards" : "Solar energy reaching the Earth's surface.",
    "volumetric_soil_water_layer_1" : "Soil moisture content in the uppermost soil layer.",
    "surface_pressure" : "Atmospheric pressure at the surface level.",
    "10m_u_component_of_wind" : "Wind speed in the east-west direction, measured at 10 meters.",
    "10m_v_component_of_wind" : "Wind speed in the north-south direction, measured at 10 meters.",
    "evaporation" : "Water loss through evaporation from soil and plants.",
    "soil_temperature_level_1" : "Temperature of the upper soil layer.",
}

VALID_VARIABLES_NED_CDF = {
    "2m_temperature" : "t2m",
    "2m_dewpoint_temperature" : "d2m",
    "total_precipitation" : "tp",
    "surface_solar_radiation_downwards" : "ssrd",
    "volumetric_soil_water_layer_1" : "swvl1",
    "surface_pressure" : "sp",
    "10m_u_component_of_wind" : "u10",
    "10m_v_component_of_wind" : "v10",
    "evaporation" : "e",
    "soil_temperature_level_1" : "stl1",
}

ALL_DAY = ["00:00", "01:00", "02:00", "03:00",  "04:00", 
                    "05:00", "06:00", "07:00", "08:00",  "09:00",
                    "10:00", "11:00", "12:00", "13:00",  "14:00",
                    "15:00", "16:00", "17:00", "18:00",  "19:00",
                    "20:00", "21:00", "22:00", "23:00",]