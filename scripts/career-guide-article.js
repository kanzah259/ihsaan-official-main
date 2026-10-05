// Called by the router only after the requested article is visible.
function scrollCareerGuideSection() {
  const [route, query = ''] = window.location.hash.slice(1).split('?');
  const id = new URLSearchParams(query).get('section');
  if (!id) return false;
  const page = [...document.querySelectorAll('.guide-article-page.is-active')]
    .find(element => element.dataset.page === route);
  const target = page && [...page.querySelectorAll('.guide-article-content [id]')]
    .find(element => element.id === id);
  if (!target) return false;
  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: 'instant', block: 'start' });
  return true;
}

function initCareerGuideArticles() {
  document.querySelectorAll('.guide-article-page').forEach(page => {
    const article = page.querySelector('.guide-article-content');
    const header = page.querySelector('.guide-article-header');
    let metadata = header?.querySelector('.guide-article-metadata');
    if (header && !metadata) {
      metadata = document.createElement('div');
      metadata.className = 'guide-article-metadata';
      header.append(metadata);
      const existingTime = header.querySelector('.guide-article-reading-time');
      const existingCredits = header.querySelector('.guide-article-credits');
      if (existingTime) metadata.append(existingTime);
      if (existingCredits) metadata.append(existingCredits);
    }
    if (article && header) {
      const readableContent = article.cloneNode(true);
      readableContent.querySelectorAll('.guide-article-back, nav, script, style, [hidden], [aria-hidden="true"]').forEach(element => element.remove());
      readableContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, div, section, br').forEach(element => element.append(' '));
      const words = readableContent.textContent.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || [];
      const minutes = Math.max(1, Math.ceil(words.length / 200));
      let readingTime = header.querySelector('.guide-article-reading-time');
      if (!readingTime) {
        readingTime = document.createElement('p');
        readingTime.className = 'guide-article-reading-time';
        const credits = header.querySelector('.guide-article-credits');
        metadata.insertBefore(readingTime, credits);
      }
      const clock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      clock.setAttribute('viewBox', '0 0 24 24');
      clock.setAttribute('fill', 'none');
      clock.setAttribute('stroke', 'currentColor');
      clock.setAttribute('stroke-width', '1.8');
      clock.setAttribute('stroke-linecap', 'round');
      clock.setAttribute('aria-hidden', 'true');
      clock.setAttribute('focusable', 'false');
      const face = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      face.setAttribute('cx', '12');
      face.setAttribute('cy', '12');
      face.setAttribute('r', '9');
      const hands = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      hands.setAttribute('d', 'M12 7v5l3 2');
      clock.append(face, hands);
      readingTime.replaceChildren(clock, document.createTextNode(`${minutes} min read`));
      readingTime.setAttribute('aria-label', `Estimated reading time: ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    }
    const credits = header?.querySelector('.guide-article-credits');
    if (credits) {
      let creditCount = 0;
      credits.querySelectorAll('a').forEach(link => {
        const name = link.textContent.trim();
        let validLink = false;
        try {
          validLink = ['https:', 'http:'].includes(new URL(link.getAttribute('href')).protocol);
        } catch { /* Empty or invalid credit links stay hidden. */ }
        link.hidden = !name || !validLink;
        if (link.hidden) return;
        creditCount++;
        link.classList.add('guide-article-credit');
        if (link.querySelector('svg')) return;
        const person = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        person.setAttribute('viewBox', '0 0 24 24');
        person.setAttribute('fill', 'none');
        person.setAttribute('stroke', 'currentColor');
        person.setAttribute('stroke-width', '1.8');
        person.setAttribute('stroke-linecap', 'round');
        person.setAttribute('aria-hidden', 'true');
        person.setAttribute('focusable', 'false');
        const outline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        outline.setAttribute('d', 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21v-2a7 7 0 0 1 14 0v2');
        person.append(outline);
        link.prepend(person);
      });
      credits.hidden = creditCount === 0;
    }
    const headings = [...page.querySelectorAll('.guide-article-content h2, .guide-article-content h3, .guide-article-content h4')];
    const desktop = page.querySelector('.guide-article-toc');
    const mobile = page.querySelector('.guide-article-mobile-toc nav');
    if (!desktop || !mobile) return;
    const title = document.createElement('h2');
    title.textContent = 'On this page';
    desktop.replaceChildren(title);
    mobile.replaceChildren();
    const sections = [];
    headings.forEach((heading, index) => {
      const parentSection = heading.closest('section');
      const content = page.querySelector('.guide-article-content');
      const section = parentSection && content.contains(parentSection)
        && parentSection.querySelector('h2') === heading ? parentSection : heading;
      if (!section.id) section.id = `${page.id}-section-${index + 1}`;
      section.tabIndex = -1;
      const entry = { section, links: [] };
      sections.push(entry);
      [desktop, mobile].forEach(nav => {
        const link = document.createElement('a');
        link.textContent = heading.textContent;
        if (heading.tagName === 'H3') link.classList.add('guide-toc-subsection');
        if (heading.tagName === 'H4') link.classList.add('guide-toc-subsection', 'guide-toc-nested-subsection');
        link.href = `#${page.dataset.page}?${new URLSearchParams({ section: section.id })}`;
        link.addEventListener('click', event => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          // Replace this page's URL, without creating section-by-section Back entries.
          window.history.replaceState(window.history.state, '', link.href);
          const disclosure = link.closest('details');
          if (disclosure) disclosure.open = false;
          section.focus({ preventScroll: true });
          section.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
        });
        nav.append(link);
        entry.links.push(link);
      });
    });
    const content = page.querySelector('.guide-article-content');
    const sidebar = page.querySelector('.guide-article-sidebar');
    let activeFramePending = false;
    const updateActiveSection = () => {
      activeFramePending = false;
      if (!page.classList.contains('is-active') || !sections.length) return;
      const offset = window.matchMedia('(max-width: 640px)').matches ? 116 : 132;
      let active = sections[0];
      sections.forEach(entry => {
        if (entry.section.getBoundingClientRect().top <= offset) active = entry;
      });
      const scrollRoot = document.scrollingElement || document.documentElement;
      const maximumScroll = Math.max(0, scrollRoot.scrollHeight - scrollRoot.clientHeight);
      if (maximumScroll > 0 && scrollRoot.scrollTop >= maximumScroll - 2) {
        active = sections.at(-1);
      }
      sections.forEach(entry => entry.links.forEach(link => {
        if (entry === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }));
    };
    const scheduleActiveSection = () => {
      if (activeFramePending) return;
      activeFramePending = true;
      requestAnimationFrame(updateActiveSection);
    };
    window.addEventListener('scroll', scheduleActiveSection, { passive: true });
    window.addEventListener('resize', scheduleActiveSection);
    let framePending = false;
    const alignArticleEnd = () => {
      framePending = false;
      if (!page.classList.contains('is-active') || window.matchMedia('(max-width: 640px)').matches) {
        sidebar.style.height = '';
        return;
      }
      const finalSection = content.querySelector('section:last-child') || content;
      const finalText = finalSection.lastElementChild;
      if (!finalText) return;
      const end = finalText.getBoundingClientRect().bottom;
      // Match the sticky containing block to the actual content endpoint.
      // Native sticky positioning then stops continuously, without a mode switch.
      sidebar.style.height = `${Math.max(desktop.offsetHeight, end - sidebar.getBoundingClientRect().top)}px`;
    };
    const scheduleAlignment = () => {
      if (framePending) return;
      framePending = true;
      requestAnimationFrame(alignArticleEnd);
    };
    window.addEventListener('resize', scheduleAlignment);
    const refreshArticle = () => {
      scheduleAlignment();
      scheduleActiveSection();
    };
    new MutationObserver(refreshArticle).observe(page, { attributes: true, attributeFilter: ['class'] });
    new ResizeObserver(refreshArticle).observe(content);
    scheduleAlignment();
    scheduleActiveSection();
  });
}
