(() => {
  const params = (() => {
    const local = new URLSearchParams(window.__DEMO_PARAMS__ ?? location.search);
    if (local.toString()) return local;
    try { if (parent !== window) return new URLSearchParams(parent.location.search); } catch (_) { /* iframe cross-origin */ }
    return local;
  })();
  const cleanPhone = value => {
    const digits = value.replace(/\D/g, '');
    const local = digits.replace(/^549/, '').replace(/^54/, '');
    return /^\d{10}$/.test(local) ? local : '';
  };
  const rawName = params.get('n');
  const rawCompany = params.get('e');
  const label = rawCompany || rawName;
  if (label) {
    const safeLabel = label.trim().slice(0, 80);
    document.querySelectorAll('[data-dynamic]').forEach(el => { el.textContent = `${safeLabel} · Zinguería`; });
    document.title = `${safeLabel} | Zinguería a medida · Demo`;
    document.querySelector('meta[name="description"]').content = `Demo de zinguería para ${safeLabel}: canaletas, babetas y soluciones pluviales a medida.`;
  }
  const rawPhone = params.get('t');
  const digits = rawPhone ? cleanPhone(rawPhone) : '';
  const waPhone = digits ? `549${digits}` : '';
  document.querySelectorAll('[data-whatsapp]').forEach(link => {
    if (!waPhone) { link.removeAttribute('href'); link.setAttribute('aria-disabled', 'true'); return; }
    const message = encodeURIComponent(`Hola, vi la demo de ${label || 'Zinguero'} y quisiera consultar por un trabajo de zinguería.`);
    link.href = `https://wa.me/${waPhone}?text=${message}`;
    link.removeAttribute('aria-disabled');
  });
  const phoneLink = document.querySelector('.contact-phone');
  if (waPhone) {
    phoneLink.href = `tel:+${waPhone}`;
    phoneLink.textContent = `+${waPhone} · teléfono de demo`;
    phoneLink.removeAttribute('aria-disabled');
  } else {
    phoneLink.removeAttribute('href');
    phoneLink.setAttribute('aria-disabled', 'true');
  }
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menú');
  }));

  const header = document.querySelector('.header');
  const updateHeaderDepth = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', updateHeaderDepth, { passive: true });
  updateHeaderDepth();

  const revealTargets = document.querySelectorAll('.service-card, .manifesto-image, .manifesto-copy, .photo-card, .steps li, .testimonial-card, .faq-list details');
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${(index % 4) * 75}ms`);
  });
  const showAll = () => revealTargets.forEach(element => element.classList.add('is-visible'));
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
    revealTargets.forEach(element => revealObserver.observe(element));
  }
})();
