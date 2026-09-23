document.querySelectorAll('.spotlight-name').forEach(name => {
  name.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const box = name.getBoundingClientRect();
    name.style.setProperty('--spot-x', `${event.clientX - box.left}px`);
    name.style.setProperty('--spot-y', `${event.clientY - box.top}px`);
    name.classList.add('is-spotlit');
  });
  name.addEventListener('pointerleave', () => name.classList.remove('is-spotlit'));
});
