import { createBall } from "./ball.js"
import { createPins, checkFallenPins } from "./pins.js"
import { setupKeyboardControls } from "./controls.js"

let canvas

// Create the scene
export const createScene = async (engine, canvasElement) => {
  canvas = canvasElement
  const scene = new BABYLON.Scene(engine)

  // Create camera
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene)
  camera.setTarget(BABYLON.Vector3.Zero())
  camera.attachControl(canvas, true)

  // Create light
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene)
  light.intensity = 0.7

  // Setup physics
  const gravityVector = new BABYLON.Vector3(0, -9.81, 0)
  const physicsPlugin = new BABYLON.HavokPlugin()
  scene.enablePhysics(gravityVector, physicsPlugin)

  // Create bowling lane
  const lane = BABYLON.MeshBuilder.CreateGround("lane", { width: 6, height: 50 }, scene)
  lane.position = new BABYLON.Vector3(0, 0, 4)
  new BABYLON.PhysicsAggregate(lane, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene)

  // Create pins and ball
  await createPins(scene)
  await createBall(scene)

  // Setup keyboard controls
  setupKeyboardControls(scene, checkFallenPins)

  return scene
}
