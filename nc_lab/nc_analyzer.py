import numpy as np
import netCDF4 as nc
import matplotlib.pyplot as plt
from datetime import datetime
import random
import string
import os

def calc_min_max_by_day(parameter: str, nc_file: str) -> tuple[list[float], list[float]]:
    """
    Extracts daily minimum and maximum values for all days in the dataset.
    
    parameter: the parameter to analyze, such as temperature, humidity, etc.
    nc_file: path to the nc file
    """
    dataset = nc.Dataset(nc_file)
    time = dataset.variables['valid_time'][:]  # Time variable in the dataset
    param = dataset.variables[parameter][:]    # The parameter (e.g., temperature) we're interested in

    min_values = []
    max_values = []
    
    # Diagnostics: Print the size of the dataset
    total_hours = len(time)
    print(f"Total hours in the dataset: {total_hours}")
    print(f"Expected number of full days: {total_hours // 24}")

    # Iterate through the data assuming each day has 24 hourly entries
    for day_start in range(0, len(time), 24):  # 24 hours per day
        daily_data = param[day_start:day_start + 24]

        # Check if the day contains exactly 24 hours
        if len(daily_data) == 24:
            daily_min = np.min(daily_data)
            daily_max = np.max(daily_data)

            # Convert from Kelvin to Celsius
            daily_min_c = daily_min - 273.15
            daily_max_c = daily_max - 273.15

            # Append to lists
            min_values.append(round(float(daily_min_c), 2))
            max_values.append(round(float(daily_max_c), 2))
        else:
            # Diagnostics: If there's a day with incomplete data
            print(f"Incomplete data for day starting at hour {day_start}. Skipping.")

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

import numpy as np
import matplotlib.pyplot as plt
import os

def plot_min_max_temperatures(min_values: list[float], max_values: list[float], directory: str) -> None:
    """
    Plots the daily minimum and maximum temperatures, with the x-axis labeled every 5 days, 
    bolding the lines for "Day 5", "Day 10", etc., and increasing the font size.
    """
    days = np.arange(1, len(min_values) + 1)  # Days for the x-axis: Day 1, Day 2, ...
    
    # Generate labels every 5th day
    label_interval = 5
    x_labels = [f'Day {int(day)}' if day % label_interval == 0 else '' for day in days]

    plt.figure(figsize=(12, 10))

    # Font size and styling
    label_fontsize = 16
    title_fontsize = 18
    tick_fontsize = 14

    # Subplot 1: Minimum Temperatures
    plt.subplot(2, 1, 1)
    plt.plot(days, min_values, marker='o', linestyle='-', color='b', label='Min Temps')
    plt.axhline(y=np.median(min_values), color='r', linestyle='--', label=f'Median Min: {np.median(min_values):.2f}')
    plt.xlabel('Days', fontsize=label_fontsize)
    plt.ylabel('Min Temperature (°C)', fontsize=label_fontsize)
    plt.title('Minimum Temperature for Each Day', fontsize=title_fontsize)
    
    # Set x-ticks and labels
    plt.xticks(days, x_labels, fontsize=tick_fontsize)

    # Bold vertical grid lines for "Day 5", "Day 10", etc.
    for day in range(5, len(days) + 1, 5):
        plt.axvline(x=day, color='gray', linestyle='--', linewidth=2)  # Bold lines at intervals of 5
    
    plt.legend(fontsize=label_fontsize)
    plt.grid(True)

    # Subplot 2: Maximum Temperatures
    plt.subplot(2, 1, 2)
    plt.plot(days, max_values, marker='o', linestyle='-', color='g', label='Max Temps')
    plt.axhline(y=np.median(max_values), color='r', linestyle='--', label=f'Median Max: {np.median(max_values):.2f}')
    plt.xlabel('Days', fontsize=label_fontsize)
    plt.ylabel('Max Temperature (°C)', fontsize=label_fontsize)
    plt.title('Maximum Temperature for Each Day', fontsize=title_fontsize)
    
    # Set x-ticks and labels
    plt.xticks(days, x_labels, fontsize=tick_fontsize)

    # Bold vertical grid lines for "Day 5", "Day 10", etc.
    for day in range(5, len(days) + 1, 5):
        plt.axvline(x=day, color='gray', linestyle='--', linewidth=2)  # Bold lines at intervals of 5

    plt.legend(fontsize=label_fontsize)
    plt.grid(True)

    plt.tight_layout()

    # Save the plot
    os.makedirs(directory, exist_ok=True)
    output_file = os.path.join(directory, generate_random_filename(directory))
    plt.savefig(output_file)
    plt.close()

# Example usage
nc_file = "test.nc"
min_values, max_values = calc_min_max_by_day('t2m', nc_file)

directory = "./plots"
plot_min_max_temperatures(min_values=min_values, max_values=max_values, directory=directory)
