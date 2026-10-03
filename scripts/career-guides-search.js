function initCareerGuidesSearch() {
  const form = document.getElementById("guide-search-form");
  const input = document.getElementById("guide-search");
  const submit = document.getElementById("guide-search-submit");
  const results = document.getElementById("guide-results");
  const status = document.getElementById("guide-results-status");
  const retry = document.getElementById("guide-search-retry");
  const categoryFilter = document.getElementById("guide-category");
  const clearFilter = document.getElementById("guide-clear-filter");
  if (!form || !input || !submit || !results || !status || !retry || !categoryFilter) return;

  let guides = [];
  let loaded = false;
  let loading = false;

  const heroForm = document.getElementById("guide-hero-search-form");
  const heroInput = document.getElementById("guide-hero-search");
  const heroStatus = document.getElementById("guide-hero-search-status");
  const mobileQuery = window.matchMedia("(max-width: 640px)");
  const updatePlaceholders = () => {
    [input, heroInput].filter(Boolean).forEach((field) => {
      field.placeholder = mobileQuery.matches ? "Search guides" : "Search career choices, CVs, or interviews";
    });
  };
  mobileQuery.addEventListener("change", updatePlaceholders);
  updatePlaceholders();
  const suggestions = document.getElementById("guide-hero-suggestions");
  let activeSuggestion = -1;
  const closeSuggestions = () => {
    if (!suggestions || !heroInput) return;
    suggestions.hidden = true;
    heroInput.setAttribute("aria-expanded", "false");
    heroInput.removeAttribute("aria-activedescendant");
    activeSuggestion = -1;
  };
  const renderSuggestions = () => {
    if (!suggestions || !heroInput || !heroStatus) return;
    closeSuggestions();
    const query = heroInput.value.trim().toLocaleLowerCase("en-GB");
    if (query.length < 2 || document.activeElement !== heroInput) return;
    suggestions.replaceChildren();
    const matches = loaded ? getMatches(query).slice(0, 5) : [];
    matches.forEach((guide, index) => {
      const option = document.createElement("a");
      option.id = `guide-suggestion-${index}`;
      option.className = "guide-suggestion";
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", "false");
      option.tabIndex = -1;
      option.href = guide.url || `#career-guides-search?${new URLSearchParams({ q: guide.title })}`;
      option.textContent = guide.title;
      option.addEventListener("click", closeSuggestions);
      suggestions.append(option);
    });
    if (!matches.length) {
      const message = document.createElement("p");
      message.className = "guide-suggestions-empty";
      message.textContent = loaded ? "No guides found." : loading ? "Loading guides…" : "Suggestions unavailable. You can still search.";
      suggestions.append(message);
    }
    suggestions.hidden = false;
    heroInput.setAttribute("aria-expanded", "true");
  };
  if (heroForm && heroInput && heroStatus) {
    heroInput.addEventListener("input", () => {
      heroStatus.textContent = "";
      renderSuggestions();
    });
    heroInput.addEventListener("focus", renderSuggestions);
    heroInput.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSuggestions();
        heroStatus.textContent = "";
        return;
      }
      if (!suggestions || suggestions.hidden) return;
      const options = [...suggestions.querySelectorAll('[role="option"]')];
      if ((event.key === "ArrowDown" || event.key === "ArrowUp") && options.length) {
        event.preventDefault();
        activeSuggestion = event.key === "ArrowDown"
          ? (activeSuggestion + 1) % options.length
          : (activeSuggestion <= 0 ? options.length : activeSuggestion) - 1;
        options.forEach((option, index) => option.setAttribute("aria-selected", String(index === activeSuggestion)));
        heroInput.setAttribute("aria-activedescendant", options[activeSuggestion].id);
      } else if (event.key === "Enter" && activeSuggestion >= 0) {
        event.preventDefault();
        options[activeSuggestion].click();
      }
    });
    heroForm.addEventListener("focusout", (event) => {
      if (!heroForm.contains(event.relatedTarget)) closeSuggestions();
    });
    document.addEventListener("pointerdown", (event) => {
      if (!heroForm.contains(event.target)) closeSuggestions();
    });
    window.addEventListener("hashchange", closeSuggestions);
    heroForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = heroInput.value.trim();
      heroStatus.textContent = "";
      closeSuggestions();
      window.location.hash = query
        ? `career-guides-search?${new URLSearchParams({ q: query })}`
        : "career-guides-search";
    });
  }

  const matchRank = (guide, query) => {
    if (!query) return 0;
    const title = guide.title.toLocaleLowerCase("en-GB");
    if (title === query) return 0;
    if (title.startsWith(query)) return 1;
    if (title.includes(query)) return 2;
    if (guide.description.toLocaleLowerCase("en-GB").includes(query)) return 3;
    return Infinity;
  };

  const getMatches = (query, category = "") => guides
    .filter((guide) => (!category || guide.category === category)
      && Number.isFinite(matchRank(guide, query)))
    .sort((a, b) => matchRank(a, query) - matchRank(b, query)
      || a.title.localeCompare(b.title, "en-GB"));

  const render = () => {
    if (clearFilter) clearFilter.disabled = !loaded || !categoryFilter.value;
    if (!loaded) return;
    const query = input.value.trim().toLocaleLowerCase("en-GB");
    results.replaceChildren();
    const matches = getMatches(query, categoryFilter.value);
    status.textContent = matches.length
      ? `${matches.length} ${matches.length === 1 ? "result" : "results"}`
      : "No guides found. Try another search or category.";

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
      const availability = document.createElement(guide.url ? "a" : "span");
      availability.className = guide.url ? "guide-article-back" : "guide-result-demo";
      availability.textContent = guide.url ? "Read guide →" : "Demo guide · Article not available";
      if (guide.url) availability.href = guide.url;
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
    categoryFilter.disabled = true;
    if (clearFilter) clearFilter.disabled = true;
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
        && (guide.url === undefined || (typeof guide.url === "string" && /^#career-guide-[a-z0-9-]+$/.test(guide.url)))
      )) throw new Error("Invalid catalogue");
      guides = catalogue.sort((a, b) => a.title.localeCompare(b.title, "en-GB"));
      loaded = true;
      input.disabled = false;
      submit.disabled = false;
      categoryFilter.disabled = false;
      render();
    } catch {
      results.replaceChildren();
      status.textContent = "Guides couldn’t load. Please retry.";
      retry.hidden = false;
    } finally {
      loading = false;
      results.removeAttribute("aria-busy");
      renderSuggestions();
    }
  };

  input.addEventListener("input", render);
  const readRouteQuery = () => {
    const [route, query = ""] = window.location.hash.slice(1).split("?");
    if (route !== "career-guides-search") return;
    const params = new URLSearchParams(query);
    input.value = params.get("q") || "";
    const category = params.get("category") || "";
    categoryFilter.value = [...categoryFilter.options].some(option => option.value === category) ? category : "";
    render();
  };
  window.addEventListener("hashchange", readRouteQuery);
  readRouteQuery();
  categoryFilter.addEventListener("change", render);
  if (clearFilter) clearFilter.addEventListener("click", () => {
    categoryFilter.value = "";
    render();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });
  retry.addEventListener("click", load);
  load();
}
