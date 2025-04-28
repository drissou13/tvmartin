const powerButton = document.getElementById('powerButton');
const youtubePlayer = document.getElementById('youtubePlayer');
const tvNoise = document.getElementById('tvNoise');
const noiseSound = document.getElementById('noiseSound');
const flash = document.getElementById('flash');
const whiteDot = document.getElementById('whiteDot');
const iframe = youtubePlayer.querySelector('iframe');  // Récupère l'iframe YouTube
let player = new YT.Player(iframe);  // Player YouTube API

let isOn = true;
let isMuted = true;
let isPlaying = true;

// Générer du bruit TV
const ctx = tvNoise.getContext('2d');
function createNoise() {
  const w = tvNoise.width;
  const h = tvNoise.height;
  const imageData = ctx.createImageData(w, h);
  const buffer32 = new Uint32Array(imageData.data.buffer);
  const len = buffer32.length;
  for (let i = 0; i < len; i++) {
    buffer32[i] = (Math.random() < 0.5) ? 0xffffffff : 0xff000000;
  }
  ctx.putImageData(imageData, 0, 0);
}

// Boucle bruit
function noiseLoop() {
  if (!isOn) {
    createNoise();
    requestAnimationFrame(noiseLoop);
  }
}

// Adapter canvas
function resizeCanvas() {
  tvNoise.width = youtubePlayer.clientWidth;
  tvNoise.height = youtubePlayer.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Flash blanc allumage
function flashScreen() {
  flash.style.opacity = '1';
  setTimeout(() => {
    flash.style.opacity = '0';
  }, 100);
}

// Animation point blanc extinction
function showWhiteDot() {
  whiteDot.style.opacity = '1';
  whiteDot.style.transform = 'translate(-50%, -50%) scale(1)';

  setTimeout(() => {
    whiteDot.style.opacity = '0';
    whiteDot.style.transform = 'translate(-50%, -50%) scale(0)';
  }, 700);
}

// Fonction pour contrôler le son et la vidéo
function toggleMute() {
  isMuted = !isMuted;
  if (isMuted) {
    player.mute();
  } else {
    player.unMute();
  }
}

function togglePlayPause() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    player.playVideo();
  } else {
    player.pauseVideo();
  }
}

// Bouton ON/OFF
powerButton.addEventListener('click', () => {
  isOn = !isOn;
  if (isOn) {
    youtubePlayer.style.display = 'block';
    tvNoise.style.display = 'none';
    flashScreen();
    toggleMute();  // Démute si on allume
    togglePlayPause(); // Lance la vidéo si la TV est allumée
  } else {
    youtubePlayer.style.display = 'none';
    tvNoise.style.display = 'block';
    noiseLoop();
    noiseSound.currentTime = 0;
    noiseSound.play();
    showWhiteDot();
    togglePlayPause(); // Pause la vidéo si la TV est éteinte
  }
});