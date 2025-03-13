class Menu {
    constructor(game) {
        this.game = game;

        this.createMenu();
    }

    createMenu() {
        this.menuElement = document.createElement("div");
        this.menuElement.classList.add("menu");
        this.menuElement.innerHTML = `
            <h1 class="game-title">🔥 Tower Defense 🔥</h1>
            <button id="resumeBtn" class="menu-btn">Resume</button>
            <button id="restartBtn" class="menu-btn">Restart</button>
            <button id="startBtn" class="menu-btn">Start Game</button>
            <button id="exitBtn" class="menu-btn">Exit</button>
        `;

        this.menuElement.style.display = "flex";
        this.menuElement.style.flexDirection = "column";
        this.menuElement.style.position = 'absolute';
        this.menuElement.style.zIndex = 10000;
        document.body.appendChild(this.menuElement);

        // Récupérer les btn
        this.startBtn = document.getElementById("startBtn");
        this.exitBtn = document.getElementById("exitBtn");
        this.resumeBtn = document.getElementById("resumeBtn");
        this.restartBtn = document.getElementById("restartBtn");
        
        this.restartBtn.style.display = "none";
        this.resumeBtn.style.display = "none";

        // Ajout des événements
        document.getElementById("startBtn").addEventListener("click", () => {
            this.hide();
        });

        document.getElementById("exitBtn").addEventListener("click", () => {
            this.exitGame();
        });

        document.getElementById("resumeBtn").addEventListener("click", () => {
            this.hide();
        });

        document.getElementById("restartBtn").addEventListener("click", () => {
            this.game.restart();
            this.hide();
        });

        document.body.classList.add("disabled-overlay");
    }

    exitButton() {
        this.menuElement.innerHTML = `
        <h1 class="game-title">🔥 Tower Defense 🔥</h1>
        <button id="resumeBtn" class="menu-btn">Resume</button>
        <button id="restartBtn" class="menu-btn">Restart</button>
        <button id="exitBtn" class="menu-btn">Exit</button>
        `;
        // ARattacher les événements
        document.getElementById("exitBtn").addEventListener("click", () => {
            this.exitGame();
        });

        document.getElementById("resumeBtn").addEventListener("click", () => {
            this.hide();
        });

        document.getElementById("restartBtn").addEventListener("click", () => {
            this.game.restart();
            this.hide();
        });

        this.startBtn.style.display = "none";
        this.menuElement.style.display = "flex";
        document.body.classList.add("disabled-overlay");
        this.game.isPaused = false;
        this.game.pause()
    }

    hide() {
        this.game.isPaused = true;
        this.game.pause()
        this.menuElement.style.display = "none";
        document.body.classList.remove("disabled-overlay");
    }

    exitGame() {
        window.close();
    }

    // showVictoryScreen() {
    //     this.menuElement.innerHTML = `
    //         <h1 class="game-title">🔥 Victory 🔥</h1>
    //         <button id="restartBtn" class="menu-btn">Restart</button>
    //         <button id="exitBtn" class="menu-btn">Exit</button>
    //     `;
    // }
    showVictoryScreen() {
        // Ne pas changer isPaused ici, car on l'a déjà fait dans update()
        this.menuElement.innerHTML = `
            <h1 class="game-title">🔥 Victory 🔥</h1>
            <button id="restartBtn" class="menu-btn">Restart</button>
            <button id="exitBtn" class="menu-btn">Exit</button>
        `;

        // Réattacher les écouteurs d'événements
        document.getElementById("restartBtn").addEventListener("click", () => {
            this.game.restart();
            this.hide();
        });
        document.getElementById("exitBtn").addEventListener("click", () => {
            this.exitGame();
        });
        
        this.menuElement.style.display = "flex";
        document.body.classList.add("disabled-overlay");
    }

    showDefeatScreen() {
        // Ne pas changer isPaused ici, car on l'a déjà fait dans update()
        this.menuElement.innerHTML = `
            <h1 class="game-title">💀 Defeat 💀</h1>
            <button id="restartBtn" class="menu-btn">Restart</button>
            <button id="exitBtn" class="menu-btn">Exit</button>
        `;

        // Réattacher les écouteurs d'événements
        document.getElementById("restartBtn").addEventListener("click", () => {
            this.game.restart();
            this.hide();
        });
        document.getElementById("exitBtn").addEventListener("click", () => {
            this.exitGame();
        });
        
        this.menuElement.style.display = "flex";
        document.body.classList.add("disabled-overlay");
    }

}
