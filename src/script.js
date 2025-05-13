// --- Stats ---
let Damage = 1;
let AttackSpeed = 1;
let Health = 100;
let Level = 1;
let Experience = 0;
let NeededExperience = 100;
let coins = 100;
let Walkspeed = 2;

// --- Secondary Stats ---
let luck = 1;
let CritChance = 0;
let ProjectileDamageMultiplier = 1;
let MeleeDamageMultiplier = 1;
let Interest = 5;
let TrackingProjectiles = false;
let ExplodingProjectiles = false;
let explosionsize = 1;
let ProjectileRichochet = false;

// --- Game State ---
let roundDuration = 60; // 60 seconds per round
let timeLeft = roundDuration;
let timerInterval; // Updated to handle timer overlaps
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
let wave = 1;

// enemies
let enemies = [];

// --- Fullscreen ---
function enterFullscreen() {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else {
    console.log("Fullscreen mode is not supported.");
  }
}

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
  speed: 1 * Walkspeed,
};

// --- Start Game ---
document.getElementById("PlayButton").addEventListener("click", startGame);

function startGame() {
  gamestarted = true;
  inRound = true; // Ensure round state is reset
  clearInterval(timerInterval); // Avoid timer overlaps
  timerInterval = setInterval(changeTimer, 1000);

  canvas.style.display = "block"; // Make canvas visible
  document.getElementById("PlayButton").style.display = "none";
  document.getElementById("header").style.display = "none";
  enterFullscreen();
  generateStarDots();
  generateGridDots();
  spawnEnemies(); // Ensure enemies are generated
  gameLoop();
}

// --- Key States ---
let keyState = {
  w: false,
  a: false,
  s: false,
  d: false,
};

// Event listeners for key presses
document.addEventListener("keydown", (event) => {
  if (event.key === "w") keyState.w = true;
  if (event.key === "a") keyState.a = true;
  if (event.key === "s") keyState.s = true;
  if (event.key === "d") keyState.d = true;
});

document.addEventListener("keyup", (event) => {
  if (event.key === "w") keyState.w = false;
  if (event.key === "a") keyState.a = false;
  if (event.key === "s") keyState.s = false;
  if (event.key === "d") keyState.d = false;
});

// --- Game Loop ---
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas every frame
  moveGridDotsWithKeys();
  drawGridDots();
  moveStarDots();
  drawStarDots();
  moveEnemies();
  drawEnemies();
  drawPlayer();
  drawCoins();
  drawTimer();
  drawHealth();

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

// --- Grid Dots ---
function generateGridDots() {
  gridDots = []; // Reset the array
  for (let x = 0; x < canvas.width; x += 50) {
    for (let y = 0; y < canvas.height; y += 50) {
      gridDots.push({
        x,
        y,
        speedX: (Math.random() - 0.5) * 0.5, // Horizontal speed
        speedY: (Math.random() - 0.5) * 0.5, // Vertical speed
      });
    }
  }
}

function moveGridDotsWithKeys() {
  gridDots.forEach((dot) => {
    if (keyState.w) dot.y += Walkspeed; // Move up
    if (keyState.a) dot.x += Walkspeed; // Move left
    if (keyState.s) dot.y -= Walkspeed; // Move down
    if (keyState.d) dot.x -= Walkspeed; // Move right

    // Wrap around the canvas boundaries
    if (dot.x > canvas.width) dot.x = 0;
    if (dot.x < 0) dot.x = canvas.width;
    if (dot.y > canvas.height) dot.y = 0;
    if (dot.y < 0) dot.y = canvas.height;
  });
}

function drawGridDots() {
  ctx.fillStyle = "grey";
  gridDots.forEach((dot) => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

// --- Star Dots ---
function generateStarDots() {
  starDots = []; // Reset star dots
  for (let i = 0; i < 100; i++) {
    starDots.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
    });
  }
}

function moveStarDots() {
  starDots.forEach((dot) => {
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
  starDots.forEach((dot) => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

// --- Draw Player ---
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x - player.width / 2,
    player.y - player.height / 2,
    player.width,
    player.height
  );
}

// --- Enemies ---
function spawnEnemies() {
  enemies = []; // Reset enemies
  for (let i = 0; i < wave * 5; i++) {
    enemies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: 20,
      height: 20,
      speed: 1 + wave * 0.1, // Increase speed with waves
      color: "red",
    });
  }
}

function moveEnemies() {
  enemies.forEach((enemy) => {
    // Simple chasing logic: move towards the player
    if (enemy.x < player.x) enemy.x += enemy.speed;
    if (enemy.x > player.x) enemy.x -= enemy.speed;
    if (enemy.y < player.y) enemy.y += enemy.speed;
    if (enemy.y > player.y) enemy.y -= enemy.speed;

    // Add boundary wrapping
    if (enemy.x > canvas.width) enemy.x = 0;
    if (enemy.x < 0) enemy.x = canvas.width;
    if (enemy.y > canvas.height) enemy.y = 0;
    if (enemy.y < 0) enemy.y = canvas.height;
  });
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// --- Collision ---
function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function handleCollisions() {
  // Check collision with enemies
  enemies.forEach((enemy) => {
    if (checkCollision(player, enemy)) {
      console.log("Player hit by enemy!");
      Health -= 10; // Reduce health
      if (Health <= 0) {
        console.log("Game Over!");
        resetGame(); // Add game reset logic
      }
    }
  });
}

// --- Draw Coins ---
function drawCoins() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`Coins: ${coins}`, canvas.width - 20, 30);
}

// --- Draw Timer ---
function drawTimer() {
  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText(`Timer: ${timeLeft}`, canvas.width - 150, 30); // Adjust position
}

// --- Draw Health ---
function drawHealth() {
  ctx.fillStyle = "red";
  ctx.fillRect(20, 50, Health * 2, 20); // Health bar
  ctx.strokeStyle = "white";
  ctx.strokeRect(20, 50, 200, 20); // Health bar border

  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`Health: ${Health}`, 20, 45);
}

function changeTimer() {
  if (timeLeft > 0) {
    timeLeft--;
  } else {
    inRound = false; // End the round
    showUpgradeMenu();
    clearInterval(timerInterval);
  }
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  generateGridDots(); // Regenerate grid dots to fit new canvas size
});

// --- Debugging ---
const DEBUG = false;

function logDebug(message) {
  if (DEBUG) console.log(message);
}
