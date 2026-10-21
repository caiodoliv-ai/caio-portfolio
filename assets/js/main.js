/* =========================================================
   Caio de Oliveira — personal site · main script
   Sections:
     1. Feature check (ANIM) and static fallback
     2. Smooth scroll, anchors, headline splitting
     3. Globe (three.js) that carries the origins story
     4. Pinned scenes: Origins, Career, How I lead
     5. Other scroll triggers: nav, night mode, reveals, counters
     6. Render loop
   See docs/ARCHITECTURE.md for how the pieces fit together.
   ========================================================= */
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => innerWidth <= 900;
const D = Math.PI / 180;
// Animations run only when the libraries loaded and the viewport is a real screen.
const ANIM = !!(window.gsap && window.ScrollTrigger && window.THREE) && !REDUCED && innerHeight < (screen.height || 2000) * 2;
document.documentElement.classList.toggle('anim', ANIM);
const TOUCH = !matchMedia('(pointer: fine)').matches;

// Diagnostics: open the site with #debug to see why animations are on or off.
if (location.hash === '#debug') {
  const why = !(window.gsap && window.ScrollTrigger && window.THREE) ? 'libraries not loaded'
    : REDUCED ? 'device asks for reduced motion' : !ANIM ? 'viewport looks unusual' : 'animations on';
  let gl = false; try { gl = !!document.createElement('canvas').getContext('webgl'); } catch (e) {}
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:9999;font:12px/1.4 monospace;background:#1F1E1B;color:#F4F1EA;padding:8px 10px;border-radius:8px;max-width:calc(100% - 16px)';
  d.textContent = `${why} · touch:${TOUCH} · webgl:${gl} · ${innerWidth}×${innerHeight} (screen ${screen.width}×${screen.height})`;
  addEventListener('DOMContentLoaded', () => document.body.appendChild(d)); if (document.body) document.body.appendChild(d);
}

if (ANIM) {
gsap.registerPlugin(ScrollTrigger);
// Touch devices: steady pins while the address bar moves and momentum scrolling is on
ScrollTrigger.config({ ignoreMobileResize: true });
if (TOUCH) ScrollTrigger.normalizeScroll(true);
// On touch, let each pinned scene settle on its key moments instead of flying past them
const snapTo = pts => TOUCH ? { snapTo: pts, inertia: false, directional: false, duration: { min: .25, max: .8 }, delay: .15, ease: 'power1.inOut' } : false;

/* ---------------- smooth scroll ---------------- */
let lenis = null;
if (window.Lenis && window.top === window.self && matchMedia('(pointer: fine)').matches) {
  lenis = window.__lenis = new Lenis({ lerp: .09 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
document.querySelectorAll('[data-go]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href'); if (!id || id[0] !== '#') return;
  e.preventDefault();
  const el = id === '#top' ? 0 : document.querySelector(id);
  lenis ? lenis.scrollTo(el, { duration: 1.6 }) : (el === 0 ? scrollTo(0, 0) : el.scrollIntoView());
}));

/* ---------------- split headings into words ---------------- */
function split(node) {
  [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        const w = document.createElement('span'); w.className = 'w';
        const i = document.createElement('span'); i.textContent = part; w.appendChild(i); frag.appendChild(w);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1 && n.tagName !== 'BR') split(n);
  });
}
document.querySelectorAll('.split').forEach(split);

/* ---------------- hello rotator ---------------- */
(() => {
  const words = [...document.querySelectorAll('#hello span')]; let i = 0;
  words.forEach((w, k) => gsap.set(w, { yPercent: k ? 100 : 0, opacity: k ? 0 : 1 }));
  setInterval(() => {
    const a = words[i], b = words[(i + 1) % words.length]; i = (i + 1) % words.length;
    gsap.to(a, { yPercent: -100, opacity: 0, duration: .8, ease: 'power3.inOut' });
    gsap.fromTo(b, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, ease: 'power3.inOut' });
  }, 1800);
})();

