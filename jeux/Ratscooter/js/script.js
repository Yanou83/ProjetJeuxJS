import Game from "./Game.js";
import MainMenu from "./MainMenu.js";

// Bonne pratique : avoir une fonction appelée une fois
// que la page est prête, que le DOM est chargé, etc.
window.onload = init;

async function init() {
    // Vérifier si l'utilisateur est authentifié
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    const userEmail = sessionStorage.getItem("userEmail");
    if (isAuthenticated === "false" || isAuthenticated === null || !userEmail) {
        window.location.href = "/login";
        return;
    }
    console.log("UTILISATEUR AUTHENTIFIÉ : ", userEmail);

    // On recupère le canvas
    let canvas = document.querySelector("#myCanvas");

    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;

    // Créer une instance du menu principal
    let mainMenu = new MainMenu(canvas, startGame);

    async function startGame(selectedColor, soundActivated) {
        // Cacher le menu principal
        mainMenu.hideMenu();

        // On cree une instance du jeu
        let game = new Game(canvas, selectedColor, soundActivated);

        game.onGameRestart = () => restartGame(selectedColor, soundActivated);

        // ici on utilise await car la méthode init est asynchrone
        // typiquement dans init on charge des images, des sons, etc.
        await game.init();

        // Attendre que tous les éléments soient chargés
        await game.loadAssets();

        // on peut démarrer le jeu
        game.start();
    }

    async function restartGame(selectedColor, soundActivated) {
        // Supprimer le canvas avant de recréer le jeu
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Créer une nouvelle instance du jeu
        let newGame = new Game(canvas, selectedColor, soundActivated);
        newGame.onGameRestart = () => restartGame(selectedColor, soundActivated);

        await newGame.init();
        await newGame.loadAssets();
        newGame.start();
    }
}