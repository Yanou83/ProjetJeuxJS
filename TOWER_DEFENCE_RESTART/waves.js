// A voir si je laisse pas la possibilité de lancer les va  gue toutes à la suite
class Waves {
    constructor(game) {
        this.game = game;
        this.waveNumber = 0;
        this.waveIsActive = false;

        this.nbEnneniesCreated = 0;
        this.timeoutIds = []; // Stocker les IDs des timeouts pour restar le jeux

        this.startWaveButton = document.getElementById("start-wave");
        this.startWaveButton.addEventListener('click', () => this.nextWave());

        this.queueEnnemis = []
    }

    startWave() {
        this.waveIsActive = true;
        this.nbEnneniesCreated = 0;
        console.log("start Wave : "+this.waveNumber)
        this.updateATHWave();
        // afficher les ennemies de waveinformation
        this.addOnQueueEnnemis();
    }

    nextWave() {
        this.startWaveButton.style.backgroundColor = "grey";
        if (this.waveNumber >= wavesInformation.length-1) {// fin du jeux
            this.game.gameAth.notify("Vous avez terminé toutes les vagues");
            return;
        }
        this.waveNumber++;
        this.startWave();
    }

    addOnQueueEnnemis() {
        console.log("lancement du spawn des ennemie de la vague "+this.waveNumber) 

        let ennemisOnWave = wavesInformation[this.waveNumber].enemies
        let delay = 0;// délai entre chaque ennemie parmaétrer dans le fichier waveInformation
        for (let i = 0; i < ennemisOnWave.length; i++) {
            const enemy = new Enemy(ennemisOnWave[i].type, this.game.gameMap.path, this.game.gameMap, this.game);
            delay += ennemisOnWave[i].delay;
            enemy.spawnDelay = delay;
            this.queueEnnemis.push(enemy)
        }
        console.log(this.queueEnnemis)
    }

    updateATHWave() {
        console.log(this.game.currentWave)
        this.game.currentWave++;
        this.game.gameAth.updateHeaderATH();
    }

    waveIsAnd() {
        if (this.queueEnnemis.length == 0 && this.waveNumber > 0) {
            this.startWaveButton.style.backgroundColor = "red";
        }
    }

}