/* =================================================================
   GLOBE — one object that carries the origin story
   ================================================================= */
const LAND = window.GLOBE_LAND || "";   // dotted land points, see assets/js/globe-data.js
const R = 2;
const canvas = document.getElementById('globe');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, .1, 100);
camera.position.set(0, 0, 14);
const root = new THREE.Group(), tilt = new THREE.Group(), spin = new THREE.Group();
root.add(tilt); tilt.add(spin); scene.add(root);

function ll(lat, lon, r = R) {
  const p = (90 - lat) * D, t = (lon + 180) * D;
  return new THREE.Vector3(-r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t));
}
const COL = {
  dayBall: new THREE.Color('#EBE6DB'), nightBall: new THREE.Color('#2A2824'),
  dayDot: new THREE.Color('#B3A794'), nightDot: new THREE.Color('#A0927E'),
  clay: new THREE.Color('#C8643B'), clay2: new THREE.Color('#E08A62')
};
const ballMat = new THREE.MeshBasicMaterial({ color: COL.dayBall.clone() });
spin.add(new THREE.Mesh(new THREE.SphereGeometry(R * .985, 64, 48), ballMat));

const dotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
  x.beginPath(); x.arc(32, 32, 28, 0, 7); x.fillStyle = '#fff'; x.fill(); return new THREE.CanvasTexture(c); })();
const pts = [];
for (let i = 0; i < LAND.length; i += 6) {
  const lat = parseInt(LAND.slice(i, i + 3), 36) / 10 - 90, lon = parseInt(LAND.slice(i + 3, i + 6), 36) / 10 - 180;
  const v = ll(lat, lon, R * 1.002); pts.push(v.x, v.y, v.z);
}
const dotGeo = new THREE.BufferGeometry(); dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
const dotMat = new THREE.PointsMaterial({ size: .056, map: dotTex, transparent: true, alphaTest: .4, color: COL.dayDot.clone() });
spin.add(new THREE.Points(dotGeo, dotMat));

const CITY = { JPA: [-7.12, -34.86], VRN: [45.40, 10.89] };
const markers = {};
for (const k in CITY) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(.05, 16, 12), new THREE.MeshBasicMaterial({ color: COL.clay }));
  m.position.copy(ll(...CITY[k], R * 1.01)); spin.add(m); markers[k] = m;
}
const A = ll(...CITY.JPA, 1).normalize(), B = ll(...CITY.VRN, 1).normalize(), qAB = new THREE.Quaternion().setFromUnitVectors(A, B);
const routePts = [];
for (let i = 0; i <= 80; i++) { const t = i / 80; routePts.push(A.clone().applyQuaternion(new THREE.Quaternion().slerp(qAB, t)).multiplyScalar(R * (1.01 + Math.sin(Math.PI * t) * .3))); }
const curve = new THREE.CatmullRomCurve3(routePts);
const routeGeo = new THREE.TubeGeometry(curve, 140, .016, 8, false);
const route = new THREE.Mesh(routeGeo, new THREE.MeshBasicMaterial({ color: COL.clay2 }));
routeGeo.setDrawRange(0, 0); spin.add(route);
// the travelling light
const comet = new THREE.Group(); spin.add(comet);
comet.add(new THREE.Mesh(new THREE.SphereGeometry(.07, 16, 12), new THREE.MeshBasicMaterial({ color: 0xFFE3D2 })));
const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(224,138,98,.9)'); g.addColorStop(1, 'rgba(224,138,98,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false }));
glow.scale.set(.6, .6, 1); comet.add(glow);

/* state driven by scroll */
const S = { x: .5, y: 0, scale: 1.2, lon: -18, lat: 12, idle: 1, dark: 0, route: 0, op: 1, labels: 0 };
function heroPose() { if (isMobile()) Object.assign(S, { x: 0, y: .42, scale: .9 }); else Object.assign(S, { x: .5, y: 0, scale: 1.2 }); }
heroPose();

