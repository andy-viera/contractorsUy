import os
import re
import requests
from bs4 import BeautifulSoup

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONSTANTS_FILE = os.path.join(SCRIPT_DIR, "../src/lib/constants.ts")

def fetch_bfc_bpc():
    """
    Fetches the most recent BFC and BPC from the BPS page.
    Returns a tuple (bfc_value, bpc_value) as floats.
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

    if bfc_value is None or bpc_value is None:
        raise RuntimeError("Could not find both BFC and BPC values in the table.")

    return (bfc_value, bpc_value)

def update_constants_file(bfc_value: float, bpc_value: float):
    """
    Updates the lines `let BPC = 0;` and `let BFC = 0;` in constants.ts
    with the new float values for BPC and BFC.
    """
    print(f"Updating constants.ts with BPC={bpc_value}, BFC={bfc_value}")

    if not os.path.exists(CONSTANTS_FILE):
        raise FileNotFoundError(f"constants.ts not found at {CONSTANTS_FILE}")

    with open(CONSTANTS_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    content = re.sub(
        r"(let\s+BFC\s*=\s*)([-+]?\d*\.?\d+)(\s*;)",  
        lambda m: f"{m.group(1)}{bfc_value}{m.group(3)}",  
        content
    )

    content = re.sub(
        r"(let\s+BPC\s*=\s*)([-+]?\d*\.?\d+)(\s*;)",  
        lambda m: f"{m.group(1)}{bpc_value}{m.group(3)}",  
        content
    )   

    with open(CONSTANTS_FILE, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"constants.ts successfully updated at {CONSTANTS_FILE}")

def main():
    bfc, bpc = fetch_bfc_bpc()
    print(f"Fetched from BPS site -> BFC: {bfc}, BPC: {bpc}")

    update_constants_file(bfc, bpc)
    print("constants.ts updated successfully.")

if __name__ == "__main__":
    main()