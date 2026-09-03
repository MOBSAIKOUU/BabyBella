const music = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');
const musicEnabled = localStorage.getItem('music-enabled') === 'true';
const savedTime = Number(localStorage.getItem('music-time')) || 0;

music.currentTime = savedTime;

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

window.addEventListener('pagehide', () => {
  localStorage.setItem('music-time', String(music.currentTime));
});

updateMusicButton();