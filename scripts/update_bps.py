import os
import re
import requests
from bs4 import BeautifulSoup
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONSTANTS_FILE = os.path.join(SCRIPT_DIR, "../src/lib/constants.ts")


def fetch_constants():
    """
    Fetches the most recent annually updated values from the BPS page.
    Returns the fetched values as a dictionary.
    """
    url = "https://www.bps.gub.uy/bps/valores.jsp?contentid=5478"
    response = requests.get(url)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    table = soup.find("table")
    if not table:
        raise RuntimeError("Could not find a <table> on the page.")

    constants = {
        "BFC": None,
        "BPC": None,
        "CPE": None,
        "MINIMUM_WAGE": None,
        "RETIREMENT_CONTRIBUTIONS_CAP": None
    }

    for row in table.find_all("tr"):
        cols = [td.get_text(strip=True) for td in row.find_all(["td", "th"])]

        if len(cols) < 3:
            continue

        concept = cols[0].lower()  
        value_str = cols[2]  

        numeric = re.sub(r"[\$]", "", value_str) 
        numeric = re.sub(r"\.", "", numeric)     
        numeric = numeric.replace(",", ".")       

        try:
            numeric_value = float(numeric)
        except ValueError:
            continue  

        if "base ficta" in concept or "bfc" in concept:
            constants["BFC"] = numeric_value
        elif "prestaciones" in concept or "bpc" in concept:
            constants["BPC"] = numeric_value
        elif "cpe" in concept:
            constants["CPE"] = numeric_value
        elif "salario mínimo nacional" in concept:
            constants["MINIMUM_WAGE"] = numeric_value
        elif "topes art." in concept and "- c" in concept:
            constants["RETIREMENT_CONTRIBUTIONS_CAP"] = numeric_value

    return constants


def update_constant(content, key, value):
    """
    Helper function to update a constant in the file content.
    """
    pattern = rf"(const\s+{key}\s*=\s*)([-+]?\d*\.?\d+)(\s*;)"
    return re.sub(pattern, lambda m: f"{m.group(1)}{value}{m.group(3)}", content)


def update_constants_file(constants):
    """
    Updates the annually updated constants in constants.ts file.
    Only updates values that were found, and reports the missing ones.
    """
    if not os.path.exists(CONSTANTS_FILE):
        raise FileNotFoundError(f"constants.ts not found at {CONSTANTS_FILE}")

    with open(CONSTANTS_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    updated_keys = []
    missing_keys = []

    for key, value in constants.items():
        if value is not None:
            content = update_constant(content, key, value)
            updated_keys.append(key)
        else:
            missing_keys.append(key)

    content = update_constant(content, "LAST_UPDATE", datetime.now().year)

    with open(CONSTANTS_FILE, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"constants.ts successfully updated at {CONSTANTS_FILE}")
    print(f"Updated constants: {', '.join(updated_keys)}")
    
    if missing_keys:
        print(f"⚠️ Warning: Could not update the following constants as they were not found: {', '.join(missing_keys)}")


def main():
    constants = fetch_constants()
    print(f"Fetched from BPS site -> {constants}")

    update_constants_file(constants)
    print("constants.ts updated successfully.")


if __name__ == "__main__":
    main()