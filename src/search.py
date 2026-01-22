from load_data import load_games
from playability import compute_playability

user_hw = {
    "cpu": 6000,
    "gpu": 7000,
    "ram": 16,
    "vram": 6
}

query_genre = "RPG"

def search(games, user_hw, genre):
    results = []
    for game in games:
        if genre not in game["genres"]:
            continue
        score, note = compute_playability(game, user_hw)
        results.append((game["title"], score, note))
    results.sort(key=lambda x: x[1], reverse=True)
    return results

if __name__ == "__main__":
    games = load_games("data/games_sample.json")
    results = search(games, user_hw, query_genre)

    print(f"Search results for genre: {query_genre}\n")
    for title, score, note in results:
        print(f"{title:25} Score: {score:.2f}  {note}")
