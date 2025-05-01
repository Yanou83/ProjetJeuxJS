let canvas;
let engine;
let scene;
let sceneToRender;
let retryButton;
let replayButton;
let canPressZ = true; // Flag to prevent multiple 'Z' presses
let pins; // Array to hold the pin meshes
let score = 0;
let bowlingBall; // Reference to the ball mesh

const startRenderLoop = (engine, canvas) => {
    engine.runRenderLoop(() => {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
};

const createReplayButton = () => {
    replayButton = document.createElement("button");
    replayButton.innerText = "Rejouer";
    replayButton.style.position = "absolute";
    replayButton.style.top = "60%"; // Move button down a bit
    replayButton.style.left = "50%";
    replayButton.style.transform = "translate(-50%, -50%)";
    replayButton.style.padding = "10px 20px";
    replayButton.style.fontSize = "1.5em";
    replayButton.style.cursor = "pointer";
    document.body.appendChild(replayButton);

    replayButton.addEventListener("click", () => {
        window.location.reload(); // Reload the page to replay
    });
};

const createRetryButton = () => {
    // Remove existing retry button if it exists
    if (retryButton) {
        retryButton.remove();
    }
    
    retryButton = document.createElement("button");
    retryButton.innerText = "Continuer pour faire tomber les balles restantes";
    retryButton.style.position = "absolute";
    retryButton.style.top = "60%"; // Move button down a bit
    retryButton.style.left = "50%";
    retryButton.style.transform = "translate(-50%, -50%)";
    retryButton.style.padding = "10px 20px";
    retryButton.style.fontSize = "1.5em";
    retryButton.style.cursor = "pointer";
    document.body.appendChild(retryButton);

    retryButton.addEventListener("click", () => {
        resetBall(); // Reset ball and allow retry
        retryButton.style.display = "none"; // Hide retry button
    });
};

const displayScore = () => {
    // Remove existing score display if it exists
    const existingScoreDisplay = document.getElementById("scoreDisplay");
    if (existingScoreDisplay) {
        existingScoreDisplay.remove();
    }
    
    const scoreDisplay = document.createElement("div");
    scoreDisplay.id = "scoreDisplay";
    scoreDisplay.innerText = `Score ${score}`;
    scoreDisplay.style.position = "absolute";
    scoreDisplay.style.top = "70%"; // Move score display below the button
    scoreDisplay.style.left = "50%";
    scoreDisplay.style.transform = "translate(-50%, -50%)";
    scoreDisplay.style.fontSize = "2em";
    scoreDisplay.style.fontWeight = "bold";
    scoreDisplay.style.color = "black"; // Adjust color as needed
    document.body.appendChild(scoreDisplay);
};

const checkFallenPins = () => {
    let fallenCount = 0;
    if (pins) {
        pins.forEach(pin => {
            // Check if the pin has rotated significantly on the X or Z axis
            if (pin.rotationQuaternion) {
                const rotation = pin.rotationQuaternion.toEulerAngles();
                if (Math.abs(BABYLON.Tools.ToDegrees(rotation.x)) > 15 || 
                    Math.abs(BABYLON.Tools.ToDegrees(rotation.z)) > 15 || 
                    pin.position.y < -0.5) {
                    fallenCount++;
                    pin.setEnabled(false); // Disable the fallen pin
                }
            }
        });
        score = fallenCount;
        displayScore();

        // Create "Retry" or "Replay" button based on the score
        if (score === 10) {
            // All pins knocked down, show replay button
            setTimeout(() => {
                createReplayButton();
                alert("You knocked all the pins down!");
            }, 1000);
        } else {
            // Not all pins knocked down, show retry button
            setTimeout(() => {
                createRetryButton();
            }, 1000);
        }
    }
};

// Reset the ball's position for the next shot
const resetBall = async () => {
    // If there's an existing ball, dispose of it and its physics
    if (bowlingBall) {
        if (bowlingBall.physicsImpostor) {
            bowlingBall.physicsImpostor.dispose();
        }
        bowlingBall.dispose();
        bowlingBall = null;
    }
    
    // Create a new ball
    await createBall(scene);
    canPressZ = true; // Allow 'Z' press again
};

// Create the bowling ball
async function createBall(scene) {
    try {
        const result = await BABYLON.SceneLoader.ImportMeshAsync("", Assets.meshes.bowlingBall_glb.rootUrl, Assets.meshes.bowlingBall_glb.filename, scene);
        bowlingBall = result.meshes[1];
        bowlingBall.scaling.scaleInPlace(0.2);
        bowlingBall.position = new BABYLON.Vector3(0, 0.5, -5);
        
        // Create physics for the bowling ball
        const ballAggregate = new BABYLON.PhysicsAggregate(bowlingBall, BABYLON.PhysicsShapeType.SPHERE, {
            mass: 1,
            restitution: 0.25
        }, scene);
        
        // Store reference to the physics aggregate directly on the ball
        bowlingBall.physicsAggregate = ballAggregate;
        
        if (ballAggregate.body) {
            ballAggregate.body.disablePreStep = false;
            console.log("Ball physics created successfully");
        } else {
            console.warn("Ball body not created properly");
        }
        
        return bowlingBall;
    } catch (error) {
        console.error("Error creating ball:", error);
    }
}

const createScene = async () => {
    // This creates a basic Babylon Scene object (non-mesh)
    scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Enable physics engine
    const gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    const physicsPlugin = new BABYLON.HavokPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Create bowling lane
    const lane = BABYLON.MeshBuilder.CreateGround("lane", {
        width: 6,
        height: 50
    }, scene);
    lane.position = new BABYLON.Vector3(0, 0, 4);
    new BABYLON.PhysicsAggregate(lane, BABYLON.PhysicsShapeType.BOX, {
        mass: 0
    }, scene);

    // Create bowling pins
    await createPins(scene);

    // Create the bowling ball
    await createBall(scene);
    
    // Set up keyboard controls
    setupKeyboardControls(scene);

    return scene;
};

// Setup keyboard controls
const setupKeyboardControls = (scene) => {
    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                switch (kbInfo.event.key.toLowerCase()) {
                    case "q":
                        if (bowlingBall) bowlingBall.position.x += 0.1;
                        break;
                    case "d":
                        if (bowlingBall) bowlingBall.position.x -= 0.1;
                        break;
                    case "z":
                        if (canPressZ && bowlingBall) {
                            if (bowlingBall.physicsAggregate && bowlingBall.physicsAggregate.body) {
                                // Use the direct reference we stored on the ball
                                console.log("Throwing ball");
                                bowlingBall.physicsAggregate.body.applyImpulse(
                                    new BABYLON.Vector3(0, 0, 20), 
                                    bowlingBall.getAbsolutePosition()
                                );
                                canPressZ = false;
                                setTimeout(() => {
                                    checkFallenPins();
                                }, 7000);
                            } else {
                                console.log("Cannot find physics body for ball");
                            }
                        }
                        break;
                }
                break;
        }
    });
};

