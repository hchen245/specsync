def compute_playability(game, user_hw):
    cpu_ratio = user_hw["cpu"] / game["cpu_rec"]
    gpu_ratio = user_hw["gpu"] / game["gpu_rec"]
    ram_ratio = user_hw["ram"] / game["ram_rec"]

    cpu_ratio = min(cpu_ratio, 1.5)
    gpu_ratio = min(gpu_ratio, 1.5)
    ram_ratio = min(ram_ratio, 1.5)

    score = (
        0.5 * gpu_ratio +
        0.3 * cpu_ratio +
        0.2 * ram_ratio
    )

    if user_hw["vram"] < game["vram_rec"]:
        return score, "❌ VRAM not sufficient"

    return score, "OK"
