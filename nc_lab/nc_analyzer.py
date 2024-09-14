import numpy as np
import netCDF4 as nc
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
from datetime import datetime
import random
import string
import os


def calc_mean_by_given_hour(interval: int, parameter: str, nc_file: str) -> list[float]:
    """
    interval: intervalul de ore la care se preiau datele
    parameter: parametrul care se analizeaza: temperatura, umiditate etc.
    nc_file: path-ul catre fisierul nc
    """
    dataset = nc.Dataset(nc_file)
    time = dataset.variables['valid_time'][:]
    param = dataset.variables[parameter][:]
    mean_values = []

    for i in range(0, len(time), interval):
        data_interval = param[i:i+interval]
        mean_interval = np.mean(data_interval, axis=0)
        overall_mean = np.mean(mean_interval)
        mean_values.append(round(float(overall_mean), 2)) #temp in kelvin

    dataset.close()

    return mean_values

def generate_random_filename(directory: str) -> str:
    """
    genereaza un nume random de fisier cu urmatorul format:
    YYYYMMDD_XXXX_T.png
    YYYYMMDD - data curenta (an, luna, zi)
    XXXX - 4 caractere alfanumerice generate random
    T - vine de la type si se schimba in functie de ce facem: P (plot), S (string / text), T (tabel)
    !!!type trebuie implementat, deocamdata se genereaza doar ploturi
    """

    while True:
        current_date = datetime.now().strftime("%Y%m%d")
        random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        filename = f"{current_date}_{random_suffix}_P.png"
        file_path = os.path.join(directory, filename)

        if not os.path.exists(file_path):
            return filename



def plot_mean_by_given_interval(interval: int, mean_values: list[float]) -> None:
    x_values = np.arange(0, len(mean_values) * interval, interval)
    median_value = np.median(mean_values)

    def time_format(x, _):
        hours = int(x)
        return f"{hours:02d}:00"

    plt.figure(figsize=(10, 6))
    plt.plot(x_values, mean_values, marker='o', linestyle = '-', color='b', label = 'Mean Values')
    plt.axhline(y=median_value, color='r', linestyle='--', label=f'Median: {median_value:.2f}')
    plt.xlabel('Time (hours)')
    plt.ylabel('Mean Value')
    plt.title('Mean Values Over Time with Median Line')
    plt.legend()
    plt.grid(True)

    plt.gca().xaxis.set_major_formatter(FuncFormatter(time_format))

    output_dir = "./plots" #dupa ce generam mai multe chestii trebuie generalizata si asta
    os.makedirs(output_dir, exist_ok=True)

    output_file = os.path.join(output_dir, generate_random_filename(output_dir))
    plt.savefig(output_file)

    plt.close()





nc_file = "a_random_name_2.nc"
interval = 4
mean_values = calc_mean_by_given_hour(interval, 't2m', nc_file)
print(mean_values)

output_file = "plot.png"
plot_mean_by_given_interval(interval=interval, mean_values=mean_values)