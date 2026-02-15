def compute_playability(game, user_hw):
    import pandas as pd
    import os
    # Load CPU and GPU benchmarks with robust path
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
    cpu_benchmarks = pd.read_csv(os.path.join(base_dir, "CPU_benchmark_v4.csv"))
    gpu_benchmarks = pd.read_csv(os.path.join(base_dir, "GPU_benchmarks_v7.csv"))

    # Find user CPU and GPU scores
    user_cpu_row = cpu_benchmarks[cpu_benchmarks["cpuName"].str.lower() == user_hw["cpu_model"].lower()]
    user_gpu_row = gpu_benchmarks[gpu_benchmarks["gpuName"].str.lower() == user_hw["gpu_model"].lower()]

    # Fallback if not found
    user_cpu_score = user_cpu_row["cpuMark"].values[0] if not user_cpu_row.empty else 1000
    user_gpu_score = user_gpu_row["G3Dmark"].values[0] if not user_gpu_row.empty else 1000

    # Game recommended scores
    game_cpu_score = game.get("cpu_rec", 1000)
    game_gpu_score = game.get("gpu_rec", 1000)
    ram_ratio = user_hw["ram"] / game["ram_rec"]

    cpu_ratio = user_cpu_score / game_cpu_score
    gpu_ratio = user_gpu_score / game_gpu_score
    cpu_ratio = min(cpu_ratio, 3)
    gpu_ratio = min(gpu_ratio, 3)
    ram_ratio = min(ram_ratio, 3)

    score = (
        0.5 * gpu_ratio +
        0.3 * cpu_ratio +
        0.2 * ram_ratio
    )

    if user_hw["vram"] < game["vram_rec"]:
        return score, "❌ VRAM not sufficient"

    return score, "OK"
