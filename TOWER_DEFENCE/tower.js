class Tower {
    constructor(type, x, y, gameMap, game) {
        this.type = type;

        this.fireRate = type.fireRate;
        this.timeBeforeNextShot = type.fireRate;

        this.x = x;
        this.y = y;
        this.game = game;
        this.gameMap = gameMap;

        this.isSelect = false;

        this.rangeElement = null;
    }

    buildTower() {
        this.game.audio.playSound("build",1);
        // Construit la tour
        console.log("buildTower");
        this.elementTower = document.createElement('div');
        this.elementTower.className = `tower tower-${this.type.name}`;
        this.elementTower.style.position = 'absolute';
        this.elementTower.style.zIndex = this.y;
        // Configurer la tour comme conteneur flex pour le bouton de vente
        this.elementTower.style.display = 'flex';
        this.elementTower.style.justifyContent = 'center'; // Centrage horizontal
        this.elementTower.style.alignItems = 'center';     // Centrage vertical

        //Coordonnées en pixels
        this.pixelX = this.x * this.gameMap.cellSize;
        this.pixelY = this.y * this.gameMap.cellSize;

        // Positionner la tour sur la grille
        this.elementTower.style.left = `${this.pixelX}px`;
        this.elementTower.style.top = `${this.pixelY -(this.gameMap.cellSize*this.type.aspectRatio)+this.gameMap.cellSize}px`;

        // Taille de la tour
        this.elementTower.style.width = `${this.gameMap.cellSize}px`;
        this.elementTower.style.height = `${this.gameMap.cellSize*this.type.aspectRatio}px`; 

        // Définir l'image de fond depuis la propriété spritePath
        this.elementTower.style.backgroundSize = 'contain';
        this.elementTower.style.backgroundPosition = 'bottom';
        this.elementTower.style.backgroundRepeat = 'no-repeat'; 
        this.elementTower.style.backgroundImage = `url(${this.type.spritePath})`;
        // this.elementTower.style.backgroundColor = 'red';
        
        document.getElementById('game-map').appendChild(this.elementTower);
        this.elementTower.addEventListener('click', (event) => {
            event.stopPropagation();  // Empêche la propagation de l'événement
            this.showTowerControlPanel();
        });
        
        document.addEventListener('click', () => this.hideTowerControlPanel());
        

        // Créer l'élément de portée
        this.rangeElement = document.createElement('div'); 
        this.rangeElement.className = 'tower-range';
        this.rangeElement.style.position = 'absolute';
        this.rangeElement.style.width = `${this.type.range * 2}px`;
        this.rangeElement.style.height = `${this.type.range * 2}px`;
        this.rangeElement.style.borderRadius = '50%';
        this.rangeElement.style.border = '2px solid rgb(0, 0, 0, 1)';
        this.rangeElement.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        this.rangeElement.style.left = `${this.pixelX + this.gameMap.cellSize / 2 - this.type.range}px`;
        this.rangeElement.style.top = `${this.pixelY + this.gameMap.cellSize / 2 - this.type.range}px`;
        this.rangeElement.style.display = 'none';
        document.getElementById('game-map').appendChild(this.rangeElement);

        // Bouton pour vendre
        this.sellButton = document.createElement('button');
        this.sellButton.className = 'sell-button';
        this.sellButton.innerHTML = 'Sell';
        this.sellButton.style.position = 'absolute';
        this.sellButton.style.bottom = `${this.gameMap.cellSize*this.type.aspectRatio+10}px`;
        this.sellButton.style.display = 'none';

        this.sellButton.addEventListener('click', () => this.sellTower());
        this.elementTower.appendChild(this.sellButton);



        // Ecouteur pour montrer la range
        this.elementTower.addEventListener('mouseenter', () => this.showRange());
        this.elementTower.addEventListener('mouseleave', () => this.hideRange());

        this.game.towers.push(this);
    }

    showRange() {
        this.rangeElement.style.display = 'block';
    }

    
    hideRange() {
        this.rangeElement.style.display = 'none';
    }

    shoot(target) {
        const bullet = new Bullet(this, target, this.game);
        // Ajouter à la liste projectiles
        this.game.projectiles.push(bullet);
    }

    calculateDistance(target) {
        return Math.sqrt((this.pixelX - target.x) ** 2 + (this.pixelY - target.y) ** 2);
    }

    showTowerControlPanel() {
        this.sellButton.style.display = 'flex';
        // Pour chauqe tours auf celle ci on cache les autres
        for (let tower of this.game.towers) {
            if (tower !== this) {
                tower.sellButton.style.display = 'none';
            }
        }
    } 

    hideTowerControlPanel() {
        for (let tower of this.game.towers) {
            tower.sellButton.style.display = 'none';
        }
    }

    sellTower() {
        this.game.audio.playSound("build",1);
        for (let i = 0; i < this.game.towers.length; i++) {
            if (this.game.towers[i] === this) {
                this.game.towers.splice(i, 1);
            }
        }
        this.elementTower.remove();
        this.rangeElement.remove();
        this.game.gameMap.grid[this.y][this.x] = 0;
        this.game.money += Math.round(this.type.cost / 2); // Récupérer la moitié de l'argent
        this.game.gameAth.updateHeaderATH();
    }

}