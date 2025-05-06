// --- Stats ---
let Damage = 1;
let Health = 100;
let Level = 1;
let Experience = 0;
let NeededExperience = 100;
let gamestarted = false;

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
  setInterval(gameLoop, 100); // every 100ms

  console.log("Game started!");
}

// --- Game Loop ---
function gameLoop() {
  // Cheat check
  checkCheats();

  // Gain experience
  Experience += 1;

  // Level up logic
  if (Experience >= NeededExperience) {
    Level += 1;
    Experience = 0;
    NeededExperience = Math.floor(NeededExperience * 1.4);
    console.log(`Leveled up to ${Level}`);
  }

  updateStats();
}

// --- Cheat Checker ---
function checkCheats() {
  if (Health !== 100) console.log("Cheating detected: Health reset");
  if (Damage !== 1) console.log("Cheating detected: Damage reset");
  if (Level !== 1) console.log("Cheating detected: Level reset");
  if (Experience !== 0 && Experience < 100) console.log("Cheating detected: Experience reset");
  if (NeededExperience !== 100 && NeededExperience < 100) console.log("Cheating detected: NeededExperience reset");
}

// --- Update Stats on Screen ---
function updateStats() {
  // These need to exist in the HTML if you want to show them
  const dmgEl = document.getElementById("damage");
  const hpEl = document.getElementById("health");
  const lvlEl = document.getElementById("level");
  const expEl = document.getElementById("experience");

  if (dmgEl) dmgEl.textContent = Damage;
  if (hpEl) hpEl.textContent = Health;
  if (lvlEl) lvlEl.textContent = Level;
  if (expEl) expEl.textContent = Experience;
}
