
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

from load_data import load_games
from playability import compute_playability


data_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "games_processed.json"))
games = load_games(data_path)
game_docs = [g["text_doc"].lower() + " " + g["name"].lower() for g in games]

vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(game_docs)


def search_games(query, user_hw, top_n=10, candidate_n=50):
    query_vec = vectorizer.transform([query.lower()])
    cosine_sim = linear_kernel(query_vec, tfidf_matrix).flatten()
    top_candidate_idx = cosine_sim.argsort()[::-1][:candidate_n]

    seen = set()
    results = []
    for i in top_candidate_idx:
        game_id = games[i]["id"]
        if game_id in seen:
            continue
        seen.add(game_id)

        game = games[i]
        score, note = compute_playability(game, user_hw)
        results.append((game["name"], score, note, cosine_sim[i]))

    results.sort(key=lambda x: (x[1], x[3]), reverse=True)
    return results[:top_n]


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    cpu_model: str
    gpu_model: str
    ram: float = Field(..., gt=0)
    vram: float = Field(..., gt=0)
    top_n: int = Field(default=10, ge=1, le=50)


app = FastAPI(title="SpecSync API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "games_loaded": len(games)}


@app.post("/search")
def search(payload: SearchRequest):
    user_hw = {
        "cpu_model": payload.cpu_model,
        "gpu_model": payload.gpu_model,
        "ram": payload.ram,
        "vram": payload.vram,
    }

    rows = search_games(payload.query, user_hw, top_n=payload.top_n)
    return {
        "query": payload.query,
        "results": [
            {
                "name": name,
                "score": round(float(score), 4),
                "note": note,
                "cosine_similarity": round(float(cos_sim), 4),
            }
            for name, score, note, cos_sim in rows
        ],
    }


def run_cli_mode():
    print("Enter your hardware specifications:")
    cpu_model = input("CPU model (e.g., Intel i7-9700K): ")
    gpu_model = input("GPU model (e.g., NVIDIA GTX 1060): ")
    ram = float(input("RAM (GB): "))
    vram = float(input("VRAM (GB): "))

    query_text = input("Enter your search query (e.g., RPG multiplayer open world): ")

    user_hw = {
        "cpu_model": cpu_model,
        "gpu_model": gpu_model,
        "ram": ram,
        "vram": vram,
    }

    results = search_games(query_text, user_hw)

    print(f"\nSearch results for query: {query_text}\n")
    print(f'{"Game Name":30} {"Score":>5} {"Note":>22} {"CosSim":>7}')
    print("-" * 72)
    for name, score, note, cos_sim in results:
        print(f"{name[:30]:30} {score:5.2f} {note:>22} {cos_sim:7.2f}")


if __name__ == "__main__":
    run_cli_mode()