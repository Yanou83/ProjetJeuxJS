export default class Bonus {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.type = type; // vert ou bleu
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.type === 'green' ? 'green' : 'blue';
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }
}
