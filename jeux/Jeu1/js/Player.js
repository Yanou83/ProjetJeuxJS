import ObjectGraphique from "./ObjectGraphique.js";
import { drawCircleImmediat } from "./utils.js";
import Vehicule from "./Vehicule.js";

export default class Player extends ObjectGraphique {
    constructor(x, y) {
        super(x, y, 150, 150);
        this.vitesseX = 0;
        this.vitesseY = 0;
        this.couleur = "green";
        this.angle = 0;
        this.vehicule = new Vehicule(this.couleur);
        this.flameImageSrc = "/jeux/images/feu_boost.gif";
        this.flameAnimation = null;
        this.flameCanvas = document.createElement('canvas');
        this.flameCanvas.width = 40;
        this.flameCanvas.height = 100;

        this.initFlameAnimation();
    }

    // Charger toutes les images avant de démarrer le jeu
    load() {
        return this.vehicule.load();
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.translate(-this.w / 2, -this.h / 2);

        // Dessiner le véhicule plus bas
        ctx.save();
        ctx.translate(0, this.angle >= Math.PI / 14 ? 40 : 20); // Ajuster cette valeur pour positionner le véhicule plus bas
        this.vehicule.draw(ctx);
        ctx.restore();

        // Dessiner le corps du monstre légèrement à droite
        ctx.save();
        ctx.translate(25, 0); // Ajuster cette valeur pour décaler le corps vers la droite
        this.drawBody(ctx);
        ctx.restore();

        ctx.restore();

        // Dessiner la hitbox (rectangle rouge) avec inclinaison
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        // Ajuster la hitbox pour inclure uniquement la partie basse
        ctx.strokeRect(-this.w / 2, -this.h / 2, this.w, this.h);
        ctx.restore();

        // super.draw() pour debug
        super.draw(ctx);
    }

    drawBody(ctx) {
        // BONNE PRATIQUE : on sauvegarde le contexte
        ctx.save();

        // tete
        drawCircleImmediat(ctx, 30, 25, 22, "brown");

        // yeux
        this.drawEyes(ctx);

        //nez
        drawCircleImmediat(ctx, 52, 32, 10, "brown");
        drawCircleImmediat(ctx, 67, 32, 8, "brown");
        drawCircleImmediat(ctx, 77, 32, 5, "brown");
        ctx.fillStyle = "black";
        drawCircleImmediat(ctx, 87, 32, 6, "black");

        ctx.fillStyle = "brown";
        // Corps du monstre (triangle équilateral avec bords arrondis, encore plus élargi)
        ctx.beginPath();
        ctx.moveTo(30, 35); // Point supérieur
        ctx.arcTo(60, 80, 30, 85, 15); // Point droit avec bord arrondi
        ctx.arcTo(30, 85, 0, 80, 15); // Point inférieur avec bord arrondi
        ctx.arcTo(0, 80, 30, 35, 15); // Point gauche avec bord arrondi
        ctx.closePath();
        ctx.fill();

        // Jambes du monstre (traits parallèles inclinés à 45 degrés)
        ctx.strokeStyle = "brown";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(25, 70); // Début de la jambe
        ctx.lineTo(60, 115); // Fin de la jambe
        ctx.stroke();

        // Pied du monstre (rectangle avec des angles arrondis, incliné)
        ctx.save();
        ctx.translate(55, 115);
        ctx.rotate(Math.PI / -5.7); // Inclinaison à 45 degrés
        this.drawPied(ctx, -2, 0, 20, 10, 5);
        ctx.restore();

        // Bras du monstre
        this.drawBras(ctx, 40, 50, 35, 5, 3);

        // BONNE PRATIQUE : on restore le contexte à la fin
        ctx.restore();
    }

    drawEyes(ctx) {
        ctx.save();

        drawCircleImmediat(ctx, 35, 19.2, 8, "white");
        drawCircleImmediat(ctx, 46.8, 19.2, 5, "white");

        // pupille
        drawCircleImmediat(ctx, 37, 19.2, 2.5, "black");
        drawCircleImmediat(ctx, 47.8, 19.2, 2.5, "black");

        ctx.restore();
    }

    // Méthode pour dessiner un bras (rectangle avec des angles arrondis)
    drawBras(ctx, x, y, width, height, radius) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(45 * Math.PI / 180);
        ctx.fillStyle = "brown";
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(width - radius, 0);
        ctx.quadraticCurveTo(width, 0, width, radius);
        ctx.lineTo(width, height - radius);
        ctx.quadraticCurveTo(width, height, width - radius, height);
        ctx.lineTo(radius, height);
        ctx.quadraticCurveTo(0, height, 0, height - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // Méthode pour dessiner un rectangle avec des angles arrondis
    drawPied(ctx, x, y, width, height, radius) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    initFlameAnimation() {
        gifler(this.flameImageSrc).get((anim) => {
            this.flameAnimation = anim;
            this.flameAnimation.animateInCanvas(this.flameCanvas); // Active l'animation dans le canvas
        });
    }

    drawFlames(ctx) {
        if (!this.flameAnimation) return; // Si l'animation n'est pas chargée, on ne fait rien

        const flameWidth = 40;
        const flameHeight = 100;
        const flameX = this.x - this.w / 2 - flameWidth - 10;
        const flameY = this.y + this.h / 2 - flameHeight + 70;

        ctx.save();
        ctx.translate(flameX, flameY);
        ctx.rotate(260 * Math.PI / 180); // Rotation du feu

        // Dessiner l'animation du GIF
        ctx.drawImage(this.flameCanvas, -flameWidth / 2, -flameHeight / 2, flameWidth, flameHeight);
        ctx.restore();
    }

    move() {
        this.y += this.vitesseY;

        // Réduire l'inclinaison lors de la chute
        if (this.vitesseY > 0) {
            this.angle += 0.025; // Vitesse de rotation
        } else if (this.vitesseY < 0) {
            this.angle -= 0.025; // Vitesse de rotation
        }
    }
}