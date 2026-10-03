async function initCareerGuidesStartHere() {
  const grid = document.getElementById("guide-start-cards");
  if (!grid) return;
  try {
    const response = await fetch("data/career-guides.demo.json");
    if (!response.ok) throw new Error("Catalogue request failed");
    const guides = await response.json();
    if (!Array.isArray(guides) || !guides.every((guide) =>
      guide && typeof guide.startHere === "boolean"
      && ["title", "description", "category"].every((key) =>
        typeof guide[key] === "string" && guide[key].trim()
      )
      && (guide.url === undefined || (typeof guide.url === "string" && /^#career-guide-[a-z0-9-]+$/.test(guide.url)))
    )) throw new Error("Invalid catalogue");

    const cards = guides.filter((guide) => guide.startHere).map((guide, index) => {
      const card = document.createElement("article");
      card.className = "guide-result-card";
      card.dataset.reveal = "fade-up";
      card.dataset.revealDelay = String(index * 80);
      const category = document.createElement("p");
      category.className = "guide-result-category";
      category.textContent = guide.category;
      const title = document.createElement("h3");
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
    grid.replaceChildren(...cards);
    initRevealSystem();
  } catch {
    // Preserve the HTML fallback if the catalogue cannot be fetched or parsed.
  }
}
