import Angle from './Angle';

export default class {
  #fromPoint;
  #toPoint;

  constructor(settings) {
    let {fromPoint, toPoint} = settings;

    this.#setFromPoint(fromPoint);
    this.#setToPoint(toPoint);
  }

  #setFromPoint(fromPoint) {
    this.#fromPoint = fromPoint;
  }

  #setToPoint(toPoint) {
    this.#toPoint = toPoint;
  }

  #getX() {
    return this.#toPoint.getX() - this.#fromPoint.getX();
  }

  #getY() {
    // Note the positive y-direction is "down" in the browser, but we use "up"; thus the reversal when compared to `getX()`
    return this.#fromPoint.getY() - this.#toPoint.getY();
  }

  #measure() {
    let distXsq = Math.pow(this.#getX(), 2);
    let distYsq = Math.pow(this.#getY(), 2);

    return Math.sqrt( distXsq + distYsq );
  }

  getAngle() {
    return new Angle({
      arcsin: Math.asin(this.#getY() / this.#measure()),
      quadrant: this.#getVectorQuadrant(),
    });
  }

  #getVectorQuadrant() {
    let y = this.#getY();

    return this.#getX() > 0 ?
      (y > 0 ? 1 : 4) :
      (y > 0 ? 2 : 3 );
  }
}
