import Angle from "./Angle";
import LinearMap1d from "./LinearMap1d";

export default class {
  #knob;
  #range;

  #mapping;

  constructor(settings) {
    let {knob, range, isReverseMapping} = settings;

    this.#setKnob(knob);
    this.#setRange(range);

    this.#setMapping(Boolean(isReverseMapping));
  }


  #setKnob(knob) {
    this.#knob = knob;
  }

  #setRange(range) {
    this.#range = range;
  }

  #setMapping(isReversed) {
    this.#mapping = new LinearMap1d({
      domain: this.#knob.getRange(),
      range: this.#range,
      isReversed,
    });
  }

  getValue(angle) {
    return this.#mapping.map(angle);
  }

  getAngle(value) {
    return new Angle({radians: this.#mapping.getInverse(value)});
  }
};
