import { moveBallLeft, moveBallRight, throwBall } from "./ball.js"

// Setup keyboard controls
export const setupKeyboardControls = (scene, checkFallenPins) => {
  scene.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
      case BABYLON.KeyboardEventTypes.KEYDOWN:
        switch (kbInfo.event.key.toLowerCase()) {
          case "q":
            moveBallLeft()
            break
          case "d":
            moveBallRight()
            break
          case "z":
            if (throwBall()) {
              setTimeout(() => {
                checkFallenPins()
              }, 7000)
            }
            break
        }
        break
    }
  })
}
