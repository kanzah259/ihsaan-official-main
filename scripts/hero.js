// ---------- HERO VIDEO PLAYBACK ----------
function initHeroVideoPlayback() {
  const video = document.querySelector(".hero-video");
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  video.querySelectorAll("source").forEach(source => {
    if (!source.src && source.dataset.src) source.src = source.dataset.src;
  });

  const tryPlay = () => {
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        video.classList.add("is-autoplay-blocked");
      });
    }
  };

  if (video.readyState >= 2) {
    tryPlay();
  } else {
    video.load();
    video.addEventListener("canplay", tryPlay, { once: true });
  }

  const unlockPlayback = () => {
    video.classList.remove("is-autoplay-blocked");
    tryPlay();
  };

  ["touchstart", "pointerdown", "click", "scroll"].forEach(eventName => {
    window.addEventListener(eventName, unlockPlayback, { once: true, passive: true });
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tryPlay();
  });
}

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
  const heroTitles = document.querySelectorAll("#heroTitle, [data-hero-title]");
  if (!heroTitles.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  heroTitles.forEach(heroTitle => {
    const originalHTML = heroTitle.innerHTML;
    const words = originalHTML.split(/(\s+|<br\s*\/?>)/);
    heroTitle.innerHTML = words.map(word => {
      if (word.match(/<br\s*\/?>/)) return word;
      if (word.match(/^\s+$/)) return word;
      const letters = Array.from(word)
        .map(letter => `<span class="letter">${letter}</span>`)
        .join("");
      return `<span class="word">${letters}</span>`;
    }).join("");

    const wordEls = heroTitle.querySelectorAll(".word");
    if (reducedMotion) {
      wordEls.forEach(word => word.classList.add("visible"));
      return;
    }

    wordEls.forEach((word, i) => {
      setTimeout(() => word.classList.add("visible"), 300 + i * 80);
    });
  });
}

// ---------- HERO PARTICLES ----------
function initHeroParticles() {
  const canvas = document.getElementById("heroParticles");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  const PARTICLE_COUNT = 22;
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
      size: Math.random() * 1.2 + 0.45,
      speedY: -(Math.random() * 0.18 + 0.06),
      speedX: (Math.random() - 0.5) * 0.12,
      opacity: Math.random() * 0.18 + 0.04,
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
