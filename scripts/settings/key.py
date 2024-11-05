from os.path import abspath, dirname, join

API_KEY_FILE = join(dirname(dirname(abspath(__file__))), "API-KEY.txt")

with open(API_KEY_FILE, 'r') as file:
    API_KEY = file.read()
