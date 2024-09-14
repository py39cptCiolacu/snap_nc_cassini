import numpy as np
import netCDF4 as nc
import matplotlib.pyplot as plt
from datetime import datetime
import random
import string
import os

def calc_min_max_by_day(parameter: str, nc_file: str) -> tuple[list[float], list[float]]:
    """
    parameter: the parameter to analyze, such as temperature, humidity, etc.
    nc_file: path to the nc file
    """
    dataset = nc.Dataset(nc_file)
    time = dataset.variables['valid_time'][:]
    param = dataset.variables[parameter][:]

    min_values = []
    max_values = []

    for day_start in range(0, len(time), 24):  # 24 hours per day
        daily_data = param[day_start:day_start+24]
        daily_min = np.min(daily_data)
        daily_max = np.max(daily_data)
        
        # Convert from Kelvin to Celsius
        daily_min_c = daily_min - 273.15
        daily_max_c = daily_max - 273.15
        
        min_values.append(round(float(daily_min_c), 2))
        max_values.append(round(float(daily_max_c), 2))

    dataset.close()

    return min_values, max_values

def generate_random_filename(directory: str) -> str:
    """
    Generates a random file name with the following format:
    YYYYMMDD_XXXX_P.png
    """
    while True:
        current_date = datetime.now().strftime("%Y%m%d")
        random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        filename = f"{current_date}_{random_suffix}_P.png"
        file_path = os.path.join(directory, filename)

        if not os.path.exists(file_path):
            return filename

def plot_min_max_temperatures(min_values: list[float], max_values: list[float], directory: str) -> None:
    days = np.arange(1, len(min_values) + 1)  # Days for the x-axis: Day 1, Day 2, ...

    plt.figure(figsize=(10, 8))

    plt.subplot(2, 1, 1)
    plt.plot(days, min_values, marker='o', linestyle='-', color='b', label='Min Temps')
    plt.axhline(y=np.median(min_values), color='r', linestyle='--', label=f'Median Min: {np.median(min_values):.2f}')
    plt.xlabel('Days')
    plt.ylabel('Min Temperature (°C)')
    plt.title('Minimum Temperature for Each Day')
    plt.xticks(days, [f'Day {int(day)}' for day in days])
    plt.legend()
    plt.grid(True)

    plt.subplot(2, 1, 2)
    plt.plot(days, max_values, marker='o', linestyle='-', color='g', label='Max Temps')
    plt.axhline(y=np.median(max_values), color='r', linestyle='--', label=f'Median Max: {np.median(max_values):.2f}')
    plt.xlabel('Days')
    plt.ylabel('Max Temperature (°C)')
    plt.title('Maximum Temperature for Each Day')
    plt.xticks(days, [f'Day {int(day)}' for day in days])
    plt.legend()
    plt.grid(True)

    plt.tight_layout()

    os.makedirs(directory, exist_ok=True)
    output_file = os.path.join(directory, generate_random_filename(directory))
    plt.savefig(output_file)
    plt.close()

# # Example usage
# nc_file = "2m_temperature.nc"
# min_values, max_values = calc_min_max_by_day('t2m', nc_file)

# directory = "./plots"
# plot_min_max_temperatures(min_values=min_values, max_values=max_values, directory=directory)