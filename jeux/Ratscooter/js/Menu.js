import { getBestScore } from '../../scores.js'; 

export default class Menu {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.isPaused = false;
        this.game = game;
        this.createPauseMenu();
        this.createGameOverMenu();
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.showPauseMenu();
        } else {
            this.hidePauseMenu();
            this.game.resumeGame();
        }
    }

    createPauseMenu() {
        // Fond flouté
        this.pauseOverlay = document.createElement("div");
        this.pauseOverlay.id = "pause-menu-overlay";

        // Conteneur du menu pause
        this.pauseMenuContainer = document.createElement("div");
        this.pauseMenuContainer.id = "pause-menu";

        // Ajouter un titre "Pause"
        const title = document.createElement("h1");
        title.innerText = "Pause";
        this.pauseMenuContainer.appendChild(title);

        // Séparateur
        const separator = document.createElement("div");
        separator.className = "separator";
        this.pauseMenuContainer.appendChild(separator);

        // Bouton "Reprendre le jeu"
        const resumeButton = document.createElement("button");
        resumeButton.innerText = "▶ Reprendre le jeu";
        resumeButton.onclick = () => this.togglePause();
        this.pauseMenuContainer.appendChild(resumeButton);

        // Bouton "Retour au menu principal"
        const mainMenuButton = document.createElement("button");
        mainMenuButton.innerText = "🏠 Retour menu principal";
        mainMenuButton.onclick = () => {
            window.location.reload(); // Recharge la page pour revenir au menu principal
        };
        this.pauseMenuContainer.appendChild(mainMenuButton);

        // Ajouter les éléments au DOM
        this.pauseOverlay.appendChild(this.pauseMenuContainer);
        document.body.appendChild(this.pauseOverlay);
    }


    createGameOverMenu() {
        const userEmail = this.game.userEmail;
        const gameName = this.game.gameName;

        // Fond flouté du menu Game Over
        this.gameOverOverlay = document.createElement("div");
        this.gameOverOverlay.id = "game-over-menu-overlay";

        // Conteneur du menu Game Over
        this.gameOverMenuContainer = document.createElement("div");
        this.gameOverMenuContainer.id = "game-over-menu";

        // Ajouter un titre "Game Over"
        const title = document.createElement("h1");
        title.innerText = "Game Over";
        this.gameOverMenuContainer.appendChild(title);

        // Séparateur
        const separator = document.createElement("div");
        separator.className = "separator";
        this.gameOverMenuContainer.appendChild(separator);

        // Score réalisé lors de la partie
        const currentScoreText = document.createElement("p");
        currentScoreText.id = "current-score"; // Ajout de l'ID pour pouvoir le mettre à jour plus tard
        currentScoreText.innerText = `Score réalisé: ${this.game.score}`;
        this.gameOverMenuContainer.appendChild(currentScoreText);



        // Meilleur score du joueur
        const bestScore = getBestScore(userEmail, gameName);
        const bestScoreText = document.createElement("p");
        bestScoreText.innerText = `Meilleur score: ${bestScore}`;
        this.gameOverMenuContainer.appendChild(bestScoreText);

        // Bouton "Recommencer le jeu"
        const restartButton = document.createElement("button");
        restartButton.innerText = "🔄 Nouvelle partie";
        restartButton.onclick = () => {
            this.hideGameOverMenu();
            this.game.resetGame(); // Appeler la méthode resetGame pour réinitialiser le jeu
        };
        this.gameOverMenuContainer.appendChild(restartButton);

        // Bouton "Retour menu principal"
        const mainMenuButton = document.createElement("button");
        mainMenuButton.innerText = "🏠 Retour menu principal";
        mainMenuButton.onclick = () => {
            window.location.reload();
        };
        this.gameOverMenuContainer.appendChild(mainMenuButton);

        // Ajouter au DOM
        this.gameOverOverlay.appendChild(this.gameOverMenuContainer);
        document.body.appendChild(this.gameOverOverlay);
    }


    showPauseMenu() {
        this.pauseOverlay.classList.add("visible");
    }

    hidePauseMenu() {
        this.pauseOverlay.classList.remove("visible");
    }

    showGameOverMenu() {
        // Met à jour le score au moment d'afficher le menu
        const currentScoreText = this.gameOverMenuContainer.querySelector("#current-score");
        if (currentScoreText) {
            currentScoreText.innerText = `Score réalisé: ${this.game.score}`;
        }

        this.gameOverOverlay.classList.add("visible");
    }

    hideGameOverMenu() {
        this.gameOverOverlay.classList.remove("visible");
    }

    // Icône de pause
    drawPauseIcon() {
        const iconSize = 50;
        this.ctx.save();
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(10, 10, iconSize, iconSize);
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(23.5, 20.5, 8, 30);
        this.ctx.fillRect(38.5, 20.5, 8, 30);
        this.ctx.restore();
    }

    handlePauseIconClick(x, y) {
        const iconSize = 50;
        if (x >= 10 && x <= 10 + iconSize && y >= 10 && y <= 10 + iconSize) {
            this.togglePause();
        }
    }
}