// Create bowling pins
async function createPins(scene) {
    const result = await BABYLON.SceneLoader.ImportMeshAsync("", Assets.meshes.bowlingPinpin_glb.rootUrl, Assets.meshes.bowlingPinpin_glb.filename, scene);
    const bowlingPin = result.meshes[1];
    bowlingPin.scaling = new BABYLON.Vector3(0.3, 0.3, 0.3);
    bowlingPin.setEnabled(false);

    // Pin positions
    const ZPinShiftFactor = 15;
    const YPinShiftFactor = 2;
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
        new BABYLON.Vector3(1.5, 0, 8 + ZPinShiftFactor)
    ];

    // Create instances of the bowling pin
    pins = pinPositions.map(function(positionInSpace, idx) {
        const pin = new BABYLON.InstancedMesh("pin-" + idx, bowlingPin);
        pin.position = positionInSpace;
        new BABYLON.PhysicsAggregate(pin, BABYLON.PhysicsShapeType.CONVEX_HULL, {
            mass: 1,
            restitution: 0.25
        }, scene);
        return pin;
    });
    return pins;
}

const initFunction = async () => {
    globalThis.HK = await HavokPhysics();

    const asyncEngineCreation = async () => {
        try {
            return new BABYLON.Engine(canvas, true, {
                preserveDrawingBuffer: true,
                stencil: true,
                disableWebGL2Support: false
            });
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return new BABYLON.Engine(canvas, true, {
                preserveDrawingBuffer: true,
                stencil: true,
                disableWebGL2Support: false
            });
        }
    };

    engine = await asyncEngineCreation();

    const engineOptions = engine.getCreationOptions?.();
    if (!engineOptions || engineOptions.audioEngine !== false) {
        // Audio engine initialization (if needed)
    }
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    scene = await createScene();
    sceneToRender = scene;

    // Resize
    window.addEventListener("resize", () => {
        engine.resize();
    });
};

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById("renderCanvas");
    initFunction().then(() => {
        console.log("Bowling game initialized successfully");
    });
});

