from load_data import load_games
from playability import compute_playability
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

#let user input their hardware specs
print("Enter your hardware specifications:")
cpu = float(input("CPU score: "))
gpu = float(input("GPU score: "))
ram = float(input("RAM (GB): "))
vram = float(input("VRAM (GB): "))

user_hw = {
    "cpu": cpu,
    "gpu": gpu,
    "ram": ram,
    "vram": vram
}

#let user input their search query
query_text = input("Enter your search query (e.g., RPG multiplayer open world): ")

#load games data
print("\nLoading processed game data...")
games = load_games("games_processed.json")
print(f"Loaded {len(games)} games")

game_docs = [g["text_doc"].lower() + " " + g["name"].lower() for g in games]

#TF-IDF Vectorization
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(game_docs)

def search_games(query, user_hw, top_n=10, candidate_n=50):
    # TF-IDF vectorization of the query
    query_vec = vectorizer.transform([query.lower()])
    cosine_sim = linear_kernel(query_vec, tfidf_matrix).flatten()
    top_candidate_idx = cosine_sim.argsort()[::-1][:candidate_n]

    # Evaluate playability and compile results
    seen = set()
    results = []
    for i in top_candidate_idx:
        game_id = games[i]["id"]
        if game_id in seen:
            continue
        seen.add(game_id)

        game = games[i]
        score, note = compute_playability(game, user_hw)
        cpu_ratio = min(user_hw["cpu"] / game["cpu_rec"], 3)
        gpu_ratio = min(user_hw["gpu"] / game["gpu_rec"], 3)
        ram_ratio = min(user_hw["ram"] / game["ram_rec"], 3)
        results.append((game["name"], score, cpu_ratio, gpu_ratio, ram_ratio, note, cosine_sim[i]))
    # Sort by playability score and then by relevance
    results.sort(key=lambda x: (x[1], x[6]), reverse=True)
    return results[:top_n]

if __name__ == "__main__":
    results = search_games(query_text, user_hw)

    print(f"\nSearch results for query: {query_text}\n")
    print(f"{'Game Name':30} {'Score':>5} {'CPU':>5} {'GPU':>5} {'RAM':>5} {'VRAM':>8} {'CosSim':>7}")
    print("-" * 75)
    for name, score, cpu_ratio, gpu_ratio, ram_ratio, vram_note, cos_sim in results:
        print(f"{name[:30]:30} {score:5.2f} {cpu_ratio:5.2f} {gpu_ratio:5.2f} {ram_ratio:5.2f} {vram_note:>8} {cos_sim:7.2f}")