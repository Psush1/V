function goToScreen(id) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));

  document.getElementById(id).classList.add('active');
}

let tapScore = 0;
let tapTime = 30;
let tapInterval;
let spawnInterval;

function startTapGame() {
  tapScore = 0;
  tapTime = 30;

  document.getElementById('tap-score').textContent = '🥤 0';
  document.getElementById('tap-timer').textContent = '⏱ 30';

  const area = document.getElementById('tap-area');
  area.innerHTML = '';
  area.style.position = 'relative';

  tapInterval = setInterval(() => {
    tapTime--;
    document.getElementById('tap-timer').textContent = '⏱ ' + tapTime;

    if (tapTime <= 0) {
      endTapGame();
    }
  }, 1000);

  spawnInterval = setInterval(spawnCan, 700);
}

function spawnCan() {
  const area = document.getElementById('tap-area');
  const can = document.createElement('div');
  can.classList.add('can');
  can.textContent = '🥤';

  const x = Math.random() * (area.clientWidth - 40);
  const y = Math.random() * (area.clientHeight - 40);

  can.style.left = x + 'px';
  can.style.top = y + 'px';

  can.onclick = () => {
    tapScore++;
    document.getElementById('tap-score').textContent = '🥤 ' + tapScore;
    can.remove();
  };

  area.appendChild(can);

  setTimeout(() => {
    if (can.parentNode) can.remove();
  }, 1200);
}

function endTapGame() {
  clearInterval(tapInterval);
  clearInterval(spawnInterval);

  document.getElementById('final-score-text').innerHTML =
    "Yay! You're a Diet Coke champion 🥤✨<br><br>" +
    "You collected <strong>" + tapScore + "</strong> cans!";

  document.getElementById('tap-popup').style.display = "flex";
}
function closeTapPopup() {
  clearInterval(tapInterval);
  clearInterval(spawnInterval);

  document.getElementById('tap-popup').style.display = "none";

  goToScreen('menu');
}
let heartScore = 0;
let heartTime = 60;
let heartLives = 5;

let heartInterval;
let heartSpawnInterval;

function startHeartGame() {
  clearInterval(heartInterval);
clearInterval(heartSpawnInterval);

  heartScore = 0;
  heartTime = 60;
  heartLives = 5;

  document.getElementById('heart-score').textContent = '❤️ 0';
  document.getElementById('heart-timer').textContent = '⏱ 60';
  document.getElementById('heart-lives').textContent = '💔 5';

  const area = document.getElementById('heart-area');
  area.innerHTML = '<div id="catcher">✋</div>';
  area.style.position = 'relative';

  const catcher = document.getElementById('catcher');

  // MOUSE MOVEMENT
  area.onmousemove = function (e) {
    const rect = area.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;

    mouseX = Math.max(0, Math.min(area.clientWidth - 40, mouseX));

    catcher.style.left = mouseX + 'px';
  };

  heartInterval = setInterval(() => {
    heartTime--;
    document.getElementById('heart-timer').textContent = '⏱ ' + heartTime;

    if (heartTime <= 0) {
      endHeartGame();
    }
  }, 1000);

  heartSpawnInterval = setInterval(spawnHeart, 800);
}

function spawnHeart() {
  const area = document.getElementById('heart-area');
  const heart = document.createElement('div');
  heart.classList.add('falling-heart');
  heart.textContent = '❤️';

  let x = Math.random() * (area.clientWidth - 30);
  heart.style.left = x + 'px';
  heart.style.top = '0px';

  area.appendChild(heart);

  let fallInterval = setInterval(() => {
    let top = parseInt(heart.style.top);
    heart.style.top = top + 5 + 'px';

    const catcher = document.getElementById('catcher');
    const catcherRect = catcher.getBoundingClientRect();
    const heartRect = heart.getBoundingClientRect();

    // CATCH DETECTION
    if (
      heartRect.bottom >= catcherRect.top &&
      heartRect.left < catcherRect.right &&
      heartRect.right > catcherRect.left
    ) {
      heartScore++;
      document.getElementById('heart-score').textContent =
        '❤️ ' + heartScore;
      heart.remove();
      clearInterval(fallInterval);
    }

    // MISS DETECTION
    if (top > area.clientHeight) {
      heartLives--;
      document.getElementById('heart-lives').textContent =
        '💔 ' + heartLives;

      heart.remove();
      clearInterval(fallInterval);

      if (heartLives <= 0) {
        endHeartGame();
      }
    }
  }, 20);
}

