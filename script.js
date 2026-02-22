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

  const currentPage = document.querySelector(".page.is-active");
  const nextPage = Array.from(pages).find(p => p.dataset.page === finalRoute);

  if (currentPage === nextPage) return;

  // Fade out current page
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
    if (drawer) drawer.hidden = true;
    if (burger) burger.setAttribute("aria-expanded", "false");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Re-init reveal system for new page
    initRevealSystem();

    // Re-init counters if going to home
    if (finalRoute === "home") {
      impactCounterStarted = false;
      initCounterObserver();
    }
  }, currentPage ? 250 : 0);
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

// ---------- HERO PARALLAX ----------
function initHeroParallax() {
  const heroVideo = document.querySelector(".hero-video");
  const hero = document.querySelector(".hero");
  if (!heroVideo || !hero) return;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        if (scrollY < heroHeight) {
          heroVideo.style.transform = `translateY(${scrollY * 0.4}px) scale(1.1)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ---------- HERO TEXT REVEAL ----------
function initHeroTextReveal() {
  const heroTitle = document.getElementById("heroTitle");
  if (!heroTitle) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const originalHTML = heroTitle.innerHTML;
  const words = originalHTML.split(/(\s+|<br\s*\/?>)/);
  heroTitle.innerHTML = words.map(word => {
    if (word.match(/<br\s*\/?>/)) return word;
    if (word.match(/^\s+$/)) return word;
    return `<span class="word">${word}</span>`;
  }).join("");

  const wordEls = heroTitle.querySelectorAll(".word");
  wordEls.forEach((word, i) => {
    setTimeout(() => word.classList.add("visible"), 300 + i * 80);
  });
}

// ---------- HERO PARTICLES ----------
function initHeroParticles() {
  const canvas = document.getElementById("heroParticles");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  const PARTICLE_COUNT = 40;
  let animId = null;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.pulse += 0.02;
      const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(143, 208, 255, ${alpha})`;
      ctx.fill();
    });
    animId = requestAnimationFrame(animate);
  }

  // Only animate when hero is visible
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { if (!animId) animate(); }
      else { if (animId) { cancelAnimationFrame(animId); animId = null; } }
    });
  }, { threshold: 0.1 });
  obs.observe(hero);
}

// ---------- NAV SCROLL STATE ----------
function initNavScroll() {
  const topbar = document.getElementById("top");
  if (!topbar) return;
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        topbar.classList.toggle("scrolled", window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ---------- SCROLL REVEAL SYSTEM ----------
function initRevealSystem() {
  const reveals = document.querySelectorAll("[data-reveal]:not(.is-visible)");
  if (!reveals.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    reveals.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.revealDelay || "0", 10);
        setTimeout(() => {
          el.classList.add("is-visible");
          setTimeout(() => { el.style.willChange = "auto"; }, 1000);
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  reveals.forEach(el => observer.observe(el));
}

// ---------- BUTTON RIPPLE EFFECT ----------
function initRippleEffect() {
  document.querySelectorAll(".btn, .donate-btn").forEach(btn => {
    btn.addEventListener("click", function(e) {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
      ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
      this.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}

// ---------- 3D CARD TILT ----------
function initCardTilt() {
  const cards = document.querySelectorAll(".prog-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
    });
  });
}

// ---------- COUNT UP COUNTERS ----------
let impactCounterStarted = false;

function animateCounters() {
  const counters = document.querySelectorAll(".counter");

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target || "0", 10);
    const duration = 2000;
    const startTime = performance.now();
    counter.classList.add("counting");

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const value = Math.floor(easedProgress * target);
      counter.textContent = value.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.textContent = target.toLocaleString() + "+";
        counter.classList.remove("counting");
        counter.classList.add("done");
      }
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

// ---------- UNIVERSAL SITE LOADER ----------
function runSiteLoader() {
  const loader = document.getElementById("siteLoader");
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add("fade-out");
    setTimeout(() => { loader.style.display = "none"; }, 600);
  }, 1000);
}

// Init
window.addEventListener("load", () => {
  runSiteLoader();
  initNavScroll();
  initHeroParallax();
  initHeroTextReveal();
  initHeroParticles();
  initCardTilt();
  initRippleEffect();
  initRevealSystem();
  initCounterObserver();
});
