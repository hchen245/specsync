import requests
import json
import os
import re
import argparse
import time
import pandas as pd

API_KEY = "c820d14bb2f7404ea0ec14b05053f31a"

BASE_URL = "https://api.rawg.io/api/games"

def build_text_doc(game):
    """
    Build a text document from English tags (and optionally genres)
    """
    words = []
    words.extend(game["name"].lower().split())
    slug = game.get("slug", "")
    if slug:
        words.extend(slug.replace("-", " ").lower().split())

    released = game.get("released", "")
    if released:
        words.append(str(released).lower())
    # tags and genres
    for tag in game.get("tags", []):
        if tag.get("language") == "eng":
            words.append(tag["name"].lower())

    for genre in game.get("genres", []):
        words.append(genre["name"].lower())

    return " ".join(words)

def parse_ram_from_text(text):
    if not text:
        return 0
    match = re.search(r"(\d+)\s*GB", text, re.IGNORECASE)
    return int(match.group(1)) if match else 0

def estimate_cpu_score(cpu_text, cpu_benchmarks):
    if not cpu_text:
        return 1000
    cpu_lower = cpu_text.lower()
    row = cpu_benchmarks[cpu_benchmarks["cpuName"].str.lower() == cpu_lower]
    if not row.empty:
        return int(row.iloc[0]["cpuMark"])
    if "i3" in cpu_lower or "ryzen 3" in cpu_lower:
        return 4000
    if "i5" in cpu_lower or "ryzen 5" in cpu_lower:
        return 8000
    if "i7" in cpu_lower or "ryzen 7" in cpu_lower:
        return 12000
    if "i9" in cpu_lower or "ryzen 9" in cpu_lower:
        return 18000
    return 6000

def estimate_gpu_score(gpu_text, gpu_benchmarks):
    if not gpu_text:
        return 1000
    gpu_lower = gpu_text.lower()
    row = gpu_benchmarks[gpu_benchmarks["gpuName"].str.lower() == gpu_lower]
    if not row.empty:
        return int(row.iloc[0]["G3Dmark"])
    if "gtx 1050" in gpu_lower or "rx 560" in gpu_lower:
        return 3000
    if "gtx 1060" in gpu_lower or "rx 580" in gpu_lower:
        return 8000
    if "gtx 1070" in gpu_lower or "rx 5700" in gpu_lower or "rtx 2060" in gpu_lower:
        return 12000
    if "rtx 3060" in gpu_lower or "rx 6700" in gpu_lower:
        return 16000
    if "rtx 3070" in gpu_lower or "rtx 4060" in gpu_lower:
        return 20000
    if "rtx 3080" in gpu_lower or "rtx 4070" in gpu_lower:
        return 24000
    if "rtx 4090" in gpu_lower:
        return 35000
    return 5000

def fetch_game_detail(game_id):
    url = f"{BASE_URL}/{game_id}"
    params = {"key": API_KEY}
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def estimate_hw_from_metadata(game):
    released = game.get("released", "")
    year = 2010
    if released:
        match = re.match(r"(\d{4})", released)
        if match:
            year = int(match.group(1))
    tags = [t.get("name", "").lower() for t in game.get("tags", [])]
    is_indie = any("indie" in tag for tag in tags)
    is_aaa = any(tag in ["action", "open world", "fps", "multiplayer"] for tag in tags)
    if year >= 2020:
        cpu_rec = 10000 if is_aaa else 6000
        gpu_rec = 14000 if is_aaa else 7000
        ram_rec = 16 if is_aaa else 8
        vram_rec = 6 if is_aaa else 4
    elif year >= 2015:
        cpu_rec = 8000 if is_aaa else 4000
        gpu_rec = 10000 if is_aaa else 5000
        ram_rec = 12 if is_aaa else 8
        vram_rec = 4 if is_aaa else 2
    elif year >= 2010:
        cpu_rec = 5000 if is_aaa else 2000
        gpu_rec = 6000 if is_aaa else 3000
        ram_rec = 8 if is_aaa else 4
        vram_rec = 2
    else:
        cpu_rec = 2000
        gpu_rec = 2000
        ram_rec = 4
        vram_rec = 1
    if is_indie:
        cpu_rec = int(cpu_rec * 0.6)
        gpu_rec = int(gpu_rec * 0.6)
        ram_rec = max(ram_rec - 4, 4)
    return cpu_rec, gpu_rec, ram_rec, vram_rec

