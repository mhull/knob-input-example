export default class {
  #min;
  #max;

  #minValue;
  #maxValue;

  getValue;

  /**
   * @var {object} settings
   *   @property min
   *   @property max
   */
  constructor(settings) {
    let {min, max, getValue} = settings;

    this.#setMin(min);
    this.#setMax(max);

    if( ! getValue ) {
      getValue = this.#getValueDefaultCallback;
    }
    this.#setGetValue(getValue);

    this.#setMinValue();
    this.#setMaxValue();
  }

  getMin() {
    return this.#min;
  }

  #setMin(min) {
    this.#min = min;
  }

  getMinValue() {
    return this.#minValue;
  }

  #setMinValue() {
    this.#minValue = Number(this.getValue(this.#min));
  }

  getMax() {
    return this.#max;
  }

  #setMax(max) {
    this.#max = max;
  }

  getMaxValue() {
    return this.#maxValue;
  }

  #setMaxValue() {
    this.#maxValue = Number(this.getValue(this.#max));
  }

  #setGetValue(callback) {
    this.getValue = callback;
  }

  #getValueDefaultCallback(item) {
    return Number(item);
  }

  contains(item) {
    let value = Number(this.getValue(item));
    return this.#minValue <= value && value <= this.#maxValue;
  }

  getNearestItem(possibleItem) {
    if(this.getValue(possibleItem) < this.getMinValue()) {
      return this.getMin();
    }
    if(this.getValue(possibleItem) > this.getMaxValue()) {
      return this.getMax();
    }
    return possibleItem;
  }
};
