const data = window.PORTFOLIO;
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const dialog = $('#project-dialog');
const lightbox = $('#image-lightbox');
let sequenceIndex = 0;
const nodes = [];
let galleryImages = [], galleryIndex = 0, galleryTitle = '', galleryLayers = [], activeGalleryLayer = 0, galleryChangeToken = 0;
function element(tag, className, text) { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; }
function media(source, video = false) {
  const el = element(video ? 'video' : 'img');
  if (video) { el.controls = true; el.playsInline = true; el.preload = 'none'; }
  else { el.loading = 'lazy'; el.decoding = 'async'; el.draggable = false; el.alt = '作品画面'; }
  el.src = source;
  return el;
}
function updateGallery(index) {
  if (!galleryImages.length) return;
  const nextIndex = (index + galleryImages.length) % galleryImages.length;
  if (nextIndex !== galleryIndex && galleryLayers.length === 2) {
    const token = ++galleryChangeToken;
    const nextLayer = 1 - activeGalleryLayer;
    const image = galleryLayers[nextLayer];
    image.src = galleryImages[nextIndex];
    image.alt = `${galleryTitle}，第 ${nextIndex + 1} 张`;
    image.decode().catch(() => {}).then(() => {
      if (token !== galleryChangeToken) return;
      galleryLayers[activeGalleryLayer].classList.remove('is-active');
      image.classList.add('is-active');
      activeGalleryLayer = nextLayer;
    });
  }
  galleryIndex = nextIndex;
  const count = $('#gallery-count');
  if (count) count.textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(galleryImages.length).padStart(2, '0')}`;
  if (lightbox.open) {
    $('#lightbox-image').src = galleryImages[galleryIndex];
    $('#lightbox-image').alt = `${galleryTitle}，第 ${galleryIndex + 1} 张`;
    $('#lightbox-count').textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
  }
}
function makeGallery(images, title, startIndex = 0) {
  galleryImages = images;
  galleryIndex = (startIndex + images.length) % images.length;
  galleryTitle = title;
  galleryChangeToken++;
  activeGalleryLayer = 0;
  const shell = element('div', 'gallery-shell');
  const enlarge = element('button', 'gallery-enlarge');
  enlarge.type = 'button'; enlarge.setAttribute('aria-label', '放大查看当前图片');
  const picture = media(images[galleryIndex]); picture.className = 'gallery-slide is-active'; picture.loading = 'eager'; picture.alt = title;
  const nextPicture = media(images[galleryIndex]); nextPicture.className = 'gallery-slide'; nextPicture.loading = 'eager'; nextPicture.alt = '';
  galleryLayers = [picture, nextPicture];
  enlarge.append(picture, nextPicture, element('span', 'gallery-zoom', '＋'));
  let swiped = false;
  enlarge.addEventListener('click', () => {
    if (swiped) { swiped = false; return; }
    $('#lightbox-image').src = galleryImages[galleryIndex];
    $('#lightbox-image').alt = `${galleryTitle}，第 ${galleryIndex + 1} 张`;
    $('#lightbox-count').textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
    lightbox.showModal();
  });
  shell.append(enlarge);
  if (images.length > 1) {
    const controls = element('div', 'gallery-controls');
    const prev = element('button', 'gallery-prev'); prev.type = 'button'; prev.setAttribute('aria-label', '上一张图片'); prev.append(element('span', 'line-icon reverse'));
    const next = element('button', 'gallery-next'); next.type = 'button'; next.setAttribute('aria-label', '下一张图片'); next.append(element('span', 'line-icon'));
    prev.addEventListener('click', () => updateGallery(galleryIndex - 1));
    next.addEventListener('click', () => updateGallery(galleryIndex + 1));
    const count = element('span', 'label', `${String(galleryIndex + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`); count.id = 'gallery-count';
    controls.append(prev, count, next); shell.append(controls);
  }
  let startX = 0;
  shell.addEventListener('pointerdown', event => { startX = event.clientX; });
  shell.addEventListener('pointerup', event => { if (Math.abs(event.clientX - startX) > 45) { swiped = true; updateGallery(galleryIndex + (event.clientX < startX ? 1 : -1)); } });
  return shell;
}
function openProject(project, startIndex = 0) {
  if (lightbox.open) lightbox.close();
  galleryChangeToken++;
  galleryImages = []; galleryLayers = [];
  const previousVideo = dialog.querySelector('video');
  if (previousVideo) { previousVideo.pause(); previousVideo.removeAttribute('src'); previousVideo.load(); }
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
  } else if (project.gallery?.length) {
    container.append(makeGallery(project.gallery, project.title, startIndex));
    updateGallery(startIndex);
  } else container.textContent = '影像待添加';

  const shots = project.video ? (project.frames || []) : [];
  const grid = $('#shots-grid'); grid.replaceChildren();
  $('.detail-shots').hidden = shots.length === 0 && !project.gallery?.length;
  const stillName = project.category === 'interview' ? '采访画面' : project.category === 'short' ? '影像片段' : '交互画面';
  $('#detail-shots-label').textContent = `${project.category === 'interview' ? 'INTERVIEW STILLS' : project.category === 'short' ? 'MOTION STILLS' : 'SCREEN VIEWS'} / ${stillName}`;
  $('#detail-shots-count').textContent = String(shots.length).padStart(2, '0') + ' VIEWS';
  shots.forEach((source, index) => {
    const figure = element('figure', 'shot');
    const shot = media(source); shot.alt = `${project.title} · ${stillName} ${index + 1}`;
    const caption = project.frameTitles?.[index] || `${stillName} ${String(index + 1).padStart(2, '0')}`;
    figure.append(shot, element('figcaption', '', caption)); grid.append(figure);
  });
  if (project.video && project.gallery?.length) {
    const gallerySection = element('div', 'h5-gallery');
    gallerySection.append(makeGallery(project.gallery, project.title));
    grid.append(gallerySection);
    $('#detail-shots-count').textContent = `${shots.length} + ${project.gallery.length} VIEWS`;
  }
  $('.detail-shots').hidden = !shots.length && !(project.video && project.gallery?.length);

  const related = category ? data.projects.filter(item => item.category === project.category) : [];
  $('#detail-related').hidden = related.length === 0;
  $('#related-label').textContent = `${category?.english || 'MORE WORKS'} / 同类作品`;
  $('#related-count').textContent = String(related.length).padStart(2, '0') + ' WORKS';
  const relatedGrid = $('#related-grid'); relatedGrid.replaceChildren();
  related.forEach(item => {
    const button = element('button', 'related-item'); button.type = 'button';
    button.setAttribute('aria-label', `查看${item.title}`);
    if (item.id === project.id) button.setAttribute('aria-current', 'true');
    if (item.image) { const image = media(item.image); image.alt = ''; button.append(image); }
    button.append(element('span', '', item.title));
    button.addEventListener('click', () => openProject(item)); relatedGrid.append(button);
  });
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}
const galleryPreviews = new Map();
const galleryPreviewObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  const state = galleryPreviews.get(entry.target);
  if (!state) return;
  if (!entry.isIntersecting || document.hidden) { clearInterval(state.timer); state.timer = null; return; }
  if (state.timer) return;
  state.timer = setInterval(() => {
    const nextIndex = (state.index + 1) % state.images.length;
    const nextLayer = 1 - state.activeLayer;
    const image = state.layers[nextLayer];
    image.src = state.images[nextIndex];
    image.decode().catch(() => {}).then(() => {
      if (!state.timer) return;
      state.layers[state.activeLayer].classList.remove('is-active');
      image.classList.add('is-active');
      state.activeLayer = nextLayer;
      state.index = nextIndex;
    });
  }, 2800);
}), { rootMargin: '160px 0px 160px 0px', threshold: .01 });
data.projects.forEach((project, index) => {
  const category = data.categories.find(c => c.id === project.category);
  if (!category) return;
  const button = element('button', 'project');
  button.type = 'button'; button.dataset.category = project.category; button.dataset.id = project.id;
  button.style.setProperty('--media-ratio', project.aspect || 1.7778);
  button.dataset.orientation = project.aspect < .95 ? 'portrait' : 'landscape';
  const frame = element('span', 'project-image');
  if (project.image) { const img = media(project.image); if (index < 5) img.loading = 'eager'; img.alt = `${project.title}封面`; if (project.kind === 'gallery' && project.gallery?.length > 1) img.classList.add('is-active'); frame.append(img); }
  if (project.hoverImage) { const hover = media(project.hoverImage); hover.classList.add('project-hover-image'); hover.alt = ''; frame.append(hover); }
  if (project.kind === 'gallery' && project.gallery?.length > 1) {
    frame.classList.add('gallery-preview');
    galleryPreviews.set(button, { images: project.gallery, layers: [...frame.querySelectorAll('img')], index: Math.max(0, project.gallery.indexOf(project.image)), activeLayer: 0, timer: null });
    galleryPreviewObserver.observe(button);
  }
  frame.append(element('span', 'project-arrow line-icon diagonal'));
  const meta = element('span', 'project-meta');
  meta.append(element('h3', '', project.title || '作品待添加'), element('span', '', String(index + 1).padStart(2, '0')));
  button.append(frame, meta, element('span', 'project-subtitle', category.name + (project.duration ? ' · ' + project.duration : '')));
  button.addEventListener('click', () => openProject(project, galleryPreviews.get(button)?.index || 0));
  $('#projects').append(button); nodes.push(button);
});
document.addEventListener('visibilitychange', () => galleryPreviews.forEach((state, button) => {
  if (document.hidden) { clearInterval(state.timer); state.timer = null; }
  else { galleryPreviewObserver.unobserve(button); galleryPreviewObserver.observe(button); }
}));
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
const featuredIds = ['interview-04', 'short-01', 'design-ip'];
const sequenceTrack = $('#sequence-panels');
data.categories.forEach((category, index) => {
  const project = data.projects.find(item => item.id === featuredIds[index]);
  const slide = element('article', 'sequence-slide');
  if (index === 2) slide.classList.add('is-design');
  const editorial = element('div', 'sequence-editorial');
  editorial.append(element('span', 'sequence-kicker', `LUO HAO / ${String(index + 1).padStart(2, '0')}`));
  const title = element('h2', '', category.name);
  editorial.append(title, element('span', 'sequence-english', category.english));
  const visual = element('div', 'sequence-visual');
  if (project?.image) {
    const image = media(index === 2 ? 'assets/works/design-ip-04.webp' : project.image);
    image.className = 'sequence-image'; image.loading = 'eager'; image.alt = '';
    visual.append(image);
  }
  slide.append(editorial, visual);
  sequenceTrack.append(slide);
});
let renderedSequenceIndex = -1;
function renderSequence(progress) {
  sequenceIndex = Math.round(Math.min(2, Math.max(0, progress)));
  if (sequenceIndex === renderedSequenceIndex) return;
  renderedSequenceIndex = sequenceIndex;
  sequenceTrack.style.transform = `translate3d(${-sequenceIndex * 100 / 3}%,0,0)`;
  $('#sequence-name').textContent = data.categories[sequenceIndex].name;
  $('#sequence-current').textContent = String(sequenceIndex + 1).padStart(2, '0');
  $$('.sequence-tabs button').forEach((button, index) => {
    button.setAttribute('aria-selected', String(index === sequenceIndex));
    button.tabIndex = index === sequenceIndex ? 0 : -1;
  });
}
function goToSequence(index) {
  const target = Math.min(2, Math.max(0, index));
  renderSequence(target);
  window.scrollTo({ top: sequence.offsetTop + (sequence.offsetHeight - innerHeight) * (target / 2), behavior: 'instant' });
}
$$('.sequence-tabs button').forEach((button, index) => {
  button.addEventListener('click', () => goToSequence(index));
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : Math.min(2, Math.max(0, sequenceIndex + (event.key === 'ArrowLeft' ? -1 : 1)));
    goToSequence(target); $$('.sequence-tabs button')[target].focus();
  });
});
$('#previous').addEventListener('click', () => goToSequence(sequenceIndex - 1));
$('#next').addEventListener('click', () => goToSequence(sequenceIndex + 1));
$('#sequence-explore').addEventListener('click', () => { filterProjects(data.categories[sequenceIndex].id); $('#works').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); });
$('#showreel').addEventListener('click', () => openProject({ title: 'SHOWREEL', kind: 'video', video: data.showreel, frames: [] }));
$$('.dialog-close, .dialog-done').forEach(b => b.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { const rect = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close(); });
dialog.addEventListener('close', () => { const video = dialog.querySelector('video'); if (video) { video.pause(); video.removeAttribute('src'); video.load(); } $('#dialog-media').replaceChildren(); });
$('.lightbox-close').addEventListener('click', () => lightbox.close());
$('.lightbox-prev').addEventListener('click', () => updateGallery(galleryIndex - 1));
$('.lightbox-next').addEventListener('click', () => updateGallery(galleryIndex + 1));
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
let lightboxStartX = 0;
lightbox.addEventListener('pointerdown', event => { lightboxStartX = event.clientX; });
lightbox.addEventListener('pointerup', event => {
  if (Math.abs(event.clientX - lightboxStartX) > 45) updateGallery(galleryIndex + (event.clientX < lightboxStartX ? 1 : -1));
});
document.addEventListener('keydown', event => {
  if (!lightbox.open && !dialog.open) return;
  if (event.key === 'ArrowLeft') updateGallery(galleryIndex - 1);
  if (event.key === 'ArrowRight') updateGallery(galleryIndex + 1);
});
function updateNav() { $('.navigation').classList.toggle('scrolled', scrollY > 80); }
const progressLine = $('.page-progress-line');
const progressDot = $('.page-progress i');
const heroTitle = $('#hero-title');
const heroOutline = $('.outline');
const sequence = $('#sequence');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let targetHeroY = 0, currentHeroY = 0, heroFrame = 0, scrollFrame = 0;
let sequenceTop = 0, sequenceTravel = 1, progressWidth = 1;
function measureScrollGeometry() {
  sequenceTop = sequence.offsetTop;
  sequenceTravel = Math.max(1, sequence.offsetHeight - innerHeight);
  progressWidth = $('.page-progress').clientWidth;
}
function updateScrollState() {
  const y = scrollY;
  const viewport = innerHeight;
  const max = document.documentElement.scrollHeight - innerHeight;
  const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
  const sequencePosition = Math.min(2, Math.max(0, (y - sequenceTop) / sequenceTravel * 2));
  updateNav();
  progressLine.style.transform = `scaleX(${progress})`;
  progressDot.style.transform = `translate3d(${(progressWidth * progress).toFixed(2)}px,-50%,0) translateX(-50%)`;
  renderSequence(sequencePosition);
  targetHeroY = Math.min(y, viewport) * -.15;
  if (!heroFrame && (y < viewport * 1.5 || Math.abs(targetHeroY - currentHeroY) > .25)) heroFrame = requestAnimationFrame(animateHero);
}
function animateHero() {
  heroFrame = 0;
  currentHeroY += (targetHeroY - currentHeroY) * (reducedMotion.matches ? 1 : .075);
  if (Math.abs(targetHeroY - currentHeroY) < .25) currentHeroY = targetHeroY;
  heroTitle.style.transform = `translate3d(0,${currentHeroY}px,0)`;
  heroOutline.style.transform = `translate3d(0,${currentHeroY * .55}px,0)`;
  if (currentHeroY !== targetHeroY) heroFrame = requestAnimationFrame(animateHero);
}
function scheduleScrollState() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; updateScrollState(); });
}
window.addEventListener('scroll', scheduleScrollState, { passive: true });
let sequenceWheelTimer;
let sequenceWheelLocked = false;
window.addEventListener('wheel', event => {
  if (event.ctrlKey || document.body.classList.contains('intro-active') || dialog.open || lightbox.open) return;
  if (Math.abs(event.deltaY) < 3 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
  const y = scrollY;
  if (y < sequenceTop - 2 || y > sequenceTop + sequenceTravel + 2) return;
  if (sequenceWheelLocked) {
    event.preventDefault();
    clearTimeout(sequenceWheelTimer);
    sequenceWheelTimer = setTimeout(() => { sequenceWheelLocked = false; }, 240);
    return;
  }
  const direction = Math.sign(event.deltaY);
  const current = Math.round((y - sequenceTop) / sequenceTravel * 2);
  if ((current === 0 && direction < 0) || (current === 2 && direction > 0)) return;
  event.preventDefault();
  sequenceWheelLocked = true;
  goToSequence(current + direction);
  sequenceWheelTimer = setTimeout(() => { sequenceWheelLocked = false; }, 240);
}, { passive: false });
function snapSequence() {
  if (document.body.classList.contains('intro-active')) return;
  const y = scrollY;
  if (y < sequenceTop - 2 || y > sequenceTop + sequenceTravel + 2) return;
  const index = Math.round((y - sequenceTop) / sequenceTravel * 2);
  const target = sequenceTop + sequenceTravel * index / 2;
  if (Math.abs(target - y) < 3) return;
  window.scrollTo({ top: target, behavior: 'instant' });
}
if ('onscrollend' in window) window.addEventListener('scrollend', snapSequence);
else {
  let snapTimer;
  window.addEventListener('scroll', () => { clearTimeout(snapTimer); snapTimer = setTimeout(snapSequence, 160); }, { passive: true });
}
window.addEventListener('resize', () => { measureScrollGeometry(); scheduleScrollState(); requestAnimationFrame(layoutProjects); }, { passive: true });
measureScrollGeometry(); updateScrollState();
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
filterProjects('all');
