(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  const mobile = matchMedia('(max-width: 960px)');
  menuButton?.setAttribute('data-enhanced', 'true');
  nav?.setAttribute('data-enhanced', 'true');
  const background = [document.getElementById('main-content'), document.querySelector('.site-footer')].filter(Boolean);
  const setMenu = (open, returnFocus = false) => {
    nav?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menuButton?.setAttribute('aria-expanded', String(open));
    menuButton?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    background.forEach(element => { element.inert = open && mobile.matches; });
    if (returnFocus) menuButton?.focus();
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  nav?.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    setMenu(false);
    const url = new URL(link.href, location.href);
    const normalize = path => path.replace(/index\.html$/, '');
    if (url.origin === location.origin && normalize(url.pathname) === normalize(location.pathname) && url.hash) {
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (target) { target.setAttribute('tabindex', '-1'); target.focus({preventScroll: true}); }
    }
  });
  document.addEventListener('keydown', (event) => {
    if (menuButton?.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { event.preventDefault(); setMenu(false, true); }
    if (event.key === 'Tab') {
      const items = [menuButton, ...nav.querySelectorAll('a')];
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  mobile.addEventListener('change', () => setMenu(false));
  const sectionLinks = [...(nav?.querySelectorAll('a[href*="#"]') || [])];
  if (sectionLinks.length && document.querySelector('.page-home')) {
    const markSection = id => sectionLinks.forEach(link => {
      if (new URL(link.href, location.href).hash === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    markSection(location.hash.slice(1));
    addEventListener('hashchange', () => markSection(location.hash.slice(1)));
    if ('IntersectionObserver' in window) {
      const sections = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) markSection(visible[0].target.id);
      }, {rootMargin:'-15% 0px -65% 0px'});
      sectionLinks.forEach(link => {
        const section = document.getElementById(new URL(link.href, location.href).hash.slice(1));
        if (section) sections.observe(section);
      });
    }
  }
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  const buttons = [...document.querySelectorAll('[data-filter]')];
  document.querySelectorAll('.filters').forEach(group => group.setAttribute('data-enhanced', 'true'));
  const repositories = [...document.querySelectorAll('.repo-row')];
  buttons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    repositories.forEach(row => {
      row.hidden = filter !== 'Todos' && row.dataset.category !== filter;
      if (!row.hidden) count += 1;
    });
    const status = document.getElementById('repo-count');
    if (status) status.textContent = `${count} ${count === 1 ? 'repositório' : 'repositórios'}${filter === 'Todos' ? '' : ` · ${filter}`}`;
  }));

  const projectButtons = [...document.querySelectorAll('[data-project-filter]')];
  const projectCards = [...document.querySelectorAll('#portfolio-projects [data-project-group]')];
  projectButtons.forEach(button => button.addEventListener('click', () => {
    const group = button.dataset.projectFilter;
    projectButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    projectCards.forEach(card => {
      card.hidden = group !== 'Todos' && card.dataset.projectGroup !== group;
      if (!card.hidden) {
        count += 1;
        // A card hidden during observation must be readable when shown again.
        card.classList.remove('is-pending');
        card.classList.add('is-visible');
      }
    });
    const status = document.getElementById('project-count');
    if (status) status.textContent = `${count} ${count === 1 ? 'projeto' : 'projetos'}${group === 'Todos' ? '' : ` · ${button.textContent.trim()}`}`;
  }));

  const counters = [...document.querySelectorAll('[data-count]')];
  const runningCounters = new Map();
  let counterObserver;
  const finishCounters = () => {
    counterObserver?.disconnect();
    runningCounters.forEach(id => cancelAnimationFrame(id));
    runningCounters.clear();
    counters.forEach(el => { el.textContent = el.dataset.count; });
  };
  if ('IntersectionObserver' in window && !reduced.matches) {
    counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target, target = Number(el.dataset.count), started = performance.now();
        counterObserver.unobserve(el);
        // Keep the accessible value stable while the visible number advances.
        el.setAttribute('aria-label', String(target));
        const tick = now => {
          const progress = Math.min(1, (now - started) / 700);
          el.textContent = String(Math.round(target * (1 - (1 - progress) ** 3)));
          if (progress < 1 && !reduced.matches) runningCounters.set(el, requestAnimationFrame(tick));
          else { el.textContent = String(target); runningCounters.delete(el); }
        };
        runningCounters.set(el, requestAnimationFrame(tick));
      });
    }, {threshold: 0.5});
    counters.forEach(el => counterObserver.observe(el));
  }

  let observer;
  if ('IntersectionObserver' in window && !reduced.matches) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-pending');
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('.reveal').forEach(el => { el.classList.add('is-pending'); observer.observe(el); });
  }
  const progress = document.querySelector('.scroll-progress');
  const heroGraphic = document.querySelector('.hero-graphic');
  let heroVisible = true;
  const syncHeroMotion = () => heroGraphic?.classList.toggle('motion-paused', reduced.matches || document.hidden || !heroVisible);
  if (heroGraphic && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(entries => {
      heroVisible = entries[0].isIntersecting;
      syncHeroMotion();
    });
    heroObserver.observe(heroGraphic);
  }
  document.addEventListener('visibilitychange', syncHeroMotion);
  reduced.addEventListener('change', syncHeroMotion);
  syncHeroMotion();
  const animation = progress?.animate?.([{transform:'scaleX(0)'},{transform:'scaleX(1)'}], {duration:1000,fill:'both'});
  animation?.pause();
  let scheduled = false;
  const updateProgress = () => {
    if (animation && !reduced.matches) {
      const max = document.documentElement.scrollHeight - innerHeight;
      animation.currentTime = max > 0 ? Math.min(1000, Math.max(0, scrollY / max * 1000)) : 0;
    }
    scheduled = false;
  };
  addEventListener('scroll', () => { if (!scheduled && !reduced.matches) { scheduled = true; requestAnimationFrame(updateProgress); } }, {passive:true});
  addEventListener('resize', updateProgress, {passive:true});
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      finishCounters();
      observer?.disconnect();
      document.querySelectorAll('.is-pending').forEach(el => el.classList.remove('is-pending'));
    }
    updateProgress();
  });
  updateProgress();

  if (document.querySelector('[data-legacy-project]')) {
    const routes = Object.freeze({clientflow:'clientflow.html',decisionforge:'decisionforge-ai.html',curtailment:'curtailment-intelligence.html',finance:'gestao-financeira.html',pricing:'precificacao-vendas.html',institutional:'site-institucional-painel.html',csv:'analise-vendas.html',riftpilot:'riftpilot.html'});
    const id = new URLSearchParams(location.search).get('id');
    if (Object.hasOwn(routes, id)) {
      document.getElementById('legacy-project-link').href = routes[id];
      location.replace(routes[id]);
    }
  }
})();
