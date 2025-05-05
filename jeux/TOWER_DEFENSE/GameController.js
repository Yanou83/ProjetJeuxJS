class GameController {
    constructor(game) {
        this.game = game;
        this.selectedTowerData = null;

        document.getElementById('game-map').addEventListener('click', (e) => this.placeTower(e));
        document.getElementById('game-map').addEventListener('mousemove', (e) => this.showFakeTower(e));
        document.getElementById('game-map').addEventListener('mouseleave', (e) => this.hideFakeTower(e));
    }

    placeTower(e) {
        if (!this.game.gameAth.selectedTowerData) return; // Vérifie si une tour est sélectionnée
        this.hideFakeTower(e);// Cache la tour fantome

        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / this.game.gameMap.cellSize);
        const y = Math.floor((e.clientY - rect.top) / this.game.gameMap.cellSize);

        const towerData = this.game.gameAth.selectedTowerData;
        if (this.game.gameMap.canBuildTower(x, y)) {
            if (this.game.money >= towerData.cost) {
                // Déduire l'argent ici
                this.game.money -= towerData.cost;
                this.game.gameAth.updateHeaderATH();

                // Construir la tour
                const tower = new Tower(this.game.gameAth.selectedTowerData, x, y, this.game.gameMap, this.game);
                tower.buildTower();
                this.game.gameMap.grid[y][x] = "T";
                // console.log(this.game.gameMap.grid);
            }else{
                this.game.gameAth.notify("Vous n'avez pas assez d'argent pour construire cette tour");
                this.game.audio.playSound("error",1);
            }
        }else{
            this.game.gameAth.notify("Vous ne pouvez pas construire une tour ici");
            this.game.audio.playSound("error",1);
        }
    }

    // Affiche une tour fantome pour bien montrer que on l'a selectionné
    showFakeTower(e) {
        if (!this.game.gameAth.selectedTowerData) return; // Vérifie si une tour est sélectionnée
        
        // Récupère les coordonnées de la souris en fonction du quadrillage
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / this.game.gameMap.cellSize);
        const y = Math.floor((e.clientY - rect.top) / this.game.gameMap.cellSize);
        //Coordonnées de la souris en pixels
        const pixelX = x * this.game.gameMap.cellSize;
        const pixelY = y * this.game.gameMap.cellSize;
        
        // Vérifie si on peut build la tour
        if (!this.game.gameMap.canBuildTower(x, y)) {
            this.hideFakeTower(e);
            return;
        };

        // Vérifie si pas déjà une fackTower de créer juste repositionne ainsi que la range
        if (document.getElementById('fakeTower') && document.getElementById('fack-tower-range')) {
            this.fackTower.style.left = `${x*this.game.gameMap.cellSize}px`;
            this.fackTower.style.top = `${pixelY -(this.game.gameMap.cellSize*this.game.gameAth.selectedTowerData.aspectRatio)+this.game.gameMap.cellSize}px`;;
            // this.fackTower.style.top = `${y*this.game.gameMap.cellSize}px`;
            // console.log(this.game.gameAth.selectedTowerData.aspectRatio)
            this.FackRange.style.left = `${pixelX + this.game.gameMap.cellSize / 2 - this.game.gameAth.selectedTowerData.range}px`;
            this.FackRange.style.top = `${pixelY + this.game.gameMap.cellSize / 2 - this.game.gameAth.selectedTowerData.range}px`;
            return;
        } 


        // Créer la tour fantomatique sous la souris
        // console.log("showFakeTower")
        this.fackTower = document.createElement('div');
        this.fackTower.id = "fakeTower";
        this.fackTower.style.position = 'absolute';
        this.fackTower.style.zIndex = 1000;

        // Placer la fausse tour 
        this.fackTower.style.left = `${pixelX}px`;
        this.fackTower.style.top = `${pixelY}px`;

        // Taille de la tour
        this.fackTower.style.width = `${this.game.gameMap.cellSize}px`;
        this.fackTower.style.height = `${this.game.gameMap.cellSize*this.game.gameAth.selectedTowerData.aspectRatio}px`;

        this.fackTower.style.backgroundImage = `url(${this.game.gameAth.selectedTowerData.spritePath})`;
        this.fackTower.style.backgroundSize = 'contain'; 
        this.fackTower.style.backgroundPosition = 'bottom'; 
        this.fackTower.style.backgroundRepeat = 'no-repeat';
        this.fackTower.style.opacity = '0.5';
    
        document.getElementById('game-map').appendChild(this.fackTower);

        // Créer l'élément de portée
        this.FackRange = document.createElement('div'); 
        this.FackRange.id = 'fack-tower-range';
        this.FackRange.style.position = 'absolute';
        this.FackRange.style.width = `${this.game.gameAth.selectedTowerData.range * 2}px`;
        this.FackRange.style.height = `${this.game.gameAth.selectedTowerData.range * 2}px`;
        this.FackRange.style.borderRadius = '50%';
        this.FackRange.style.border = '2px solid rgb(0, 0, 0, 0.5)';
        this.FackRange.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
        this.FackRange.style.left = `${pixelX + this.game.gameMap.cellSize / 2 - this.game.gameAth.selectedTowerData.range}px`;
        this.FackRange.style.top = `${pixelY + this.game.gameMap.cellSize / 2 - this.game.gameAth.selectedTowerData.range}px`;

        document.getElementById('game-map').appendChild(this.FackRange);

    }

    // Cache la tour fantome et sa range
    hideFakeTower(e){
        if (!this.game.gameAth.selectedTowerData) return; // Vérifie si une tour est sélectionnée
        // console.log("hideFakeTower")
        this.fackTower.remove();
        this.FackRange.remove();
    }
}
