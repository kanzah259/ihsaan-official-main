function initCareerGuidesSearch() {
  const form = document.getElementById("guide-search-form");
  const input = document.getElementById("guide-search");
  const submit = document.getElementById("guide-search-submit");
  const results = document.getElementById("guide-results");
  const status = document.getElementById("guide-results-status");
  const retry = document.getElementById("guide-search-retry");
  if (!form || !input || !submit || !results || !status || !retry) return;

  let guides = [];
  let loaded = false;
  let loading = false;

  const render = () => {
    if (!loaded) return;
    const query = input.value.trim().toLocaleLowerCase("en-GB");
    results.replaceChildren();
    if (query.length === 1) {
      status.textContent = "Type at least 2 characters to search.";
      return;
    }

    const matches = guides.filter((guide) =>
      !query || `${guide.title} ${guide.description}`.toLocaleLowerCase("en-GB").includes(query)
    );
    status.textContent = matches.length
      ? `${matches.length} ${matches.length === 1 ? "result" : "results"}`
      : "No guides found. Try another search.";

    const cards = matches.map((guide) => {
      const card = document.createElement("article");
      card.className = "guide-result-card";
      const category = document.createElement("p");
      category.className = "guide-result-category";
      category.textContent = guide.category;
      const title = document.createElement("h2");
      title.textContent = guide.title;
      const description = document.createElement("p");
      description.className = "guide-result-description";
      description.textContent = guide.description;
      const availability = document.createElement("span");
      availability.className = "guide-result-demo";
      availability.textContent = "Demo guide · Article not available";
      card.append(category, title, description, availability);
      return card;
    });
    results.replaceChildren(...cards);
  };

  const load = async () => {
    if (loading) return;
    loading = true;
    loaded = false;
    input.disabled = true;
    submit.disabled = true;
    retry.hidden = true;
    results.setAttribute("aria-busy", "true");
    status.textContent = "Loading guides…";
    try {
      const response = await fetch("data/career-guides.demo.json");
      if (!response.ok) throw new Error("Catalogue request failed");
      const catalogue = await response.json();
      if (!Array.isArray(catalogue) || !catalogue.every((guide) =>
        guide && ["title", "description", "category"].every((key) =>
          typeof guide[key] === "string" && guide[key].trim()
        ) && typeof guide.startHere === "boolean"
      )) throw new Error("Invalid catalogue");
      guides = catalogue.sort((a, b) => a.title.localeCompare(b.title, "en-GB"));
      loaded = true;
      input.disabled = false;
      submit.disabled = false;
      render();
    } catch {
      results.replaceChildren();
      status.textContent = "Guides couldn’t load. Please retry.";
      retry.hidden = false;
    } finally {
      loading = false;
      results.removeAttribute("aria-busy");
    }
  };

  input.addEventListener("input", render);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });
  retry.addEventListener("click", load);
  load();
}
