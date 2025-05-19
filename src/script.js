// --- 1. Stats ---
let Damage = 1;
let AttackSpeed = 1;
let Health = 100;
let Level = 1;
let Experience = 0;
let NeededExperience = 100;
let Coins = 100;
let WalkSpeed = 2;

// --- 2. Secondary Stats ---
let Luck = 1; // Luck now affects upgrade rarity
let CritChance = 0;
let CritDamageMultiplier = 1;
let ProjectileDamageMultiplier = 1;
let MeleeDamageMultiplier = 1;
let Interest = 5;
let TrackingProjectiles = false;
let ExplodingProjectiles = false;
let ExplosionSize = 1;
let ProjectileRichochet = false;

// --- 3. Game State ---
let roundDuration = 60; // 60 seconds per round
let timeLeft = roundDuration;
let timerInterval; // Updated to handle timer overlaps
let gamestarted = false;
let gambling = false;
let upgradeQueue = 0;
let inRound = true;
let itemlist = [];
let weaponlist = [];
let upgrades = [];
let shopItems = [];
let starDots = [];
let gridDots = [];
let wave = 1;

// FullScreen
let pausedForFullscreen = false;

// timer anim
let timerAnimElapsed = 0;
let timerAnimDuration = 1000; // 1 second
let timerBaseFontSize = 80;
let timerPopScale = 1.4;

// Difficulty

let Difficulty = 0;

/*

--Difficulty 0--
Default stats

--Difficulty 1--
Enemy speed and damage increased by half, as well as making the ai better (memory - 0.5)

--Difficulty 2--
Enemy Health doubles

--Difficulty 3--
Player starts with half health

--Difficulty 4--
Enemys now perfectly track the player, removes their ai.

--Difficulty 5--
Player does half damage, enemys take half damage from crit attacks

*/

if (Difficulty >= 4) {
  CritDamageMultiplier /= 2
}

// Enemies
let enemies = [];

// --- 4. Fullscreen Functionality ---
function enterFullscreen() {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else {
    console.log("Fullscreen mode is not supported.");
  }
}

// --- 5. Canvas Setup ---
const canvas = document.createElement("canvas");
canvas.id = "gameCanvas";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.display = "none";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

// --- 6. Player Setup ---
let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 30,
  height: 30,
  color: "blue",
  speed: 1 * WalkSpeed,
};

// --- Draw Player ---
function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.width / 2, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();
}

// Helper to get contrast color (black or white) based on background color
function getContrastYIQ(r, g, b) {
  const yiq = (r*299 + g*587 + b*114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

// Helper to get pixel color from canvas at (x, y)
function getBackgroundColorAt(x, y) {
  const data = ctx.getImageData(x, y, 1, 1).data;
  return { r: data[0], g: data[1], b: data[2] };
}

// --- 7. Game Start ---
document.getElementById("PlayButton").addEventListener("click", startGame);

function startGame() {
  gamestarted = true;
  inRound = true; // Ensure round state is reset
  clearInterval(timerInterval); // Avoid timer overlaps
  timerInterval = setInterval(changeTimer, 1000);

  canvas.style.display = "block"; // Make canvas visible
  document.getElementById("PlayButton").style.display = "none";
  document.getElementById("header").style.display = "none";
  document.getElementById("SettingsButton").style.display = "none";
  enterFullscreen();
  generateStarDots();
  generateGridDots();
  spawnEnemies(); // Ensure enemies are generated
  gameLoop();
}

// --- 8. Key States ---
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

// --- 9. Game Loop ---
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas every frame
  if (inRound) {
    moveGridDotsWithKeys();
    moveStarDots();
    moveEnemies();
    handleCollisions();
  }

  drawLevel();
  drawGridDots();
  drawStarDots();
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
  } else if (!pausedForFullscreen) {
    showUpgradeMenu();
  }

  requestAnimationFrame(gameLoop);
}

// --- 10. Grid Dots ---
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
  // Move grid dots
  gridDots.forEach((dot) => {
    if (keyState.w) dot.y += WalkSpeed; // Move up
    if (keyState.a) dot.x += WalkSpeed; // Move left
    if (keyState.s) dot.y -= WalkSpeed; // Move down
    if (keyState.d) dot.x -= WalkSpeed; // Move right

    // Wrap around the canvas boundaries
    if (dot.x > canvas.width) dot.x = 0;
    if (dot.x < 0) dot.x = canvas.width;
    if (dot.y > canvas.height) dot.y = 0;
    if (dot.y < 0) dot.y = canvas.height;
  });

  // Move enemies along with the map to make it look like the player is moving
  enemies.forEach((enemy) => {
    if (keyState.w) enemy.y += WalkSpeed; // Move up
    if (keyState.a) enemy.x += WalkSpeed; // Move left
    if (keyState.s) enemy.y -= WalkSpeed; // Move down
    if (keyState.d) enemy.x -= WalkSpeed; // Move right
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

// --- 11. Star Dots ---
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

// --- 12. Enemies ---
function spawnEnemies() {
  enemies = []; // Reset enemies
  for (let i = 0; i < wave * 5; i++) {
    enemies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: 20,
      height: 20,
      speed: 1 + wave * 0.1, // Increase speed with waves
      color: "green",
      lastAttackTime: 0,
      damage: 5 * (wave / 2),
    });
  }
}

