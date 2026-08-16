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

// ---------- CUSTOM YOUTUBE COVERS ----------
function initYoutubeCovers() {
  document.querySelectorAll("[data-youtube-cover]").forEach(cover => {
    if (cover.dataset.bound === "true") return;
    cover.dataset.bound = "true";

    cover.addEventListener("click", () => {
      const wrap = cover.closest(".recap-video-wrap");
      const iframe = wrap ? wrap.querySelector("iframe") : null;
      const baseSrc = cover.dataset.videoSrc;
      if (!wrap || !iframe || !baseSrc) return;

      const autoplaySrc = new URL(baseSrc, window.location.href);
      autoplaySrc.searchParams.set("autoplay", "1");
      autoplaySrc.searchParams.set("rel", "0");
      autoplaySrc.searchParams.set("modestbranding", "1");

      iframe.src = autoplaySrc.toString();
      wrap.classList.add("is-playing");
    });
  });
}

// ---------- IN-PAGE SMOOTH SCROLL ----------
function initInPageScrollLinks() {
  document.querySelectorAll("[data-scroll-target]").forEach(link => {
    if (link.dataset.bound === "true") return;
    link.dataset.bound = "true";

    link.addEventListener("click", e => {
      const target = document.getElementById(link.dataset.scrollTarget);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
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
let careerConferenceCounterStarted = false;
let careerConferenceCounterObserver = null;

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function animateCounters() {
  const counters = document.querySelectorAll(".counter");

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

function setCountupFinalValue(counter) {
  const target = parseInt(counter.dataset.countupTarget || "0", 10);
  const suffix = counter.dataset.countupSuffix || "";
  counter.textContent = target.toLocaleString() + suffix;
}

function animateCountupValue(counter, index) {
  const target = parseInt(counter.dataset.countupTarget || "0", 10);
  const suffix = counter.dataset.countupSuffix || "";
  const duration = parseInt(counter.dataset.countupDuration || "1800", 10);
  const startTime = performance.now() + (index * 70);

  counter.classList.add("is-counting");
  counter.textContent = "0" + suffix;

  return new Promise(resolve => {
    function tick(now) {
      if (now < startTime) {
        requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(easeOutExpo(progress) * target);
      counter.textContent = value.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setCountupFinalValue(counter);
        counter.classList.remove("is-counting");
        counter.classList.add("is-counted");
        resolve();
      }
    }

    requestAnimationFrame(tick);
  });
}

function launchCareerConferenceConfetti(anchor) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const colors = ["#ffffff", "#8fd0ff", "#4a9eff", "#f5c842", "#dfefff"];
  const rect = anchor.getBoundingClientRect();
  const originX = Math.min(window.innerWidth - 40, Math.max(40, rect.left + rect.width * 0.35));
  const originY = Math.min(window.innerHeight - 80, Math.max(80, rect.top + rect.height * 0.38));
  const particles = Array.from({ length: 170 }, () => {
    const angle = (-Math.PI / 2) + ((Math.random() - 0.5) * Math.PI * 0.9);
    const speed = 7 + Math.random() * 9;

    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 5 + Math.random() * 8,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.34,
      gravity: 0.18 + Math.random() * 0.07,
      drag: 0.985,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  });
  const start = performance.now();
  const duration = 2100;

  canvas.setAttribute("aria-hidden", "true");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9998";
  document.body.appendChild(canvas);

  function resizeCanvas() {
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();

  function draw(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach(particle => {
      particle.vx *= particle.drag;
      particle.vy = (particle.vy + particle.gravity) * particle.drag;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.spin;

      const fade = Math.max(0, 1 - elapsed / duration);
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.fillStyle = particle.color;
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.56);
      ctx.restore();
    });

    if (elapsed < duration) {
      requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(draw);
}

function animateCareerConferenceStats(section) {
  const counters = Array.from(section.querySelectorAll("[data-countup]"));
  if (!counters.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    counters.forEach(setCountupFinalValue);
    return;
  }

  Promise.all(counters.map(animateCountupValue)).then(() => {
    const page = section.closest(".page");
    if (!page || page.classList.contains("is-active")) {
      launchCareerConferenceConfetti(section);
    }
  });
}

function initCounterObserver() {
  const impact = document.getElementById("impactSection");
  const careerConferenceStats = document.querySelector(".page.is-active [data-career-conf-countup]");

  if (impact && impact.dataset.counterObserved !== "true") {
    impact.dataset.counterObserved = "true";

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

  if (careerConferenceCounterStarted) return;

  if (!careerConferenceStats) {
    if (careerConferenceCounterObserver) {
      careerConferenceCounterObserver.disconnect();
      careerConferenceCounterObserver = null;
    }
    if (!careerConferenceCounterStarted) {
      document.querySelectorAll("[data-career-conf-countup]").forEach(section => {
        delete section.dataset.counterObserved;
      });
    }
    return;
  }

  if (careerConferenceStats.dataset.counterObserved === "true") return;

  careerConferenceStats.dataset.counterObserved = "true";
  careerConferenceCounterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const hasScrolledIntoStats = entry.isIntersecting && entry.boundingClientRect.top < window.innerHeight * 0.82;
      if (hasScrolledIntoStats && !careerConferenceCounterStarted) {
        careerConferenceCounterStarted = true;
        animateCareerConferenceStats(careerConferenceStats);
        careerConferenceCounterObserver.unobserve(careerConferenceStats);
      }
    });
  }, { threshold: 0.35, rootMargin: "0px 0px -18% 0px" });

  careerConferenceCounterObserver.observe(careerConferenceStats);
}
