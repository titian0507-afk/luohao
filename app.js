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
  $('.detail-overline').textContent = project.kind === 'gallery' ? 'VISUAL PROJECT / 作品标题' : 'VIDEO TITLE / 视频标题';
  const container = $('#dialog-media'); container.replaceChildren();
  container.classList.toggle('is-portrait', Boolean(project.video && project.portrait));
  container.classList.toggle('is-gallery', project.kind === 'gallery');
  if (project.video) {
    const player = media(project.video, true);
    if (project.image) player.poster = project.image;
    container.append(player);
  } else if (project.image) { const artwork = media(project.image); artwork.alt = project.title; container.append(artwork); }
  else container.textContent = '影像待添加';

  const shots = [
    ...(project.video ? (project.frames || []).map((source, index) => ({ source, kind: 'frame', index })) : []),
    ...(project.gallery || []).filter(source => project.video || source !== project.image).map((source, index) => ({ source, kind: 'visual', index }))
  ];
  const grid = $('#shots-grid'); grid.replaceChildren();
  $('.detail-shots').hidden = shots.length === 0;
  const stillName = project.category === 'interview' ? '采访画面' : project.category === 'short' ? '影像片段' : project.video ? '交互画面' : '设计画面';
  $('#detail-shots-label').textContent = `${project.category === 'interview' ? 'INTERVIEW STILLS' : project.category === 'short' ? 'MOTION STILLS' : project.video ? 'SCREEN VIEWS' : 'VISUAL STUDY'} / ${stillName}`;
  $('#detail-shots-count').textContent = String(shots.length).padStart(2, '0') + ' VIEWS';
  shots.forEach(({ source, kind, index }) => {
    const figure = element('figure', 'shot');
    const shot = media(source);
    const label = kind === 'visual' ? '设计画面' : stillName;
    shot.alt = `${project.title} · ${label} ${index + 1}`;
    const caption = kind === 'frame' && project.frameTitles?.[index] || `${label} ${String(index + 1).padStart(2, '0')}`;
    figure.append(shot, element('figcaption', '', caption));
    grid.append(figure);
  });
  dialog.showModal();
}
data.projects.forEach((project, index) => {
  const category = data.categories.find(c => c.id === project.category);
  if (!category) return;
  const button = element('button', 'project');
  button.type = 'button'; button.dataset.category = project.category; button.dataset.id = project.id;
  button.style.setProperty('--media-ratio', project.aspect || 1.7778);
  button.dataset.orientation = project.aspect < .95 ? 'portrait' : 'landscape';
  const frame = element('span', 'project-image');
  if (project.image) { const img = media(project.image); if (index < 5) img.loading = 'eager'; img.alt = `${project.title}封面`; frame.append(img); }
  if (project.hoverImage) { const hover = media(project.hoverImage); hover.classList.add('project-hover-image'); hover.alt = ''; frame.append(hover); }
  frame.append(element('span', 'project-arrow line-icon diagonal'));
  const meta = element('span', 'project-meta');
  meta.append(element('h3', '', project.title || '作品待添加'), element('span', '', String(index + 1).padStart(2, '0')));
  button.append(frame, meta, element('span', 'project-subtitle', category.name + (project.duration ? ' · ' + project.duration : '')));
  button.addEventListener('click', () => openProject(project));
  $('#projects').append(button); nodes.push(button);
});
function filterProjects(id) {
  $$('.filters button').forEach(button => { const active = button.dataset.filter === id; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  nodes.forEach(node => node.hidden = id !== 'all' && node.dataset.category !== id);
  $('#archive-count').textContent = String(nodes.filter(node => !node.hidden).length).padStart(2, '0') + ' WORKS';
  requestAnimationFrame(layoutProjects);
}
function layoutProjects() {
  const container = $('#projects');
  const source = nodes.filter(node => !node.hidden);
  const width = container.clientWidth;
  const columns = width < 900 ? 2 : 3;
  const visible = [];
  if (columns === 2) {
    for (const category of data.categories) {
      const group = source.filter(node => node.dataset.category === category.id);
      while (group.length) {
        const node = group.shift();
        visible.push(node);
        if (Number(node.style.getPropertyValue('--media-ratio')) < 1.12 && group.length && Number(group[0].style.getPropertyValue('--media-ratio')) > 1.12) {
          const partner = group.findIndex(item => Number(item.style.getPropertyValue('--media-ratio')) < 1.12);
          if (partner >= 0 && partner < 5) visible.push(group.splice(partner, 1)[0]);
        }
      }
    }
  } else visible.push(...source);
  const gap = width < 600 ? 14 : 26;
  const colWidth = (width - gap * (columns - 1)) / columns;
  const heights = Array(columns).fill(0);
  if (columns === 2) heights[1] = 52;
  visible.forEach((node, index) => {
    const aspect = Number(node.style.getPropertyValue('--media-ratio')) || 1.7778;
    const span = aspect > 1.12 ? 2 : 1;
    let bestColumn = 0, bestTop = Infinity;
    for (let column = 0; column <= columns - span; column++) {
      const top = Math.max(...heights.slice(column, column + span));
      if (top < bestTop) { bestTop = top; bestColumn = column; }
    }
    node.style.width = `${colWidth * span + gap * (span - 1)}px`;
    node.style.left = `${bestColumn * (colWidth + gap)}px`;
    node.style.top = `${bestTop}px`;
    const nextHeight = bestTop + node.getBoundingClientRect().height + (width < 600 ? 32 : 60);
    for (let column = bestColumn; column < bestColumn + span; column++) heights[column] = nextHeight;
  });
  container.style.height = `${Math.max(0, ...heights) - (visible.length ? (width < 600 ? 32 : 60) : 0)}px`;
}
$$('.filters button').forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
const stage = $('.sequence-stage');
const stageVisuals = [...stage.querySelectorAll('.stage-visual')];
let activeVisual = -1, activeImage = '';
function selectSequence(index) {
  sequenceIndex = (index + data.categories.length) % data.categories.length;
  const category = data.categories[sequenceIndex];
  $('#sequence-name').textContent = category.name; $('#sequence-english').textContent = category.english;
  $('#frame-number').textContent = String(sequenceIndex + 1).padStart(2, '0');
  $('#sequence-current').textContent = String(sequenceIndex + 1).padStart(2, '0');
  const featuredTitles = { interview: '杭城妈妈会客厅第一期', short: '豪士面包', design: '长白山 IP 设计：白参参' };
  const featured = data.projects.find(project => project.category === category.id && project.title === featuredTitles[category.id]) ||
                   data.projects.find(project => project.category === category.id && project.image);
  if (featured?.image && featured.image !== activeImage) {
    const next = (activeVisual + 1) % stageVisuals.length;
    stageVisuals[next].style.backgroundImage = `url("${featured.image}")`;
    stageVisuals[next].classList.add('is-active');
    if (activeVisual >= 0) stageVisuals[activeVisual].classList.remove('is-active');
    activeVisual = next;
    activeImage = featured.image;
  }
  stage.classList.toggle('has-media', Boolean(featured));
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
  const entering = Math.min(1, Math.max(0, (innerHeight - rect.top) / (innerHeight * .9)));
  stage.style.setProperty('--stage-grow', entering.toFixed(3));
  if (travel > 0 && rect.top <= 0 && rect.bottom >= innerHeight) {
    const local = Math.min(1, Math.max(0, -rect.top / travel));
    stage.style.setProperty('--stage-motion', ((local * 3) % 1).toFixed(3));
    const frame = Math.min(2, Math.floor(local * 3));
    if (frame !== lastForcedFrame) {
      lastForcedFrame = frame;
      selectSequence(frame);
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
window.addEventListener('resize', () => requestAnimationFrame(layoutProjects), { passive: true });
updateScrollState(); animateHero();
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { $$('.navigation nav a').forEach(a => { if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); } }), { rootMargin: '-15% 0px -50% 0px' });
$$('main>section').forEach(section => observer.observe(section));
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
}), { threshold: .08, rootMargin: '0px 0px 80px 0px' });
$$('.archive-heading,.archive-bar,.project,.about-layout,.contact-heading,.contact-grid').forEach(node => {
  node.classList.add('grow-in'); revealObserver.observe(node);
});
if (data.email) $('#contact-email').textContent = data.email;
if (data.wechat) $('#contact-wechat').textContent = data.wechat;
$$('.copy-card').forEach(button => button.addEventListener('click', async () => {
  const value = button.dataset.copy === 'email' ? data.email : data.wechat;
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value);
    else {
      const field = document.createElement('textarea'); field.value = value;
      document.body.append(field); field.select();
      if (!document.execCommand('copy')) throw new Error('copy failed');
      field.remove();
    }
    button.querySelector('.copy-feedback').textContent = '已复制';
    setTimeout(() => { button.querySelector('.copy-feedback').textContent = '点击复制'; }, 2200);
  } catch { button.querySelector('.copy-feedback').textContent = '复制失败，请手动复制'; }
}));
$('#year').textContent = new Date().getFullYear();
selectSequence(0); filterProjects('all');
