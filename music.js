const music = document.getElementById('background-music') || document.querySelector('audio');
const musicToggle = document.getElementById('music-toggle');
const musicEnabled = localStorage.getItem('music-enabled') !== 'false';
const availableTracks = [
  { label: 'Naparabang', value: 'music/naparabang.mp3' },
  { label: 'Till I Met You', value: 'music/Till%20i%20met%20you.mp3' }
];
let autoplayBlocked = false;
let playbackFailed = false;

const ensureMusicMenu = () => {
  if (document.getElementById('music-menu')) return;

  const menu = document.createElement('div');
  menu.id = 'music-menu';
  menu.className = 'music-menu';
  menu.innerHTML = `
    <button class="music-menu-button" id="music-menu-button" type="button" aria-expanded="false" aria-controls="music-menu-panel">
      ☰ Music
    </button>
    <div class="music-menu-panel hidden" id="music-menu-panel">
      <div class="music-menu-header">Choose a song</div>
      <label class="music-menu-label" for="music-track-select">Music folder</label>
      <select id="music-track-select" aria-label="Choose a music track from the music folder">
        ${availableTracks.map((track) => `<option value="${track.value}">${track.label}</option>`).join('')}
      </select>
    </div>
  `;

  document.body.prepend(menu);

  const menuButton = document.getElementById('music-menu-button');
  const menuPanel = document.getElementById('music-menu-panel');
  const trackSelect = document.getElementById('music-track-select');
  const savedTrack = localStorage.getItem('music-track') || availableTracks[0].value;

  trackSelect.value = availableTracks.some((track) => track.value === savedTrack) ? savedTrack : availableTracks[0].value;

  menuButton.addEventListener('click', () => {
    const shouldOpen = menuPanel.classList.toggle('hidden');
    menuButton.setAttribute('aria-expanded', String(!shouldOpen));
  });

  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target)) {
      menuPanel.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });

  trackSelect.addEventListener('change', async (event) => {
    const selectedTrack = event.target.value;
    localStorage.setItem('music-track', selectedTrack);
    if (!music) return;

    music.src = selectedTrack;
    music.load();
    if (musicEnabled) {
      try {
        await music.play();
        autoplayBlocked = false;
        playbackFailed = false;
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          autoplayBlocked = true;
        } else {
          playbackFailed = true;
        }
      }
    }

    updateMusicButton();
  });
};

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
  musicToggle.textContent = isPlaying
    ? 'Turn music off'
    : playbackFailed
      ? 'Music unavailable'
      : autoplayBlocked
        ? 'Tap to play music'
        : 'Play music';
  musicToggle.setAttribute('aria-label', isPlaying ? 'Turn music off' : 'Play background music');
};

ensureMusicMenu();

if (music) {
  const savedTrack = localStorage.getItem('music-track');
  if (savedTrack && availableTracks.some((track) => track.value === savedTrack)) {
    music.src = savedTrack;
  }

  music.currentTime = 0;
  music.volume = 0.45;

  if (musicEnabled) {
    music.play().then(() => {
      autoplayBlocked = false;
      playbackFailed = false;
      localStorage.setItem('music-enabled', 'true');
      updateMusicButton();
    }).catch((error) => {
      if (error.name === 'NotAllowedError') {
        autoplayBlocked = true;
      } else {
        playbackFailed = true;
        console.error('Background music could not be played:', error);
      }
      updateMusicButton();
    });
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', async () => {
      if (music.paused) {
        try {
          await music.play();
          autoplayBlocked = false;
          playbackFailed = false;
          localStorage.setItem('music-enabled', 'true');
        } catch (error) {
          if (error.name === 'NotAllowedError') {
            autoplayBlocked = true;
          } else {
            playbackFailed = true;
            console.error('Background music could not be played:', error);
          }
        }
      } else {
        music.pause();
        autoplayBlocked = false;
        localStorage.setItem('music-enabled', 'false');
      }
      updateMusicButton();
    });
  }
}

updateMusicButton();