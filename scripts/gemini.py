#from re import findall
import google.generativeai as genai
from settings.configs import GENERATION, SAFETY
from settings.key import API_KEY

def create_model()  -> genai.GenerativeModel:
    """
    Carrega um Modelo Genai Configura e pronto pra ser usado e o retorna
    """
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel(model_name="gemini-1.0-pro",
                              generation_config=GENERATION,
                              safety_settings=SAFETY)
    
    return model


def use_model(prompt: str, model: genai.GenerativeModel) -> str:
    """
    Gera um dicionário, onde cada chave é um gênero de anime, e dentro das chaves contem os animes em formato de lista de string referentes ao gênero.
    
    Dicionario[Gênero] == ["Anime1", "Anime2", "Anime3"]
    """
    
    prompt = "Corrija o texto a seguir substituido os caracteres com problemas pela palavra correta e o reescreva corretamente seguindo a estrutura do CSV (separando por virgula os itens e por quebra de linha as linhas): " + prompt
    return  model.generate_content(prompt).text.replace('*','')
                
                
def use_model_dict(prompt: str, model: genai.GenerativeModel) -> dict:
    """
    Gera um dicionário, onde cada chave é um gênero de anime, e dentro das chaves contem os animes em formato de lista de string referentes ao gênero.
    
    Dicionario[Gênero] == ["Anime1", "Anime2", "Anime3"]
    """
    
    prompt = "Recomende animes, os separando entre seus respectivos gêneros (ação, ficção, comédia, terror, etc) sobre: " + prompt
    data =  model.generate_content(prompt).text.replace('*','').splitlines()
    #print(data)
    #print("\n\n\n")
    
    dic = {}
    
    section = ''
    
    for id in range(0, len(data)):
        
        if id == 0:
            section = data[id]
            dic[section] = []
        
        elif len(data[id]) > 0 and id != 1 and section != data[id]:
            dic[section] += [data[id]]
            
        elif len(data[id]) == 0:
            if section != data[id-1]:
                section = data[id+1]
                dic[section] = []
                
    #print("\n\n\n",dic.keys())
    
    for keys in dic.keys():
        for item in dic[keys]:
            if len(item) == 0:
                del item
                
    return dic
    
    #pattern = r"(?:^|\n{2})(.*?)(?:\n{2}|\n|$)" # Expresão Regular usada para filtrar as seções dos animes recomendados
    
    #matches = findall(pattern, data)
    
    #return matches

