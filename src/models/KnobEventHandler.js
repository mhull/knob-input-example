import KnobInteraction from "./KnobInteraction";

export default class {
  #knob;
  #isTurning = false;
  #currentInteraction;

  constructor(settings) {
    let {knob} = settings;
    this.#setKnob(knob);

    this.listen();
  }

  #setKnob(knob) {
    this.#knob = knob;
  }

  #getKnobNode() {
    return this.#knob.getElement().getNode();
  }

  listen() {
    let el = this.#getKnobNode();

    /** Desktop (drag) **/
    el.addEventListener('dragstart', this.#dragstart.bind(this));
    el.addEventListener('dragend', this.dragend.bind(this));
    document.addEventListener('dragover', this.dragover.bind(this));

    /** Non-Desktop (touch) **/
    el.addEventListener('touchstart', this.touchstart.bind(this));
    el.addEventListener('touchmove', this.touchmove.bind(this));
  }

  #dragstart(event) {
    this.#setCurrentInteraction(event);
    this.#setDragImage(event);
    this.#isTurning = true;
  }

  #setDragImage(event) {
    event.dataTransfer.setDragImage(document.createElement('div'), 0, 0);
  }

  dragend() {
    this.#isTurning = false;
  }

  dragover(event) {
    if(! this.#isTurning) {
      return;
    }
    this.#currentInteraction.respondTo(event);
  }

  touchstart(event) {
    this.#setCurrentInteraction(event);
  }

  touchmove(event) {
    this.#currentInteraction.respondTo(event);
  }

  #setCurrentInteraction(event) {
    this.#currentInteraction = new KnobInteraction({
      knob: this.#knob,
      initialEvent: event,
    });
  }
};
