// ---------- APP INITIALIZATION ----------
window.addEventListener("load", async () => {
  await loadIncludes();

  pages = document.querySelectorAll(".page");
  links = document.querySelectorAll("[data-route]");

  bindRouteLinks();

  initOpportunitiesTracker();

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
  initRevealSystem();
  initCounterObserver();
  initYear();
});
