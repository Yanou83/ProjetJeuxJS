export default class Bonus {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.size = 65;
        this.type = type; // vert ou bleu
        this.image = new Image();
        this.image.src = this.type === 'green' ? 'jeux/images/pain.png' : 'jeux/images/croissant.png';
    }

    draw(ctx) {
        ctx.save();
        ctx.drawImage(this.image, this.x - 20, this.y, this.size, this.size);
        ctx.restore();
    }
}
