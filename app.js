const data = window.PORTFOLIO;
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const dialog = $('#project-dialog');
let sequenceIndex = 0;
const nodes = [];
function element(tag, className, text) { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; }
function media(source, video = false) {
  const el = element(video ? 'video' : 'img');
  el.src = source;
  if (video) { el.controls = true; el.playsInline = true; el.preload = 'metadata'; }
  else el.alt = '作品画面';
  return el;
}
function openProject(project) {
  const category = data.categories.find(c => c.id === project.category);
  $('#dialog-category').textContent = category ? category.english : 'SHOWREEL';
  $('#dialog-title').textContent = project.title || (category ? category.name + ' · 作品待添加' : '个人作品 Showreel');
  $('#dialog-description').textContent = project.description || '作品内容待添加。';
  const container = $('#dialog-media'); container.replaceChildren();
  if (project.video) container.append(media(project.video, true));
  else if (project.image) container.append(media(project.image));
  else container.textContent = '＋  影像 / 视觉占位';
  dialog.showModal();
}
data.projects.forEach((project, index) => {
  const category = data.categories.find(c => c.id === project.category);
  if (!category) return;
  const button = element('button', 'project');
  button.type = 'button'; button.dataset.category = project.category;
  const frame = element('span', 'project-image');
  if (project.image) { const img = media(project.image); img.loading = 'lazy'; frame.append(img); }
  else { frame.append(element('span', 'index', String(index + 1).padStart(2, '0')), element('span', 'empty-cross', '+'), element('span', 'placeholder-label', 'PROJECT PLACEHOLDER')); }
  frame.append(element('span', 'project-arrow', '↗'));
  const meta = element('span', 'project-meta');
  meta.append(element('h3', '', project.title || '作品待添加'), element('span', '', String(index + 1).padStart(2, '0')));
  button.append(frame, meta, element('span', 'project-subtitle', category.name));
  button.addEventListener('click', () => openProject(project));
  $('#projects').append(button); nodes.push(button);
});
function filterProjects(id) {
  $$('.filters button').forEach(button => { const active = button.dataset.filter === id; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  nodes.forEach(node => node.hidden = id !== 'all' && node.dataset.category !== id);
  $('#archive-count').textContent = String(nodes.filter(node => !node.hidden).length).padStart(2, '0') + ' PROJECT SPACES';
}
$$('.filters button').forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
function selectSequence(index) {
  sequenceIndex = (index + data.categories.length) % data.categories.length;
  const category = data.categories[sequenceIndex];
  $('#sequence-name').textContent = category.name; $('#sequence-english').textContent = category.english;
  $('#frame-number').textContent = String(sequenceIndex + 1).padStart(2, '0');
  $$('.sequence-tabs button').forEach((b, i) => { b.setAttribute('aria-selected', String(i === sequenceIndex)); b.tabIndex = i === sequenceIndex ? 0 : -1; });
}
$$('.sequence-tabs button').forEach((b, i) => { b.addEventListener('click', () => selectSequence(i)); b.addEventListener('keydown', event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); selectSequence(event.key === 'Home' ? 0 : event.key === 'End' ? 2 : sequenceIndex + (event.key === 'ArrowLeft' ? -1 : 1)); $$('.sequence-tabs button')[sequenceIndex].focus(); } }); });
$('#previous').addEventListener('click', () => selectSequence(sequenceIndex - 1));
$('#next').addEventListener('click', () => selectSequence(sequenceIndex + 1));
$('#sequence-explore').addEventListener('click', () => { filterProjects(data.categories[sequenceIndex].id); $('#works').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); });
$('#showreel').addEventListener('click', () => openProject({ title: 'SHOWREEL', video: data.showreel, description: data.showreel ? '' : '个人作品集锦待添加。' }));
$$('.dialog-close, .dialog-done').forEach(b => b.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { const rect = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close(); });
dialog.addEventListener('close', () => { const video = dialog.querySelector('video'); if (video) video.pause(); });
function updateNav() { $('.navigation').classList.toggle('scrolled', scrollY > 80); }
window.addEventListener('scroll', updateNav, { passive: true }); updateNav();
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { $$('.navigation nav a').forEach(a => { if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); } }), { rootMargin: '-15% 0px -50% 0px' });
$$('main>section').forEach(section => observer.observe(section));
if (data.bio) $('.about-placeholder').textContent = data.bio;
if (data.email) { const link = element('a', '', data.email); link.href = 'mailto:' + data.email; $('#contact-email').replaceChildren(link); }
if (data.wechat) $('#contact-wechat').textContent = data.wechat;
$('#year').textContent = new Date().getFullYear();
selectSequence(0); filterProjects('all');
