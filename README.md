# SpecSync

SpecSync is a context-aware game search and recommendation system that helps PC gamers discover compatible games based on their hardware specifications. The system combines text-based search with hardware compatibility scoring to recommend games that will run well on the user's PC.

## Demo

https://github.com/user-attachments/assets/09ec3faf-47a5-47a1-b961-c63944d50ec4

## Features

### Intelligent Search
- **Text Relevance**: TF-IDF-based semantic search across 500+ games
- **Hardware Compatibility**: Real-time playability scoring based on CPU, GPU, RAM, and VRAM
- **Balanced Ranking**: 60% text similarity + 40% hardware compatibility for optimal results

### Smart Hardware Detection
- **iGPU/dGPU Recognition**: Automatic detection of integrated vs dedicated graphics
- **Fuzzy Matching**: Finds hardware in benchmark database even with varied naming
- **Modern Hardware Support**: Manual estimates for newer CPUs/GPUs (Intel 13th/14th gen, RTX 40 series)
- **Intelligent Fallback**: Series-based estimation when exact model not found

### Steam-Style Scoring
- **0-100% Scale**: Intuitive percentage-based compatibility scores
- **Experience Tiers**: Unplayable, Low, Medium, High, Ultra Smooth
- **Dynamic VRAM**: Auto-calculates shared memory for integrated graphics

## Data Sources
- **RAWG Video Games Database API**: 500 games with metadata (tags, genres, release dates)
- **Kaggle CPU Benchmark Dataset**: 1000+ CPU performance scores (PassMark)
- **Kaggle GPU Benchmark Dataset**: 1000+ GPU performance scores (G3DMark)

## Repository
- **GitHub**: https://github.com/hchen245/specsync
- **Latest Commit**: fba641b

## How to Run

### Prerequisites
- Python 3.7+
- Node.js 16+
- Git

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hchen245/specsync
   cd specsync
   ```

2. **Set up Python environment**:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate      # Windows
   source .venv/bin/activate   # Mac/Linux
   pip install -r requirements.txt
   ```

3. **Start the backend API**:
   ```bash
   cd src
   uvicorn search:app --host 127.0.0.1 --port 8000
   ```
   Backend will be available at `http://127.0.0.1:8000`

4. **Start the frontend** (in a new terminal):
   ```bash
   cd src/frontend/frontend-spec-sync
   npm install
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

5. **Access the application**:
   Open your browser and navigate to `http://localhost:5173`

### Optional: Update Game Database

To refresh the game dataset from RAWG API:
```bash
cd specsync
python src/load_data.py --fetch-total 500 --page-size 40
```

## Architecture

### Backend (`src/`)
- **search.py**: FastAPI server with TF-IDF search engine
- **playability.py**: Hardware compatibility scoring with iGPU/dGPU detection
- **load_data.py**: RAWG API integration and data preprocessing

### Frontend (`src/frontend/frontend-spec-sync/`)
- **React + TypeScript**: Modern component-based UI
- **Vite**: Fast build tooling and hot module replacement
- **Tailwind CSS**: Utility-first styling

### Data (`data/`)
- **games_processed.json**: 500 games with estimated hardware requirements
- **CPU_benchmark_v4.csv**: PassMark CPU benchmark scores
- **GPU_benchmarks_v7.csv**: G3DMark GPU benchmark scores

## API Documentation

### POST /search
Search for games with hardware compatibility scoring.

**Request Body**:
```json
{
  "query": "action rpg",
  "cpu_model": "Intel Core i7-4790",
  "gpu_model": "NVIDIA GTX 1060",
  "ram": 16,
  "vram": 6,
  "top_n": 10
}
```

**Response**:
```json
{
  "query": "action rpg",
  "results": [
    {
      "name": "The Witcher 3: Wild Hunt",
      "score": 67.5,
      "note": "Medium Settings",
      "cosine_similarity": 0.3421
    }
  ]
}
```

### GET /health
Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "games_loaded": 500
}
```

## How It Works

1. **User Input**: Enter hardware specs (CPU, GPU, RAM, VRAM) and search query
2. **Text Search**: TF-IDF finds top 50 candidate games by text similarity
3. **Hardware Scoring**: Each candidate gets a 0-100% compatibility score based on:
   - CPU benchmark vs game requirements (30% weight)
   - GPU benchmark vs game requirements (40% weight)
   - RAM capacity vs game requirements (20% weight)
   - VRAM capacity vs game requirements (10% weight)
4. **Ranking**: Final ranking combines text similarity (60%) and hardware score (40%)
5. **Results**: Display games with compatibility percentage and experience tier

## Example Queries

- **"cyberpunk 2077"** - Find specific game with compatibility check
- **"action rpg"** - Discover action RPG games you can run
- **"multiplayer fps"** - Search for FPS games with multiplayer support
- **"indie platformer"** - Find indie platformer games

## Development Notes

### Hardware Requirement Estimation
Since RAWG API doesn't provide PC system requirements, the system estimates requirements based on:
- **Release Year**: Newer games (2020+) assigned higher requirements
- **AAA Detection**: Games with "AAA" tag get premium hardware estimates
- **Indie Detection**: Games with "indie" tag get modest hardware estimates

### Score Calibration
- **< 50%**: Unplayable (hardware below minimum requirements)
- **50-70%**: Low Settings (meets minimum, limited graphics quality)
- **70-85%**: Medium Settings (comfortable gameplay)
- **85-95%**: High Settings (excellent performance)
- **95-100%**: Ultra Smooth (exceeds recommended, max settings)

## Future Improvements

- [ ] Integrate real PC requirements from Steam/GOG APIs
- [ ] Add user reviews and ratings
- [ ] Implement collaborative filtering recommendations
- [ ] Support console hardware profiles
- [ ] Add price comparison across platforms
- [ ] Machine learning-based requirement prediction

## License

This project is for educational purposes (CS125 course project).

## Contributors

- [@hchen245](https://github.com/hchen245)
- [@anastar99](https://github.com/anastar99)
- [@beutan1](https://github.com/beutan1)
