import ObjectGraphique from "./ObjectGraphique.js";
import { drawCircleImmediat } from "./utils.js";

export default class Player extends ObjectGraphique {
    constructor(x, y) {
        super(x, y, 150, 150); 
        this.vitesseX = 0;
        this.vitesseY = 0;
        this.couleur = "green";
        this.angle = 0;
        this.imageColor = new Image();
        this.imageColor.src = "../images/scootercolor.png"; 
        this.image = new Image();
        this.image.src = "../images/scooter.png"; 
        this.flameImageSrc = "../images/feu_boost.gif"; 
        this.flameAnimation = null;
        this.flameCanvas = document.createElement('canvas');
        this.flameCanvas.width = 40;
        this.flameCanvas.height = 100;

        this.initFlameAnimation();
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.translate(-this.w / 2, -this.h / 2);

        // Dessiner le véhicule plus bas
        ctx.save();
        ctx.translate(0, this.angle >= Math.PI / 14 ? 40 : 20); // Ajuster cette valeur pour positionner le véhicule plus bas
        this.drawVehicule(ctx);
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
        ctx.strokeRect(-this.w / 2, -this.h / 2, this.w, this.h);
        ctx.restore();

        // super.draw() pour debug
        super.draw(ctx);
    }

    drawVehicule(ctx) {
        if (this.imageColor.complete && this.image.complete) {
            this.drawTintedImage(ctx, this.imageColor, this.couleur);
            ctx.drawImage(this.image, 0, 0, 150, 150);
        } else {
            this.imageColor.onload = () => {
                this.drawTintedImage(ctx, this.imageColor, this.couleur);
                ctx.drawImage(this.image, 0, 0, this.w, this.h);
            };
            this.image.onload = () => {
                this.drawTintedImage(ctx, this.imageColor, this.couleur);
                ctx.drawImage(this.image, 0, 0, this.w, this.h);
            };
        }

        this.drawRoues(ctx);
    }

    drawTintedImage(ctx, image, color) {
        // Créer un canvas hors écran
        const offCanvas = document.createElement('canvas');
        const offCtx = offCanvas.getContext('2d');
        offCanvas.width = this.w;
        offCanvas.height = this.h;

        // Dessiner l'image sur le canvas hors écran
        offCtx.drawImage(image, 0, 0, this.w, this.h);

        // Appliquer la teinte
        offCtx.globalCompositeOperation = 'source-atop';
        offCtx.fillStyle = color;
        offCtx.fillRect(0, 0, this.w, this.h);

        // Dessiner l'image teintée sur le canvas principal
        ctx.drawImage(offCanvas, 0, 0, 150, 150);
    }

    drawRoues(ctx) {
        // Dessiner les roues
        ctx.fillStyle = "black";
        this.drawCircle(ctx, 126, this.h - 41, 20); // Roue droite
        this.drawCircle(ctx, this.w - 118.5, this.h - 41, 20); // Roue gauche

        // Dessiner les jantes
        ctx.fillStyle = "grey";
        this.drawCircle(ctx, 126, this.h - 41, 10); // Jante droite
        this.drawCircle(ctx, this.w - 118.5, this.h - 41, 10); // Jante gauche            
    }

    // Méthode pour dessiner un cercle
    drawCircle(ctx, x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    drawBody(ctx) {
        // tete du monstre
        ctx.fillStyle = "brown";
        // tete
        this.drawCircle(ctx, 30, 25, 22);

        // yeux
        this.drawEyes(ctx);

        //nez
        this.drawCircle(ctx, 52, 32, 10);
        this.drawCircle(ctx, 67, 32, 8);
        this.drawCircle(ctx, 77, 32, 5);
        ctx.fillStyle = "black";
        this.drawCircle(ctx, 87, 32, 6);


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
    }

    drawEyes(ctx) {
        drawCircleImmediat(ctx, 35, 19.2, 8, "white");
        drawCircleImmediat(ctx, 46.8, 19.2, 5, "white");

        // pupille
        drawCircleImmediat(ctx, 37, 19.2, 2.5, "black");
        drawCircleImmediat(ctx, 47.8, 19.2, 2.5, "black");
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