function endHeartGame() {
  clearInterval(heartInterval);
  clearInterval(heartSpawnInterval);

  document.getElementById('heart-final-score').innerHTML =
    "You caught <strong>" + heartScore + "</strong> hearts ❤️";

  document.getElementById('heart-popup').style.display = "flex";
}
function closeHeartPopup() {
  clearInterval(heartInterval);
  clearInterval(heartSpawnInterval);

  document.getElementById('heart-popup').style.display = "none";

  goToScreen('menu');
}
let surviveTime = 0;
let surviveInterval;
let chaseInterval;
let surviveSpawnInterval; // renamed

let chasers = [];

function startSurviveGame() {
  clearInterval(surviveInterval);
  clearInterval(chaseInterval);
  clearInterval(surviveSpawnInterval);

  surviveTime = 0;
  chasers = [];

  document.getElementById('survive-time').textContent = '⏱ 0';

  const area = document.getElementById('survive-area');
  area.innerHTML = '<div id="player">🎀</div>';

  const player = document.getElementById('player');

  player.style.left = '50%';
  player.style.top = '50%';

  // Mouse movement
  area.onmousemove = function (e) {
    const rect = area.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.max(0, Math.min(area.clientWidth - 40, x));
    y = Math.max(0, Math.min(area.clientHeight - 40, y));

    player.style.left = x + 'px';
    player.style.top = y + 'px';
  };

  // Timer
  surviveInterval = setInterval(() => {
    surviveTime++;
    document.getElementById('survive-time').textContent =
      '⏱ ' + surviveTime;
  }, 1000);

  // Spawn new "you" every 3 seconds
  surviveSpawnInterval = setInterval(spawnChaser, 3000);

  // Movement loop
  chaseInterval = setInterval(() => {
    moveChasers();
    checkCollision();
  }, 20);

  // Spawn first one immediately
  spawnChaser();
}

function spawnChaser() {
  const area = document.getElementById('survive-area');

  const chaser = document.createElement('div');
  chaser.classList.add('chaser');
  chaser.textContent = '🐰';

  chaser.style.left = Math.random() * (area.clientWidth - 40) + 'px';
  chaser.style.top = Math.random() * (area.clientHeight - 40) + 'px';

  area.appendChild(chaser);
  chasers.push(chaser);
}

function moveChasers() {
  const player = document.getElementById('player');

  let playerX = player.offsetLeft;
  let playerY = player.offsetTop;

  chasers.forEach(chaser => {
    let chaserX = chaser.offsetLeft;
    let chaserY = chaser.offsetTop;

    let dx = playerX - chaserX;
    let dy = playerY - chaserY;

    chaser.style.left = chaserX + dx * 0.02 + 'px';
    chaser.style.top = chaserY + dy * 0.02 + 'px';
  });
}

function checkCollision() {
  const player = document.getElementById('player');
  const playerRect = player.getBoundingClientRect();

  chasers.forEach(chaser => {
    const chaserRect = chaser.getBoundingClientRect();

    if (
      playerRect.left < chaserRect.right &&
      playerRect.right > chaserRect.left &&
      playerRect.top < chaserRect.bottom &&
      playerRect.bottom > chaserRect.top
    ) {
      endSurviveGame();
    }
  });
}

function endSurviveGame() {
  clearInterval(surviveInterval);
  clearInterval(chaseInterval);
  clearInterval(surviveSpawnInterval);

  document.getElementById('survive-popup').style.display = 'flex';
}

function closeSurvivePopup() {
  clearInterval(surviveInterval);
  clearInterval(chaseInterval);
  clearInterval(surviveSpawnInterval);

  document.getElementById('survive-popup').style.display = 'none';

  goToScreen('menu');
}
function initScratchCards() {
  const canvases = document.querySelectorAll('.scratch-canvas');

  canvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');

    canvas.width = 260;
    canvas.height = 360;

    ctx.fillStyle = "#cccccc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "destination-out";

    let isDrawing = false;

    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseleave', () => isDrawing = false);

    canvas.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}
function valentineResponse(answer) {
  let title = "";
  let message = "";

  if (answer === "yes") {
    // Option B – Cute celebration
    title = "You said YES ❤️";
    message = "Okay… now I’m officially smiling like an idiot. Thank you.";
  }

  if (answer === "no") {
    // Option B – Light playful
    title = "Are you sure? 😛";
    message = "I’ll pretend I didn’t hear that for 2 seconds.";
  }

  if (answer === "maybe") {
    // Option A – Soft wait
    title = "I’ll wait 😌";
    message = "Take your time. That’s enough for me.";
  }

  document.getElementById('valentine-title').textContent = title;
  document.getElementById('valentine-message').textContent = message;

  document.getElementById('valentine-popup').style.display = "flex";
}

function closeValentinePopup() {
  document.getElementById('valentine-popup').style.display = "none";
}
