import ObjectGraphique from "./ObjectGraphique.js";
import Bonus from "./Bonus.js";

export default class Plateforme extends ObjectGraphique {
    constructor(x, y, epaisseur, longueurPilier, largeurBarre, couleur, isFirstPlatform = false) {
        super(x, y, epaisseur, longueurPilier, couleur);
        this.epaisseur = epaisseur;
        this.longueurPilier = longueurPilier;
        this.largeurBarre = largeurBarre;
        this.bonus = this.createBonus();
        this.couleur = 'orange';
        this.isFirstPlatform = isFirstPlatform;
    }

    createBonus() {
        if (this.isFirstPlatform) {
            return null; // Pas de bonus sur la première plateforme
        }

        const chance = Math.random();
        if (chance > 0.7) { // 30% de chances de créer un bonus
            const bonusTypes = ['green', 'green', 'green', 'green', 'blue']; // 80% vert, 20% bleu
            const type = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
            const bonusX = this.x; // Aligner le bonus avec le pilier central
            const bonusY = this.y - 200; // 200px au-dessus de la plateforme
            return new Bonus(bonusX, bonusY, type);
        }
        return null; // Aucun bonus créé
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = 'black';

        // Dessiner la barre horizontale principale (centrée sur le pilier)
        const barreX = this.x - (this.largeurBarre - this.epaisseur) / 2;
        const barreY = this.y;
        ctx.fillRect(barreX, barreY, this.largeurBarre, this.epaisseur + 10);

        ctx.fillStyle = this.couleur;

        // Dessiner la barre horizontal au-dessus de la plateforme
        const newBarreY = barreY - this.epaisseur - 50; // 50px au-dessus de la barre existante
        ctx.fillRect(barreX, newBarreY, this.largeurBarre, this.epaisseur);

        // Dessiner les autres barres horizontales
        for (let i = 1; i <= 3; i++) {
            const newBarreY = barreY - (this.epaisseur - 150 * i);
            ctx.fillRect(barreX, newBarreY, this.largeurBarre, this.epaisseur);
        }

        // Positionner les barres verticales aux extrémités de la barre horizontale
        const extremiteGaucheX = barreX;
        const extremiteDroiteX = barreX + this.largeurBarre - this.epaisseur;
        const hauteurBarreVerticale = this.epaisseur * 300; // Hauteur des barres verticales

        // Dessiner la barre verticale gauche
        ctx.fillRect(extremiteGaucheX, barreY - (hauteurBarreVerticale / 7) / 2 + 100, this.epaisseur, hauteurBarreVerticale);

        // Dessiner la barre verticale droite
        ctx.fillRect(extremiteDroiteX, barreY - (hauteurBarreVerticale / 7) / 2 + 100, this.epaisseur, hauteurBarreVerticale);

        // Dessiner le bonus s'il existe
        if (this.bonus && !this.isFirstPlatform) {
            this.bonus.draw(ctx);
        }

        ctx.restore();
    }

    move(dx) {
        this.x += dx;
        if (this.bonus) {
            this.bonus.x += dx; // Déplacer le bonus avec la plateforme
        }
    }
}
