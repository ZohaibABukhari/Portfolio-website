// script.js — interactions for Portfolio
// - Sidebar toggle
// - Horizontal scroller controls (arrows, wheel, touch)
// - Lightbox for images
// - Smooth scrolling for project links
// - Section 'dominate on view' using IntersectionObserver

document.addEventListener('DOMContentLoaded', () => {
  // Sidebar toggle
  const sidebar = document.querySelector('.sidebar');
  const toggles = document.querySelectorAll('.sidebar-toggle');
  toggles.forEach(btn => btn.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    sidebar.setAttribute('aria-hidden', !open);
  }));

  // Scroller controls
  const scroller = document.querySelector('.scroller');
  const btnLeft = document.querySelector('.scroller-btn.left');
  const btnRight = document.querySelector('.scroller-btn.right');
  if (btnLeft && btnRight && scroller) {
    const scrollAmount = () => scroller.clientWidth * 0.66;
    btnLeft.addEventListener('click', () => scroller.scrollBy({left: -scrollAmount(), behavior: 'smooth'}));
    btnRight.addEventListener('click', () => scroller.scrollBy({left: scrollAmount(), behavior: 'smooth'}));

    // allow shift+wheel or trackpad horizontal
    scroller.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > 0 || e.shiftKey) {
        // let native
        return;
      }
      e.preventDefault();
      scroller.scrollBy({left: e.deltaY, behavior: 'auto'});
    }, {passive: false});

    // touch swipe is native on mobile
  }

  // Lightbox
  function openLightbox(src, alt) {
    const overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.tabIndex = 0;
    overlay.innerHTML = `<div class="lb-inner"><img src="${src}" alt="${alt||''}"/></div>`;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
    overlay.addEventListener('keydown', (e) => { if (e.key === 'Escape') overlay.remove(); });
    document.body.appendChild(overlay);
  }

  document.querySelectorAll('.lightbox-open, .project-img, .thumb').forEach(el => {
    el.addEventListener('click', (e) => {
      const src = el.dataset.src || el.getAttribute('data-src') || el.getAttribute('src');
      openLightbox(src, 'Project image');
    });
  });

  // Smooth scroll for intra-page links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#' || href === '#top') return; // let default
      if (href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
      }
    });
  });

  // IntersectionObserver to make project section dominate when in view
  const projectDetails = document.querySelectorAll('.project-detail');
  if ('IntersectionObserver' in window && projectDetails.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, {threshold: [0.15, 0.55, 0.85]});
    projectDetails.forEach(s => obs.observe(s));
  }

  // Accessibility: close lightbox on ESC when focused
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.lb-overlay').forEach(lb => lb.remove());
    }
  });

});
