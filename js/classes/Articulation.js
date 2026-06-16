import Sprite from "./Sprite.js";

export default class Articulation extends Sprite {
    constructor(id, x, y) {
        super(id, x, y);
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
}