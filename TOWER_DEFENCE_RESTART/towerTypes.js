// Configuration des tours
const towerTypes = {
    basicTower: {
        name : "Tour Simple",
        range: 100,
        fireRate: 800,
        timeBeforeNextShot: 0,
        cost: 10,
        shopImage:"assets/towers/randomTower.png",
        spritePath:"assets/towers/randomTower.png",
        aspectRatio: 110/70,
        bullet : {  size : 10,
                    damage : 20,
                    speed : 0.3,
                    spritePath : "assets/bullet.png",
                    adjustBulletStartPosition : {x: 0, y: 0}
        }
    },
    dmgTower: {
        name : "Canon",
        range: 80,
        fireRate: 1500,
        timeBeforeNextShot: 0,
        cost: 25,
        shopImage:"assets/towers/randomTowerRed.png",
        spritePath:"assets/towers/randomTowerRed.png",
        aspectRatio: 110/70 ,
        bullet : {  size : 10,
                    damage : 50,
                    speed : 0.3,
                    spritePath : "assets/bullet.png",
                    adjustBulletStartPosition : {x: 0, y: 0}
        }
    },
    sniperTower: {
        name : "Sniper",
        range: 200,
        fireRate: 1000,
        timeBeforeNextShot: 0,
        cost: 30,
        shopImage:"assets/towers/randomTowerGreen.png",
        spritePath:"assets/towers/randomTowerGreen.png",
        aspectRatio: 110/70,
        bullet : {  size : 10,
                    damage : 30,
                    speed : 0.3,
                    spritePath : "assets/bullet.png",
                    adjustBulletStartPosition : {x: 0, y: 0}//Distance en cellules
        }
    }
};
