// ---------- SPA ROUTING ----------
const pages = document.querySelectorAll(".page");
const links = document.querySelectorAll("[data-route]");
const burger = document.getElementById("burger");
const drawer = document.getElementById("drawer");

const programmesDropdown = document.getElementById("programmesDropdown");
const programmesBtn = document.getElementById("programmesBtn");

function showPage(route) {
  const exists = Array.from(pages).some(p => p.dataset.page === route);
  const finalRoute = exists ? route : "home";

  pages.forEach(p => {
    p.classList.toggle("is-active", p.dataset.page === finalRoute);
  });

  closeDropdown();
  if (drawer) drawer.hidden = true;
  if (burger) burger.setAttribute("aria-expanded", "false");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleRoute() {
  const route = window.location.hash.replace("#", "") || "home";
  showPage(route);
}

links.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const route = link.dataset.route;
    if (!route) return;
    window.location.hash = route;
  });
});

window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);

// ---------- MOBILE MENU ----------
if (burger && drawer) {
  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!open));
    drawer.hidden = open;
    closeDropdown();
  });
}

// ---------- DROPDOWN ----------
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

// ---------- YEAR ----------
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// ---------- COUNT UP COUNTERS ----------
let impactCounterStarted = false;

function animateCounters() {
  const counters = document.querySelectorAll(".counter");
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target || "0", 10);
    const duration = 1200;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = value.toLocaleString();

      if (progress < 1) requestAnimationFrame(tick);
      else counter.textContent = target.toLocaleString() + "+";
    }

    requestAnimationFrame(tick);
  });
}

function initCounterObserver(){
  const impact = document.getElementById("impactSection");
  if (!impact) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !impactCounterStarted) {
        impactCounterStarted = true;
        animateCounters();
      }
    });
  }, { threshold: 0.2 });

  obs.observe(impact);
}

// ---------- MOBILE-ONLY LOADER ----------
function runMobileLoader() {
  const loader = document.getElementById("mobileLoader");
  if (!loader) return;

  const isMobile = window.matchMedia("(max-width: 900px)").matches;

  if (!isMobile) {
    loader.classList.remove("show");
    loader.style.display = "none";
    document.body.classList.add("loaded");
    return;
  }

  loader.classList.add("show");
  loader.style.display = "grid";

  setTimeout(() => {
    document.body.classList.add("loaded");
    loader.classList.remove("show");
    setTimeout(() => {
      loader.style.display = "none";
    }, 450);
  }, 850);
}

// Init
window.addEventListener("load", () => {
  runMobileLoader();
  initCounterObserver();
});
window.addEventListener("resize", () => runMobileLoader());
