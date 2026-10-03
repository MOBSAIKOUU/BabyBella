const music = document.getElementById('background-music') || document.querySelector('audio');
const musicToggle = document.getElementById('music-toggle');
const musicEnabled = localStorage.getItem('music-enabled') === 'true';

const loadPage = async (url, addToHistory = true) => {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Page failed to load: ${response.status}`);

    const pageDocument = new DOMParser().parseFromString(await response.text(), 'text/html');
    const nextMain = pageDocument.querySelector('main');
    if (!nextMain) throw new Error('Page has no main content');

    document.querySelector('main').replaceWith(nextMain);
    document.title = pageDocument.title;

    pageDocument.querySelectorAll('script:not([src])').forEach((script) => {
      const replacement = document.createElement('script');
      replacement.textContent = script.textContent;
      document.body.appendChild(replacement);
    });

    if (addToHistory) history.pushState({}, '', url);
    window.scrollTo(0, 0);
  } catch {
    window.location.href = url;
  }
};

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link || link.target || link.dataset.noSpa !== undefined || !link.pathname.endsWith('.html')) return;

  const url = new URL(link.href);
  if (url.origin !== window.location.origin) return;

  event.preventDefault();
  loadPage(url.href);
});

window.addEventListener('popstate', () => loadPage(window.location.href, false));

const updateMusicButton = () => {
  if (!music || !musicToggle) return;

  const isPlaying = !music.paused;
  musicToggle.textContent = isPlaying ? 'Turn music off' : 'Play music';
  musicToggle.setAttribute('aria-label', isPlaying ? 'Turn music off' : 'Play background music');
};

if (music) {
  music.currentTime = 0;
  music.volume = 0.45;

  if (musicEnabled) {
    music.play().catch(() => {
      updateMusicButton();
    });
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', async () => {
      if (music.paused) {
        await music.play();
        localStorage.setItem('music-enabled', 'true');
      } else {
        music.pause();
        localStorage.setItem('music-enabled', 'false');
      }
      updateMusicButton();
    });
  }
}

updateMusicButton();