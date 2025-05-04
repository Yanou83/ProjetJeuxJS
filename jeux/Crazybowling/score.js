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
  scoreDisplay.style.color = "black" // Adjust color as needed
  document.body.appendChild(scoreDisplay)
}

// Display the round
export const displayRound = () => {
  let roundDisplay = document.getElementById("roundDisplay")

  if (!roundDisplay) {
    roundDisplay = document.createElement("div")
    roundDisplay.id = "roundDisplay"
    roundDisplay.style.position = "absolute"
    roundDisplay.style.top = "30px" // Position the score at the top
    roundDisplay.style.right = "10px" // Position it on the top right
    roundDisplay.style.fontSize = "1.5em"
    roundDisplay.style.fontWeight = "bold"
    roundDisplay.style.color = "black" // Adjust color as needed
    document.body.appendChild(roundDisplay)
  }

  // Get the current round from localStorage
  const currentRound = loadRound()

  // Update the round display text
  roundDisplay.innerText = `Round: ${currentRound}`
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
  alert("Game Over! You've completed all the rounds.")
  clearLocalStorage()
  createNewGame() // Show a replay button to restart
}

// Clear localStorage
export const clearLocalStorage = () => {
  localStorage.removeItem("sessionScore")
  localStorage.removeItem("currentRound")
  console.log("LocalStorage cleared before starting the game.")
}

// Export for other modules
export { score, sessionScore, round }
