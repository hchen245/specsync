# SpecSync

SpecSync is a context-aware game search and recommendation prototype that helps PC gamers
determine whether a game is compatible with their hardware before purchasing or downloading it.

## Project Goal
Given a user's hardware profile (CPU, GPU, RAM, OS) and a simple search query (e.g., genre),
the system ranks games based on a Playability Score derived from benchmark data and game requirements.

## Data Sources
- RAWG Video Games Database (sampled game metadata)
- Kaggle CPU benchmark dataset
- Kaggle GPU benchmark dataset

## Improvement
optimization for ranking
- The hardware socre weight is too high; the text relevance weight is too low
- Cosine Similarity is too low, lowercase(.lower()), no stemming/lemmatization

## How to Run (Prototype)
```bash
python src/search.py
