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

## Current Status
This is an early-stage prototype for CS 125. The system currently supports:
- Loading sample game and benchmark data
- Computing a baseline Playability Score
- Demonstrating a simple ranked search result

## How to Run (Prototype)
```bash
python src/search.py
