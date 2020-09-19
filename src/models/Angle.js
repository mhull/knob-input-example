import RealNumber from './Number/Real';

export default class Angle {
  #radians;
  #degrees;
  #arcsin;
  #quadrant;

  constructor(settings) {
    let {radians, degrees, arcsin, quadrant} = settings;

    this.#setRadians(radians);
    this.#setDegrees(degrees);
    this.#setArcsin(arcsin);
    this.#setQuadrant(quadrant);
  }

  getRadians() {
    return this.#radians.hasValue() ?
      this.#radians.getValue() : (
        this.#degrees.hasValue() ?
          this.degreesToRadians(this.#degrees.getValue()) : (
            this.#arcsin.hasValue() && Boolean(this.#quadrant) ?
              this.arcsinToRadians(this.#arcsin.getValue(), this.#quadrant) :
              null
          )
      );
  }

  #setRadians(radians) {
    this.#radians = new RealNumber(radians);
  }

  getDegrees() {
    return this.#degrees.hasValue() ?
      this.#degrees.getValue() :
      this.radiansToDegrees(this.#radians.getValue());
  }

  #setDegrees(degrees) {
    this.#degrees = new RealNumber(degrees);
  }

  #setArcsin(arcsin) {
    this.#arcsin = new RealNumber(arcsin);
  }

  #setQuadrant(quadrant) {
    this.#quadrant = quadrant;
  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  arcsinToRadians(arcsin, quadrant) {
    return quadrant ? (
      [1,4].indexOf(quadrant) > -1 ?
        arcsin :
        Math.PI - arcsin
      ) :
      arcsin;
  }

  getCssDegrees() {
    let degrees = this.getDegrees();
    return -1 * (degrees - 90)
  }

  radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
  }

  plus(angle) {
    return new Angle({radians: this.getRadians() + angle.getRadians()});
  }

  minus(angle) {
    return new Angle({radians: this.getRadians() - angle.getRadians()});
  }
};
