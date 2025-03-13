// Configuration des ennemis
const enemyTypes = {
    basic: {
        name: "Ennemi de Base",
        maxHealth: 100,
        health: 100,
        speed: 1.5,
        size : 20,
        gold : 5,
        damageToBase : 1,
        spritePath: "assets/enemies/basicEnemy.png", // Chemin vers l'image
        aspectRatio: 1,  // Hauteur/Largeur - Ajuster selon l'image de l'ennemi
        deathAnimation: "assets/enemies/basicEnemyDeath.png", // Animation de la mort
    },
    fast: {
        name: "Ennemi Rapide",
        maxHealth: 75,
        health: 75,
        speed: 2.5,
        // value: 8,
        size : 12,
        gold : 10,
        damageToBase : 2,
        spritePath: "assets/enemies/fastEnemy.png",
        aspectRatio: 1,
        deathAnimation: "assets/enemies/fastEnemyDeath.png",
    },
    tank: {
        name: "Ennemi Blindé",
        maxHealth: 200,
        health: 200,
        speed: 1.2,
        // value: 12,
        size : 20,
        gold : 15,
        damageToBase : 3,
        spritePath: "assets/enemies/tankEnemy.png",
        aspectRatio: 1,
        deathAnimation: "assets/enemies/tankEnemyDeath.png",
    }
};
