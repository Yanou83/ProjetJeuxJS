import ObjectGraphique from "./ObjectGraphique.js";
import Bonus from "./Bonus.js";

export default class Plateforme extends ObjectGraphique {
    constructor(x, y, epaisseur, longueurPilier, largeurBarre, couleur) {
        super(x, y, epaisseur, longueurPilier, couleur);
        this.epaisseur = epaisseur;
        this.longueurPilier = longueurPilier;
        this.largeurBarre = largeurBarre;
        this.bonus = this.createBonus();
    }

    createBonus() {
        const bonusTypes = ['green', 'blue'];
        const type = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
        const bonusX = this.x; // Aligner le bonus avec le pilier
        const bonusY = this.y - 200; // 200px au-dessus de la plateforme
        return new Bonus(bonusX, bonusY, type);
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.couleur;

        // Dessiner le pilier (vertical)
        ctx.fillRect(this.x, this.y, this.epaisseur, this.longueurPilier);

        // Dessiner la barre horizontale (centrée sur le pilier)
        const barreX = this.x - (this.largeurBarre - this.epaisseur) / 2; // Centre la barre sur le pilier
        const barreY = this.y; // En haut du pilier
        ctx.fillRect(barreX, barreY, this.largeurBarre, this.epaisseur);

        // Dessiner le bonus SEULEMENT s'il existe
        if (this.bonus) {
            this.bonus.draw(ctx);
        }

        ctx.restore();
    }

    move(dx) {
        this.x += dx;
        if (this.bonus) {
            this.bonus.x += dx;  // Déplacer le bonus avec la plateforme
        }
    }

}
