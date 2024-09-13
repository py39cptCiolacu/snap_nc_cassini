import netCDF4 as nc

def read_nc(file_path: str) -> None:

    dataset = nc.Dataset(file_path, mode='r')
    
    # Afișează informații generale despre fișier
    print("Global attributes:", dataset.ncattrs())
    print("Dimensions:", dataset.dimensions.keys())
    print("Variables:", dataset.variables.keys())
    
    # Opțional, poți afișa și variabilele detaliat
    print("\nDetalii variabile:")
    for var_name in dataset.variables:
        var = dataset.variables[var_name]
        print(f"Name: {var_name}")
        print(f"Dimensions: {var.dimensions}")
        print(f"Shape: {var.shape}")
        print(f"Data type: {var.datatype}")
        print(f"Attributes: {var.ncattrs()}")
        print("-" * 40)

    # if "t2m" in dataset.variables:
    #     t2m = dataset.variables["t2m"][:]
    #     print(t2m)
    # else:
    #     print("sorry")
    
    
    # Închide fișierul
    dataset.close()

# Exemplu de utilizare
read_nc('a_random_name.nc')