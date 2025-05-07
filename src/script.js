// --- Stats ---
let Damage = 1;
let AttackSpeed = 1;
let Health = 100;
let MaxHealth = 100;
let Level = 1;
let Experience = 0;
let NeededExperience = 100;
let coins = 100;

// --- Secondary Stats (placeholders) ---
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

// --- Player & Camera ---
const player = { x: 400, y: 300, radius: 20, color: "blue" };
let worldOffsetX = 0;
let worldOffsetY = 0;
const playerSpeed = 2;        // slower for better control
let keysPressed = {};          // track key states

let canvas, ctx;

// --- Pre-game Cheat Check ---
checkCheats();

// --- Setup Key Listeners ---
document.addEventListener("keydown",  e => keysPressed[e.key.toLowerCase()] = true);
document.addEventListener("keyup",    e => keysPressed[e.key.toLowerCase()] = false);

// --- Start Button Listener ---
document.getElementById("PlayButton").addEventListener("click", startGame);

// --- Start Game ---
function startGame() {
  gamestarted = true;
  document.getElementById("PlayButton").style.display = "none";
  document.getElementById("header").style.display = "none";
  enterFullscreen();

  // Create and append canvas
  canvas = document.createElement("canvas");
  canvas.id = "gameCanvas";
  canvas.width  = 800;
  canvas.height = 600;
  canvas.style.border = "1px solid black";
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");

  // Add Pause button (optional)
  const pauseButton = document.createElement("button");
  pauseButton.innerText = "Pause";
  pauseButton.style.position = "absolute";
  pauseButton.style.top = "10px";
  pauseButton.style.right = "10px";
  document.body.appendChild(pauseButton);
  pauseButton.addEventListener("click", pauseGame);

  // Kick off the loop
  requestAnimationFrame(gameLoop);
  console.log("Game started!");
}

// --- Main Loop ---
function gameLoop() {
  if (inRound) {
    handleMovement();
    tickExperience();
    drawScene();
    if (roundOver()) {
      inRound = false;
      handleRoundEnd();
    }
  }
  requestAnimationFrame(gameLoop);
}

// --- Movement Handler ---
function handleMovement() {
  if (keysPressed["w"]) worldOffsetY += playerSpeed;
  if (keysPressed["s"]) worldOffsetY -= playerSpeed;
  if (keysPressed["a"]) worldOffsetX += playerSpeed;
  if (keysPressed["d"]) worldOffsetX -= playerSpeed;
}

// --- Experience & Leveling ---
function tickExperience() {
  Experience += 1;
  if (Experience >= NeededExperience) {
    Level++;
    Experience = 0;
    NeededExperience = Math.floor(NeededExperience * 1.5);
    upgradeQueue++;
    console.log(`Leveled up to ${Level}`);
  }
}

// --- Draw Everything ---
function drawScene() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid background so movement is visible
  const gridSize = 50;
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#444";
  // start at offset mod gridSize, draw small dots
  for (let x = -worldOffsetX % gridSize; x < canvas.width; x += gridSize) {
    for (let y = -worldOffsetY % gridSize; y < canvas.height; y += gridSize) {
      ctx.fillRect(x + gridSize/2 - 2, y + gridSize/2 - 2, 4, 4);
    }
  }

  // Health Bar (top-left)
  const barW = 200, barH = 20;
  ctx.fillStyle = "red";
  ctx.fillRect(10, 10, barW, barH);
  ctx.fillStyle = "lime";
  ctx.fillRect(10, 10, (Health / MaxHealth)*barW, barH);
  ctx.strokeStyle = "black";
  ctx.strokeRect(10, 10, barW, barH);

  // Draw player *always* in center
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI*2);
  ctx.fill();
}

// --- Round End & Rewards ---
function handleRoundEnd() {
  coins += 50 + Math.floor(coins * Interest/100);
  console.log(`Round ended. Coins: ${coins}`);

  // Placeholder for upgrades/shop/gamble
  for (let i=0; i<upgradeQueue; i++)
    console.log(`Upgrade option #${i+1}`);
  if (gambling) console.log("Show slot machine");

  upgradeQueue = 0;
  setTimeout(() => {
    inRound = true;
    luck++;
    console.log("New round begins.");
  }, 3000);
}

// --- Pause (stub) ---
function pauseGame() {
  inRound = false;
  console.log("Game paused.");
}

// --- Cheat Detection ---
function checkCheats() {
  if (Health !== MaxHealth)       console.log("Cheat: Health");
  if (Damage !== 1)               console.log("Cheat: Damage");
  if (Level !== 1)                console.log("Cheat: Level");
  if (Experience !== 0)           console.log("Cheat: Experience");
  if (NeededExperience !== 100)   console.log("Cheat: Needed XP");
}

// --- Fullscreen Request ---
function enterFullscreen() {
  document.documentElement.requestFullscreen?.();
}

// --- Dummy Round Checker ---
function roundOver() {
  return Math.random() < 0.005;  // ~0.5% chance per frame
}
