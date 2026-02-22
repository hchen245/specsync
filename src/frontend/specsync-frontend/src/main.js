const app = document.getElementById("app");

app.innerHTML = `
  <main style="max-width: 900px; margin: 24px auto; font-family: Arial, sans-serif; line-height: 1.4; padding: 0 16px;">
    <h1>SpecSync</h1>
    <p>Search game playability with your hardware.</p>

    <form id="search-form" style="display: grid; gap: 10px; grid-template-columns: 1fr 1fr;">
      <input name="query" placeholder="Query (e.g., RPG open world)" required style="grid-column: 1 / -1; padding: 8px;" />
      <input name="cpu_model" placeholder="CPU model" value="Intel i7-9700K" required style="padding: 8px;" />
      <input name="gpu_model" placeholder="GPU model" value="NVIDIA GTX 1060" required style="padding: 8px;" />
      <input name="ram" type="number" min="1" step="0.1" value="16" placeholder="RAM (GB)" required style="padding: 8px;" />
      <input name="vram" type="number" min="1" step="0.1" value="6" placeholder="VRAM (GB)" required style="padding: 8px;" />
      <button type="submit" style="grid-column: 1 / -1; padding: 10px;">Search</button>
    </form>

    <p id="status" style="margin-top: 16px;"></p>
    <div id="results" style="margin-top: 12px;"></div>
  </main>
`;

const form = document.getElementById("search-form");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");

function renderResults(items) {
  if (!items.length) {
    resultsEl.innerHTML = "<p>No results.</p>";
    return;
  }

  const rows = items
    .map(
      (item, idx) => `
      <tr>
        <td style="padding: 6px; border-bottom: 1px solid #ddd;">${idx + 1}</td>
        <td style="padding: 6px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 6px; border-bottom: 1px solid #ddd;">${item.score}</td>
        <td style="padding: 6px; border-bottom: 1px solid #ddd;">${item.note}</td>
        <td style="padding: 6px; border-bottom: 1px solid #ddd;">${item.cosine_similarity}</td>
      </tr>
    `
    )
    .join("");

  resultsEl.innerHTML = `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align: left; padding: 6px; border-bottom: 2px solid #aaa;">#</th>
          <th style="text-align: left; padding: 6px; border-bottom: 2px solid #aaa;">Game</th>
          <th style="text-align: left; padding: 6px; border-bottom: 2px solid #aaa;">Score</th>
          <th style="text-align: left; padding: 6px; border-bottom: 2px solid #aaa;">Note</th>
          <th style="text-align: left; padding: 6px; border-bottom: 2px solid #aaa;">Cosine</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    query: String(formData.get("query") || ""),
    cpu_model: String(formData.get("cpu_model") || ""),
    gpu_model: String(formData.get("gpu_model") || ""),
    ram: Number(formData.get("ram")),
    vram: Number(formData.get("vram")),
    top_n: 10,
  };

  statusEl.textContent = "Loading...";
  resultsEl.innerHTML = "";

  try {
    const response = await fetch("http://localhost:8000/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    statusEl.textContent = `Found ${data.results.length} results.`;
    renderResults(data.results);
  } catch (error) {
    statusEl.textContent = `Request failed: ${error.message}`;
  }
});
