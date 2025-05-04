let bowlingBall
let canPressZ = true // Flag to prevent multiple 'Z' presses

// Create bowling ball
export async function createBall(scene) {
  try {
    const result = await BABYLON.SceneLoader.ImportMeshAsync("", Assets.meshes.bowlingBall_glb.rootUrl, Assets.meshes.bowlingBall_glb.filename, scene);
    bowlingBall = result.meshes[1]
    bowlingBall.scaling.scaleInPlace(0.2)
    bowlingBall.position = new BABYLON.Vector3(0, 0.5, -5)

    // Create physics for the bowling ball
    const ballAggregate = new BABYLON.PhysicsAggregate(
      bowlingBall,
      BABYLON.PhysicsShapeType.SPHERE,
      {
        mass: 1,
        restitution: 0.25,
      },
      scene,
    )

    // Store reference to the physics aggregate directly on the ball
    bowlingBall.physicsAggregate = ballAggregate

    if (ballAggregate.body) {
      ballAggregate.body.disablePreStep = false
      console.log("Ball physics created successfully")
    } else {
      console.warn("Ball body not created properly")
    }

    return bowlingBall
  } catch (error) {
    console.error("Error creating ball:", error)
  }
}

// Reset the ball
export const resetBall = async (scene) => {
  if (getShotsTaken() >= 2) {
    console.log("Round over, no more shots allowed.")
    return // Exit early if it's already the second shot
  }

  // If there's an existing ball, dispose of it and its physics
  if (bowlingBall) {
    if (bowlingBall.physicsImpostor) {
      bowlingBall.physicsImpostor.dispose()
    }
    bowlingBall.dispose()
    bowlingBall = null
  }

  // Create a new ball
  await createBall(scene)
  canPressZ = true // Allow 'Z' press again
}

// Throw the ball
export const throwBall = () => {
  if (canPressZ && bowlingBall && getShotsTaken() < 2) {
    if (bowlingBall.physicsAggregate && bowlingBall.physicsAggregate.body) {
      console.log("Throwing ball")

      bowlingBall.physicsAggregate.body.applyImpulse(new BABYLON.Vector3(0, 0, 20), bowlingBall.getAbsolutePosition())
      canPressZ = false
      return true
    } else {
      console.log("Cannot find physics body for ball")
    }
  }
  return false
}

// Move the ball left
export const moveBallLeft = () => {
  if (bowlingBall) bowlingBall.position.x += 0.1
}

// Move the ball right
export const moveBallRight = () => {
  if (bowlingBall) bowlingBall.position.x -= 0.1
}

// Get shots taken from pins.js
const getShotsTaken = () => {
  return window.gameState?.shotsTaken || 0
}

// Export ball for other modules
export { bowlingBall, canPressZ }
