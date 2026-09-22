const data = window.PORTFOLIO;
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const dialog = $('#project-dialog');
let sequenceIndex = 0;
const nodes = [];
function element(tag, className, text) { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; }
function media(source, video = false) {
  const el = element(video ? 'video' : 'img');
  if (video) { el.controls = true; el.playsInline = true; el.preload = 'none'; }
  else { el.loading = 'lazy'; el.decoding = 'async'; el.draggable = false; el.alt = '作品画面'; }
  el.src = source;
  return el;
}
function openProject(project) {
  const category = data.categories.find(c => c.id === project.category);
  $('#dialog-category').textContent = category ? category.english : 'SHOWREEL';
  $('#dialog-title').textContent = project.title || 'SHOWREEL';
  $('.detail-overline').textContent = project.kind === 'gallery' ? 'VISUAL PROJECT / 作品标题' : project.kind === 'document' ? 'SCRIPT TITLE / 脚本标题' : 'VIDEO TITLE / 视频标题';
  const container = $('#dialog-media'); container.replaceChildren();
  container.classList.toggle('is-portrait', Boolean(project.video && project.portrait));
  container.classList.toggle('is-gallery', project.kind === 'gallery');
  if (project.video) {
    const player = media(project.video, true);
    if (project.image) player.poster = project.image;
    container.append(player);
  } else if (project.image) { const artwork = media(project.image); artwork.alt = project.title; container.append(artwork); }
  else container.textContent = project.document ? '分镜脚本' : '影像待添加';

  const shots = [
    ...(project.video ? (project.frames || []).map((source, index) => ({ source, kind: 'frame', index })) : []),
    ...(project.gallery || []).filter(source => project.video || source !== project.image).map((source, index) => ({ source, kind: 'visual', index }))
  ];
  const grid = $('#shots-grid'); grid.replaceChildren();
  $('.detail-shots').hidden = shots.length === 0;
  $('#detail-shots-label').textContent = project.video && project.gallery?.length ? 'KEY FRAMES & VISUALS / 关键分镜与画面' : project.video ? 'KEY FRAMES / 关键分镜' : 'VISUALS / 画面';
  $('#detail-shots-count').textContent = String(shots.length).padStart(2, '0') + (project.video ? ' FRAMES' : ' VISUALS');
  shots.forEach(({ source, kind, index }) => {
    const figure = element('figure', 'shot');
    const shot = media(source);
    const label = kind === 'frame' ? '关键分镜' : '画面';
    shot.alt = `${project.title} · ${label} ${index + 1}`;
    const caption = kind === 'frame' && project.frameTitles?.[index] || `${label} ${String(index + 1).padStart(2, '0')}`;
    figure.append(shot, element('figcaption', '', caption));
    grid.append(figure);
  });
  const documentLink = $('#dialog-document');
  documentLink.hidden = !project.document;
  if (project.document) documentLink.href = project.document;
  dialog.showModal();
}
data.projects.forEach((project, index) => {
  const category = data.categories.find(c => c.id === project.category);
  if (!category) return;
  const button = element('button', 'project');
  button.type = 'button'; button.dataset.category = project.category; button.dataset.id = project.id;
  const frame = element('span', 'project-image');
  if (project.image) { const img = media(project.image); img.alt = `${project.title}封面`; frame.append(img); }
  else if (project.kind === 'document') {
    frame.classList.add('script-image');
    frame.append(element('span', 'index', String(index + 1).padStart(2, '0')),
                 element('span', 'script-mark', '脚本'),
                 element('span', 'placeholder-label', 'SCRIPT / STORYBOARD'));
  } else { frame.append(element('span', 'index', String(index + 1).padStart(2, '0')), element('span', 'empty-cross', '+'), element('span', 'placeholder-label', 'PROJECT PLACEHOLDER')); }
  if (project.video) frame.append(element('span', 'play-glyph', '▶'));
  frame.append(element('span', 'project-arrow', '↗'));
  const meta = element('span', 'project-meta');
  meta.append(element('h3', '', project.title || '作品待添加'), element('span', '', String(index + 1).padStart(2, '0')));
  button.append(frame, meta, element('span', 'project-subtitle', category.name + (project.duration ? ' · ' + project.duration : '')));
  button.addEventListener('click', () => openProject(project));
  $('#projects').append(button); nodes.push(button);
});
function filterProjects(id) {
  $$('.filters button').forEach(button => { const active = button.dataset.filter === id; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  nodes.forEach(node => node.hidden = id !== 'all' && node.dataset.category !== id);
  nodes.filter(node => !node.hidden).forEach((node, index) => {
    node.classList.remove('layout-0', 'layout-1', 'layout-2', 'layout-3', 'layout-4');
    node.classList.add('layout-' + (index % 5));
  });
  $('#archive-count').textContent = String(nodes.filter(node => !node.hidden).length).padStart(2, '0') + ' PROJECT SPACES';
}
$$('.filters button').forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
function selectSequence(index) {
  sequenceIndex = (index + data.categories.length) % data.categories.length;
  const category = data.categories[sequenceIndex];
  $('#sequence-name').textContent = category.name; $('#sequence-english').textContent = category.english;
  $('#frame-number').textContent = String(sequenceIndex + 1).padStart(2, '0');
  $('#sequence-current').textContent = String(sequenceIndex + 1).padStart(2, '0');
  const featuredTitles = { interview: '杭城妈妈会客厅第一期', short: '豪士面包', design: '长白山 IP 设计：白参参' };
  const featured = data.projects.find(project => project.category === category.id && project.title === featuredTitles[category.id]) ||
                   data.projects.find(project => project.category === category.id && project.image);
  $('.sequence-stage').style.backgroundImage = featured ? `linear-gradient(90deg,rgba(0,0,0,.68),rgba(0,0,0,.3)),url("${featured.image}")` : '';
  $('.sequence-stage').classList.toggle('has-media', Boolean(featured));
  $$('.sequence-tabs button').forEach((b, i) => { b.setAttribute('aria-selected', String(i === sequenceIndex)); b.tabIndex = i === sequenceIndex ? 0 : -1; });
}
$$('.sequence-tabs button').forEach((b, i) => { b.addEventListener('click', () => selectSequence(i)); b.addEventListener('keydown', event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); selectSequence(event.key === 'Home' ? 0 : event.key === 'End' ? 2 : sequenceIndex + (event.key === 'ArrowLeft' ? -1 : 1)); $$('.sequence-tabs button')[sequenceIndex].focus(); } }); });
$('#previous').addEventListener('click', () => selectSequence(sequenceIndex - 1));
$('#next').addEventListener('click', () => selectSequence(sequenceIndex + 1));
$('#sequence-explore').addEventListener('click', () => { filterProjects(data.categories[sequenceIndex].id); $('#works').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); });
$('#showreel').addEventListener('click', () => openProject({ title: 'SHOWREEL', kind: 'video', video: data.showreel, frames: [] }));
$$('.dialog-close, .dialog-done').forEach(b => b.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { const rect = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close(); });
dialog.addEventListener('close', () => { const video = dialog.querySelector('video'); if (video) { video.pause(); video.removeAttribute('src'); video.load(); } $('#dialog-media').replaceChildren(); });
function updateNav() { $('.navigation').classList.toggle('scrolled', scrollY > 80); }
const progressLine = $('.page-progress-line');
const progressDot = $('.page-progress i');
const heroTitle = $('#hero-title');
const heroOutline = $('.outline');
const sequence = $('#sequence');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let targetHeroY = 0, currentHeroY = 0, lastForcedFrame = -1;
function updateScrollState() {
  updateNav();
  const max = document.documentElement.scrollHeight - innerHeight;
  const progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  progressLine.style.transform = `scaleX(${progress})`;
  progressDot.style.left = `${progress * 100}%`;
  targetHeroY = Math.min(scrollY, innerHeight) * -.15;
  const rect = sequence.getBoundingClientRect();
  const travel = sequence.offsetHeight - innerHeight;
  if (travel > 0 && rect.top <= 0 && rect.bottom >= innerHeight) {
    const local = Math.min(1, Math.max(0, -rect.top / travel));
    const frame = Math.min(2, Math.floor(local * 3));
    if (frame !== lastForcedFrame) {
      lastForcedFrame = frame;
      $('.sequence-stage').classList.add('changing');
      setTimeout(() => { selectSequence(frame); $('.sequence-stage').classList.remove('changing'); }, reducedMotion.matches ? 0 : 180);
    }
  }
}
function animateHero() {
  currentHeroY += (targetHeroY - currentHeroY) * (reducedMotion.matches ? 1 : .075);
  heroTitle.style.transform = `translate3d(0,${currentHeroY}px,0)`;
  heroOutline.style.transform = `translate3d(0,${currentHeroY * .55}px,0)`;
  requestAnimationFrame(animateHero);
}
window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('resize', updateScrollState, { passive: true });
updateScrollState(); animateHero();
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { $$('.navigation nav a').forEach(a => { if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); } }), { rootMargin: '-15% 0px -50% 0px' });
$$('main>section').forEach(section => observer.observe(section));
if (data.bio) $('.about-placeholder').textContent = data.bio;
if (data.email) { const link = element('a', '', data.email); link.href = 'mailto:' + data.email; $('#contact-email').replaceChildren(link); }
if (data.wechat) $('#contact-wechat').textContent = data.wechat;
$('#year').textContent = new Date().getFullYear();
selectSequence(0); filterProjects('all');
