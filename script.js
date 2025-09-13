// ===== Rozložení ikon do elipsy =====
const circle = document.getElementById('circle');
const icons = Array.from(circle.querySelectorAll('.icon'));

// přepočet hodnoty (px, %, vh, vw)
function toPx(val, rect, axis = 'width') {
  if (!val) return null;
  let s = String(val).trim().replace(',', '.');

  if (s.endsWith('px')) return parseFloat(s);

  if (s.endsWith('%')) {
    const pct = parseFloat(s) / 100;
    const base = axis === 'height' ? rect.height : rect.width;
    return pct * base;
  }
  if (s.endsWith('vh')) return (parseFloat(s) / 100) * window.innerHeight;
  if (s.endsWith('vw')) return (parseFloat(s) / 100) * window.innerWidth;

  const num = parseFloat(s);
  if (Number.isFinite(num)) {
    const base = axis === 'height' ? rect.height : rect.width;
    return num <= 1 ? num * base : num;
  }
  return null;
}

function layoutEllipse() {
  if (!icons.length) return;

  // fallback grid pro malé mobily – zajišťuje CSS
  if (window.innerWidth < 420) return;

  const rect = circle.getBoundingClientRect();
  const item = icons[0].getBoundingClientRect().width || 0;
  const pad = 8;

  const rxAttr = circle.getAttribute('data-rx');
  const ryAttr = circle.getAttribute('data-ry');
  const start = parseFloat(circle.getAttribute('data-start') ?? -90);
  const rotate = parseFloat(circle.getAttribute('data-rotate') ?? 0);

  const rxRaw = toPx(rxAttr, rect, 'width') ?? rect.width / 2;
  const ryRaw = toPx(ryAttr, rect, 'width') ?? rect.height / 2;

  const rx = Math.max(0, rxRaw - item / 2 - pad);
  const ry = Math.max(0, ryRaw - item / 2 - pad);

  const n = icons.length;
  const a0 = (start * Math.PI) / 180;
  const rot = (rotate * Math.PI) / 180;

  icons.forEach((el, i) => {
    const a = (2 * Math.PI * i) / n + a0;
    const x0 = Math.cos(a) * rx;
    const y0 = Math.sin(a) * ry;

    const x = x0 * Math.cos(rot) - y0 * Math.sin(rot);
    const y = x0 * Math.sin(rot) + y0 * Math.cos(rot);

    el.style.setProperty('--tx', `${x}px`);
    el.style.setProperty('--ty', `${y}px`);
  });
}

window.addEventListener('load', layoutEllipse);
window.addEventListener('resize', () => requestAnimationFrame(layoutEllipse));

// ===== Modal logika =====
const body = document.body;
const backdrop = document.querySelector('.backdrop');
const modal = document.getElementById('modal');
const modalCard = modal.querySelector('.modal-card');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

function openModal(btn) {
  const img = btn.querySelector('img');
  modalImg.src = img.src;
  modalImg.alt = img.alt || btn.dataset.title;
  modalTitle.textContent = btn.dataset.title || '';
  modalDesc.textContent = btn.dataset.desc || '';

  body.classList.add('modal-open');
  backdrop.classList.add('show');
  modal.hidden = false;
}

function closeModal() {
  body.classList.remove('modal-open');
  backdrop.classList.remove('show');
  modal.hidden = true;
  modalImg.removeAttribute('src');
}

// kliknutí na ikony
circle.addEventListener('click', e => {
  const btn = e.target.closest('.icon');
  if (!btn) return;
  openModal(btn);
});

// zavírání modalu
backdrop.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (!modalCard.contains(e.target)) closeModal(); });
window.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
modalImg.addEventListener('click', closeModal);