/* ---------------- PINS FIRST, in page order ---------------- */
// 02 Origins
const ot = gsap.timeline({ scrollTrigger: { trigger: '#origins', start: 'top top', end: () => isMobile() ? '+=280%' : '+=260%', pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
  snap: snapTo([0, .245, .578, .93, 1]) } });   // the three text steps
gsap.set('.o-step', { y: 30 });
ot.to(S, { x: 0, y: () => isMobile() ? .3 : .02, scale: () => isMobile() ? .95 : 1.55, lon: -35, lat: -7, idle: 0, labels: 1, duration: 1.2, ease: 'power2.inOut' }, 0)
  .to('[data-step="0"]', { opacity: 1, y: 0, duration: .5 }, .5)
  .to('[data-step="0"]', { opacity: 0, y: -20, duration: .4 }, 1.6)
  .to(S, { route: 1, lon: 8, lat: 38, duration: 2.2, ease: 'power1.inOut' }, 1.5)
  .to('[data-step="1"]', { opacity: 1, y: 0, duration: .5 }, 2.0)
  .to('[data-step="1"]', { opacity: 0, y: -20, duration: .4 }, 3.4)
  .to('[data-step="2"]', { opacity: 1, y: 0, duration: .5 }, 3.8)
  .to({}, { duration: .8 }, 4.3);

// 04 Career — horizontal on desktop (native swipe on mobile)
const mm = gsap.matchMedia();
mm.add('(min-width: 901px)', () => {
  const track = document.getElementById('track');
  gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: 'none',
    scrollTrigger: { trigger: '#path', start: 'top top', end: () => '+=' + (track.scrollWidth - innerWidth), pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true } });
});

// 05 How I lead — the rider runs the track, principles change at checkpoints
(() => {
  const path = document.getElementById('trackLine'), rider = document.getElementById('rider'), L = path.getTotalLength();
  const view = document.getElementById('bmxView'), svg = document.getElementById('trackSvg');
  const prs = [...document.querySelectorAll('.pr')], dots = [...document.querySelectorAll('.dots i')];
  const CP = [.08, .47, .83];
  const cpG = document.getElementById('checkpoints');
  CP.forEach((f, i) => {
    const p = path.getPointAtLength(f * L);
    cpG.insertAdjacentHTML('beforeend', `<g transform="translate(${p.x} ${p.y + 34})"><circle r="15" fill="#F4F1EA" stroke="#C8643B" stroke-width="2" id="cp${i}"/><text y="4.5" fill="#C8643B">0${i + 1}</text></g>`);
  });
  path.style.strokeDasharray = L; path.style.strokeDashoffset = L;
  let cur = -1;
  const show = k => {
    if (k === cur) return; cur = k;
    prs.forEach((p, i) => gsap.to(p, { autoAlpha: i === k ? 1 : 0, y: i === k ? 0 : (i < k ? -16 : 16), duration: .45, ease: 'power2.out' }));
    dots.forEach((d, i) => d.classList.toggle('on', i <= k));
    CP.forEach((_, i) => document.getElementById('cp' + i).setAttribute('fill', i <= k ? '#C8643B' : '#F4F1EA'));
  };
  const st = { p: 0 };
  const draw = () => {
    const l = st.p * L, a = path.getPointAtLength(l), b = path.getPointAtLength(Math.min(l + 2, L));
    rider.setAttribute('transform', `translate(${a.x} ${a.y}) rotate(${Math.atan2(b.y - a.y, b.x - a.x) / D})`);
    path.style.strokeDashoffset = L - l;
    show(st.p < .4 ? 0 : st.p < .76 ? 1 : 2);
    if (isMobile()) {   // camera follows the rider
      const s = svg.getBoundingClientRect().width / 1200, vw = view.clientWidth;
      const x = gsap.utils.clamp(-(svg.getBoundingClientRect().width - vw), 0, vw * .4 - a.x * s);
      svg.style.transform = `translateX(${x}px)`;
    } else svg.style.transform = '';
  };
  show(0); draw();
  gsap.to(st, { p: 1, ease: 'none', onUpdate: draw,
    scrollTrigger: { trigger: '#lead', start: 'top top', end: () => isMobile() ? '+=300%' : '+=200%', pin: true, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true, onRefresh: draw,
      snap: snapTo([0, .22, .58, .93, 1]) } });   // the three principles
})();

