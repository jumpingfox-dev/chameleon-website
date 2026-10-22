// Chameleon — small touches for the landing page. The page works without any of it.

(() => {
  // The header gets a backdrop once the page scrolls under it.
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Sections fade up as they come into view.
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const seen = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          seen.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => seen.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // "Make it yours": the swatches switch the phone's screenshot and the light behind it.
  const themes = {
    default: { name: 'Default', shot: 'assets/shots/phone-home.webp', glow: '#7c3aed' },
    emerald: { name: 'Emerald', shot: 'assets/shots/phone-home-theme.webp', glow: '#10b981' },
  };
  const shot = document.querySelector('[data-theme-shot]');
  const glow = document.querySelector('[data-theme-glow]');
  const label = document.querySelector('[data-theme-name]');
  const swatches = document.querySelectorAll('.swatches button');
  Object.values(themes).forEach((t) => { const img = new Image(); img.src = t.shot; });
  swatches.forEach((button) => {
    button.addEventListener('click', () => {
      const theme = themes[button.dataset.theme];
      swatches.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      shot.src = theme.shot;
      glow.style.background = theme.glow;
      label.textContent = theme.name;
    });
  });

  // Screenshots: TV and Phone tabs (arrow keys move between them).
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      select(next);
      next.focus();
    });
  });

  // Screenshots open full size.
  const box = document.getElementById('lightbox');
  if (box && typeof box.showModal === 'function') {
    const big = box.querySelector('img');
    document.querySelectorAll('.zoom').forEach((button) => {
      button.addEventListener('click', () => {
        const img = button.querySelector('img');
        big.src = img.src;
        big.alt = img.alt;
        box.showModal();
      });
    });
    box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
  }
})();
