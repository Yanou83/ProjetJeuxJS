import { initializeGame } from "./game.js"
import { handleAuth, createReturnButton } from "./auth.js"

document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  if (!handleAuth()) {
    return // Exit if not authenticated
  }

  // Create return button
  createReturnButton()

  // Initialize the game
  const canvas = document.getElementById("renderCanvas")
  initializeGame(canvas)
})
