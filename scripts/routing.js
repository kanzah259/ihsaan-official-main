// ---------- SPA ROUTING ----------
let pages = [];
let links = [];
const burger = document.getElementById("burger");
const drawer = document.getElementById("drawer");

const programmesDropdown = document.getElementById("programmesDropdown");
const programmesBtn = document.getElementById("programmesBtn");

function showPage(route) {
  const exists = Array.from(pages).some(p => p.dataset.page === route);
  const finalRoute = exists ? route : "home";

  const currentPage = document.querySelector(".page.is-active");
  const nextPage = Array.from(pages).find(p => p.dataset.page === finalRoute);

  if (currentPage === nextPage) return;

  if (currentPage) {
    currentPage.style.opacity = "0";
    currentPage.style.transform = "translateY(-8px)";
    currentPage.style.transition = "opacity 0.25s ease, transform 0.25s ease";
  }

  setTimeout(() => {
    pages.forEach(p => {
      p.classList.remove("is-active");
      p.style.opacity = "";
      p.style.transform = "";
      p.style.transition = "";
    });
    if (nextPage) nextPage.classList.add("is-active");

    closeDropdown();
    if (drawer) {
      drawer.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
    if (burger) burger.setAttribute("aria-expanded", "false");
    window.scrollTo({ top: 0, behavior: "smooth" });

    initRevealSystem();
    initCounterObserver();
  }, currentPage ? 250 : 0);
}

function handleRoute() {
  const route = window.location.hash.replace("#", "") || "home";
  showPage(route);
}

window.addEventListener("hashchange", handleRoute);

function bindRouteLinks() {
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const route = link.dataset.route;
      if (!route) return;
      window.location.hash = route;
    });
  });
}

// ---------- MOBILE MENU ----------
if (burger && drawer) {
  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!open));
    drawer.hidden = false;
    drawer.classList.toggle("is-open", !open);
    closeDropdown();
  });
}

// ---------- PROGRAMMES DROPDOWN ----------
function openDropdown() {
  if (!programmesDropdown || !programmesBtn) return;
  programmesDropdown.classList.add("open");
  programmesBtn.setAttribute("aria-expanded", "true");
}
function closeDropdown() {
  if (!programmesDropdown || !programmesBtn) return;
  programmesDropdown.classList.remove("open");
  programmesBtn.setAttribute("aria-expanded", "false");
}
function toggleDropdown() {
  if (!programmesDropdown || !programmesBtn) return;
  const isOpen = programmesDropdown.classList.contains("open");
  if (isOpen) closeDropdown();
  else openDropdown();
}

if (programmesBtn) {
  programmesBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown();
  });
}
document.addEventListener("click", () => closeDropdown());
