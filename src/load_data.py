import json

def load_games(path):
    with open(path, "r") as f:
        return json.load(f)

if __name__ == "__main__":
    games = load_games("data/games_sample.json")
    print("Loaded games:")
    for game in games:
        print("-", game["title"])
