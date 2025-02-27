import os
import re
import requests
from bs4 import BeautifulSoup
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONSTANTS_FILE = os.path.join(SCRIPT_DIR, "../src/lib/constants.ts")

def fetch_constants():
    """
    Fetches the most recent anually updated values from the BPS page.
    Returns the fetched values as a tuple (bfc, bpc, minimum_wage). 
    """
    url = "https://www.bps.gub.uy/bps/valores.jsp?contentid=5478"
    response = requests.get(url)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    # Find the table
    table = soup.find("table")
    if not table:
        raise RuntimeError("Could not find a <table> on the page.")

    bfc_value = None
    bpc_value = None
    minimum_wage = None

    for row in table.find_all("tr"):
        cols = [td.get_text(strip=True) for td in row.find_all(["td", "th"])]

        if len(cols) < 2:
            continue

        concept = cols[0].lower()  
        value_str = cols[1]       

        numeric = re.sub(r"[\$]", "", value_str)
        numeric = re.sub(r"\.", "", numeric)    
        numeric = numeric.replace(",", ".")    

        try:
            numeric_value = float(numeric)
        except ValueError:
            continue

        if "base ficta" in concept or "bfc" in concept:
            bfc_value = numeric_value
        elif "prestaciones" in concept or "bpc" in concept:
            bpc_value = numeric_value
        elif "salario mínimo nacional" in concept:
            minimum_wage = numeric_value

    if bfc_value is None or bpc_value is None or minimum_wage is None:
        raise RuntimeError("Could not find some values in the table.")

    return (bfc_value, bpc_value, minimum_wage)




def update_constants_file(bfc_value: float, bpc_value: float, minimum_wage: float):
    """
    Updates the anually updated constants in constants.ts file
    """
    print(f"Updating constants.ts with BPC={bpc_value}, BFC={bfc_value}")

    if not os.path.exists(CONSTANTS_FILE):
        raise FileNotFoundError(f"constants.ts not found at {CONSTANTS_FILE}")

    with open(CONSTANTS_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    content = re.sub(
        r"(const\s+BFC\s*=\s*)([-+]?\d*\.?\d+)(\s*;)",  
        lambda m: f"{m.group(1)}{bfc_value}{m.group(3)}",  
        content
    )

    content = re.sub(
        r"(const\s+BPC\s*=\s*)([-+]?\d*\.?\d+)(\s*;)",  
        lambda m: f"{m.group(1)}{bpc_value}{m.group(3)}",  
        content
    )   

    content = re.sub(
        r"(const\s+MINIMUM_WAGE\s*=\s*)([-+]?\d*\.?\d+)(\s*;)",  
        lambda m: f"{m.group(1)}{minimum_wage}{m.group(3)}",  
        content
    )   

    content = re.sub(
        r"(const\s+LAST_UPDATE\s*=\s*)(\d+)(\s*;)",  
        lambda m: f"{m.group(1)}{datetime.now().year}{m.group(3)}",  
        content
    )

    with open(CONSTANTS_FILE, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"constants.ts successfully updated at {CONSTANTS_FILE}")

def main():
    bfc, bpc, minimum_wage = fetch_constants()
    print(f"Fetched from BPS site -> BFC: {bfc}, BPC: {bpc}, Minimum Wage: {minimum_wage}")

    update_constants_file(bfc, bpc, minimum_wage)
    print("constants.ts updated successfully.")

if __name__ == "__main__":
    main()