function isEnemyNearPlayer(enemy, distance = 40) {
  const dx = enemy.x - player.x;
  const dy = enemy.y - player.y;
  return Math.sqrt(dx * dx + dy * dy) < distance;
}

function moveEnemies() {
  enemies.forEach((enemy) => {
    // Simple chasing logic: move towards the player
    // AI

    // Move towards the player
    let speed = enemy.speed
    let Xpos = enemy.x;
    let Ypos = enemy.y;

    // change Xpos and Ypos a little bit randomly

    let maxMemory = Math.max(5 - (0.05 * wave), 0);
    let MemoryX = Math.random() * maxMemory;
    let MemoryY = Math.random() * maxMemory;

    Xpos += MemoryX;
    Ypos += MemoryY; 

    if (Difficulty > 0) {
      speed = speed * 1.25
    }

    if (Difficulty <= 3) {
      if (Xpos < player.x) enemy.x += enemy.speed;
      if (Xpos > player.x) enemy.x -= enemy.speed;
      if (Ypos < player.y) enemy.y += enemy.speed;
      if (Ypos > player.y) enemy.y -= enemy.speed;
    }

    if (Difficulty >= 3) {
      if (enemy.x < player.x) enemy.x += enemy.speed;
      if (enemy.x > player.x) enemy.x -= enemy.speed;
      if (enemy.y < player.y) enemy.y += enemy.speed;
      if (enemy.y > player.y) enemy.y -= enemy.speed;
    }

    // Enemy separation logic
    const minDistance = 24; // Minimum allowed distance between enemy centers
    for (let i = 0; i < enemies.length; i++) {
      for (let j = i + 1; j < enemies.length; j++) {
        const dx = enemies[i].x - enemies[j].x;
        const dy = enemies[i].y - enemies[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDistance && dist > 0) {
          // Calculate how much to push each enemy apart
          const overlap = (minDistance - dist) / 2;
          const ox = (dx / dist) * overlap;
          const oy = (dy / dist) * overlap;
          enemies[i].x += ox;
          enemies[i].y += oy;
          enemies[j].x -= ox;
          enemies[j].y -= oy;
        }
      }
    }
  }); // <-- This closes forEach
} // <-- This closes moveEnemies

function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// --- 13. Collision Handling ---
function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function handleCollisions() {
  const now = Date.now();
  enemies.forEach((enemy) => {
    if (isEnemyNearPlayer(enemy, 10)) {
      if (now - enemy.lastAttackTime >= 500) { // half a second delay
        Health -= enemy.damage; // or whatever damage value
        enemy.lastAttackTime = now; // update last attack time

        if (Health <= 0) {
          console.log("Game Over!");
          enemies = [];
          resetGame();
        }
      }
    }
  });
}

// --- 14. Upgrades with Luck Integration ---
const baseProbabilities = {
  common: 0.4,
  uncommon: 0.3,
  rare: 0.2,
  legendary: 0.05,
  godly: 0.025,
  demonic: 0.02,
  unknown: 0.005,
};

function GetUpgrades() {
  // Adjust probabilities based on Luck
  const adjustedProbabilities = { ...baseProbabilities };
  adjustedProbabilities.legendary += Luck * 0.01;
  adjustedProbabilities.rare += Luck * 0.005;
  adjustedProbabilities.common -= Luck * 0.015;

  // Normalize probabilities
  const totalProbability = Object.values(adjustedProbabilities).reduce((a, b) => a + b, 0);
  for (const rarity in adjustedProbabilities) {
    adjustedProbabilities[rarity] /= totalProbability;
  }

  // Randomly select an upgrade
  const random = Math.random();
  let cumulative = 0;
  let selectedRarity = "common"; // Default to common

  for (const rarity in adjustedProbabilities) {
    cumulative += adjustedProbabilities[rarity];
    if (random < cumulative) {
      selectedRarity = rarity;
      break;
    }
  }

  // Filter upgrades by selected rarity
  const possibleUpgrades = Upgrades.filter(upgrade => upgrade.rarity === selectedRarity);

  // Randomly pick one upgrade from the list
  const selectedUpgrade = possibleUpgrades[Math.floor(Math.random() * possibleUpgrades.length)];

  console.log(`Upgrade chosen: ${selectedUpgrade.name} (${selectedUpgrade.rarity})`);
  return selectedUpgrade;
}

// --- 15. UI Elements ---
function drawCoins() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`Coins: ${Coins}`, canvas.width - 20, 30);
}

