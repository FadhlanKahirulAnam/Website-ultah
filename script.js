// ============================================================
// ⚙️ GANTI DI SINI: tanggal jadian kalian (tahun, bulan, tanggal)
// Format: new Date(TAHUN, BULAN-1, TANGGAL)
// ============================================================
const startDate = new Date(2026, 2, 5);

function updateCounter(){
  const now = new Date();
  let diff = now - startDate;
  if(diff < 0) diff = 0;
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff / (1000*60*60)) % 24);
  const mins = Math.floor((diff / (1000*60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  document.getElementById('cDays').textContent = days;
  document.getElementById('cHours').textContent = hours;
  document.getElementById('cMins').textContent = mins;
  document.getElementById('cSecs').textContent = secs;
}
updateCounter();
setInterval(updateCounter, 1000);

// Tombol musik
const musicBtn = document.getElementById('musicBtn');
const audio = document.getElementById('bgMusic');
let playing = false;
musicBtn.addEventListener('click', () => {
  if(!playing){
    audio.play().catch(()=>{});
    musicBtn.textContent = '❚❚ Jeda musik';
    musicBtn.setAttribute('aria-pressed','true');
  } else {
    audio.pause();
    musicBtn.textContent = '♪ Putar musik';
    musicBtn.setAttribute('aria-pressed','false');
  }
  playing = !playing;
});

// Petals ambient
const petalContainer = document.getElementById('petals');
for(let i=0; i<16; i++){
  const p = document.createElement('div');
  p.className = 'petal';
  p.style.left = Math.random()*100 + 'vw';
  p.style.animationDuration = (8 + Math.random()*10) + 's';
  p.style.animationDelay = (Math.random()*10) + 's';
  p.style.opacity = 0.15 + Math.random()*0.3;
  p.style.transform = `scale(${0.6 + Math.random()*0.8})`;
  petalContainer.appendChild(p);
}

// ---------- Navigasi antar layar (klik tombol, bukan scroll) ----------
const screens = Array.from(document.querySelectorAll('.screen'));
let current = 0;

function goToScreen(index){
  if(index < 0 || index >= screens.length) return;
  screens[current].classList.remove('active');
  current = index;
  const target = screens[current];
  target.classList.add('active');
  // restart reveal animations tiap kali layar ini ditampilkan
  target.querySelectorAll('.reveal').forEach(el => {
    el.style.animation = 'none';
    // eslint-disable-next-line no-unused-expressions
    el.offsetHeight; // paksa reflow
    el.style.animation = '';
  });
}

document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', () => goToScreen(current + 1));
});

// ---------- Mini-game: tangkap hati (basa-basi pembuka) ----------
const gameIntro = document.getElementById('gameIntro');
const gamePlay = document.getElementById('gamePlay');
const gameResult = document.getElementById('gameResult');
const gameArea = document.getElementById('gameArea');
const scoreLabel = document.getElementById('scoreLabel');
const timeLabel = document.getElementById('timeLabel');
const resultText = document.getElementById('resultText');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const startGameBtn = document.getElementById('startGameBtn');
const afterGameBtn = document.getElementById('afterGameBtn');
const retryBtn = document.getElementById('retryBtn');

// GANTI DI SINI: batas skor tinggi. Skor sama atau lebih dari angka ini
// dianggap "skor tinggi".
const HIGH_SCORE_THRESHOLD = 6;

// GANTI DI SINI: kata-kata untuk skor rendah & skor tinggi
const LOW_SCORE_MESSAGE = "Yah, cuma segini? ngapapaa sayanggg🤏🤏🤏, yang penting semangatnya!!!. Mau coba lagi atau lanjut aja?";
const HIGH_SCORE_MESSAGE = "WIHHH😻😻😻, gesit banget tangkap hatinya, ANJAYYY! Secepat itu juga aku jatuh hati sama kamu🤭🤭🤭, wehhehehehe";

let score = 0;
let timeLeft = 10;
let spawnTimer = null;
let countdownTimer = null;

function spawnHeart(){
  if(!gameArea.isConnected) return;
  const heart = document.createElement('button');
  heart.className = 'heart-target';
  heart.textContent = '❤';
  heart.setAttribute('aria-label', 'Tangkap hati');
  const areaRect = gameArea.getBoundingClientRect();
  const x = 30 + Math.random() * (areaRect.width - 60);
  const y = 30 + Math.random() * (areaRect.height - 60);
  heart.style.left = x + 'px';
  heart.style.top = y + 'px';

  const despawn = setTimeout(() => heart.remove(), 900);
  heart.addEventListener('click', () => {
    score++;
    scoreLabel.textContent = 'Skor: ' + score;
    clearTimeout(despawn);
    heart.remove();
  });
  gameArea.appendChild(heart);
}

function startGame(){
  score = 0;
  timeLeft = 10;
  scoreLabel.textContent = 'Skor: 0';
  timeLabel.textContent = 'Waktu: 10';
  gameIntro.style.display = 'none';
  gamePlay.style.display = 'flex';
  gamePlay.style.flexDirection = 'column';
  gamePlay.style.alignItems = 'center';
  gameArea.innerHTML = '';

  spawnTimer = setInterval(spawnHeart, 550);
  countdownTimer = setInterval(() => {
    timeLeft--;
    timeLabel.textContent = 'Waktu: ' + Math.max(timeLeft, 0);
    if(timeLeft <= 0) endGame();
  }, 1000);
}

function endGame(){
  clearInterval(spawnTimer);
  clearInterval(countdownTimer);
  gameArea.innerHTML = '';
  gamePlay.style.display = 'none';
  gameResult.style.display = 'flex';
  gameResult.style.flexDirection = 'column';
  gameResult.style.alignItems = 'center';
  resultText.textContent = 'Skor kamu: ' + score + ' hati ♥';

  const isHighScore = score >= HIGH_SCORE_THRESHOLD;
  resultTitle.textContent = isHighScore ? 'Keren! 🎉' : 'Yaah~ 🥲';
  resultMessage.textContent = isHighScore ? HIGH_SCORE_MESSAGE : LOW_SCORE_MESSAGE;
  retryBtn.style.display = isHighScore ? 'none' : 'inline-block';
}

startGameBtn.addEventListener('click', startGame);
retryBtn.addEventListener('click', startGame);
afterGameBtn.addEventListener('click', () => goToScreen(1));

// ---------- Kirim harapan lewat WhatsApp ----------
// GANTI DI SINI: nomor WhatsApp tujuan (format internasional, tanpa + atau 0 di depan)
const WISH_WHATSAPP_TARGET = "6285882016798";

const wishInput = document.getElementById('wishInput');
const wishError = document.getElementById('wishError');
const sendWishBtn = document.getElementById('sendWishBtn');
const wishForm = document.getElementById('wishForm');
const wishSent = document.getElementById('wishSent');

sendWishBtn.addEventListener('click', () => {
  const wish = wishInput.value.trim();
  if(!wish){
    wishError.style.display = 'block';
    return;
  }
  wishError.style.display = 'none';

  const message = encodeURIComponent('Harapan ulang tahunku: ' + wish);
  window.open(`https://wa.me/${WISH_WHATSAPP_TARGET}?text=${message}`, '_blank');

  wishForm.style.display = 'none';
  wishSent.style.display = 'flex';
  wishSent.style.flexDirection = 'column';
  wishSent.style.alignItems = 'center';
});