// --- Stats ---
let Damage = 1;
let AttackSpeed = 1;
let Health = 100;
let Level = 1;
let Experience = 0;
let NeededExperience = 100;
let coins = 100;

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

// --- Player and Canvas Setup ---
let player = {
  x: 400,
  y: 300,
  radius: 20,
  color: "blue",
};

let worldOffsetX = 0;
let worldOffsetY = 0;
const playerSpeed = 5;
let canvas, ctx;
let keysPressed = {};

// --- Pre-game Cheat Check ---
checkCheats();

// --- Start Button ---
document.getElementById("PlayButton").addEventListener("click", startGame);

// --- Start Game ---
function startGame() {
  gamestarted = true;
  document.getElementById("PlayButton").style.display = "none";
  document.getElementById("header").style.display = "none";
  enterFullscreen();

  // Canvas setup
  canvas = document.createElement("canvas");
  canvas.id = "gameCanvas";
  canvas.width = 800;
  canvas.height = 600;
  canvas.style.border = "1px solid black";
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");

  // Add pause button
  const pauseButton = document.createElement("button");
  pauseButton.id = "pauseButton";
  pauseButton.innerText = "Pause";
  pauseButton.style.position = "absolute";
  pauseButton.style.top = "10px";
  pauseButton.style.right = "10px";
  document.body.appendChild(pauseButton);

  pauseButton.addEventListener("click", pauseGame);

  setInterval(gameLoop, 500);
  console.log("Game started!");
}

// --- Key Events for Movement ---
document.addEventListener("keydown", (e) => {
  keysPressed[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
  keysPressed[e.key.toLowerCase()] = false;
});

// --- Game Loop ---
function gameLoop() {
  if (!inRound) return;

  handleMovement(); // Handle movement based on key input

  Experience += 1;

  if (Experience >= NeededExperience) {
    Level += 1;
    Experience = 0;
    NeededExperience = Math.floor(NeededExperience * 1.5);
    upgradeQueue += 1;
  }

  updateCanvas(); // Update canvas with player and map

  if (roundOver()) {
    inRound = false;
    handleRoundEnd();
  }
}

// --- Handle Movement ---
function handleMovement() {
  if (keysPressed["w"]) worldOffsetY += playerSpeed;
  if (keysPressed["s"]) worldOffsetY -= playerSpeed;
  if (keysPressed["a"]) worldOffsetX += playerSpeed;
  if (keysPressed["d"]) worldOffsetX -= playerSpeed;
}

// --- Update Canvas (Draw Player and Map) ---
function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  // Simulate the world background (placeholder)
  ctx.fillStyle = "#eee";
  ctx.fillRect(worldOffsetX, worldOffsetY, canvas.width * 2, canvas.height * 2); // Background world

  // Health Bar at top left
  const barWidth = 200;
  const barHeight = 20;
  ctx.fillStyle = "red";
  ctx.fillRect(10, 10, barWidth, barHeight);
  ctx.fillStyle = "green";
  ctx.fillRect(10, 10, (Health / 100) * barWidth, barHeight); // Health bar proportionate to max health
  ctx.strokeStyle = "black";
  ctx.strokeRect(10, 10, barWidth, barHeight);

  // Draw Player in the center of canvas (world position is offset)
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();
}

// --- Round End Logic ---
function handleRoundEnd() {
  coins += 50; // Example reward
  coins += Math.floor((coins * Interest) / 100);

  for (let i = 0; i < upgradeQueue; i++) {
    console.log(`Upgrade choice #${i + 1} shown (placeholder)`);
    // Show upgrade UI here
  }

  showShop();

  if (gambling) {
    showGamblingMachine();
  }

  upgradeQueue = 0;

  // Continue after delay
  setTimeout(() => {
    inRound = true;
    console.log("Next round starts");
    luck += 1;
  }, 3000);
}

// --- Shop Placeholder ---
function showShop() {
  console.log("Displaying 10 shop items (placeholder)");
}

// --- Gambling Placeholder ---
function showGamblingMachine() {
  console.log("Gambling activated: Showing slot machine (placeholder)");
}

// --- Pause ---
function pauseGame() {
  console.log("Game paused - show stats/settings here");
  // Toggle pause logic can be added
}

// --- Update Stats on Screen ---
function updateStats() {
  console.log(`Stats - Level: ${Level}, XP: ${Experience}, Coins: ${coins}`);
}

// --- Cheat Detection ---
function checkCheats() {
  if (Health !== 100) console.log("Cheating detected: Health");
  if (Damage !== 1) console.log("Cheating detected: Damage");
  if (Level !== 1) console.log("Cheating detected: Level");
  if (Experience !== 0) console.log("Cheating detected: Experience");
  if (NeededExperience !== 100) console.log("Cheating detected: NeededExperience");
}

// --- Fullscreen Function ---
function enterFullscreen() {
  const docEl = document.documentElement;
  if (docEl.requestFullscreen) docEl.requestFullscreen();
}

// --- Dummy Round Checker ---
function roundOver() {
  // Replace with enemy death checking later
  return Math.random() < 0.01; // 1% chance each loop as placeholder
}
