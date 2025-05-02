class fackTower {
    constructor(type, x, y, gameMap, game) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.game = game;
        this.gameMap = gameMap;
        this.element = null;
        this.rangeElement = null;
        this.target = null;
        this.lastShot = 0;

    }

    buildFackTower() {
        // Construit la tour
        console.log("buildTower");
        this.elementTower = document.createElement('div');
        this.elementTower.className = `tower tower-${this.type.name}`;
        this.elementTower.style.position = 'absolute';
        this.elementTower.style.zIndex = this.y;

        //Coordonnées en pixels
        const pixelX = this.x * this.gameMap.cellSize;
        const pixelY = this.y * this.gameMap.cellSize;

        // Positionner la tour sur la grille
        this.elementTower.style.left = `${pixelX}px`;
        // this.elementTower.style.top = `${this.y * this.gameMap.cellSize}px`;
        this.elementTower.style.top = `${pixelY -(this.gameMap.cellSize*this.type.aspectRatio)+this.gameMap.cellSize}px`;

        // Taille de la tour
        this.elementTower.style.width = `${this.gameMap.cellSize}px`;
        this.elementTower.style.height = `${this.gameMap.cellSize*this.type.aspectRatio}px`; 

        // Définir l'image de fond depuis la propriété spritePath
        this.elementTower.style.backgroundSize = 'contain'; // L'image s'adapte à la taille sans déformation
        this.elementTower.style.backgroundPosition = 'center'; // Centre l'image
        this.elementTower.style.backgroundRepeat = 'no-repeat'; // Évite la répétition de l'image
        this.elementTower.style.backgroundImage = `url(${this.type.spritePath})`;
        // this.elementTower.style.backgroundColor = 'red';
                
        document.getElementById('game-map').appendChild(this.elementTower);

        // Créer l'élément de portée
        this.rangeElement = document.createElement('div'); 
        this.rangeElement.className = 'tower-range';
        this.rangeElement.style.position = 'absolute';
        this.rangeElement.style.width = `${this.type.range * 2}px`;
        this.rangeElement.style.height = `${this.type.range * 2}px`;
        this.rangeElement.style.borderRadius = '50%';
        this.rangeElement.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        this.rangeElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        this.rangeElement.style.left = `${pixelX + this.gameMap.cellSize / 2 - this.type.range}px`;
        this.rangeElement.style.top = `${pixelY + this.gameMap.cellSize / 2 - this.type.range}px`;
        this.rangeElement.style.display = 'block';
        document.getElementById('game-map').appendChild(this.rangeElement);


    }

    updateFackTower() {

    }

}