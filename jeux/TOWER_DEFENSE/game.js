class Game {
    constructor() {
        this.gameMap = null;
        this.gameAth = null;
        this.menu = null;
        this.chronometre = null; 
        this.audio = null;
        
        this.enemies = [];
        this.towers = [];
        this.projectiles = [];

        this.lives = 20;
        this.money = 50;
        
        this.waveInProgress = false;
        
        this.isPaused = false;
        this.lastUpdate = 0;
        this.gameFPS = 60;
    }
    
    start() {
        // console.log("Start Game")
        this.audio = new GameAudio();
        this.gameMap = new GameMap();
        this.gameAth = new GameAth(this);
        this.gameController = new GameController(this);
        this.waves = new Waves(this);
        this.chronometre = new Chronometre(this);

        // Démarrer la boucle de jeu
        this.gameLoop();
    }

    gameLoop(timestamp) {
        // Calculer le delta time
        const deltaTime = timestamp - this.lastUpdate;
        // Mettre à jour le jeu tt les 60 secondes en fonction de la vitesse
        if (deltaTime > (1000 / this.gameFPS) && this.isPaused === false) {
            this.update(timestamp);
            this.lastUpdate = timestamp;
        } 
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(){    
        // Vérifier si le joueur a perdu
        if (this.lives <= 0) {
            this.menu.showDefeatScreen();
            this.isPaused = true;
            return; // On mets fin à la mise à jour du jeu car perdu
        }

        // Vérifie si le joueur à gagner
        if(this.waves.waveNumber >= wavesInformation.length-1 && this.enemies.length==0 && this.waves.queueEnnemis.length == 0){
            // console.log("Victoire")
            this.menu.showVictoryScreen();
            this.isPaused = true;
        }

        // Vérifier si la vague est terminer 
        this.waves.waveIsAnd();

        // Mettre à jour le spone des ennemies
        for (let i = 0; i < this.waves.queueEnnemis.length; i++) {
            const ennemie = this.waves.queueEnnemis[i];
            ennemie.spawnDelay += - (1000 / this.gameFPS);
            if (ennemie.spawnDelay <= 0){// Si il a atteint le temps de spawn
                ennemie.createEnemy();
                this.waves.queueEnnemis.splice(i, 1);
            }
        }

        // Mettre à jour les ennemis
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].updateEnemy();
        }

        // Mettre à jour les tires
        for (let i = 0; i < this.towers.length; i++) {
            for (let j = 0; j < this.enemies.length; j++) {
                const distanceTowerEnemy = this.towers[i].calculateDistance(this.enemies[j]);
                // Vérifier si l'ennemie est dans la range de la tour
                if (distanceTowerEnemy <= this.towers[i].type.range) {
                    
                    // Tirer sur l'ennemie si le temps de recharge est écoulé
                    if (this.towers[i].timeBeforeNextShot <= 0) {
                        this.towers[i].shoot(this.enemies[j]);
                        // console.log("Tirer sur l'ennemie")
                        this.towers[i].timeBeforeNextShot = this.towers[i].fireRate;
                        break;// on ne tire que sur le premier ennemie et un seul à la fois
                    }

                }
            }
            // On décrémente le temps avant le procahin tir
            this.towers[i].timeBeforeNextShot += - (1000 / this.gameFPS);
        }

        // Mettre à jour les projectiles
        for (let i = 0; i < this.projectiles.length; i++) {
            this.projectiles[i].move();
        }

    }

    restart() {
        // console.log("Redémarrage du jeu...");
        
        // 1. Nettoyer les éléments du DOM enneies et tours et projectiles
        this.enemies.forEach(enemy => { // Suppression de l'affichage ennemies in game
            enemy.elementEnemy.remove();
        });
        this.towers.forEach(tower => {
            tower.elementTower.remove();
            tower.rangeElement.remove();
        });
        this.projectiles.forEach(projectile => {
            projectile.elementProjectile.remove();
        });
        
        // Supprimer fake tower si présente
        const fakeTower = document.getElementById('fakeTower');
        if (fakeTower) fakeTower.remove();
        
        const fakeRange = document.getElementById('fack-tower-range');
        if (fakeRange) fakeRange.remove();
        
        // 2. Arrêter les timeouts en cours
        if (this.waves && this.waves.timeoutIds) {
            this.waves.timeoutIds.forEach(id => clearTimeout(id));
        }
        this.waves.spawnInProgress = false;
        
        // 3. Réinitialiser les variables d'état du jeu
        this.isPaused = false;
        this.lastUpdate = 0;
        this.enemies = [];// Suppression des ennemies
        this.waves.queueEnnemis = [];
        this.towers = []; // Suppression des tours
        this.projectiles = [];
        this.lives = 20;
        this.money = 50;
        this.waveInProgress = false;
        
        // 5. Réinitialiser les vagues
        this.waves.waveNumber = 0;
        this.waves.waveIsActive = false;
        this.waves.nbEnneniesCreated = 0;
        this.currentWave = 0;
        
        // Réinitialiser la grid
        this.gameMap.initializeMap();
        this.gameMap.createPath() 

        // // 4. Réinitialiser l'interface
        this.gameAth.updateHeaderATH();
        
        // Réinitialiser le chronomètre
        if (this.chronometre) {
            this.chronometre.reset();
            this.chronometre.start(); 
        }
        
        // Notifier l'utilisateur
        this.gameAth.notify("Jeu redémarré!");
    }

    pause(){
        // console.log("Pause")
        // this.waves.timeoutIds.forEach(id => console.log(id));
        if (this.isPaused) {
            this.isPaused = false;
        } else {
            this.isPaused = true;
        }
    }
    
    earnGoldOnKill(reward){
        this.money += reward;
        this.gameAth.updateHeaderATH();
    }


}


// Initialiser le jeu lorsque la page est chargée
window.addEventListener('load', () => {
    window.game = new Game();
    window.game.menu = new Menu(this.game);
    game.start();
});
