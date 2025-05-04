import { resetBall } from "./ball.js"
import { resetGame } from "./pins.js"
import { scene } from "./game.js"

let retryButton
let replayButton

// Create Replay Button
export const createReplayButton = () => {
  if (replayButton) {
    replayButton.remove()
  }

  replayButton = document.createElement("button")
  replayButton.innerText = "Round Suivant"
  replayButton.style.position = "absolute"
  replayButton.style.top = "60%" // Move button down a bit
  replayButton.style.left = "50%"
  replayButton.style.transform = "translate(-50%, -50%)"
  replayButton.style.padding = "10px 20px"
  replayButton.style.fontSize = "1.5em"
  replayButton.style.cursor = "pointer"
  document.body.appendChild(replayButton)

  replayButton.addEventListener("click", () => {
    // Reload the page to proceed to the next round
    window.location.reload() // Reloads the page but retains localStorage values
  })
}

// Create Retry Button
export const createRetryButton = () => {
  // Remove existing retry button if it exists
  if (retryButton) {
    retryButton.remove()
  }

  retryButton = document.createElement("button")
  retryButton.innerText = "Second shot"
  retryButton.style.position = "absolute"
  retryButton.style.top = "60%" // Move button down a bit
  retryButton.style.left = "50%"
  retryButton.style.transform = "translate(-50%, -50%)"
  retryButton.style.padding = "10px 20px"
  retryButton.style.fontSize = "1.5em"
  retryButton.style.cursor = "pointer"
  document.body.appendChild(retryButton)

  retryButton.addEventListener("click", () => {
    resetBall(scene) // Reset ball and allow retry
    retryButton.style.display = "none" // Hide retry button
  })
}

// Create New Round Button
export const createNewRoundButton = () => {
  const newRoundButton = document.createElement("button")
  newRoundButton.innerText = "Nouvelle partie"
  newRoundButton.style.position = "absolute"
  newRoundButton.style.top = "70%" // Move button down a bit more
  newRoundButton.style.left = "50%"
  newRoundButton.style.transform = "translate(-50%, -50%)"
  newRoundButton.style.padding = "10px 20px"
  newRoundButton.style.fontSize = "1.5em"
  newRoundButton.style.cursor = "pointer"
  document.body.appendChild(newRoundButton)

  newRoundButton.addEventListener("click", () => {
    resetGame() // Reset the game to start a new round
  })
}

// Create New Game Button
export const createNewGame = () => {
  replayButton = document.createElement("button")
  replayButton.innerText = "Restart a new game"
  replayButton.style.position = "absolute"
  replayButton.style.top = "60%" // Move button down a bit
  replayButton.style.left = "50%"
  replayButton.style.transform = "translate(-50%, -50%)"
  replayButton.style.padding = "10px 20px"
  replayButton.style.fontSize = "1.5em"
  replayButton.style.cursor = "pointer"
  document.body.appendChild(replayButton)

  replayButton.addEventListener("click", () => {
    // Reload the page to proceed to the next round
    window.location.reload() // Reloads the page but retains localStorage values
  })
}

export { retryButton, replayButton }
