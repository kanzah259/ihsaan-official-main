// ---------- INCLUDES LOADER ----------
async function loadIncludes() {
  const includeEls = document.querySelectorAll('[data-include]');
  await Promise.all([...includeEls].map(async el => {
    const res = await fetch(el.dataset.include, { cache: "no-store" });
    el.outerHTML = await res.text();
  }));
}
