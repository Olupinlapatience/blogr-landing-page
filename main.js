    'use strict';

    /* ----- LOADING SCREEN ----- */
    window.addEventListener('load', () => {
      const loader = document.getElementById('loader');
      setTimeout(() => loader.classList.add('hidden'), 600);
    });

    /* ----- DARK MODE ----- */
    const html         = document.documentElement;
    const themeToggle  = document.getElementById('themeToggle');
    const THEME_KEY    = 'blogr-theme';

    // Apply saved preference on load
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initTheme = saved || (prefersDark ? 'dark' : 'light');
    html.setAttribute('data-theme', initTheme);
    themeToggle.textContent = initTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', initTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
      themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });

    /* ----- DESKTOP DROPDOWNS ----- */
    const navBtns = document.querySelectorAll('.nav__btn');

    function closeAll() {
      navBtns.forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling?.classList.remove('is-open');
      });
    }

    navBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const open = btn.getAttribute('aria-expanded') === 'true';
        closeAll();
        if (!open) {
          btn.setAttribute('aria-expanded', 'true');
          btn.nextElementSibling?.classList.add('is-open');
        }
      });
      btn.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeAll(); btn.focus(); }
      });
    });

    document.addEventListener('click', closeAll);

    /* ----- MOBILE MENU ----- */
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', e => {
      e.stopPropagation();
      const open = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!open));
      hamburger.setAttribute('aria-label', open ? 'Open navigation menu' : 'Close navigation menu');
      hamburger.classList.toggle('is-active', !open);
      mobileMenu.classList.toggle('is-open', !open);
      mobileMenu.setAttribute('aria-hidden', String(open));
    });

    // Mobile accordion
    document.querySelectorAll('.mobile-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') === 'true';
        // Close all siblings
        document.querySelectorAll('.mobile-toggle').forEach(t => {
          if (t !== toggle) {
            t.setAttribute('aria-expanded', 'false');
            t.nextElementSibling?.classList.remove('is-open');
          }
        });
        toggle.setAttribute('aria-expanded', String(!open));
        toggle.nextElementSibling?.classList.toggle('is-open', !open);
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');
        hamburger.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    });

    // Reset on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.querySelectorAll('.mobile-toggle').forEach(t => {
          t.setAttribute('aria-expanded', 'false');
          t.nextElementSibling?.classList.remove('is-open');
        });
      }
    });

    /* ----- SCROLL REVEAL ----- */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObs.observe(el));

    /* ----- SMOOTH SCROLL ----- */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    /* ----- PREFETCH ON HOVER (Performance bonus) ----- */
    document.querySelectorAll('a[href]').forEach(a => {
      a.addEventListener('mouseenter', () => {
        const link = document.createElement('link');
        link.rel  = 'prefetch';
        link.href = a.href;
        document.head.appendChild(link);
      }, { once: true });
    });

    console.log('%c✅ Blogr — All systems go!', 'color:#FF525D;font-weight:bold;font-size:14px;background:#fff;padding:4px 8px;border-radius:4px;');
