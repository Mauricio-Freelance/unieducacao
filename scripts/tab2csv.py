import json
import pandas as pd


df = pd.read_csv("sheet2.csv", sep="\t", header=None)

category = "DIREITO  - Direitos Específicos e Interdisciplinaridades"

#print(df)

data = {}

for row in df.iterrows(): 
    id = row[0] 

    if len(row[1]) > 1:

        course, duration = row[1]
    else:

        course = row[1].values[0]
        duration = "INDEFINIDO"

    #print(f"{id} - {course} - {duration}")

    data[id] = {
        "Curso": course,
        "Duração": duration
    }

data = {category: data}

string_json = json.dumps(data, indent=4, ensure_ascii=False)

with open("course_catalog.json", "w", encoding="utf-8") as file:
    file.write(string_json)
    print("Salvei no arquivo")