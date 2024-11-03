from json import dumps


def read_file(filename: str = "copy_past_here.txt") -> list[str]:
    """
    Lê o arquivo de texto com os dados do catálogo do curso
    """
    with open(filename, "r") as file:
        lines = file.readlines()

    return lines


def get_course_name(lines: list[str]) -> str:
    """
    Retorna o nome do curso
    """
    course_name = lines[0].split("PÓS")[1].capitalize().strip().replace("\n", "").split("–")[0].capitalize()

    if "-" in course_name:
        course_name = course_name.split("-")[0].capitalize().strip()

    return course_name


def clean_trash_rows(lines: list[str]) -> list[str]:
    """
    Limpa as linhas que não são necessárias para a extração dos dados
    """
    for _ in range(4):
        lines.pop(0)

    company = 2
    count = 0
    i = 0

    for line in lines:
        
        if count == company:
            line
            lines.pop(
                lines.index(line)
            ) 
            count = 0
            i -=1

        count += 1
        

    return lines


def build_course_catalog(lines: list[str]) -> dict:
    """
    Constroi o catálogo do curso com as informações de cada curso, sendo nome e duração
    """
    course_catalog = {}

    lines = clean_trash_rows(lines)

    idx = 0

    for i in range(0, len(lines)-1, 2):

        idx += 1

        course_catalog[idx] = {
            "Curso": lines[i].replace("\n", "").strip(),
            "Duração": lines[i + 1].replace("\n", "").strip(),
        }

    return course_catalog


def clipboard_to_dict(lines: list[str]) -> dict:
    """
    Converte as linhas para um dict
    """
    dic = {}

    course_name = get_course_name(lines)

    dic[course_name] = build_course_catalog(lines)

    return dic


def dict_to_json(course_catalog: dict) -> str:
    """
    Converte o catálogo do curso em um arquivo JSON
    """
    return dumps(course_catalog, indent=4, ensure_ascii=False)


def main():
    """
    # Processo Principal:
    - Copiar o word e colar em copy_past_here.txt
    - Executar este script python
    - Obter o arquivo course_catalog.json com o catálogo do curso
    - Copiar a chave do curso em course_catalog.json para database.json
    - Ser feliz de não ter que fazer isso manualmente :)
    """
    lines = read_file()

    course_catalog = clipboard_to_dict(lines)

    json = dict_to_json(course_catalog)

    with open("course_catalog.json", "w", encoding="utf-8") as file:
        file.write(json)


main()