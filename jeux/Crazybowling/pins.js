import { updateSessionScore, displayRound, displaySessionScore, incrementRound } from "./score.js"
import { createRetryButton, createReplayButton } from "./ui.js"
import { resetBall } from "./ball.js"
import { scene } from "./game.js"

let pins // Array to hold the pin meshes
const fallenPinsSet = new Set()
let shotsTaken = 0

// Initialize game state
if (typeof window !== "undefined" && !window.gameState) {
  window.gameState = {
    shotsTaken: 0,
  }
}

// Create bowling pins
export async function createPins(scene) {
  const result = await BABYLON.SceneLoader.ImportMeshAsync("", Assets.meshes.bowlingPinpin_glb.rootUrl, Assets.meshes.bowlingPinpin_glb.filename, scene);
  const bowlingPin = result.meshes[1]
  bowlingPin.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3)
  bowlingPin.setEnabled(false)

  // Pin positions
  const ZPinShiftFactor = 19 // Factor so it shifts the pins to
  const pinPositions = [
    new BABYLON.Vector3(0, 0, 5 + ZPinShiftFactor),
    new BABYLON.Vector3(0.5, 0, 6 + ZPinShiftFactor),
    new BABYLON.Vector3(-0.5, 0, 6 + ZPinShiftFactor),
    new BABYLON.Vector3(0, 0, 7 + ZPinShiftFactor),
    new BABYLON.Vector3(1, 0, 7 + ZPinShiftFactor),
    new BABYLON.Vector3(-1, 0, 7 + ZPinShiftFactor),
    new BABYLON.Vector3(-1.5, 0, 8 + ZPinShiftFactor),
    new BABYLON.Vector3(-0.5, 0, 8 + ZPinShiftFactor),
    new BABYLON.Vector3(0.5, 0, 8 + ZPinShiftFactor),
    new BABYLON.Vector3(1.5, 0, 8 + ZPinShiftFactor),
  ]

  // Create instances of the bowling pin
  pins = pinPositions.map((positionInSpace, idx) => {
    const pin = new BABYLON.InstancedMesh("pin-" + idx, bowlingPin)
    pin.position = positionInSpace
    new BABYLON.PhysicsAggregate(
      pin,
      BABYLON.PhysicsShapeType.CONVEX_HULL,
      {
        mass: 1,
        restitution: 0.25,
      },
      scene,
    )
    return pin
  })
  return pins
}

// Check fallen pins and update session score
export const checkFallenPins = () => {
  let newlyFallenCount = 0

  if (pins) {
    pins.forEach((pin, index) => {
      if (pin.rotationQuaternion) {
        const rotation = pin.rotationQuaternion.toEulerAngles()
        const isFallen =
          Math.abs(BABYLON.Tools.ToDegrees(rotation.x)) > 15 ||
          Math.abs(BABYLON.Tools.ToDegrees(rotation.z)) > 15 ||
          pin.position.y < -0.5

        if (isFallen && !fallenPinsSet.has(index)) {
          fallenPinsSet.add(index) // Track newly fallen pin
          newlyFallenCount++
          pin.setEnabled(false) // Hide it visually
        }
      }
    })
  }

  // Update session score only by the number of NEW pins knocked down this shot
  updateSessionScore(newlyFallenCount)
  shotsTaken++
  window.gameState.shotsTaken = shotsTaken

  // End the round if two shots are taken or all pins are knocked down
  if (shotsTaken >= 2 || fallenPinsSet.size === 10) {
    setTimeout(() => {
      createReplayButton()
      alert(fallenPinsSet.size === 10 ? "Strike! You knocked all the pins down!" : "Round over, you took two shots!")
      incrementRound()
      resetRound()
    }, 1000)
  } else {
    // Prepare for second shot
    setTimeout(() => {
      createRetryButton()
      alert("Shoot your second shot!")
    }, 1000)
  }
}

// Reset the round
export const resetRound = () => {
  shotsTaken = 0
  window.gameState.shotsTaken = 0
  fallenPinsSet.clear() // Clear fallen pins tracking
  displayRound()
  displaySessionScore()
}

// Reset the game
export const resetGame = async () => {
  // Reset pins
  if (pins) {
    pins.forEach((pin) => pin.setEnabled(true)) // Enable all pins again
  }

  // Reset shots and score
  shotsTaken = 0
  window.gameState.shotsTaken = 0
  displaySessionScore()
  displayRound() // Ensure session score display is recreated

  // Reset the ball
  await resetBall(scene)
}

// Export for other modules
export { pins, shotsTaken, fallenPinsSet }
