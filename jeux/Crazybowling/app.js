let canvas;
let engine;
let scene;
let sceneToRender;
let retryButton;
let replayButton;
let canPressZ = true; // Flag to prevent multiple 'Z' presses
let pins; // Array to hold the pin meshes
let score = 0; // Current round score (reset after each round)
let sessionScore = 0; // Total session score (accumulated score across rounds)
let bowlingBall; // Reference to the ball mesh
let round = 1;
let crazybowlingLocaldev = true;
let maxRounds = 3;  // Set the maximum rounds to 3 (you can change this as needed)
let shotsTaken = 0;  // Track the number of shots per round

const saveSessionScore = (sessionScore) => {
    localStorage.setItem('sessionScore', sessionScore);
};

// Load session score from localStorage
const loadSessionScore = () => {
    const savedSessionScore = localStorage.getItem('sessionScore');
    return savedSessionScore ? parseInt(savedSessionScore) : 0;
};

// Handle authentication (same as your original code)
const handleAuth = () => {
    if (crazybowlingLocaldev){
        return true;
    } else {
        const isAuthenticated = sessionStorage.getItem("isAuthenticated");
        const userEmail = sessionStorage.getItem("userEmail");
        if (isAuthenticated === "false" || isAuthenticated === null || !userEmail) {
            window.location.href = "/login";
            return false;
        }
        console.log("UTILISATEUR AUTHENTIFIÉ : ", userEmail);
        localStorage.removeItem('sessionScore');
        return true;
    }
};

const getCurrentEmailPlayer = () => {
    const userEmail = sessionStorage.getItem("scoreKey");
    if (userEmail){
        return userEmail;
    } else {
        return "No email Found";
    }
}

// Initialize the session score
const initializeScores = () => {
    sessionScore = loadSessionScore(); // Load total session score
    displaySessionScore();
    displayRound();
};

// Display the session score (total score)
const displaySessionScore = () => {
    const existingScoreDisplay = document.getElementById("sessionScoreDisplay");
    if (existingScoreDisplay) {
        existingScoreDisplay.remove();
    }

    const scoreDisplay = document.createElement("div");
    scoreDisplay.id = "sessionScoreDisplay";
    scoreDisplay.innerText = `Session Score: ${sessionScore}`;
    scoreDisplay.style.position = "absolute";
    scoreDisplay.style.top = "10px"; // Position the score at the top
    scoreDisplay.style.right = "10px"; // Position it on the top right
    scoreDisplay.style.fontSize = "1.5em";
    scoreDisplay.style.fontWeight = "bold";
    scoreDisplay.style.color = "black"; // Adjust color as needed
    document.body.appendChild(scoreDisplay);
};

const displayRound = () => {
    let roundDisplay = document.getElementById("roundDisplay");

    if (!roundDisplay) {
        roundDisplay = document.createElement("div");
        roundDisplay.id = "roundDisplay";
        roundDisplay.style.position = "absolute";
        roundDisplay.style.top = "30px"; // Position the score at the top
        roundDisplay.style.right = "10px"; // Position it on the top right
        roundDisplay.style.fontSize = "1.5em";
        roundDisplay.style.fontWeight = "bold";
        roundDisplay.style.color = "black"; // Adjust color as needed
        document.body.appendChild(roundDisplay);
    }

    // Get the current round from localStorage
    const currentRound = loadRound();

    // Update the round display text
    roundDisplay.innerText = `Round : ${currentRound}`;
};

const saveRound = (round) => {
    localStorage.setItem("currentRound", round);
};

const loadRound = () => {
    const savedRound = localStorage.getItem("currentRound");
    return savedRound ? parseInt(savedRound) : 1; // Default to round 1 if not found
};

// Update the session score after each ball shot
const updateSessionScore = (pinsDown) => {
    sessionScore += pinsDown; // Add the number of pins knocked down to session score
    saveSessionScore(sessionScore); // Save the updated session score to localStorage
    displaySessionScore(); // Update the display
    displayRound();
};

