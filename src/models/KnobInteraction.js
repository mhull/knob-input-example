import Point2d from './Point2d';

export default class {
  #knob;
  #initialEvent;
  #currentEvent;

  #initialKnobAngle;
  #initialClientAngle;

  constructor(settings) {
    let {knob, initialEvent} = settings;
    this.#setKnob(knob);
    this.#setInitialEvent(initialEvent);
    this.#setCurrentEvent(initialEvent);

    this.#setInitialKnobAngle();
    this.#setInitialClientAngle();
  }

  #setKnob(knob) {
    this.#knob = knob;
  }

  #setInitialEvent(event) {
    this.#initialEvent = event;
  }

  #setCurrentEvent(event) {
    this.#currentEvent = event;
  }

  #setInitialKnobAngle() {
    this.#initialKnobAngle = this.#knob.getAngle();
  }

  #setInitialClientAngle() {
    this.#initialClientAngle = this.#getClientAngle();
  }

 #getPosition(event) {
    return new Point2d(this.#getCoordinates(event));
  }

  #getCoordinates(event) {
    return this.#isDragEvent(event) ?
      this.#getMouseCoordinates(event) :
      this.#getTouchCoordinates(event);
  }

  #isDragEvent(event) {
    return ['dragstart', 'dragover'].indexOf(event.type) > -1;
  }

  #getMouseCoordinates(event) {
    return [
      event.pageX,
      event.pageY
    ];
  }

  #getTouchCoordinates(event) {
    return [
      event.changedTouches[0].pageX,
      event.changedTouches[0].pageY,
    ]
  }

  #getClientPosition() {
    return this.#getPosition(this.#currentEvent);
  }

  #getClientDistanceToCenter() {
    return this.#knob
      .getElement()
      .getCenter()
      .getDistanceTo(this.#getClientPosition());
  }

  #getClientAngle() {
    return this.#getClientDistanceToCenter().getAngle();
  }

  respondTo(event) {
    this.#setCurrentEvent(event);

    let clientAngle = this.#getClientAngle();

    let rotationAmount = clientAngle.minus(this.#initialClientAngle);
    let angle = this.#initialKnobAngle.plus(rotationAmount)

    this.#knob.rotateTo({angle});
  }
};
