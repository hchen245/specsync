Game {
  game_id: string
  title: string

  # --- Text view (for TF-IDF) ---
  genres: [string]
  tags: [string]
  text_doc: string   # genres + tags 

  # --- Hardware view (for ranking) ---
  min_cpu: string
  rec_cpu: string
  min_gpu: string
  rec_gpu: string
  min_ram_gb: number
  rec_ram_gb: number
  rec_vram_gb: number (optional)

  # --- Derived later ---
  cpu_score: number (from Kaggle)
  gpu_score: number (from Kaggle)
}
