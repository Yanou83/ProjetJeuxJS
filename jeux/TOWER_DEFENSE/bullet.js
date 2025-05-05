class Bullet {
    constructor(tower, target, game) {
        this.game = game;
        this.target = target;
        this.tower = tower;

        this.damage = this.tower.type.bullet.damage;
        this.speed = this.tower.type.bullet.speed;
        this.spritePath = this.tower.type.bullet.spritePath;
        this.adjustBulletStartPosition = {
            x:this.tower.type.bullet.adjustBulletStartPosition.x*game.gameMap.cellSize, 
            y:this.tower.type.bullet.adjustBulletStartPosition.y*game.gameMap.cellSize};

        this.x = this.tower.pixelX + this.game.gameMap.cellSize/2 + this.adjustBulletStartPosition.x;
        this.y = this.tower.pixelY + this.adjustBulletStartPosition.y;
        this.size = this.tower.type.bullet.size;

        this.createBullet();
    }

    createBullet() {
        this.elementProjectile = document.createElement('div');
        this.elementProjectile.className = 'bullet';
        this.elementProjectile.style.position = 'absolute';
        this.elementProjectile.style.zIndex = 1000;
        this.elementProjectile.style.width = `${this.size}px`;
        this.elementProjectile.style.height = `${this.size}px`;
        this.elementProjectile.style.backgroundColor = 'red';
        this.elementProjectile.style.borderRadius = '50%';
        this.elementProjectile.style.opacity = '0.4';
        this.elementProjectile.style.transform = "translate(-50%, -50%)";
        // Positionner l'élément dom créé
        this.elementProjectile.style.left = `${this.x+this.game.gameMap.cellSize/2}px`;
        this.elementProjectile.style.top = `${this.y}px`;
        document.getElementById('game-map').appendChild(this.elementProjectile);
    }

    move() {
        this.x += this.speed*(this.target.x - this.x);
        this.y += this.speed*(this.target.y - this.y);;

        this.elementProjectile.style.left = `${this.x}px`;
        this.elementProjectile.style.top = `${this.y}px`;
        
        this.checkHit();
    }

    checkHit() {
        const distanceBulletTarget = Math.sqrt(Math.pow(this.target.x - this.x, 2) + Math.pow(this.target.y - this.y, 2));
        if (distanceBulletTarget < this.size/2+this.target.size/2) {
            this.game.audio.playSound("hit");
            this.target.takeDamage(this.damage);
            this.remove();
        }

    }

    remove() {
        this.elementProjectile.remove();
        this.game.projectiles.splice(this.game.projectiles.indexOf(this), 1);
    }
}