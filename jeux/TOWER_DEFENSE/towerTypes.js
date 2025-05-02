// Configuration des tours
const towerTypes = {
    basicTower: {
        name : "Tour Orbital",
        range: 100,
        fireRate: 800,
        timeBeforeNextShot: 0,
        cost: 20,
        shopImage:"assets/towers/TourOrbital.png",
        spritePath:"assets/towers/TourOrbital.png",
        aspectRatio: 430/268,
        bullet : {  size : 10,
                    damage : 20,
                    speed : 0.3,
                    adjustBulletStartPosition : {x: 0, y: 0}
        }
    },
    dmgTower: {
        name : "Fortification Cubique",
        range: 80,
        fireRate: 1500,
        timeBeforeNextShot: 0,
        cost: 25,
        shopImage:"assets/towers/FortificationCubique.png",
        spritePath:"assets/towers/FortificationCubique.png",
        aspectRatio: 390/187 ,
        bullet : {  size : 10,
                    damage : 50,
                    speed : 0.3,
                    adjustBulletStartPosition : {x: 0, y: 0}
        }
    },
    sniperTower: {
        name : "Pyramide Défensive",
        range: 200,
        fireRate: 1000,
        timeBeforeNextShot: 0,
        cost: 50,
        shopImage:"assets/towers/PyramideDéfensive.png",
        spritePath:"assets/towers/PyramideDéfensive.png",
        aspectRatio: 536/244,
        bullet : {  size : 10,
                    damage : 30,
                    speed : 0.3,
                    adjustBulletStartPosition : {x: 0, y: 0}//Distance en cellules
        }
    }
};