/* ---------------- everything else (after pins, so positions are right) ---------------- */
const box = el => (el = typeof el === 'string' ? document.querySelector(el) : el, el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el);

// nav + progress
const nav = document.getElementById('nav');
ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => {
  document.getElementById('progress').style.transform = `scaleX(${s.progress})`;
  nav.classList.toggle('scrolled', s.scroll() > 40);
}});
document.querySelectorAll('.nav ul a').forEach(a => {
  ScrollTrigger.create({ trigger: box(a.getAttribute('href')), start: 'top 50%', end: 'bottom 50%', onToggle: s => a.classList.toggle('on', s.isActive) });
});

// night mode during the origins scene
ScrollTrigger.create({ trigger: box('#origins'), start: 'top 45%', end: 'bottom 35%',
  onToggle: s => { document.body.classList.toggle('night', s.isActive); gsap.to(S, { dark: s.isActive ? 1 : 0, duration: .6 }); } });

// the globe leaves after the origins
gsap.to(S, { op: 0, scale: () => isMobile() ? .7 : 1.1, labels: 0, ease: 'none',
  scrollTrigger: { trigger: '#numbers', start: 'top 85%', end: 'top 25%', scrub: true } });

// reveals
if (!REDUCED) {
  gsap.from('.hero .w>span', { yPercent: 115, duration: 1.2, ease: 'power4.out', stagger: .08, delay: .15 });
  gsap.to('.hero .rv', { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: .1, delay: .5 });
  gsap.utils.toArray('.split').filter(el => !el.closest('.hero')).forEach(el => gsap.from(el.querySelectorAll('.w>span'), {
    yPercent: 115, duration: 1.1, ease: 'power4.out', stagger: .06, scrollTrigger: { trigger: el, start: 'top 85%' } }));
  gsap.utils.toArray('.rv').filter(el => !el.closest('.hero')).forEach(el => gsap.to(el, {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));
  // mobile career cards: scale-in as they enter
  mm.add('(max-width: 900px)', () => {
    gsap.from('.spec', { scale: .9, opacity: 0, duration: .9, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: '#track', start: 'top 85%' } });
  });
} else gsap.set('.rv', { opacity: 1, y: 0 });

// counters
document.querySelectorAll('[data-count]').forEach(el => {
  const n = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', plus = !el.hasAttribute('data-plain');
  const o = { v: 0 }; el.innerHTML = pre + '0' + suf;
  ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () =>
    gsap.to(o, { v: n, duration: 1.8, ease: 'power2.out', onUpdate: () => el.innerHTML = pre + Math.round(o.v) + suf + (plus ? '<sup>+</sup>' : '') }) });
});

// scope bars grow from the baseline, one after the other
gsap.from('.scopeline i', { scaleY: () => isMobile() ? 1 : 0, scaleX: () => isMobile() ? 0 : 1, duration: 1.1, ease: 'power3.out', stagger: .15, scrollTrigger: { trigger: '.scopeline', start: 'top 85%' } });

// the journey continues — dotted line draws towards the contacts
(() => {
  const p = document.getElementById('journeyLine'), dot = document.getElementById('journeyDot'), L = p.getTotalLength(), st = { k: 0 };
  const draw = () => { const a = p.getPointAtLength(st.k * L); dot.setAttribute('cx', a.x); dot.setAttribute('cy', a.y); document.getElementById('jcr').setAttribute('width', a.x + 10); };
  draw();
  gsap.to(st, { k: 1, ease: 'none', onUpdate: draw, scrollTrigger: { trigger: '#now', start: 'top 80%', end: 'top 10%', scrub: 1 } });
})();

