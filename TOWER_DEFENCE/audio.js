class GameAudio {
    constructor() {
        // Musique de fond en boucle
        this.backgroundMusic = new Audio('assets/audios/BackgroundSound.mp3');        
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        
        // Tableau pour stocker tous les effets sonores
        this.soundEffects = {
            clickOnBtn: new Audio('assets/audios/buttonSound.mp3'),
            hit: new Audio('assets/audios/hit.mp3'),
            selectTower: new Audio('assets/audios/selectedSound.mp3'),
            build: new Audio('assets/audios/build.mp3'),
            victory: new Audio('assets/audios/victory.mp3'),
            gameOver: new Audio('assets/audios/gameOver.mp3')
        };
    }

    // Démarrer la musique de fond
    playBackgroundMusic() {
        this.backgroundMusic.play()
    }

    // Jouer un effet sonore
    playSound(soundName, volume = 0.2) {
        if (this.soundEffects[soundName]) {
            // Cloner le son pour permettre des lectures simultanées
            const sound = this.soundEffects[soundName].cloneNode();
            sound.volume = volume;
            sound.play()
        }
    }
}