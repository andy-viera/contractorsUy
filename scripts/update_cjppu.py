import os
import re
import requests
import pdfplumber
from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Optional

SCRIPT_DIR: str = os.path.dirname(os.path.abspath(__file__))
CONSTANTS_FILE: str = os.path.join(SCRIPT_DIR, "../src/lib/constants.ts")
CJPPU_URL: str = "https://www.cjppu.org.uy/afiliados_aportes.php"


def fetch_contributions_pdf_url() -> str:
    """
    Scrapes the CJPPU page to find the latest PDF file link for contribution scales.

    Returns:
        str: The URL of the contributions PDF.
    
    Raises:
        RuntimeError: If no valid PDF link is found.
    """
    response: requests.Response = requests.get(CJPPU_URL)
    response.raise_for_status()
    soup: BeautifulSoup = BeautifulSoup(response.text, "html.parser")

    for link in soup.find_all("a", href=True):
        if f"Aportes {datetime.now().year}" in link.text:
            pdf_url: str = link["href"]
            if not pdf_url.startswith("http"):
                pdf_url = f"https://www.cjppu.org.uy/{pdf_url}"
            return pdf_url

    raise RuntimeError("Could not find the latest CJPPU contributions PDF.")


def download_pdf(pdf_url: str) -> str:
    """
    Downloads the PDF file from the given URL and saves it locally.

    Args:
        pdf_url (str): The URL of the PDF file to download.

    Returns:
        str: The local file path of the downloaded PDF.
    """
    pdf_path: str = os.path.join(SCRIPT_DIR, "cjppu_aportes.pdf")
    response: requests.Response = requests.get(pdf_url)
    response.raise_for_status()

    with open(pdf_path, "wb") as file:
        file.write(response.content)

    print(f"pdf downloaded successfully: {pdf_path}")
    return pdf_path


def extract_cuota_unificada(pdf_path: str) -> List[int]:
    """
    Extracts the values under 'CUOTA UNIFICADA' column from the PDF.

    Args:
        pdf_path (str): The file path of the downloaded PDF.

    Returns:
        List[int]: A list of extracted CUOTA UNIFICADA values as integers.
    """
    extracted_values: List[int] = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            table: Optional[List[List[Optional[str]]]] = page.extract_table()

            if not table:
                continue

            for row in table:
                if not row or len(row) < 5:  
                    continue

                cuota_unificada: Optional[str] = row[4]  

                if not cuota_unificada:
                    continue

         
                numeric_value: str = re.sub(r"\.", "", cuota_unificada)  
                numeric_value = numeric_value.replace(",", ".") 

                try:
                    extracted_values.append(int(float(numeric_value)))  
                except ValueError:
                    continue

    return extracted_values


def update_professional_categories(content: str, values: List[int]) -> str:
    """
    Updates the PROFESSIONAL_CATEGORIES constant with new values in order.

    Args:
        content (str): The content of the constants.ts file.
        values (List[int]): The new values to update in order.

    Returns:
        str: The updated content.
    """
    pattern = re.compile(r'(\{ label: "([^"]+)", value: )([\d\.,]+)( \},)', re.MULTILINE)

    def replacement(match):
        nonlocal index
        label = match.group(2)  

        if index < len(values):
            new_value = values[index] 
            index += 1  
            return f'{{ label: "{label}", value: {new_value} }},'
        return match.group(0)  

    index = 0
    updated_content = pattern.sub(replacement, content)

    return updated_content


def update_constants_file(values: List[int]) -> None:
    """
    Updates the PROFESSIONAL_CATEGORIES in constants.ts file with new CUOTA UNIFICADA values.

    Args:
        values (List[int]): The list of new values to update.
    """
    if not os.path.exists(CONSTANTS_FILE):
        raise FileNotFoundError(f"constants.ts not found at {CONSTANTS_FILE}")

    with open(CONSTANTS_FILE, "r", encoding="utf-8") as f:
        content: str = f.read()

    updated_content = update_professional_categories(content, values)

    with open(CONSTANTS_FILE, "w", encoding="utf-8") as f:
        f.write(updated_content)

    print(f"constants.ts successfully updated at {CONSTANTS_FILE}")
    print(f"Updated PROFESSIONAL_CATEGORIES values: {values}")


def main() -> None:
    """
    Main function that orchestrates fetching, downloading, extracting, and updating constants.
    """
    try:
        pdf_url: str = fetch_contributions_pdf_url()
        print(f"Found pfd url: {pdf_url}")

        pdf_path: str = download_pdf(pdf_url)

        cuota_unificada_values: List[int] = extract_cuota_unificada(pdf_path)
        
        os.remove(pdf_path)

        print(f"Extracted CUOTA UNIFICADA values: {cuota_unificada_values}")
        
        if len(cuota_unificada_values) >= 11:  
            update_constants_file(cuota_unificada_values[:11])
        else:
            print("⚠️ Warning: Not enough values extracted to update all professional categories.")

    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    main()