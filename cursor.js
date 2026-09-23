const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const cursorRings = [...document.querySelectorAll('.site-cursor')];
const ambientGrid = document.querySelector('.ambient-grid');
let pointerX = -100, pointerY = -100, cursorFrame = 0;

function syncCursorMode() {
  document.body.classList.toggle('custom-cursor', finePointer.matches);
}
syncCursorMode();
finePointer.addEventListener('change', syncCursorMode);

document.addEventListener('pointermove', event => {
  if (!finePointer.matches || event.pointerType !== 'mouse') return;
  pointerX = event.clientX;
  pointerY = event.clientY;
  const overControl = Boolean(event.target.closest('a[href],button,[role="button"]'));
  cursorRings.forEach(ring => ring.classList.toggle('over-control', overControl));
  if (cursorFrame) return;
  cursorFrame = requestAnimationFrame(() => {
    cursorRings.forEach(ring => {
      ring.style.transform = `translate3d(${pointerX}px,${pointerY}px,0) translate(-50%,-50%)`;
    });
    if (ambientGrid) {
      ambientGrid.style.setProperty('--grid-x', `${pointerX}px`);
      ambientGrid.style.setProperty('--grid-y', `${pointerY}px`);
      ambientGrid.classList.add('is-visible');
    }
    cursorFrame = 0;
  });
}, { passive: true });

document.addEventListener('pointerdown', () => cursorRings.forEach(ring => ring.classList.add('is-down')));
document.addEventListener('pointerup', () => cursorRings.forEach(ring => ring.classList.remove('is-down')));
document.documentElement.addEventListener('mouseleave', () => {
  cursorRings.forEach(ring => ring.classList.add('is-hidden'));
  ambientGrid?.classList.remove('is-visible');
});
document.documentElement.addEventListener('mouseenter', () => cursorRings.forEach(ring => ring.classList.remove('is-hidden')));
