import Vehicule from "./Vehicule.js";

export default class MainMenu {
    constructor(canvas, startGameCallback) {
        this.canvas = canvas;
        this.startGameCallback = startGameCallback;
        this.selectedColor = "grey"; // Couleur initiale du scooter
        this.createMenu();
    }

    createMenu() {
        // Créer un conteneur pour le fond flouté
        this.overlay = document.createElement("div");
        this.overlay.id = "menu-overlay";
        document.body.appendChild(this.overlay);

        // Créer un conteneur pour le menu
        this.menuContainer = document.createElement("div");
        this.menuContainer.id = "main-menu";
        document.body.appendChild(this.menuContainer);

        // Ajouter un titre
        const title = document.createElement("h1");
        title.innerText = "🛵 Ratscooter";
        this.menuContainer.appendChild(title);

        // Ajouter une ligne décorative
        const separator = document.createElement("div");
        separator.className = "separator";
        this.menuContainer.appendChild(separator);

        // Ajouter un canevas pour afficher le scooter
        this.scooterCanvas = document.createElement("canvas");
        this.scooterCanvas.width = 200;
        this.scooterCanvas.height = 200;
        this.scooterCanvas.id = "scooter-preview";
        this.menuContainer.appendChild(this.scooterCanvas);

        // Initialiser le scooter avec la couleur par défaut
        this.scooter = new Vehicule(this.selectedColor);
        this.scooter.load().then(() => this.updateScooterDisplay());

        // Créer la palette de couleurs
        this.createColorPicker();

        // Ajouter un bouton pour démarrer le jeu
        const startButton = document.createElement("button");
        startButton.innerText = "▶ Démarrer le jeu";
        startButton.onclick = () => {
            this.hideMenu();
            this.startGameCallback(this.selectedColor);
        };
        this.menuContainer.appendChild(startButton);

        // Ajouter un bouton pour revenir au site
        const backButton = document.createElement("button");
        backButton.innerText = "🏠 Retour à l\'accueil";
        backButton.onclick = () => {
            window.location.href = "/";
        };
        this.menuContainer.appendChild(backButton);
    }

    createColorPicker() {
        const colors = ["#007BFF", "red", "yellow", "green", "pink", "purple", "#17A2B8", "orange", "grey"];
        const colorPickerContainer = document.createElement("div");
        colorPickerContainer.id = "color-picker-container";

        colors.forEach(color => {
            const colorCircle = document.createElement("div");
            colorCircle.className = "color-circle";
            colorCircle.style.backgroundColor = color;
            colorCircle.onclick = () => {
                this.selectedColor = color;
                this.updateScooterDisplay();
            };
            colorPickerContainer.appendChild(colorCircle);
        });

        this.menuContainer.appendChild(colorPickerContainer);
    }

    updateScooterDisplay() {
        const ctx = this.scooterCanvas.getContext("2d");
        ctx.clearRect(0, 0, this.scooterCanvas.width, this.scooterCanvas.height);

        ctx.save();
        ctx.translate(25, 25);
        this.scooter.couleur = this.selectedColor;
        this.scooter.draw(ctx);
        ctx.restore();
    }

    hideMenu() {
        this.overlay.style.opacity = "0";
        this.menuContainer.style.opacity = "0";
        this.menuContainer.style.transform = "translate(-50%, -45%) scale(0.95)";

        setTimeout(() => {
            this.menuContainer.style.display = "none";
            this.overlay.style.display = "none";
        }, 500);
    }
}
