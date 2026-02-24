DEDICATED_KEYWORDS = [
    "rtx", "gtx",
    "rx 5", "rx 6", "rx 7",
    "arc a",
]

INTEGRATED_KEYWORDS = [
    "integrated",
    "iris",
    "uhd",
    "vega",
    "radeon 6",
    "radeon 7",
]


def _is_integrated_gpu(gpu_model):
    model = str(gpu_model).lower()
    return any(keyword in model for keyword in INTEGRATED_KEYWORDS)


def _is_dedicated_gpu(gpu_model):
    model = str(gpu_model).lower()
    return any(keyword in model for keyword in DEDICATED_KEYWORDS)


def _experience_tier(score_percent):
    if score_percent < 50:
        return "Unplayable"
    if score_percent < 70:
        return "Low Settings"
    if score_percent < 85:
        return "Medium Settings"
    if score_percent < 95:
        return "High Settings"
    return "Ultra Smooth"


def _find_cpu_score(cpu_model, cpu_benchmarks):
    """Find CPU score with fuzzy matching and smart fallback"""
    model = str(cpu_model).lower()
    
    # Try exact match first
    exact = cpu_benchmarks[cpu_benchmarks["cpuName"].str.lower() == model]
    if not exact.empty:
        return exact["cpuMark"].values[0]
    
    # Try contains match (fuzzy)
    fuzzy = cpu_benchmarks[cpu_benchmarks["cpuName"].str.lower().str.contains(model, na=False)]
    if not fuzzy.empty:
        return fuzzy["cpuMark"].values[0]
    
    # Extract key patterns for smart fallback
    # Known missing CPUs (2023-2024 hardware)
    if "13900k" in model or "14900k" in model:
        return 55000  # Estimated based on generational improvements
    if "13700k" in model or "14700k" in model:
        return 45000
    if "13600k" in model or "14600k" in model:
        return 35000
    
    # Fallback: find best match by series
    if "i9" in model:
        i9_cpus = cpu_benchmarks[cpu_benchmarks["cpuName"].str.contains("i9", case=False, na=False)]
        if not i9_cpus.empty:
            return i9_cpus["cpuMark"].max()
    if "i7" in model:
        i7_cpus = cpu_benchmarks[cpu_benchmarks["cpuName"].str.contains("i7", case=False, na=False)]
        if not i7_cpus.empty:
            return i7_cpus["cpuMark"].max()
    if "i5" in model:
        i5_cpus = cpu_benchmarks[cpu_benchmarks["cpuName"].str.contains("i5", case=False, na=False)]
        if not i5_cpus.empty:
            return i5_cpus["cpuMark"].max()
    if "ryzen 9" in model or "r9" in model:
        r9_cpus = cpu_benchmarks[cpu_benchmarks["cpuName"].str.contains("Ryzen 9", case=False, na=False)]
        if not r9_cpus.empty:
            return r9_cpus["cpuMark"].max()
    if "ryzen 7" in model or "r7" in model:
        r7_cpus = cpu_benchmarks[cpu_benchmarks["cpuName"].str.contains("Ryzen 7", case=False, na=False)]
        if not r7_cpus.empty:
            return r7_cpus["cpuMark"].max()
    
    return 3000  # Conservative fallback


