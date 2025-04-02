import os
import re
import requests
import pandas as pd
from bs4 import BeautifulSoup
from datetime import datetime
import time
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONSTANTS_FILE = os.path.join(SCRIPT_DIR, "../src/lib/constants.ts")

def fetch_with_retries(url, retries=5, timeout=100):
    for i in range(retries):
        try:
            return requests.get(url, timeout=timeout)
        except requests.exceptions.RequestException as e:
            if i < retries - 1:
                time.sleep(5)
            else:
                raise e


def fetch_dolar_rate():
    """Fetches the current USD to UYU average exchange rate from INE's Excel file."""
    base_url = "https://www.gub.uy/instituto-nacional-estadistica/datos-y-estadisticas/estadisticas/series-historicas-cotizacion%20monedas"

    page = fetch_with_retries(base_url)
    page.raise_for_status()

    soup = BeautifulSoup(page.text, "html.parser")
    anchor = soup.find("a", text=re.compile("Cotizaciones al publico de las principales monedas"))

    if not anchor:
        raise RuntimeError("Could not find the download link on INE's website.")

    file_url = anchor["href"]
    if not file_url.startswith("http"):
        file_url = "https://www.gub.uy" + file_url

    file_response = requests.get(file_url)
    file_response.raise_for_status()

    file_path = os.path.join(SCRIPT_DIR, "cotizaciones.xlsx")
    with open(file_path, "wb") as f:
        f.write(file_response.content)

    df = pd.read_excel(file_path)

    last_row = df.dropna(subset=[df.columns[2], df.columns[3]]).iloc[-1]
    compra = last_row[df.columns[2]]
    venta = last_row[df.columns[3]]

    dolar_rate = round((compra + venta) / 2, 2)

    os.remove(file_path)

    return dolar_rate


def update_constant(content, key, value):
    """Updates a constant in the file content."""
    pattern = rf"(const\s+{key}\s*=\s*)([-+]?\d*\.?\d+)(\s*;)"
    return re.sub(pattern, lambda m: f"{m.group(1)}{value}{m.group(3)}", content)


def update_constants_file(dolar_rate):
    """Updates DOLAR_UYU_RATE in constants.ts."""
    if not os.path.exists(CONSTANTS_FILE):
        raise FileNotFoundError(f"constants.ts not found at {CONSTANTS_FILE}")

    with open(CONSTANTS_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    content = update_constant(content, "DOLAR_UYU_RATE", dolar_rate)
    content = update_constant(content, "LAST_UPDATE", datetime.now().year)

    with open(CONSTANTS_FILE, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"constants.ts successfully updated at {CONSTANTS_FILE}")
    print(f"Updated DOLAR_UYU_RATE to {dolar_rate}")


def main():
    dolar_rate = fetch_dolar_rate()
    print(f"Fetched USD to UYU average rate -> {dolar_rate}")

    update_constants_file(dolar_rate)


if __name__ == "__main__":
    main()
