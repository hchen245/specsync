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
## Repository
Repository: https://github.com/hchen245/specsync
Commit hash/tag: 66eed42

## How to Run

1. Clone the repository:
	```bash
	git clone [[repo link]](https://github.com/hchen245/specsync)
	```

2. Set up the Python environment:
	```bash
	cd specsync
	python -m venv .venv
	.venv\Scripts\activate  # (Windows)
	source .venv/bin/activate # (Mac)
	pip install -r requirements.txt
	```

3. (Optional) Ingest or preprocess data if needed:
	- Data files are already included in the data/ directory.

4. Run the backend API server:
	```bash
	cd src
	uvicorn search:app --reload --port 8000
	```

5. Start the frontend:
	```bash
	cd src/frontend/specsync-frontend
	npm install
	npm run dev
	```

6. Access the UI at http://localhost:5173.

## Note
Frontend and backend are connected via `POST /search` on `http://localhost:8000`.
