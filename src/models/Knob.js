import El from './Element';
import KnobEventHandler from './KnobEventHandler';

import Angle from './Angle';
import Interval1d from './Interval1d';
import KnobValue from "./KnobValue";

export default class {
  #element;
  #range;
  #angle;

  #value;
  #eventHandler;

  constructor(settings) {
    let {element, range, initialValue} = settings;
    this.#setElement(element);
    this.#setRange(range);

    this.#setValue();

    let initialAngle = initialValue ?
      this.#value.getAngle(initialValue) :
      this.#getDefaultAngle();

    this.#setAngle(initialAngle);


    this.#setEventHandler();
    this.#rotateToAngle(this.#angle);
  }

  getElement() {
    return this.#element;
  }

  #setElement(el) {
    this.#element = new El(el);
  }

  #getNode() {
    return this.getElement().getNode();
  }

  getRange() {
    return this.#range;
  }

  #setRange(range) {
    if( ! range ) {
      range = this.#getDefaultRange();
    }
    this.#range = range;
  }

  #getDefaultRange() {
    return new Interval1d({
      min: new Angle({degrees: -45}),
      max: new Angle({degrees: 225}),
      getValue: angle => angle.getRadians(),
    });
  }

  getAngle() {
    return this.#angle;
  }

  #setAngle(angle) {
    this.#angle = angle;
  }

  #getDefaultAngle() {
    return this.getRange().getMax();
  }

  getValue(angle) {
    return this.#value.getValue(angle);
  }

  #setValue() {
    this.#value = new KnobValue({
      knob: this,
      range: new Interval1d({
        min: 0,
        max: 100,
      }),
      isReverseMapping: true,
    })
  }

  #setEventHandler() {
    this.#eventHandler = new KnobEventHandler({
      knob: this,
    });
  }

  rotateTo(to) {
    let {angle, value} = to;

    if(! angle) {
      angle = this.#value.getAngle(value);
    }
    this.#rotateToAngle(angle);
  }

  #rotateToAngle(angle) {
    let range = this.getRange();

    if(! range.contains(angle)) {
      angle = range.getNearestItem(angle);
    }
    this.#setAngle(angle);
    this.#setCssRotationAmount();

    this.getElement().emit('rotate', angle);
  }

  #setCssRotationAmount() {
    let degrees = this.getAngle().getCssDegrees();
    this.#getNode().style.transform = `rotate(${degrees}deg)`;
  }

  on(eventType, callback) {
    this.getElement().on(eventType, callback);
  }
};