addEventListener('load', () => ScrollTrigger.refresh());
// Keep scroll scenes in sync when the layout changes after load (web fonts, images, panel resizes)
(() => {
  let lastH = 0, t;
  const tr = document.getElementById('track');
  const measure = () => document.querySelector('main').getBoundingClientRect().height + tr.scrollWidth * 1000;
  ScrollTrigger.addEventListener('refresh', () => { lastH = measure(); });
  const later = () => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 150); };
  if (window.ResizeObserver) new ResizeObserver(() => { if (Math.abs(measure() - lastH) > 4) later(); }).observe(document.querySelector('main'));
  if (window.ResizeObserver) new ResizeObserver(() => { if (Math.abs(measure() - lastH) > 4) later(); }).observe(tr);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(later);
})();

/* ---------------- render loop ---------------- */
const KM = 7400; // great-circle João Pessoa → Verona, approx.
const kmEl = document.getElementById('km');
const tags = { JPA: document.getElementById('tagJPA'), VRN: document.getElementById('tagVRN') };
const v = new THREE.Vector3();
let drift = 0, last = performance.now();
function size() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
size();
let lastW = innerWidth;
addEventListener('resize', () => { size(); if (Math.abs(innerWidth - lastW) > 40) { lastW = innerWidth; ScrollTrigger.refresh(); } });
ScrollTrigger.addEventListener('refreshInit', () => { if (scrollY < innerHeight * .5) heroPose(); });

function toScreen(obj, out) {
  obj.getWorldPosition(v); const front = v.clone().sub(root.position).normalize().dot(camera.position.clone().sub(v).normalize());
  v.project(camera); out.x = (v.x * .5 + .5) * innerWidth; out.y = (-v.y * .5 + .5) * innerHeight; out.front = front; return out;
}
function place(el, o, show) {
  el.style.opacity = show && o.front > .15 ? 1 : 0;
  const x = Math.min(o.x + 12, innerWidth - el.offsetWidth - 10);
  el.style.transform = `translate(${x}px,${o.y - 28}px)`;
}

function frame(now) {
  const dt = Math.min((now - last) / 1000, .05); last = now;
  if (!REDUCED) drift += dt * 6 * S.idle;
  const h = Math.tan(camera.fov * D / 2) * camera.position.z, w = h * camera.aspect;
  root.position.set(S.x * w, S.y * h, 0);
  root.scale.setScalar(S.scale);
  tilt.rotation.x = S.lat * D;
  spin.rotation.y = -Math.PI / 2 - (S.lon - drift) * D;
  ballMat.color.copy(COL.dayBall).lerp(COL.nightBall, S.dark);
  dotMat.color.copy(COL.dayDot).lerp(COL.nightDot, S.dark);
  canvas.style.opacity = S.op;
  canvas.style.visibility = S.op < .01 ? 'hidden' : 'visible';

  routeGeo.setDrawRange(0, Math.floor(routeGeo.index.count * S.route / 6) * 6);
  comet.visible = S.route > .005 && S.route < .995;
  if (comet.visible) { comet.position.copy(curve.getPoint(S.route)); glow.scale.setScalar(.5 + Math.sin(now / 160) * .08); }
  markers.JPA.visible = markers.VRN.visible = S.labels > .2;

  const o = {};
  place(tags.JPA, toScreen(markers.JPA, o), S.labels > .5 && S.op > .5);
  place(tags.VRN, toScreen(markers.VRN, o), S.labels > .5 && S.route > .9 && S.op > .5);
  kmEl.textContent = Math.round(KM * S.route).toLocaleString('en-US') + ' km';

  if (S.op > .01) renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
} // end ANIM
