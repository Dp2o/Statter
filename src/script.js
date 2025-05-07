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
let gambling = true;
let Difficulty = 0;
let upgradeQueue = 0;
let inRound = true;
let showShopMenu = false;
let showGamblingMenu = false;
let shopItems = [];
let spinCount = 0;
let gameTimer = 0;

// --- Canvas Setup ---
document.getElementById("PlayButton").addEventListener("click", startGame);

function startGame() {
  gamestarted = true;
  document.getElementById("PlayButton").style.display = "none";
  document.getElementById("header").style.display = "none";
  enterFullscreen();

  const canvas = document.createElement("canvas");
  canvas.id = "gameCanvas";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  setInterval(gameLoop, 16); // 60 FPS
  console.log("Game started!");
}

// --- Game Loop ---
function gameLoop() {
  if (!inRound) return;
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer(ctx, canvas);
  drawHealthBar(ctx);
  drawCoins(ctx, canvas);

  // Experience and Level Up Logic
  Experience += 0.1;
  if (Experience >= NeededExperience) {
    Level++;
    Experience = 0;
    NeededExperience = Math.floor(NeededExperience * 1.5);
    upgradeQueue++;
    console.log(`Leveled up to ${Level}`);
  }

  // Round Timer
  gameTimer += 16; // 16ms per frame
  if (gameTimer >= 60000) { // 1 minute
    inRound = false;
    gameTimer = 0;
    handleRoundEnd();
  }
}

// --- Draw Player ---
function drawPlayer(ctx, canvas) {
  ctx.fillStyle = "blue";
  ctx.fillRect(canvas.width / 2 - 25, canvas.height / 2 - 25, 50, 50);
}

// --- Draw Health Bar ---
function drawHealthBar(ctx) {
  ctx.fillStyle = "red";
  ctx.fillRect(20, 20, 200 * (Health / 100), 20);
  ctx.strokeStyle = "black";
  ctx.strokeRect(20, 20, 200, 20);
}

// --- Draw Coins ---
function drawCoins(ctx, canvas) {
  ctx.fillStyle = "gold";
  ctx.font = "20px Arial";
  ctx.textAlign = "right";
  ctx.fillText(`Coins: ${coins}`, canvas.width - 20, 40);
}

// --- Round End Logic ---
function handleRoundEnd() {
  showShopMenu = true;
  showShop();
}

// --- Shop Display ---
function showShop() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Shop - Choose an item", canvas.width / 2, 100);

  shopItems = generateShopItems();
  shopItems.forEach((item, index) => {
    ctx.fillStyle = "grey";
    ctx.fillRect(150 + index * 100, 200, 80, 80);
    ctx.fillStyle = "white";
    ctx.fillText(item.name, 150 + index * 100 + 40, 250);
  });

  // Continue Button
  ctx.fillStyle = "green";
  ctx.fillRect(canvas.width / 2 - 100, canvas.height - 100, 200, 50);
  ctx.fillStyle = "white";
  ctx.fillText("Continue", canvas.width / 2, canvas.height - 65);

  canvas.addEventListener("click", handleShopClick);
}

// --- Shop Items Generation ---
function generateShopItems() {
  return [
    { name: "Damage +1", effect: () => Damage++ },
    { name: "Health +10", effect: () => Health += 10 },
    { name: "Attack Speed +0.1", effect: () => AttackSpeed += 0.1 },
    { name: "Crit Chance +5%", effect: () => CritChance += 5 },
    { name: "Interest +1%", effect: () => Interest++ },
    { name: "Coins +50", effect: () => coins += 50 },
    { name: "Luck +1", effect: () => luck++ },
    { name: "Projectile Damage +0.1", effect: () => ProjectileDamageMultiplier += 0.1 },
    { name: "Melee Damage +0.1", effect: () => MeleeDamageMultiplier += 0.1 },
    { name: "Health Regen +1", effect: () => Health += 1 }
  ];
}

// --- Shop Interaction ---
function handleShopClick(event) {
  const canvas = document.getElementById("gameCanvas");
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (y > canvas.height - 100 && y < canvas.height - 50 && x > canvas.width / 2 - 100 && x < canvas.width / 2 + 100) {
    showShopMenu = false;
    if (gambling) {
      showGambling();
    } else {
      startNextRound();
    }
  }
}

// --- Gambling Display ---
function showGambling() {
  console.log("Gambling started (template).");
  startNextRound();
}

// --- Start Next Round ---
function startNextRound() {
  inRound = true;
  coins += Math.floor(coins * (Interest / 100));
  console.log("Next round starts!");
}

// --- Fullscreen ---
function enterFullscreen() {
  const docEl = document.documentElement;
  if (docEl.requestFullscreen) docEl.requestFullscreen();
}
