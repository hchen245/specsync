import requests
import json
import os
import re

API_KEY = "c820d14bb2f7404ea0ec14b05053f31a"

BASE_URL = "https://api.rawg.io/api/games"

def build_text_doc(game):
    """
    Build a text document from English tags (and optionally genres)
    """
    words = []
    words.extend(game["name"].lower().split())
    # tags and genres
    for tag in game.get("tags", []):
        if tag.get("language") == "eng":
            words.append(tag["name"].lower())

    for genre in game.get("genres", []):
        words.append(genre["name"].lower())

    return " ".join(words)

def parse_number_from_string(s):
    """Extract the first number from a string, return 0 if none"""
    match = re.search(r"(\d+\.?\d*)", s)
    return float(match.group(1)) if match else 0

def add_numeric_hw_fields(game):
    """
    Add numeric CPU/GPU/RAM/VRAM fields to a game dict.
    This is a simplified example based on RAWG recommended requirements.
    """
    rec = game.get("requirements", {}).get("recommended", {})

    # CPU/GPU/RAM/VRAM as numeric values
    game["cpu_rec"] = parse_number_from_string(rec.get("cpu", "0"))
    game["gpu_rec"] = parse_number_from_string(rec.get("gpu", "0"))
    game["ram_rec"] = parse_number_from_string(rec.get("ram", "0"))
    game["vram_rec"] = parse_number_from_string(rec.get("vram", "0"))

    # fallback if RAWG didn't provide recommended hardware
    game["cpu_rec"] = game["cpu_rec"] or 1000
    game["gpu_rec"] = game["gpu_rec"] or 1000
    game["ram_rec"] = game["ram_rec"] or 8
    game["vram_rec"] = game["vram_rec"] or 2

    return game

def transform_games(raw_games):
    """
    Transform raw RAWG data into simplified IR-friendly format
    """
    transformed = []

    for game in raw_games:
        game = add_numeric_hw_fields(game)
        transformed.append({
            "id": game["id"],
            "name": game["name"],
            "text_doc": build_text_doc(game),
            "cpu_rec": game["cpu_rec"],
            "gpu_rec": game["gpu_rec"],
            "ram_rec": game["ram_rec"],
            "vram_rec": game["vram_rec"],
        })

    return transformed


def fetch_all_games(total_games=1000, page_size=40):
    all_games = []
    page = 1
    while len(all_games) < total_games:
        params = {
            "key": API_KEY,
            "page_size": page_size,
            "platforms": 4,
            "page": page
        }
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        games = response.json()["results"]
        if not games:
            break
        all_games.extend(games)
        page += 1
    return all_games[:total_games]

    

def save_raw_games(games, filename):
    path = f"data/{filename}"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(games, f, indent=2)

def load_games(filename):
    path = os.path.join("data", filename)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

if __name__ == "__main__":
    raw_games = load_games("games_raw.json")
    processed_games = transform_games(raw_games)
    save_raw_games(processed_games, "games_processed.json")

    print("Processed games saved with names included in text_doc.")
