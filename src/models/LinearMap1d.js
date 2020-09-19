export default class {
  #domain;
  #range;
  #isReversed;

  #scale;
  #translateAmount;

  constructor(settings) {
    let {domain, range, isReversed} = settings;
    this.setDomain(domain);
    this.setRange(range);
    this.setReversed(isReversed);

    this.setScale();
    this.setTranslateAmount();
  }

  setDomain(value) {
    this.#domain = value;
  }

  setRange(value) {
    this.#range = value;
  }

  setReversed(value) {
    this.#isReversed = value;
  }

  setScale() {
    let rangeDiff = this.#range.getMaxValue() - this.#range.getMinValue();
    let domainDiff = this.#domain.getMaxValue() - this.#domain.getMinValue();

    let scale = rangeDiff / domainDiff;

    this.#scale = this.#isReversed ?
      scale * -1 :
      scale;
  }

  setTranslateAmount() {
    this.#translateAmount = this.#isReversed ?
      this.#range.getMaxValue() :
      this.#range.getMinValue();
  }

  map(domainItem) {
    let domainValue = this.#domain.getValue(domainItem);

    let distanceFromMin = Math.abs(domainValue - this.#domain.getMinValue());
    return distanceFromMin * this.#scale + this.#translateAmount;
  }

  getInverse(rangeItem) {
    let rangeValue = this.#range.getValue(rangeItem);

    return ((rangeValue - this.#translateAmount) / this.#scale ) + this.#domain.getMinValue();
  }
};
