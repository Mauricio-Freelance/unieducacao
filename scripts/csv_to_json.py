from json import dumps
from pandas import(
    DataFrame,
    read_csv
)


from gemini import (
    create_model, 
    use_model
)

model = create_model()


CSV_FILE = "data/CURSOS PÓS TECNICOS.csv"
JSON_FILE = "file.json"
CATEGORY = "Pós-Técnicos"
COURSES = "CURSOS"
DURATION = "DURAÇÃO"


def from_dict(dic: dict) -> DataFrame:
    
    new_dic = {}
    
    for idx in range(len(dic[COURSES])):

        course, duration = dic[COURSES][idx], dic[DURATION][idx]

        print(course, duration)

        new_dic[idx] = {
            "Curso": course,
            "Duração": duration
        }

    result = {
        CATEGORY: new_dic
    }

    return result

def from_gemini(result: str) -> dict:

    lines = result.splitlines()

    del lines[0]

    print(lines)

    new_dict = {}

    idx = 0

    for line in lines:
        course, duration = line.split(",")

        idx += 1

        new_dict[str(idx)] = {
            COURSES: course,
            DURATION: duration
        }

    return new_dict

def main():

    df = read_csv(CSV_FILE)

    prompt = df.to_string()

    print(prompt)

    result = use_model(prompt, model)

    print(f"String do GEMINI: \n\n{result}")

    result = from_gemini(result)

    result = dumps(result, indent=4, ensure_ascii=False)


    with open(JSON_FILE, "w", encoding="utf-8") as file:
        file.write(result)




#df.to_json("file.json", orient="records", indent=4, force_ascii=False)

main()