import Sprite from "./Sprite.js";

export default class Articulation extends Sprite {
    constructor(id, x, y) {
        super(id, x, y);
        this.startPosition = { x, y };
    }

    toHTMLElement() {
        const articulationElement = document.createElement("div");
        articulationElement.className = "articulation";
        articulationElement.id = `articulation-${this.id}`;
        articulationElement.style.position = "absolute";
        articulationElement.style.left = `${this.x}px`;
        articulationElement.style.top = `${this.y}px`;

        return articulationElement;
    }

    render() {
        document.querySelector("main").appendChild(this.toHTMLElement());
    }

    clear() {
        const oldElement = document.getElementById(`articulation-${this.id}`);
        if (oldElement) {
            oldElement.remove();
        }
    }

    reset() {
        this.x = this.startPosition.x;
        this.y = this.startPosition.y;
    }

    mutate(previousArticulation) {
        const maxMove = 200;

        const shouldMutateX = Math.random() < 0.5;
        const shouldMutateY = Math.random() < 0.5;

        if (shouldMutateX) {
            let deltaX = Math.random() * maxMove - maxMove / 2;

            if (deltaX < 15 && deltaX > -15) {
                deltaX = deltaX < 0 ? -15 : 15;
            }

            this.x += deltaX;
        }

        if (shouldMutateY) {
            let deltaY = Math.random() * maxMove - maxMove / 2;

            if (deltaY < 15 && deltaY > -15) {
                deltaY = deltaY < 0 ? -15 : 15;
            }

            this.y += deltaY;
        }

        this.x = Math.max(previousArticulation.x - maxMove, Math.min(previousArticulation.x + maxMove, this.x));
        this.y = Math.max(previousArticulation.y - maxMove, Math.min(previousArticulation.y + maxMove, this.y));
    }
}