def add_numeric_hw_fields(game, cpu_benchmarks, gpu_benchmarks):
    platforms = game.get("platforms", [])
    pc_requirements = None
    for plat in platforms:
        if plat.get("platform", {}).get("id") == 4:
            pc_requirements = plat.get("requirements", {})
            break
    if pc_requirements:
        rec_text = pc_requirements.get("recommended", "") or ""
        if rec_text:
            ram_rec = parse_ram_from_text(rec_text) or 8
            cpu_rec = estimate_cpu_score(rec_text, cpu_benchmarks)
            gpu_rec = estimate_gpu_score(rec_text, gpu_benchmarks)
            if gpu_rec >= 20000:
                vram_rec = 8
            elif gpu_rec >= 12000:
                vram_rec = 6
            elif gpu_rec >= 8000:
                vram_rec = 4
            else:
                vram_rec = 2
        else:
            cpu_rec, gpu_rec, ram_rec, vram_rec = estimate_hw_from_metadata(game)
    else:
        cpu_rec, gpu_rec, ram_rec, vram_rec = estimate_hw_from_metadata(game)
    game["cpu_rec"] = cpu_rec
    game["gpu_rec"] = gpu_rec
    game["ram_rec"] = ram_rec
    game["vram_rec"] = vram_rec
    return game

def transform_games(raw_games, cpu_benchmarks, gpu_benchmarks, enrich_details=False):
    transformed = []
    if enrich_details:
        print(f"Enriching {len(raw_games)} games with detailed requirements...")
        for i, game in enumerate(raw_games):
            if i > 0 and i % 50 == 0:
                print(f"  Enriched {i}/{len(raw_games)}...")
                time.sleep(1)
            try:
                detail = fetch_game_detail(game["id"])
                game["platforms"] = detail.get("platforms", [])
            except Exception as e:
                print(f"  Error fetching {game.get('name', 'unknown')}: {e}")
                time.sleep(2)
    for game in raw_games:
        game = add_numeric_hw_fields(game, cpu_benchmarks, gpu_benchmarks)
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
            "page": page,
            "ordering": "-added",
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
    parser = argparse.ArgumentParser(description="Fetch and preprocess SpecSync game data")
    parser.add_argument("--fetch-total", type=int, default=0, help="Fetch raw games from RAWG before processing")
    parser.add_argument("--page-size", type=int, default=40, help="RAWG page size during fetch")
    parser.add_argument("--enrich-details", action="store_true", help="Fetch detailed requirements for each game")
    args = parser.parse_args()
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
    cpu_benchmarks = pd.read_csv(os.path.join(base_dir, "CPU_benchmark_v4.csv"))
    gpu_benchmarks = pd.read_csv(os.path.join(base_dir, "GPU_benchmarks_v7.csv"))
    if args.fetch_total > 0:
        print(f"Fetching {args.fetch_total} games from RAWG...")
        raw_games = fetch_all_games(total_games=args.fetch_total, page_size=args.page_size)
        save_raw_games(raw_games, "games_raw.json")
        print(f"Saved {len(raw_games)} games to data/games_raw.json")
    else:
        raw_games = load_games("games_raw.json")
    processed_games = transform_games(raw_games, cpu_benchmarks, gpu_benchmarks, enrich_details=args.enrich_details)
    save_raw_games(processed_games, "games_processed.json")
    print(f"Processed {len(processed_games)} games and saved to data/games_processed.json")
