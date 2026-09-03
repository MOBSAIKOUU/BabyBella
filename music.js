const music = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');

musicToggle.addEventListener('click', async () => {
  if (music.paused) {
    await music.play();
    musicToggle.textContent = 'Turn music off';
    musicToggle.setAttribute('aria-label', 'Turn music off');
  } else {
    music.pause();
    musicToggle.textContent = 'Play music';
    musicToggle.setAttribute('aria-label', 'Play background music');
  }
});