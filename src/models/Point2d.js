import Distance2d from './Distance2d';

export default class {
  #x;
  #y;

  constructor(coordinates) {
    this.#x = coordinates[0];
    this.#y = coordinates[1];
  }

  getX() {
    return this.#x;
  }

  getY() {
    return this.#y;
  }

  getDistanceTo(point) {
    return new Distance2d({fromPoint: this, toPoint: point});
  }
}
