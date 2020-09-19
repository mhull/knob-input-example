import Point2d from "./Point2d";

export default class {
  #node;

  constructor(el) {
    this.#setNode(el);
  }

  getNode() {
    return this.#node;
  }

  #setNode(el) {
    this.#node = el;
  }

  getCenter() {
    const rect = this.#node.getBoundingClientRect()

    return new Point2d([
      this.#getCenterX(rect),
      this.#getCenterY(rect),
    ]);
  }

  #getCenterX(rect) {
    return (rect.left + rect.right)/2;
  }

  #getCenterY(rect) {
    return (rect.top + rect.bottom)/2;
  }

  emit(eventType, data) {
    let event = new Event(eventType);
    event.data = data;
    this.getNode().dispatchEvent(event);
  }

  on(eventType, callback) {
    this.getNode().addEventListener(eventType, callback);
  }
}
