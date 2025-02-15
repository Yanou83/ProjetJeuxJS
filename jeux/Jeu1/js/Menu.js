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
        // BONNE PRATIQUE : on sauvegarde le contexte
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

        // BONNE PRATIQUE : on restore le contexte à la fin
        this.ctx.restore();
    }

    hidePauseMenu() {
        // Effacer le canvas pour enlever le menu de pause
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
