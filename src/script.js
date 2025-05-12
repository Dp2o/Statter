// --- Stats ---
let Damage = 1;
let AttackSpeed = 1;
let Health = 100;
let Level = 1;
let Experience = 0;
let NeededExperience = 100;
let coins = 100;
let Walkspeed = 1;

// --- Secondary Stats ---
let luck = 0;
let CritChance = 0;
let ProjectileDamageMultiplier = 1;
let MeleeDamageMultiplier = 1;
let Interest = 5;
let TrackingProjectiles = false;
let ExplodingProjectiles = false;
let explosionsize = 1;
let ProjectileRichochet = false;

// --- Game State ---
let gamestarted = false;
let gambling = false;
let Difficulty = 0;
let upgradeQueue = 0;
let inRound = true;
let Itemlist = [];
let Weaponlist = [];
let upgrades = [];
let shopItems = [];
let starDots = [];
let gridDots = [];

// --- Canvas Setup ---
const canvas = document.createElement("canvas");
canvas.id = "gameCanvas";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.display = "none";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

// --- Player Setup ---
let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 30,
  height: 30,
  color: "blue",
  speed: 1 * Walkspeed
};

// --- Start Game ---
document.getElementById("PlayButton").addEventListener("click", startGame);

function startGame() {
  gamestarted = true;
  canvas.style.display = "block";
  document.getElementById("PlayButton").style.display = "none";
  document.getElementById("header").style.display = "none";
  enterFullscreen();
  generateStarDots();
  generateGridDots();
  gameLoop();
}

// --- Game Loop ---
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGridDots();
  moveStarDots();
  drawStarDots();
  drawPlayer();
  drawCoins();

  if (inRound) {
    Experience += 0.05;
    if (Experience >= NeededExperience) {
      Level++;
      Experience = 0;
      NeededExperience = Math.floor(NeededExperience * 1.5);
      upgradeQueue++;
    }
  } else {
    showUpgradeMenu();
  }

  requestAnimationFrame(gameLoop);
}

// --- Star Dots ---
function generateStarDots() {
  for (let i = 0; i < 100; i++) {
    starDots.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5
    });
  }
}

function moveStarDots() {
  starDots.forEach(dot => {
    dot.x += dot.speedX;
    dot.y += dot.speedY;

    if (dot.x > canvas.width) dot.x = 0;
    if (dot.x < 0) dot.x = canvas.width;
    if (dot.y > canvas.height) dot.y = 0;
    if (dot.y < 0) dot.y = canvas.height;
  });
}

function drawStarDots() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
  starDots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

// --- Grid Dots ---
function generateGridDots() {
  for (let x = 0; x < canvas.width; x += 50) {
    for (let y = 0; y < canvas.height; y += 50) {
      gridDots.push({ x, y });
    }
  }
}

function drawGridDots() {
  ctx.fillStyle = "grey";
  gridDots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

// --- Draw Player ---
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
}

// --- Draw Coins ---
function drawCoins() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`Coins: ${coins}`, canvas.width - 20, 30);
}
