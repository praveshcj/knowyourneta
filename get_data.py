import os
import requests
from bs4 import BeautifulSoup
import csv


def get_lok_sabha_members(url):
    print(url)
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    table = soup.find('table', {'class': 'member_list_table'})
    rows = table.find_all('tr')[1:]

    members = []

    for row in rows:
        columns = row.find_all('td')
        if len(columns) > 1:
            # name = columns[0].get_text(strip=True)
            name = columns[1].get_text(strip=True)
            party = columns[2].get_text(strip=True)
            constituency = columns[3].get_text(strip=True)
            # print(columns)
            img_tag = columns[1].find('img')
            img_src = img_tag['src'] if img_tag else None

            member = {
                'name': name,
                'constituency': constituency,

                'party': party,
                'img_src': img_src
            }
            members.append(member)

    return members


def download_image(url, path):
    response = requests.get(url)
    with open(path, 'wb') as f:
        f.write(response.content)

def save_members_to_csv(members, csv_filename):
    headers = ['name', 'constituency', 'party', 'img_src']

    with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers,  delimiter='\t')
        writer.writeheader()
        for member in members:
            writer.writerow(member)




if __name__ == '__main__':
    url = 'https://loksabha.nic.in/Members/AlphabeticalList.aspx'
    members = get_lok_sabha_members(url)
    images_directory = 'member_images'
    csv_filename = 'lok_sabha_members.csv'
    save_members_to_csv(members, csv_filename)
    print(f"Members data saved to {csv_filename}")

    # if not os.path.exists(images_directory):
        # os.makedirs(images_directory)

    # for member in members:
    #     img_url = member['img_src']
    #     if img_url:
    #         img_name = member['name'].replace(' ', '_') + '.jpg'
    #         img_path = os.path.join(images_directory, img_name)

    #         print(f"Downloading image for {member['name']} from {img_url} to {img_path}")
    #         download_image(img_url, img_path)
    #     else:
    #         print(f"No image available for {member['name']}")

