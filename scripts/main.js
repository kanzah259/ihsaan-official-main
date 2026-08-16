// ---------- APP INITIALIZATION ----------
window.addEventListener("load", async () => {
  await loadIncludes();

  pages = document.querySelectorAll(".page");
  links = document.querySelectorAll("[data-route]");

  bindRouteLinks();

  handleRoute();

  initScrollRevealAndTimeline();

  initHeroVideoPlayback();
  initNavScroll();
  initHeroParallax();
  initMissionLayerReveal();
  initStoryBlueParallax();
  initHeroTextReveal();
  initHeroParticles();
  initCardTilt();
  initRippleEffect();
  initYoutubeCovers();
  initInPageScrollLinks();
  initRevealSystem();
  initCounterObserver();
  initYear();
});
