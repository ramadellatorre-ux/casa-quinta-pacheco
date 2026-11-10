// Casa Quinta Pacheco · interacciones
(() => {
  const WA = '5491126734338';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const pesos = n => '$' + n.toLocaleString('es-AR');

  // --- Loader: el foco se prende y se va
  const t0 = performance.now();
  const ready = () => setTimeout(() => document.documentElement.classList.add('loaded'), Math.max(0, (reduce ? 0 : 1400) - (performance.now() - t0)));
  // Dentro del visor de dispositivos (iframe) no se repite el loader
  if (window.self !== window.top) document.documentElement.classList.add('loaded');
  else ready(); // el script va al final del body: el DOM ya está listo

  // --- WhatsApp
  $$('.js-wa').forEach(a => { a.href = waLink(a.dataset.msg); a.target = '_blank'; a.rel = 'noopener'; });

  // --- Nav
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu'), hero = $('#inicio'), waFloat = $('.wa-float');
  const onScroll = () => {
    nav.classList.toggle('solid', scrollY > 40);
    waFloat.classList.toggle('hide', scrollY < hero.offsetHeight * 0.6);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', open); menu.classList.toggle('open', open);
    nav.classList.add('solid');
  });
  $$('a', menu).forEach(a => a.addEventListener('click', () => { burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); }));

  // --- Video del hero (desktop / mobile)
  const video = $('#heroVideo'), toggle = $('#videoToggle');
  const mobile = matchMedia('(max-width: 760px)').matches;
  const base = 'assets/video/hero-' + (mobile ? 'mobile' : 'desktop');
  video.poster = base + '.jpg';
  video.src = base + '.mp4';
  const setPaused = p => { toggle.setAttribute('aria-pressed', p); toggle.setAttribute('aria-label', p ? 'Reproducir video' : 'Pausar video'); };
  if (reduce) setPaused(true);
  else video.play().then(() => setPaused(false)).catch(() => setPaused(true));
  toggle.addEventListener('click', () => {
    if (video.paused) { video.play(); setPaused(false); } else { video.pause(); setPaused(true); }
  });

  // --- Guirnaldas
  const NS = 'http://www.w3.org/2000/svg';
  function garland(svg, n) {
    const [, , W, H] = svg.getAttribute('viewBox').split(' ').map(Number);
    const x0 = 6, x1 = W - 6, y = 6, sag = H * 0.3, r = Math.min(7, H * 0.11);
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('class', 'cable'); p.setAttribute('d', `M${x0} ${y} Q${W / 2} ${y + 2 * sag} ${x1} ${y}`);
    svg.appendChild(p);
    const vi = Math.floor(n * 0.62), bulbs = [];
    for (let i = 0; i < n; i++) {
      const t = (i + 1) / (n + 1), x = x0 + (x1 - x0) * t, yy = y + sag * 4 * t * (1 - t);
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', yy + r * 1.5); c.setAttribute('r', r);
      c.setAttribute('class', 'bulb' + (i === vi ? ' v' : ''));
      svg.appendChild(c); bulbs.push(c);
    }
    return bulbs;
  }
  const diaBulbs = garland($('#diaGarland'), 9);
  const cierreBulbs = garland($('#cierreGarland'), 15);
  new IntersectionObserver(es => es.forEach(e => {
    cierreBulbs.forEach((b, i) => setTimeout(() => b.classList.toggle('on', e.isIntersecting), e.isIntersecting ? i * 110 : 0));
  }), { threshold: 0.5 }).observe($('#cierreGarland'));

  // --- Un día en Pacheco: el paso del centro de la pantalla cambia la foto y prende la guirnalda
  const pasos = $$('.paso'), fotos = $$('.dia-fotos img');
  const setPaso = i => {
    pasos.forEach((p, k) => p.classList.toggle('on', k === i));
    fotos.forEach((f, k) => f.classList.toggle('on', k === i));
    const on = Math.round(((i + 1) / pasos.length) * diaBulbs.length);
    diaBulbs.forEach((b, k) => b.classList.toggle('on', k < on));
  };
  if (matchMedia('(min-width: 981px)').matches) {
    const diaIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setPaso(pasos.indexOf(e.target)); }),
      { rootMargin: '-45% 0px -45% 0px' });
    pasos.forEach(p => diaIO.observe(p));
    setPaso(0);
  }

  // --- Reveal
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
  $$('.reveal').forEach(el => io.observe(el));

  // --- Galería: filtros + lightbox
  const items = $$('#gal button'), lb = $('#lightbox'), lbImg = $('#lbImg');
  let vis = items, cur = 0;
  $$('.filtros button').forEach(b => b.addEventListener('click', () => {
    $$('.filtros button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
    items.forEach(it => it.classList.toggle('off', b.dataset.f !== 'todo' && it.dataset.cat !== b.dataset.f));
    vis = items.filter(it => !it.classList.contains('off'));
  }));
  const show = i => { cur = (i + vis.length) % vis.length; const im = $('img', vis[cur]); lbImg.src = im.src; lbImg.alt = im.alt; };
  items.forEach(it => it.addEventListener('click', () => { show(vis.indexOf(it)); lb.showModal(); }));
  $('#lbClose').addEventListener('click', () => lb.close());
  $('#lbPrev').addEventListener('click', () => show(cur - 1));
  $('#lbNext').addEventListener('click', () => show(cur + 1));
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
  let tx = null;
  lb.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); tx = null; });

  // --- Calculadora
  const P = { semana: 185000, finde: 230000, persona: 10000, limpieza: 50000, cap: 20 };
  const f = $('#cFecha'), fer = $('#cFeriado'), pers = $('#cPers'), persOut = $('#cPersOut'),
        limp = $('#cLimpieza'),
        totalEl = $('#cTotal'), det = $('#cDetalle'), tipo = $('#cTipo'), enviar = $('#cEnviar');
  const hoy = new Date(); f.min = hoy.toISOString().slice(0, 10);
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  function calc() {
    let fecha = null;
    if (f.value) { const [y, m, d] = f.value.split('-').map(Number); fecha = new Date(y, m - 1, d); }
    const finde = fer.checked || (fecha && (fecha.getDay() === 0 || fecha.getDay() === 6));
    const base = finde ? P.finde : P.semana;
    const n = +pers.value, extra = Math.max(0, n - P.cap);
    const total = base + extra * P.persona + (limp.checked ? P.limpieza : 0);
    persOut.textContent = n + (extra ? ` (${extra} extra)` : '');
    tipo.textContent = fecha ? `${DIAS[fecha.getDay()]} · tarifa ${finde ? 'fin de semana / feriado' : 'día de semana'}` : 'Elegí una fecha';
    totalEl.textContent = pesos(total);
    const partes = [`Base ${finde ? 'finde/feriado' : 'día de semana'} ${pesos(base)}`];
    if (extra) partes.push(`${extra} pers. extra ${pesos(extra * P.persona)}`);
    if (limp.checked) partes.push(`limpieza ${pesos(P.limpieza)}`);
    det.textContent = partes.join(' + ');
    const cuando = fecha ? `el ${DIAS[fecha.getDay()]} ${fecha.getDate()}/${fecha.getMonth() + 1}${fer.checked ? ' (feriado)' : ''}` : '(todavía sin fecha)';
    let msg = `Hola! Quería consultar por Casa Quinta Pacheco ${cuando}, para ${n} personas`;
    if (limp.checked) msg += ', con limpieza';
    msg += `. Total estimado en la web: ${pesos(total)}. ¿Está disponible?`;
    enviar.href = waLink(msg);
  }
  [f, fer, pers, limp].forEach(el => el.addEventListener('input', calc));
  calc();

  // --- Frase-molde rotativa
  const em = $('.cierre h2 em'), palabras = ['cumple', 'asado del domingo', 'fin de año', 'despedida', 'reunión de amigos'];
  if (!reduce && em) {
    let k = 0;
    setInterval(() => {
      em.style.opacity = 0;
      setTimeout(() => { k = (k + 1) % palabras.length; em.textContent = palabras[k]; em.style.opacity = 1; }, 300);
    }, 2600);
    em.style.transition = 'opacity .3s';
  }
})();
