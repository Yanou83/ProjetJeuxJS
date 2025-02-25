import ObjectGraphique from "./ObjectGraphique.js";
import Bonus from "./Bonus.js";

export default class Plateforme extends ObjectGraphique {
    constructor(x, y, epaisseur, longueurPilier, largeurBarre, couleur) {
        super(x, y, epaisseur, longueurPilier, couleur);
        this.epaisseur = epaisseur;
        this.longueurPilier = longueurPilier;
        this.largeurBarre = largeurBarre;
        this.bonus = this.createBonus();

        // Ajustement de la hauteur des piliers latéraux 
        this.longueurPilierGauche = longueurPilier + 30; // Plus bas que le central
        this.longueurPilierDroit = longueurPilier + 30; // Plus bas que le central
    }

    createBonus() {
        const chance = Math.random();
        if (chance > 0.7) { // 30% de créer un bonus
            const bonusTypes = ['green', 'green', 'green', 'green', 'blue']; // 80% vert, 20% bleu
            const type = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
            const bonusX = this.x; // Aligner le bonus avec le pilier
            const bonusY = this.y - 200; // 200px au-dessus de la plateforme
            return new Bonus(bonusX, bonusY, type);
        }
        return null; // Aucun bonus créé
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

        // Dessiner la nouvelle barre horizontale juste au-dessus de l'existante
        const newBarreY = barreY - this.epaisseur - 50; // 10px au-dessus de la barre existante
        ctx.fillRect(barreX, newBarreY, this.largeurBarre, this.epaisseur);

        // Dessiner les deux barrières verticales aux extrémités
        const pilierGaucheX = barreX; // Positionner le pilier gauche à l'extrémité gauche de la barre
        const pilierDroitX = barreX + this.largeurBarre - this.epaisseur; // Positionner le pilier droit à l'extrémité droite

        ctx.fillRect(pilierGaucheX, barreY, this.epaisseur, -this.longueurPilierGauche); // Pilier gauche (montant vers le haut)
        ctx.fillRect(pilierDroitX, barreY, this.epaisseur, -this.longueurPilierDroit); // Pilier droit (montant vers le haut)

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
