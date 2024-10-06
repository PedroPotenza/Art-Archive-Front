import requests

API_KEY = '' 
BASE_URL = 'https://api.harvardartmuseums.org/object'
PAGE_SIZE = 100  # Máximo de 100 objetos por página
OUTPUT_FILE = 'titles.txt'  # Nome do arquivo de saída


def fetch_and_save_titles():
    page = 1

    with open(OUTPUT_FILE, 'w') as file:  # Abre o arquivo para escrita
        while True:
            # Faz a requisição para a API com os parâmetros de paginação
            response = requests.get(BASE_URL, params={
                'apikey': API_KEY,
                'size': PAGE_SIZE,
                'page': page,
            })

            # Verifica se a requisição foi bem-sucedida
            if response.status_code != 200:
                print(f"Erro ao buscar dados da API na página {page}: {response.status_code}")
                break

            data = response.json()
            objects = data.get('records', [])

            # Se não houver mais objetos, sair do loop
            if not objects:
                break

            # Escreve os títulos no arquivo
            for obj in objects:
                title = obj.get('title')
                if title:
                    file.write(f"{title}\n")  # Salva o título em uma nova linha

            print(f"Página {page} coletada e títulos salvos com sucesso.")
            page += 1  # Passa para a próxima página


def main():
    print("Buscando e salvando títulos de todos os objetos da API...")
    fetch_and_save_titles()
    print(f"Títulos salvos no arquivo {OUTPUT_FILE}")


if __name__ == '__main__':
    main()