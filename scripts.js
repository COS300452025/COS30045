// Shared JS for all pages
document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  document.querySelectorAll('.year').forEach(span => {
    span.textContent = new Date().getFullYear();
  });

  // Determine current page via data-page on <html> OR file name
  const htmlPage = document.documentElement.getAttribute('data-page');
  const filePage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // Map filenames to keys for active state
  const pageKey = htmlPage || (filePage.includes('televisions') ? 'televisions'
                  : filePage.includes('about') ? 'about'
                  : 'home');

  // Activate nav item for current page
  document.querySelectorAll('.nav-link').forEach(link => {
    const route = link.getAttribute('data-route');
    const isHome = pageKey === 'home' && route === 'index.html';
    const isTV   = pageKey === 'televisions' && route === 'televisions.html';
    const isAbout= pageKey === 'about' && route === 'about.html';
    const active = isHome || isTV || isAbout;

    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');

    // JS-driven swapping: intercept clicks and navigate
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href') || route;
      // Use JS to swap pages (hard navigation, keeps requirement of JS-driven)
      window.location.href = href;
    });

    // Keyboard activation (accessibility)
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = link.getAttribute('href') || route;
      }
    });
  });

  // Power logo click -> Home via JS
  const logo = document.getElementById('logoLink');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'index.html';
    });
  }

  // Page-specific logic: Running cost calculator on televisions page
  if (pageKey === 'televisions') {
    const form = document.getElementById('costForm');
    const kwh = document.getElementById('kwhInput');
    const tariff = document.getElementById('tariffInput');
    const out = document.getElementById('costOutput');

    function updateCost(){
      const k = parseFloat(kwh?.value || '0');
      const t = parseFloat(tariff?.value || '0');
      const cost = k * t;
      out.textContent = `Annual Cost: ${isFinite(cost) ? 'A$' + cost.toFixed(2) : '—'}`;
    }

    if (form && kwh && tariff && out) {
      form.addEventListener('submit', (e) => { e.preventDefault(); updateCost(); });
      kwh.addEventListener('input', updateCost);
      tariff.addEventListener('input', updateCost);
      updateCost();
    }
  }
});
