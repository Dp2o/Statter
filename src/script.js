// Stats
let Damage = 1;
let Health = 100;
let Level = 1;
let Experience = 0;
let NeededExperience = 100;
let gamestarted = false;
// Event listener for the start button
document.getElementById("PlayButton").addEventListener("click", startGame);
// check if variables are modified

if (gamestarted){checkcheats}

function checkcheats(){
  if (! Health === 100) {
    console.log("Cheating detected, resetting stats")
    }
  if (! Damage === 1){
    console.log("cheating detected, resetting stats")
  }
  if (! Level === 1){
    console.log("cheating detected, resetting stats")
  }
  if (! Experience === 0){
    console.log("cheating detected, resetting stats")
  }
  if (! NeededExperience === 100){
    console.log("cheating detected, resetting stats")
  }
}

// start the game

function startGame() {
  // Hide the play button when the game starts
  document.getElementById("PlayButton").style.display = "none";

  // Call the game loop function
  setInterval(gameLoop, 100);  // Game loop every second
  
  console.log("Game started!");
}

function gameLoop() {
  // Increase experience over time
  Experience += 1;
  // Level up logic
  if (Experience >= NeededExperience) {
    Level += 1;
    NeededExperience = NeededExperience * 1.4
    Experience = 0;  // Reset experience after leveling up
  }


  // Update the stats display
  updateStats();
}

function updateStats() {
  // Display the current stats on the page
  document.getElementById("damag e").textContent = Damage;
  document.getElementById("health").textContent = Health;
  document.getElementById("level").textContent = Level;
  document.getElementById("experience").textContent = Experience;
}