// In your gameLoop function:
timerAnimElapsed += 1000 / 60; // assuming 60fps, adjust if you use delta timing

if (timerAnimElapsed >= timerAnimDuration) {
    timerAnimElapsed = 0;
}

function drawTimer() {
  // Calculate scale based on time elapsed
  let progress = timerAnimElapsed / timerAnimDuration;
  // Ease out for "pop" effect
  let scale = 1 + (timerPopScale - 1) * Math.pow(progress, 0.5);

  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = `${timerBaseFontSize * scale}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(`${timeLeft}`, canvas.width / 2, 10);
  ctx.restore();
}

// Draw Health
function drawHealth() {
  // Bar background
  ctx.fillStyle = "green";
  ctx.fillRect(20, 50, Health * 2, 20); // Health bar
  ctx.strokeStyle = "white";
  ctx.strokeRect(20, 50, 200, 20); // Health bar border

  // Centered text
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `${Health}`,
    20 + 200 / 2,
    50 + 20 / 2
  );
}

// Draw Level/Experience
function drawLevel() {
  
    // background 
  ctx.fillStyle = "grey";
  ctx.fillRect(20, 100, 200, 20); 
  ctx.strokeStyle = "white";
  ctx.strokeRect(20, 100, 200, 20); // Bar border
  
  // Bar
  ctx.fillStyle = "white";
  ctx.fillRect(20, 100, (Experience / NeededExperience) * 200, 20); // Exp bar, normalized to bar width
  ctx.strokeStyle = "white";
  ctx.strokeRect(20, 100, 200, 20); // Bar border

  // Centered text
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `${Math.floor(Experience)} / ${NeededExperience}           Level: ${Level}`,
    20 + 200 / 2,
    100 + 20 / 2
    
  );
}

// --- 16. Timer and Resize Handling ---
function changeTimer() {
  if (inRound) {
    if (timeLeft > 0) {
      timeLeft--;
      timerAnimElapsed = 0;
    } else {
      inRound = false; // End the round
      showUpgradeMenu();
      clearInterval(timerInterval);
    }
  }
}

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    pauseGameForFullscreen();
  }
});

function pauseGameForFullscreen() {
  pausedForFullscreen = true;
  inRound = false;
  showFullscreenPopup();
}

function showFullscreenPopup() {
  if (document.getElementById("fullscreenPopup")) return; // Prevent multiple popups

  const overlay = document.createElement("div");
  overlay.id = "fullscreenPopup";
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0,0,0,0.85)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "1000";

  const message = document.createElement("h2");
  message.innerText = "Game paused. Please return to fullscreen to continue!";
  message.style.color = "white";
  message.style.marginBottom = "20px";

  const button = document.createElement("button");
  button.innerText = "Return to Fullscreen";
  button.style.fontSize = "20px";
  button.style.padding = "10px 30px";
  button.onclick = () => {
    enterFullscreen();
    overlay.remove();
    pausedForFullscreen = false;
    // Only resume the game if the upgrade menu is NOT open
    if (!document.getElementById("upgradeOverlay")) {
      inRound = true;
    }
  };

  overlay.appendChild(message);
  overlay.appendChild(button);
  document.body.appendChild(overlay);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  generateGridDots(); // Regenerate grid dots to fit new canvas size
});

// --- 17. Debugging ---
const DEBUG = false;

function logDebug(message) {
  if (DEBUG) console.log(`[DEBUG]: ${message}`);
}

// --- 18. Upgrade Menu ---
function showUpgradeMenu() {
    
  if (document.getElementById('upgradeOverlay')) return;
  
  // Pause the game loop
  inRound = false;

  // Create a semi-transparent overlay
  const overlay = document.createElement("div");
  overlay.id = "upgradeOverlay";
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "10";

  // Add title
  const title = document.createElement("h1");
  title.innerText = "Choose Your Upgrade";
  title.style.color = "white";
  title.style.marginBottom = "20px";
  overlay.appendChild(title);

  // Create upgrade options
  const upgrades = [
    { name: "Increase Damage", effect: () => (Damage += 1) },
    { name: "Increase Walk Speed", effect: () => (WalkSpeed += 0.5) },
    { name: "Increase Health", effect: () => (Health += 20) },
  ];

  upgrades.forEach((upgrade) => {
    const button = document.createElement("button");
    button.innerText = upgrade.name;
    button.style.padding = "10px 20px";
    button.style.margin = "10px";
    button.style.fontSize = "18px";
    button.style.cursor = "pointer";
    button.addEventListener("click", () => {
      upgrade.effect(); // Apply upgrade effect
      document.body.removeChild(overlay); // Remove overlay
      inRound = true; // Resume the game loop
    });
    overlay.appendChild(button);
  });

  // Append overlay to the body
  document.body.appendChild(overlay);
}
// --- Reset ---
function resetGame() {
  location.reload();
}
