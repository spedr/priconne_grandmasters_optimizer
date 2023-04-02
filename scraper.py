import os
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def sanitize_filename(filename):
    return re.sub(r'[^\w\-_\. ]', '_', filename)

def sanitize_file_extensions(folder):
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        if os.path.isfile(file_path):
            file_base, file_ext = os.path.splitext(filename)
            file_ext = file_ext[:4]  # Keep only the first three characters after the dot
            sanitized_name = f"{file_base}{file_ext}"
            sanitized_path = os.path.join(folder, sanitized_name)
            os.rename(file_path, sanitized_path)

def download_images(url, save_folder):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'lxml')
    
    if not os.path.exists(save_folder):
        os.makedirs(save_folder)

    for img_tag in soup.find_all('img'):
        img_url = img_tag.get('src')
        img_url = urljoin(url, img_url)  # Convert the relative URL to an absolute URL
        img_name = os.path.basename(img_url)
        img_name = sanitize_filename(img_name)  # Sanitize the file name
        img_path = os.path.join(save_folder, img_name)

        try:
            img_data = requests.get(img_url).content
            with open(img_path, 'wb') as img_file:
                img_file.write(img_data)
            print(f"Downloaded {img_url}")
        except Exception as e:
            print(f"Error downloading {img_url}: {e}")

    sanitize_file_extensions(save_folder)  # Sanitize file extensions after downloading images

if __name__ == '__main__':
    url = 'https://priconne-grandmasters.jp'  # Replace this with the target website URL
    save_folder = 'downloaded_images'
    #download_images(url, save_folder)
    sanitize_file_extensions(save_folder)