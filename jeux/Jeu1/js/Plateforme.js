import ObjectGraphique from "./ObjectGraphique.js";

export default class Plateforme extends ObjectGraphique {
    constructor(x, y, epaisseur, longueurPilier, largeurBarre, couleur) {
        super(x, y, epaisseur, longueurPilier, couleur);
        this.epaisseur = epaisseur; 
        this.longueurPilier = longueurPilier;
        this.largeurBarre = largeurBarre;
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

        ctx.restore();
    }
}
