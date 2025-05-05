import { createScene } from "./scene.js"
import { initializeScores, displayRound, loadRound, stopGame } from "./score.js"
let engine
let scene
let sceneToRender
const maxRounds = 5

// Initialize the game
export const initializeGame = async (canvas) => {
  // Initialize scores and round
  initializeScores()
  initializeRound()

  // Initialize the engine and scene
  await initFunction(canvas)
}

// Initialize the round
const initializeRound = () => {
  const round = loadRound() // Load the saved round
  if (round > maxRounds) {
    stopGame() // Stop the game if maxRounds is reached
  }
  displayRound() // Display the round number
}

// Initialize the engine and scene
const initFunction = async (canvas) => {
  // Use the global HavokPhysics object that's loaded from the script tag
  globalThis.HK = await HavokPhysics()

  // Create the engine
  engine = await createEngine(canvas)
  if (!engine) throw "engine should not be null."

  // Start render loop
  startRenderLoop(engine)

  // Create the scene
  scene = await createScene(engine, canvas)
  sceneToRender = scene

  // Handle window resize
  window.addEventListener("resize", () => {
    engine.resize()
  })
}

// Create the engine
const createEngine = async (canvas) => {
  try {
    return new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false,
    })
  } catch (e) {
    console.log("The available createEngine function failed. Creating the default engine instead")
    return new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false,
    })
  }
}

// Start render loop
const startRenderLoop = (engine) => {
  engine.runRenderLoop(() => {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render()
    }
  })
}

// Export for other modules
export { scene, engine, maxRounds }
