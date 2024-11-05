from json import dumps
from pandas import(
    read_csv
)


from gemini import (
    create_model, 
    use_model
)

model = create_model()


CSV_FILE = "file.csv"
JSON_FILE = "file.json"
CATEGORY = "Tecnicos Regulares"
COURSES = "CURSOS"
DURATION = "DURAÇÃO"

def main():

    df = read_csv(CSV_FILE, encoding="utf-8")

    print(df)

    prompt = df.to_string()

    print(prompt)

    result = use_model(prompt, model)

    print(result)

    dic = df.to_dict()

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

    result = dumps(result, indent=4, ensure_ascii=False)


    with open(JSON_FILE, "w", encoding="utf-8") as file:
        file.write(result)




#df.to_json("file.json", orient="records", indent=4, force_ascii=False)

main()