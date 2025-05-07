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
let upgrades = [];
let shopItems = [];
let mapDots = [];

// --- Canvas Setup ---
const canvas = document.createElement("canvas");
canvas.id = "gameCanvas";
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

// --- Player Setup ---
let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 30,
  height: 30,
  color: "blue",
  speed: 3,
};

// --- Start Button ---
document.getElementById("PlayButton").addEventListener("click", startGame);

function startGame() {
  gamestarted = true;
  document.getElementById("PlayButton").style.display = "none";
  document.getElementById("header").style.display = "none";
  enterFullscreen();
  generateMapDots();
  gameLoop();
}

// --- Game Loop ---
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMapDots();
  drawPlayer();
  drawCoins();
  
  if (inRound) {
    Experience += 0.05; // Slower XP gain

    if (Experience >= NeededExperience) {
      Level += 1;
      Experience = 0;
      NeededExperience = Math.floor(NeededExperience * 1.5);
      upgradeQueue += 1;
    }
    
    updateStats();
  } else {
    showUpgradeMenu();
  }

  requestAnimationFrame(gameLoop);
}

// --- Movement ---
document.addEventListener("keydown", (e) => {
  if (!inRound) return;
  switch (e.key) {
    case "ArrowUp": player.y += player.speed; break;
    case "ArrowDown": player.y -= player.speed; break;
    case "ArrowLeft": player.x += player.speed; break;
    case "ArrowRight": player.x -= player.speed; break;
  }
});

// --- Draw Player ---
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// --- Draw Coins ---
function drawCoins() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "right";
  ctx.fillText(`Coins: ${coins}`, canvas.width - 20, 30);
}

// --- Draw Map Dots ---
function generateMapDots() {
  for (let i = 0; i < 100; i++) {
    mapDots.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3,
    });
  }
}

function drawMapDots() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
  mapDots.forEach((dot) => {
    dot.x -= 0.5;
    if (dot.x < 0) dot.x = canvas.width;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

// --- Upgrade Menu ---
function showUpgradeMenu() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(100, 100, 600, 400);

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Choose an Upgrade:", 300, 150);

  if (upgrades.length === 0) {
    generateUpgrades();
  }

  upgrades.forEach((upgrade, index) => {
    ctx.fillStyle = "#333";
    ctx.fillRect(120 + index * 110, 200, 100, 150);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(120 + index * 110, 200, 100, 150);
    
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(upgrade.name, 130 + index * 110, 250);
    ctx.fillText(`+${upgrade.value}`, 130 + index * 110, 280);
  });
}

// --- Generate Upgrades ---
function generateUpgrades() {
  upgrades = [];
  let possibleUpgrades = [
    { name: "Damage", value: Math.floor(Math.random() * 5) + 1 },
    { name: "Health", value: Math.floor(Math.random() * 20) + 10 },
    { name: "Crit Chance", value: Math.floor(Math.random() * 5) + 1 },
    { name: "Attack Speed", value: Math.floor(Math.random() * 0.5) + 0.1 },
    { name: "Luck", value: Math.floor(Math.random() * 5) + 1 },
  ];

  while (upgrades.length < 5) {
    let upgrade = possibleUpgrades[Math.floor(Math.random() * possibleUpgrades.length)];
    if (Math.random() < (0.5 + luck / 1000)) {
      upgrades.push(upgrade);
    }
  }
}

// --- Choose Upgrade ---
canvas.addEventListener("click", (e) => {
  if (!inRound) {
    let x = e.offsetX, y = e.offsetY;
    upgrades.forEach((upgrade, index) => {
      if (x > 120 + index * 110 && x < 220 + index * 110 && y > 200 && y < 350) {
        applyUpgrade(upgrade);
        inRound = true;
        upgrades = [];
      }
    });
  }
});

// --- Apply Upgrade ---
function applyUpgrade(upgrade) {
  switch (upgrade.name) {
    case "Damage": Damage += upgrade.value; break;
    case "Health": Health += upgrade.value; break;
    case "Crit Chance": CritChance += upgrade.value; break;
    case "Attack Speed": AttackSpeed += upgrade.value; break;
    case "Luck": luck += upgrade.value; break;
  }
}

// --- Fullscreen ---
function enterFullscreen() {
  if (canvas.requestFullscreen) canvas.requestFullscreen();
}

// --- Update Stats ---
function updateStats() {
  console.log(`Level: ${Level}, XP: ${Experience.toFixed(1)}, Coins: ${coins}`);
}