def _find_gpu_score(gpu_model, gpu_benchmarks):
    """Find GPU score with fuzzy matching and smart fallback"""
    model = str(gpu_model).lower()
    
    # Try exact match first
    exact = gpu_benchmarks[gpu_benchmarks["gpuName"].str.lower() == model]
    if not exact.empty:
        return exact["G3Dmark"].values[0]
    
    # Try contains match (fuzzy)
    fuzzy = gpu_benchmarks[gpu_benchmarks["gpuName"].str.lower().str.contains(model, na=False)]
    if not fuzzy.empty:
        return fuzzy["G3Dmark"].values[0]
    
    # Known missing GPUs (2023-2024 hardware)
    if "4090" in model:
        return 38000  # RTX 4090 benchmark estimate
    if "4080" in model:
        return 32000  # RTX 4080
    if "4070 ti" in model:
        return 27000  # RTX 4070 Ti
    if "4070" in model:
        return 23000  # RTX 4070
    if "4060 ti" in model:
        return 18000  # RTX 4060 Ti
    if "4060" in model:
        return 15000  # RTX 4060
    if "7900 xtx" in model:
        return 35000  # AMD RX 7900 XTX
    if "7900 xt" in model:
        return 30000  # AMD RX 7900 XT
    
    # Fallback: find best match by series
    if "rtx" in model or "gtx" in model:
        nvidia = gpu_benchmarks[gpu_benchmarks["gpuName"].str.contains("RTX|GTX", case=False, na=False, regex=True)]
        if not nvidia.empty:
            return nvidia["G3Dmark"].max()
    if "radeon" in model or "rx" in model:
        amd = gpu_benchmarks[gpu_benchmarks["gpuName"].str.contains("Radeon|RX", case=False, na=False, regex=True)]
        if not amd.empty:
            return amd["G3Dmark"].max()
    
    return 2000  # Conservative fallback


def compute_playability(game, user_hw):
    import pandas as pd
    import os
    # Load CPU and GPU benchmarks with robust path
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
    cpu_benchmarks = pd.read_csv(os.path.join(base_dir, "CPU_benchmark_v4.csv"))
    gpu_benchmarks = pd.read_csv(os.path.join(base_dir, "GPU_benchmarks_v7.csv"))

    # Find user CPU and GPU scores with smart matching
    user_cpu_score = _find_cpu_score(user_hw["cpu_model"], cpu_benchmarks)
    user_gpu_score = _find_gpu_score(user_hw["gpu_model"], gpu_benchmarks)

    # Game recommended scores
    is_integrated = _is_integrated_gpu(user_hw["gpu_model"])
    is_dedicated = _is_dedicated_gpu(user_hw["gpu_model"])

    if is_integrated:
        gpu_score_weight = 0.6
        effective_vram = min(float(user_hw["ram"]) * 0.25, 4)
    else:
        gpu_score_weight = 1.0
        effective_vram = float(user_hw["vram"])

    game_cpu_required = max(float(game.get("cpu_rec", 1000)), 1.0)
    game_gpu_required = max(float(game.get("gpu_rec", 1000)), 1.0)
    game_ram_required = max(float(game.get("ram_rec", 8)), 1.0)
    game_vram_required = max(float(game.get("vram_rec", 2)), 1.0)

    cpu_ratio = user_cpu_score / game_cpu_required
    gpu_ratio = (user_gpu_score / game_gpu_required) * gpu_score_weight
    ram_ratio = float(user_hw["ram"]) / game_ram_required
    vram_ratio = effective_vram / game_vram_required

    # Weighted average of hardware ratios
    # 1.0 = meets requirements, 2.0 = 2x requirements (excellent), 0.5 = 50% of requirements
    weighted_ratio = (
        0.3 * cpu_ratio +
        0.4 * gpu_ratio +
        0.2 * ram_ratio +
        0.1 * vram_ratio
    )
    
    # Map ratio to 0-100% score (Steam-style curve)
    if weighted_ratio >= 2.0:
        score_percent = 100.0
    elif weighted_ratio >= 1.5:
        # 70-100%: 1.5x-2x requirements
        score_percent = 70 + 30 * (weighted_ratio - 1.5) / 0.5
    elif weighted_ratio >= 1.0:
        # 50-70%: meets to 1.5x requirements
        score_percent = 50 + 20 * (weighted_ratio - 1.0) / 0.5
    else:
        # 0-50%: below requirements
        score_percent = 50 * weighted_ratio
    
    score_percent = min(max(score_percent, 0.0), 100.0)
    tier = _experience_tier(score_percent)

    if vram_ratio < 1:
        if is_integrated:
            return score_percent, f"{tier} · ⚠️ iGPU shared memory may be insufficient"
        if is_dedicated:
            return score_percent, f"{tier} · ❌ VRAM not sufficient"
        return score_percent, f"{tier} · ⚠️ VRAM may be insufficient"

    return score_percent, tier
