import requests

def download_pdf(url: str, filename: str) -> bool:
    """
    Downloads a PDF from the given URL and saves it to the specified filename.
    Returns True if successful, False otherwise.
    """
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()  # check for HTTP errors
        with open(filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:  # skip keep-alive chunks
                    f.write(chunk)
        print(f"Downloaded PDF successfully to '{filename}'")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error downloading PDF: {e}")
        return False

# Example usage:
if __name__ == "__main__":
    pdf_url = "chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.vssut.ac.in/lecture_notes/lecture1424354156.pdf"
    output_file = "cprog.pdf"
    download_pdf(pdf_url, output_file)
