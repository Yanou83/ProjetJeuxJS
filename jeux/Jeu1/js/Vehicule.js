import ObjectGraphique from "./ObjectGraphique.js";
import { drawCircleImmediat } from "./utils.js";

export default class Vehicule extends ObjectGraphique {
    constructor(x, y) {
        super(x, y, 100, 100);
        this.vitesseX = 0;
        this.vitesseY = 0;
        this.couleur = "blue";
        this.angle = 0;
        this.imageColor = new Image();
        this.imageColor.src = "assets/images/scootercolor.png"; 
        this.image = new Image();
        this.image.src = "assets/images/scooter.png"; 
    }

    draw(ctx) {
        // Ici on dessine un monstre
        ctx.save();

        // on déplace le systeme de coordonnées pour placer
        // le monstre en x, y.Tous les ordres de dessin
        // dans cette fonction seront par rapport à ce repère
        // translaté
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        // on recentre le monstre. Par défaut le centre de rotation est dans le coin en haut à gauche
        // du rectangle, on décale de la demi largeur et de la demi hauteur pour 
        // que le centre de rotation soit au centre du rectangle.
        // Les coordonnées x, y du monstre sont donc au centre du rectangle....
        ctx.translate(-this.w / 2, -this.h / 2);
        //this.ctx.scale(0.5, 0.5);

        // dessiner le vehicule
        this.drawVehicule(ctx);

        // Les bras
        //this.drawBrasGauche();

        // restore
        ctx.restore();

        // super.draw() dessine une croix à la position x, y
        // pour debug
        super.draw(ctx);
    }

    // Méthode pour dessiner un cercle
    drawCircle(ctx, x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    drawQuarterCircle(ctx, x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, -Math.PI / 2, true);
        ctx.stroke();
    }

    drawMirroredQuarterCircle(ctx, x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, -Math.PI, -1.8 / 2, false);
        ctx.stroke();
    }

    drawLineAtAngle(ctx, startX, startY, length, angle) {
        ctx.save();
        ctx.translate(startX, startY);
        ctx.rotate(angle * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(length, 0);
        ctx.stroke();
        ctx.restore();
    }

    drawRoues(ctx) {
        // Dessiner les roues
        ctx.fillStyle = "black";
        this.drawCircle(ctx, 126, this.h + 9, 20); // Rouge droite
        this.drawCircle(ctx, this.w - 69.5, this.h + 9, 20); // Roue gauche

        // Dessiner les jantes
        ctx.fillStyle = "grey";
        this.drawCircle(ctx, 126, this.h + 9, 10); // Jante droite
        this.drawCircle(ctx, this.w - 69.5, this.h + 9, 10); // Jante gauche            
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
        // Create an off-screen canvas
        const offCanvas = document.createElement('canvas');
        const offCtx = offCanvas.getContext('2d');
        offCanvas.width = this.w;
        offCanvas.height = this.h;

        // Draw the image on the off-screen canvas
        offCtx.drawImage(image, 0, 0, this.w, this.h);

        // Apply the tint
        offCtx.globalCompositeOperation = 'source-atop';
        offCtx.fillStyle = color;
        offCtx.fillRect(0, 0, this.w, this.h);

        // Draw the tinted image on the main canvas
        ctx.drawImage(offCanvas, 0, 0, 150, 150);
    }

    move() {
        this.x += this.vitesseX;
        this.y += this.vitesseY;

        // Add rotation when falling
        if (this.vitesseY > 0) {
            this.angle += 0.05; // Adjust the rotation speed as needed
        } else if (this.vitesseY < 0) {
            this.angle -= 0.05; // Adjust the rotation speed as needed
        }
    }
}