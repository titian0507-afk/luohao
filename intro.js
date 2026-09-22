const introScreen = document.querySelector('#intro-screen');
const introVideo = document.querySelector('#intro-video');
const introSound = document.querySelector('.intro-sound');
const introSkip = document.querySelector('.intro-skip');
const introTime = document.querySelector('#intro-time');
const introTimeline = document.querySelector('.intro-timeline span');
let introClosed = false;

// Keep the site out of the keyboard order until the opening film finishes.
const siteSections = [document.querySelector('.skip-link'), document.querySelector('.navigation'), document.querySelector('main'), document.querySelector('footer')];
siteSections.forEach(section => { if (section) section.inert = true; });

function formatIntroTime(seconds) {
  const total = Math.max(0, Math.floor(seconds || 0));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function updateIntroProgress() {
  if (!Number.isFinite(introVideo.duration) || introVideo.duration <= 0) return;
  introTime.textContent = `${formatIntroTime(introVideo.currentTime)} / ${formatIntroTime(introVideo.duration)}`;
  introTimeline.style.transform = `scaleX(${Math.min(1, introVideo.currentTime / introVideo.duration)})`;
}

function finishIntro() {
  if (introClosed) return;
  introClosed = true;
  introVideo.pause();
  introScreen.classList.add('is-leaving');

  const removeIntro = () => {
    introScreen.remove();
    introVideo.removeAttribute('src');
    introVideo.load();
    document.body.classList.remove('intro-active');
    siteSections.forEach(section => { if (section) section.inert = false; });
  };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) removeIntro();
  else {
    introScreen.addEventListener('transitionend', removeIntro, { once: true });
    setTimeout(() => { if (introScreen.isConnected) removeIntro(); }, 1000);
  }
}

introSound.addEventListener('click', () => {
  introVideo.muted = !introVideo.muted;
  const soundOn = !introVideo.muted;
  introSound.setAttribute('aria-pressed', String(soundOn));
  introSound.setAttribute('aria-label', soundOn ? '静音' : '开启声音');
  introSound.querySelector('.sound-label').textContent = soundOn ? 'SOUND ON' : 'SOUND OFF';
});
introSkip.addEventListener('click', finishIntro);
introVideo.addEventListener('ended', finishIntro);
introVideo.addEventListener('error', finishIntro);
introVideo.addEventListener('timeupdate', updateIntroProgress);
introVideo.addEventListener('loadedmetadata', updateIntroProgress);
document.addEventListener('keydown', event => {
  if (!introClosed && event.key === 'Escape') finishIntro();
});
introVideo.play().catch(finishIntro);
