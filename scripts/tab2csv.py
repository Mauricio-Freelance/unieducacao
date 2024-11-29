import json
import pandas as pd


df = pd.read_csv("sheet2.csv", sep=",", header=None)

category = "MODALIDADES"

#print(df)

data = {}

for row in df.iterrows(): 
    id = row[0] 
    course, duration = row[1]

    #print(f"{id} - {course} - {duration}")

    data[id] = {
        "Curso": course,
        "Duração": duration
    }

data = {category: data}

string_json = json.dumps(data, indent=4, ensure_ascii=False)

with open("course_catalog.json", "w", encoding="utf-8") as file:
    file.write(string_json)