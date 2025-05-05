// Configuration des ennemis
const enemyTypes = {
    basic: {
        name: "Rond basique",
        maxHealth: 100,
        health: 100,
        speed: 1.5,
        size : 20,
        gold : 5,
        damageToBase : 1,
        img: "assets/enemy/rond.png",
    },
    fast: {
        name: "Triangle rapide",
        maxHealth: 75,
        health: 75,
        speed: 2.5,
        size : 12,
        gold : 10,
        damageToBase : 2,
        img: "assets/enemy/triangle.png",
    },
    tank: {
        name: "Carré blindé",
        maxHealth: 200,
        health: 200,
        speed: 1.2,
        size : 20,
        gold : 15,
        damageToBase : 3,
        img: "assets/enemy/carre.png",
    }
};
