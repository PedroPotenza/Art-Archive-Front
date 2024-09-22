import requests
import os

API_KEY = ''
BASE_URL = 'https://api.harvardartmuseums.org/object'
PAGE_SIZE = 100  # Máximo de 100 objetos por página
OUTPUT_FILE = 'duplicated_titles.txt'  # Nome do arquivo de saída


def fetch_all_objects():
    all_objects = []
    page = 1

    while True:
        # Faz a requisição para a API com os parâmetros de paginação
        response = requests.get(BASE_URL, params={
            'apikey': API_KEY,
            'size': PAGE_SIZE,
            'page': page,
        })

        # Verifica se a requisição foi bem-sucedida
        if response.status_code != 200:
            print(f"API_KEY: {API_KEY}")
            print(f"Erro ao buscar dados da API na página {page}: {response.status_code}")
            break

        data = response.json()
        objects = data.get('records', [])

        # Se não houver mais objetos, sair do loop
        if not objects:
            break

        all_objects.extend(objects)  # Adiciona os objetos ao array principal
        print(f"Página {page} coletada com sucesso, {len(objects)} objetos.")
        page += 1  # Passa para a próxima página

    return all_objects


def find_duplicate_titles(objects):
    title_counts = {}
    duplicates = []

    # Conta quantas vezes cada título aparece
    for obj in objects:
        title = obj.get('title')
        if title:
            if title in title_counts:
                title_counts[title] += 1
            else:
                title_counts[title] = 1

    # Identifica os títulos que aparecem mais de uma vez
    for title, count in title_counts.items():
        if count > 1:
            duplicates.append({'title': title, 'count': count})

    return duplicates


def save_duplicates_to_txt(duplicates):
    # Abre o arquivo para escrita
    with open(OUTPUT_FILE, 'w') as file:
        if duplicates:
            file.write(f"Encontrados {len(duplicates)} títulos duplicados:\n\n")
            for duplicate in duplicates:
                file.write(f"'{duplicate['title']}' aparece {duplicate['count']} vezes\n")
        else:
            file.write("Nenhum título duplicado encontrado.\n")

    print(f"Dados salvos no arquivo {OUTPUT_FILE}")


def main():
    print("Buscando todos os objetos da API...")
    all_objects = fetch_all_objects()

    if not all_objects:
        print("Nenhum objeto encontrado.")
        return

    print(f"Total de objetos coletados: {len(all_objects)}")

    # Identifica títulos duplicados
    duplicates = find_duplicate_titles(all_objects)

    # Salva os dados em um arquivo txt
    save_duplicates_to_txt(duplicates)


if __name__ == '__main__':
    main()