// Check fallen pins and update session score
const checkFallenPins = () => {
    let fallenCount = 0;
    if (pins) {
        pins.forEach(pin => {
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
    }

    // Make sure to update score correctly by only adding the fallen pins once
    score = fallenCount;

    // Update session score after counting fallen pins
    updateSessionScore(score);
    shotsTaken++;

    // End the round if two shots are taken or all pins are knocked down
    if (shotsTaken >= 2 || fallenCount === 10) {
        setTimeout(() => {
            createReplayButton();
            alert(fallenCount === 10 ? "Strike! You knocked all the pins down!" : "Round over, you took two shots!");
            incrementRound(); // Use the new function to increment the round correctly
            resetRound(); // Reset shots for the next round
        }, 1000);
    } else {
        // Show retry button for the second shot
        setTimeout(() => {
            createRetryButton();
            alert("Shoot your second shot!");
        }, 1000);
    }
};

const incrementRound = () => {
    if (round < maxRounds) {
        round++;
        saveRound(round); // Save the new round value to localStorage
        displayRound(); // Update the round display
    } else {
        stopGame(); // Stop the game if maxRounds is reached
    }
};

const createNewGame = () => {
    replayButton = document.createElement("button");
    replayButton.innerText = "Restart a new game";
    replayButton.style.position = "absolute";
    replayButton.style.top = "60%"; // Move button down a bit
    replayButton.style.left = "50%";
    replayButton.style.transform = "translate(-50%, -50%)";
    replayButton.style.padding = "10px 20px";
    replayButton.style.fontSize = "1.5em";
    replayButton.style.cursor = "pointer";
    document.body.appendChild(replayButton);

    replayButton.addEventListener("click", () => {
        // Reload the page to proceed to the next round
        window.location.reload(); // Reloads the page but retains localStorage values
    });
}
const stopGame = () => {
    alert("Game Over! You've completed all the rounds.");
    clearLocalStorage();
    createNewGame();  // Optionally show a replay button or another way to restart
    resetGame();  // Reset game elements, optionally disable further actions
};

const resetRound = () => {
    shotsTaken = 0; // Reset the shot counter for the next round
    score = 0; // Reset the score for the next round
    displayRound(); // Update round display
    displaySessionScore(); // Update session score display
};

const resetBall = async () => {
    if (shotsTaken >= 2) {
        console.log("Round over, no more shots allowed.");
        return; // Exit early if it's already the second shot
    }

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

// Create the return button
const createReturnButton = () => {
    const returnButton = document.createElement("button");
    returnButton.innerText = "Retour au menu principal";
    
    returnButton.style.position = "absolute";
    returnButton.style.top = "10px"; 
    returnButton.style.left = "10px"; 
    returnButton.style.padding = "10px 20px";
    returnButton.style.fontSize = "1.2em";
    returnButton.style.cursor = "pointer";
    returnButton.style.backgroundColor = "#4CAF50"; 
    returnButton.style.color = "white"; 
    returnButton.style.border = "none";
    returnButton.style.borderRadius = "5px";

    document.body.appendChild(returnButton);

    returnButton.addEventListener("click", () => {
        window.location.href = "/"; 
    });
};

createReturnButton();

// Start render loop
const startRenderLoop = (engine, canvas) => {
    const auth_object = handleAuth();
    if (auth_object){
        localStorage.removeItem("sessionScore");
        engine.runRenderLoop(() => {
            if (sceneToRender && sceneToRender.activeCamera) {
                sceneToRender.render();
            }
        });
    }
};

// Create Replay Button
const createReplayButton = () => {
    replayButton = document.createElement("button");
    replayButton.innerText = "Round Suivant";
    replayButton.style.position = "absolute";
    replayButton.style.top = "60%"; // Move button down a bit
    replayButton.style.left = "50%";
    replayButton.style.transform = "translate(-50%, -50%)";
    replayButton.style.padding = "10px 20px";
    replayButton.style.fontSize = "1.5em";
    replayButton.style.cursor = "pointer";
    document.body.appendChild(replayButton);

    replayButton.addEventListener("click", () => {
        // Reload the page to proceed to the next round
        window.location.reload(); // Reloads the page but retains localStorage values
    });
};

// Create Retry Button
const createRetryButton = () => {
    // Remove existing retry button if it exists
    if (retryButton) {
        retryButton.remove();
    }
    
    retryButton = document.createElement("button");
    retryButton.innerText = "Second shot";
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

// Create New Round Button
const createNewRoundButton = () => {
    const newRoundButton = document.createElement("button");
    newRoundButton.innerText = "Nouvelle partie";
    newRoundButton.style.position = "absolute";
    newRoundButton.style.top = "70%"; // Move button down a bit more
    newRoundButton.style.left = "50%";
    newRoundButton.style.transform = "translate(-50%, -50%)";
    newRoundButton.style.padding = "10px 20px";
    newRoundButton.style.fontSize = "1.5em";
    newRoundButton.style.cursor = "pointer";
    document.body.appendChild(newRoundButton);

    newRoundButton.addEventListener("click", () => {
        resetGame(); // Reset the game to start a new round
    });
};

// Reset the game to start a new round
const resetGame = async () => {
    // Reset pins
    if (pins) {
        pins.forEach(pin => pin.setEnabled(true)); // Enable all pins again
    }
    
    // Reset shots and score
    shotsTaken = 0;
    score = 0;
    displaySessionScore();
    displayRound(); // Ensure session score display is recreated

    // Reset the round and start from 1 again
    round = 1;
    saveRound(round);
    displayRound();

    // Reset the ball
    await resetBall();
};

// Create bowling ball
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

// Create the scene
const createScene = async () => {
    scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    const gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    const physicsPlugin = new BABYLON.HavokPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);
    light.intensity = 0.7;

    const lane = BABYLON.MeshBuilder.CreateGround("lane", { width: 6, height: 50 }, scene);
    lane.position = new BABYLON.Vector3(0, 0, 4);
    new BABYLON.PhysicsAggregate(lane, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene);

    await createPins(scene);
    await createBall(scene);

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
                        if (canPressZ && bowlingBall && shotsTaken < 2) {  // Only allow shots if less than 2 shots have been taken
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
    const ZPinShiftFactor = 19; // Factor so it shifts the pins to
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

const initializeRound = () => {
    round = loadRound(); // Load the saved round
    if (round > maxRounds) {
        stopGame();  // Automatically stop the game if the round exceeds maxRounds
    }
    displayRound(); // Display the round number
};

// Initialize the game
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

const clearLocalStorage = () => {
    localStorage.removeItem("sessionScore");
    localStorage.removeItem("currentRound");
    console.log("LocalStorage cleared before starting the game.");
};

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById("renderCanvas");
    initializeScores(); // Initialize score from localStorage
    initializeRound(); // Initialize the round number
    initFunction().then(() => {
        console.log("Bowling game initialized successfully");
    });
});
