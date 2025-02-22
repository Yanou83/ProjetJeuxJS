export default class Menu {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.isPaused = false;
        this.game = game; 
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.showPauseMenu();
        } else {
            this.hidePauseMenu();
            this.game.resumeGame(); // Indique au jeu de reprendre
        }
    }

    showPauseMenu() {
        this.ctx.save();

        // Dessiner un fond semi-transparent
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner le texte du menu de pause
        this.ctx.fillStyle = "white";
        this.ctx.font = "30px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Pause", this.canvas.width / 2, this.canvas.height / 2 - 20);
        this.ctx.fillText("Appuyez sur Echap pour reprendre", this.canvas.width / 2, this.canvas.height / 2 + 20);

        this.ctx.restore();
    }

    hidePauseMenu() {
        // Effacer le canvas pour enlever le menu de pause
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Icone de pause
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

    showGameOverMenu() {
        this.ctx.save();

        // Dessiner un fond semi-transparent
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner le texte du menu de game over
        this.ctx.fillStyle = "white";
        this.ctx.font = "30px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Game Over", this.canvas.width / 2, this.canvas.height / 2 - 20);
        this.ctx.fillText("Appuyez sur Echap pour revenir au menu principal", this.canvas.width / 2, this.canvas.height / 2 + 20);

        this.ctx.restore();
    }
}
