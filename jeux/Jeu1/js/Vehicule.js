import { drawCircleImmediat } from "./utils.js";

export default class Vehicule {
    constructor(couleur) {
        this.couleur = couleur;
        this.imageColor = new Image();
        this.imageColor.src = "/jeux/images/scootercolor.png"; 
        this.image = new Image();
        this.image.src = "/jeux/images/scooter.png"; 
    }

    load() {
        return Promise.all([
            this.loadImage(this.imageColor),
            this.loadImage(this.image)
        ]);
    }

    loadImage(image) {
        return new Promise((resolve) => {
            if (image.complete) {
                resolve();
            } else {
                image.onload = resolve;
            }
        });
    }

    draw(ctx) {
        ctx.save();

        if (this.imageColor.complete && this.image.complete) {
            this.drawTintedImage(ctx, this.imageColor, this.couleur);
            ctx.drawImage(this.image, 0, 0, 150, 150);
        } else {
            this.imageColor.onload = () => {
                this.drawTintedImage(ctx, this.imageColor, this.couleur);
                ctx.drawImage(this.image, 0, 0, 150, 150);
            };
            this.image.onload = () => {
                this.drawTintedImage(ctx, this.imageColor, this.couleur);
                ctx.drawImage(this.image, 0, 0, 150, 150);
            };
        }

        this.drawRoues(ctx);

        ctx.restore();
    }

    drawTintedImage(ctx, image, color) {
        // Créer un canvas hors écran
        const offCanvas = document.createElement('canvas');
        const offCtx = offCanvas.getContext('2d');
        offCanvas.width = 150;
        offCanvas.height = 150;

        // Dessiner l'image sur le canvas hors écran
        offCtx.drawImage(image, 0, 0, 150, 150);

        // Appliquer la teinte
        offCtx.globalCompositeOperation = 'source-atop';
        offCtx.fillStyle = color;
        offCtx.fillRect(0, 0, 150, 150);

        // Dessiner l'image teintée sur le canvas principal
        ctx.drawImage(offCanvas, 0, 0, 150, 150);
    }

    drawRoues(ctx) {
        // Dessiner les roues
        drawCircleImmediat(ctx, 126, 109, 20, "black"); // Roue droite
        drawCircleImmediat(ctx, 31.5, 109, 20, "black"); // Roue gauche

        // Dessiner les jantes
        drawCircleImmediat(ctx, 126, 109, 10, "grey"); // Jante droite
        drawCircleImmediat(ctx, 31.5, 109, 10, "grey"); // Jante gauche            
    }
}
