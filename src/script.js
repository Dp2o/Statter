// --- Stats ---
let Damage = 1;
let AttackSpeed = 1; // multiplies attack speed by 1.5 for every AttackSpeed.
let Health = 100;
let Level = 1;
let Experience = 0;
let NeededExperience = 100;
let coins = 100;

// --- secondary stats ---
let luck = 0; // max 1000 percent, changes luck percentage. luck changes by 1 every round.
let CritChance = 0; // percent
let ProjectileDamageMultiplier = 1; // percent
let MeleeDamageMultiplier = 1; // percent
let Interest = 5; // percent, after upgrading the interest goes up by one and the player claims interest on how much they have left.
let TrackingProjectiles = false; // makes projectiles track targets a little.
let ExplodingProjectiles = false; // self explanatory
let explosionsize = 1; // changes explosion size in grid, 1 = 1 grid. Does not add explosion affect to bullets, only ExplodingProjectiles can

// Game logic Variables
let gamestarted = false;
let gambling = false; // activates a slot machine after upgrading. Cherryx3 = 10 coins || 7x3 = 100 coins || 1-6 = 10 coins
// ---------------
let Difficulty = 0; 
// Difficulty 0 = no changes to stats
// Difficulty 1 = no interest to start, enemies have 1.5 times more damage and health
// Difficulty 2 = no coins to start, interest to start and enemies have 2 times more health and damage
// Difficulty 3 = Difficulty 2 but stats don't change every round anymore.
// Difficulty 4 = Difficulty 3 but enemies have 3 times more health
// Difficulty 5 = Difficulty 4, start with 1 health, 0.1 attack speed, and has gambling enabled with twice the chance to get 1-6.


// --- Pre-game Cheat Check ---
checkCheats();

// --- Start Button ---
document.getElementById("PlayButton").addEventListener("click", startGame);

// --- Start Game Function ---
function startGame() {
  gamestarted = true;

  // Hide UI elements
  document.getElementById("PlayButton").style.display = "none";
  document.getElementById("header").style.display = "none";

  // Create and add a canvas
  const canvas = document.createElement("canvas");
  canvas.id = "gameCanvas";
  canvas.width = 800;
  canvas.height = 600;
  canvas.style.border = "1px solid black";
  document.getElementById("gameContainer").appendChild(canvas);

  // Start game loop
  setInterval(gameLoop, 500); // every 100ms

  console.log("Game started!");
}

// --- Game Loop ---
function gameLoop() {
  // Gain experience
  Experience += 1;

  // Level up logic
  if (Experience >= NeededExperience) {
    Level += 1;
    Experience = 0;
    NeededExperience = Math.floor(NeededExperience * 1.5);
    console.log(`Leveled up to ${Level}`);
  }

  updateStats();
}

// --- Cheat Checker ---
function checkCheats() {
  if (Health !== 100) console.log("Cheating detected: Health");
  if (Damage !== 1) console.log("Cheating detected: Damage");
  if (Level !== 1) console.log("Cheating detected: Level");
  if (Experience !== 0) console.log("Cheating detected: Experience");
  if (NeededExperience !== 100) console.log("Cheating detected: NeededExperience");
}

// --- Update Stats on Screen ---
function updateStats() {
  const dmgEl = document.getElementById("damage");
  const hpEl = document.getElementById("health");
  const lvlEl = document.getElementById("level");
  const expEl = document.getElementById("experience");

  if (dmgEl) dmgEl.textContent = Damage;
  if (hpEl) hpEl.textContent = Health;
  if (lvlEl) lvlEl.textContent = Level;
  if (expEl) expEl.textContent = Math.floor(Experience);
}
