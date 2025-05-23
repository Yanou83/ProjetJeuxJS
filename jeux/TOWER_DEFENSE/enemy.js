class Enemy {
    constructor(type, path, gameMap, game) {
        this.type = type;
        this.path = path;
        this.gameMap = gameMap;
        this.game = game;

        this.health = enemyTypes[this.type].health;
        this.maxHealth = enemyTypes[this.type].maxHealth;
        this.speed = enemyTypes[this.type].speed;
        this.size = enemyTypes[this.type].size;
        this.sizeHealthBar = this.gameMap.cellSize/1.5;
        this.gold = enemyTypes[this.type].gold;
        this.img = enemyTypes[this.type].img;

        this.spawnDelay = null;

        this.x = null;
        this.y = null;
        this.curentPosition = 0; // position actuelle sur le path 0 = { x: 0, y: 5 } sur le premier partie 1 = sur la deuxième partie ...
        this.dirtectionMove = "D"; // D = droite, G = gauche, H = haut, B = bas
        this.pointActuelle = this.path[this.curentPosition];
        this.pointSuivant = this.path[this.curentPosition+1];
    
        this.isDying = false;
    }
    
    createEnemy() {
        // console.log("createEnemy")
        // Créer l'élément DOM de l'ennemi
        this.elementEnemy = document.createElement('div');
        this.elementEnemy.className = `enemy enemy-${this.type}`;
        this.elementEnemy.style.position = 'absolute';
        this.elementEnemy.style.zIndex = 1000;
        this.elementEnemy.style.width = `${this.size}px`;
        this.elementEnemy.style.height = `${this.size}px`;

        // Ajouter une image de fond à l'ennemi
        this.elementEnemy.style.backgroundImage = `url('${this.img}')`;
        this.elementEnemy.style.backgroundSize = '100% 100%';
        this.elementEnemy.style.backgroundRepeat = 'no-repeat';
        this.elementEnemy.style.backgroundPosition = 'center';

        // Centrer le point de transformation
        this.elementEnemy.style.transform = "translate(-50%, -50%)";
        // // Pour centrer la barre de vie
        this.elementEnemy.style.display = 'flex';
        this.elementEnemy.style.justifyContent = 'center';

        // Spown de l'ennemi a la case initiale
        const posStartCaseX = this.path[0].x
        const posStartCaseY = this.path[0].y
        const posStartPixelX = posStartCaseX * this.gameMap.cellSize + this.gameMap.cellSize/2;
        const posStartPixelY = posStartCaseY * this.gameMap.cellSize + this.gameMap.cellSize/2;
        this.x = posStartPixelX;
        this.y = posStartPixelY;

        this.elementEnemy.style.left = `${posStartPixelX}px`;
        this.elementEnemy.style.top = `${posStartPixelY}px`;
        
        // Créer la barre de vie
        this.healthBarElement = document.createElement('div');
        this.healthBarElement.className = 'health-bar';
        this.healthBarElement.style.width = `${this.sizeHealthBar}px`;
        this.healthBarElement.style.height = '5px';
        this.healthBarElement.style.backgroundColor = 'green';
        this.healthBarElement.style.position = 'absolute';
        this.healthBarElement.style.top = "-10px";
        this.healthBarElement.style.left = `${-(this.sizeHealthBar - this.size)/2}px`;
        
        this.elementEnemy.appendChild(this.healthBarElement);
        
        // Ajouter au DOM
        document.getElementById('game-map').appendChild(this.elementEnemy);

        // Ajouter l'ennemi à la liste des ennemis
        this.game.enemies.push(this);
    }

    move() {
        // Vérifier que l'on est pas au bout du chemin
        if(this.hasFinishedPath()){
            return;
        }

        this.findDirection();
        if (this.dirtectionMove == "D"){
            this.x+=this.speed;
        }
        if (this.dirtectionMove == "G"){
            this.x-=this.speed;
        }
        if (this.dirtectionMove == "H"){
            this.y-=this.speed;
        }
        if (this.dirtectionMove == "B"){
            this.y+=this.speed;
        }

        this.updatePathPosition();
        // Mettre a jour la position de l'ennemi
        this.elementEnemy.style.left = `${this.x}px`;
        this.elementEnemy.style.top = `${this.y}px`;

        // Mettre à jour son z-index pour qu'il soit bien affiché par rapport aux tours
        this.elementEnemy.style.zIndex = this.pointActuelle.y-1;
    }

    // Mets à jour la position actuelle de l'ennemi en nombre entier en fonction de sa position sur le chemin
    updatePathPosition(){
        let pointSuivantPixel = {x: this.pointSuivant.x * this.gameMap.cellSize + this.gameMap.cellSize/2, y: this.pointSuivant.y * this.gameMap.cellSize + this.gameMap.cellSize/2};        
        
        if(this.dirtectionMove == "D" && this.x >= pointSuivantPixel.x){
            // Repositionnement de l'ennemi sur le point suivant si il va trop loin 
            this.x = pointSuivantPixel.x;
            this.y = pointSuivantPixel.y;
            this.curentPosition++;
            this.pointActuelle = this.path[this.curentPosition];
            this.pointSuivant = this.path[this.curentPosition+1];
        }
        if(this.dirtectionMove == "G" && this.x <= pointSuivantPixel.x){
            // Repositionnement de l'ennemi sur le point suivant si il va trop loin 
            this.x = pointSuivantPixel.x;
            this.y = pointSuivantPixel.y;
            this.curentPosition++;
            this.pointActuelle = this.path[this.curentPosition];
            this.pointSuivant = this.path[this.curentPosition+1];
        }
        if(this.dirtectionMove == "H" && this.y <= pointSuivantPixel.y){
            // Repositionnement de l'ennemi sur le point suivant si il va trop loin 
            this.x = pointSuivantPixel.x;
            this.y = pointSuivantPixel.y;
            this.curentPosition++;
            this.pointActuelle = this.path[this.curentPosition];
            this.pointSuivant = this.path[this.curentPosition+1];
        }
        if(this.dirtectionMove == "B" && this.y >= pointSuivantPixel.y){
            // Repositionnement de l'ennemi sur le point suivant si il va trop loin 
            this.x = pointSuivantPixel.x;
            this.y = pointSuivantPixel.y;
            this.curentPosition++;
            this.pointActuelle = this.path[this.curentPosition];
            this.pointSuivant = this.path[this.curentPosition+1];
        }
    }

    findDirection(){
        this.pointActuelle = this.path[this.curentPosition];
        this.pointSuivant = this.path[this.curentPosition+1];

        if(this.pointActuelle.y == this.pointSuivant.y && this.pointSuivant.x > this.pointActuelle.x){
            this.dirtectionMove = "D";}
        else if(this.pointActuelle.y == this.pointSuivant.y && this.pointSuivant.x < this.pointActuelle.x){
            this.dirtectionMove = "G";}
        else if(this.pointActuelle.x == this.pointSuivant.x && this.pointSuivant.y < this.pointActuelle.y){
            this.dirtectionMove = "H";}
        else if(this.pointActuelle.x == this.pointSuivant.x && this.pointSuivant.y > this.pointActuelle.y){
            this.dirtectionMove = "B";}
    }

    hasFinishedPath(){
        if(this.curentPosition == this.path.length - 1){
            this.decreasePlayerHealth();
            this.removeEnemy();
            return true;
        }else{
            return false
        }
    }

    takeDamage(damage){
        // console.log("takeDamage")
        this.health -= damage;
        this.healthBarElement.style.width = `${this.health*this.sizeHealthBar/this.maxHealth}px`;
        if(this.health <= 0 && !this.isDying){
            this.isDying = true;
            this.removeEnemy();
            this.game.earnGoldOnKill(this.gold);
            return;
        }
        if(this.health <= this.maxHealth/2){
            this.healthBarElement.style.backgroundColor = 'orange';
        }
        if(this.health <= this.maxHealth/4){
            this.healthBarElement.style.backgroundColor = 'red';
        }
    }



    // Quand l'ennemi arrive à la fin du chemin il inflige des dégats à la base du joueur
    decreasePlayerHealth(){
        this.game.audio.playSound("hitBase",1);
        this.game.lives -= enemyTypes[this.type].damageToBase;
        this.game.gameAth.updateHeaderATH();
    }

    removeEnemy(){
        // Supprimer du DOM et de la liste des ennemis
        this.game.enemies = this.game.enemies.filter(enemy => enemy !== this);
        this.elementEnemy.remove();
    }


    updateEnemy(){
        this.move()
    }
}