import { maxRounds } from "./game.js"
import { createNewGame } from "./ui.js"

const score = 0 // Current round score (reset after each round)
let sessionScore = 0 // Total session score (accumulated score across rounds)
let round = 1

// Save session score to localStorage
export const saveSessionScore = (score) => {
  localStorage.setItem("sessionScore", score)
}

// Load session score from localStorage
export const loadSessionScore = () => {
  const savedSessionScore = localStorage.getItem("sessionScore")
  return savedSessionScore ? Number.parseInt(savedSessionScore) : 0
}

// Save round to localStorage
export const saveRound = (roundNum) => {
  localStorage.setItem("currentRound", roundNum)
}

// Load round from localStorage
export const loadRound = () => {
  const savedRound = localStorage.getItem("currentRound")
  return savedRound ? Number.parseInt(savedRound) : 1 // Default to round 1 if not found
}

// Initialize the session score
export const initializeScores = () => {
  sessionScore = loadSessionScore() // Load total session score
  displaySessionScore()
  displayRound()
}

// Display the session score (total score)
export const displaySessionScore = () => {
  const existingScoreDisplay = document.getElementById("sessionScoreDisplay")
  if (existingScoreDisplay) {
    existingScoreDisplay.remove()
  }

  const scoreDisplay = document.createElement("div")
  scoreDisplay.id = "sessionScoreDisplay"
  scoreDisplay.innerText = `Score: ${sessionScore}`
  scoreDisplay.style.position = "absolute"
  scoreDisplay.style.top = "10px" // Position the score at the top
  scoreDisplay.style.right = "10px" // Position it on the top right
  scoreDisplay.style.fontSize = "1.5em"
  scoreDisplay.style.fontWeight = "bold"
  scoreDisplay.style.color = "white" // Adjust color as needed
  document.body.appendChild(scoreDisplay)
}

// Display the round
export const displayRound = () => {
  let roundDisplay = document.getElementById("roundDisplay")

  if (!roundDisplay) {
    roundDisplay = document.createElement("div")
    roundDisplay.id = "roundDisplay"
    roundDisplay.style.position = "absolute"
    roundDisplay.style.top = "40px" // Position the score at the top
    roundDisplay.style.right = "10px" // Position it on the top right
    roundDisplay.style.fontSize = "1.5em"
    roundDisplay.style.fontWeight = "bold"
    roundDisplay.style.color = "white" // Adjust color as needed
    document.body.appendChild(roundDisplay)
  }

  // Get the current round from localStorage
  const currentRound = loadRound()

  // Update the round display text
  roundDisplay.innerText = `Manche: ${currentRound} / ${maxRounds}`
}

// Update the session score after each ball shot
export const updateSessionScore = (pinsDown) => {
  sessionScore += pinsDown // Add the number of pins knocked down to session score
  saveSessionScore(sessionScore) // Save the updated session score to localStorage
  displaySessionScore() // Update the display
  displayRound()
}

// Increment the round
export const incrementRound = () => {
  round = loadRound()
  if (round < maxRounds) {
    round++
    saveRound(round) // Save the new round value to localStorage
    displayRound() // Update the round display
  } else {
    stopGame() // Stop the game if maxRounds is reached
  }
}

// Stop the game
export const stopGame = () => {
  handleFinalScore()
  clearLocalStorage()
  createNewGame() // Show a replay button to restart
}

// Clear localStorage
export const clearLocalStorage = () => {
  localStorage.removeItem("sessionScore")
  localStorage.removeItem("currentRound")
  console.log("LocalStorage cleared before starting the game.")
}

export const handleFinalScore = () => {
  const userEmail = sessionStorage.getItem("userEmail")
  const finalScore = localStorage.getItem("sessionScore");
  if (finalScore >= getBestScore(userEmail, "Crazybowling")){
    saveBestScore(parseInt(finalScore), userEmail, "Crazybowling")
    console.log("saved best score")
  } 
  else {
    console.log("Not a best score didnt save it")
  }
}

export const getBestScore = (userEmail, gameName) => {

  if (!userEmail || !gameName) {
      console.error("Données utilisateur ou jeu invalides pour récupérer le score.");
      return 0;
  }

  let storedUserData = localStorage.getItem(userEmail);

  if (!storedUserData) {
      console.warn(`Aucun score trouvé pour l'utilisateur ${userEmail}.`);
      return 0;
  }

  let userData = JSON.parse(storedUserData);
  return userData.scores?.[gameName] || 0;
}

export const saveBestScore = (score, userEmail, gameName) => {
  if (!userEmail || !gameName) {
      console.error("Données utilisateur ou jeu invalides pour l'enregistrement du score.");
      return;
  }

  // Récupérer les données de l'utilisateur dans localStorage
  let storedUserData = localStorage.getItem(userEmail);

  if (!storedUserData) {
      console.error(`Utilisateur avec l'email ${userEmail} non trouvé.`);
      return;
  }

  let userData = JSON.parse(storedUserData);

  // Vérifier si le champ `scores` existe, sinon l'initialiser
  if (!userData.scores) {
      userData.scores = {};
  }

  // Ajouter ou mettre à jour le score du jeu
  if (!userData.scores[gameName] || score > userData.scores[gameName]) {
      userData.scores[gameName] = score;

      // Sauvegarde dans localStorage
      localStorage.setItem(userEmail, JSON.stringify(userData));
  }
}

export { score, sessionScore, round }
