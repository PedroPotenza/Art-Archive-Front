from collections import defaultdict

def find_duplicates_in_file(file_path):
    title_dict = defaultdict(list)  # Usar defaultdict para armazenar IDs por título

    with open(file_path, 'r') as file:
        for line in file:
            line = line.strip()  # Remove espaços em branco
            if not line:  # Ignora linhas vazias
                continue
            
            # Tenta dividir a linha em ID e título
            try:
                object_id, title = line.split(', ', 1)
                title_dict[title].append(object_id)  # Adiciona o ID à lista correspondente ao título
            except ValueError:
                print(f"Formato inválido na linha: '{line}'")  # Exibe mensagem de erro

    # Filtra títulos que aparecem mais de uma vez
    duplicates = {title: ids for title, ids in title_dict.items() if len(ids) > 1}

    return duplicates

def save_duplicates_to_file(duplicates, output_file):
    with open(output_file, 'w') as file:
        total_duplicates = sum(len(ids) for ids in duplicates.values())  # Total de objetos duplicados
        if duplicates:
            file.write(f"Encontrados {len(duplicates)} títulos duplicados com um total de {total_duplicates} objetos duplicados:\n\n")
            for title, ids in duplicates.items():
                file.write(f"'{title}' aparece {len(ids)} vezes com os IDs: {', '.join(ids)}\n")
        else:
            file.write("Nenhum título duplicado encontrado.\n")

def main():
    file_path = 'titles_and_ids.txt'  # Caminho do arquivo de entrada
    output_file = 'duplicates.txt'  # Nome do arquivo de saída
    duplicates = find_duplicates_in_file(file_path)

    save_duplicates_to_file(duplicates, output_file)
    print(f"Resultados salvos no arquivo {output_file}")

if __name__ == '__main__':
    main()
