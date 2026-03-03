/* ── Focus outline only for keyboard users ───────────────────────────── */
const handleFirstTab = (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', handleFirstTab);
    window.addEventListener('mousedown', handleMouseDownOnce);
  }
};
const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing');
  window.removeEventListener('mousedown', handleMouseDownOnce);
  window.addEventListener('keydown', handleFirstTab);
};
window.addEventListener('keydown', handleFirstTab);

/* ── Elements ────────────────────────────────────────────────────────── */
const sections   = document.querySelectorAll('section');
const dots       = document.querySelectorAll('.nav-dot');
const progress   = document.getElementById('progress');
const backToTop  = document.querySelector('.back-to-top');

/* ── Scroll to section ───────────────────────────────────────────────── */
function scrollToSection(idx) {
  sections[idx].scrollIntoView({ behavior: 'smooth' });
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    scrollToSection(parseInt(dot.dataset.section));
  });
});

/* ── Scroll progress bar ─────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.body.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = (scrolled / total * 100) + '%';

  // Back to top visibility
  if (backToTop) {
    const show = scrolled > 600;
    backToTop.style.visibility = show ? 'visible' : 'hidden';
    backToTop.style.opacity    = show ? '1' : '0';
    backToTop.style.transform  = show ? 'scale(1)' : 'scale(0)';
  }
});

/* ── Active dot tracking ─────────────────────────────────────────────── */
const dotObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = Array.from(sections).indexOf(entry.target);
      dots.forEach(d => d.classList.remove('active'));
      if (dots[idx]) dots[idx].classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => dotObserver.observe(s));

/* ── Reveal on scroll ────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ── Keyboard navigation ─────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  const current = Array.from(sections).findIndex(s => {
    const rect = s.getBoundingClientRect();
    return rect.top <= 100 && rect.bottom > 100;
  });
  if (e.key === 'ArrowDown' && current < sections.length - 1) scrollToSection(current + 1);
  if (e.key === 'ArrowUp'   && current > 0)                   scrollToSection(current - 1);
});
