const music = document.getElementById('background-music');
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
  if (!link || link.target || !link.pathname.endsWith('.html')) return;

  const url = new URL(link.href);
  if (url.origin !== window.location.origin) return;

  event.preventDefault();
  loadPage(url.href);
});

window.addEventListener('popstate', () => loadPage(window.location.href, false));

music.currentTime = 0;

const updateMusicButton = () => {
  const isPlaying = !music.paused;
  musicToggle.textContent = isPlaying ? 'Turn music off' : 'Play music';
  musicToggle.setAttribute('aria-label', isPlaying ? 'Turn music off' : 'Play background music');
};

if (musicEnabled) {
  music.play().catch(() => {
    updateMusicButton();
  });
}

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

updateMusicButton();