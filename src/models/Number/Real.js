export default class {
  #value;

  constructor(number) {
    this.#setValue(Number(number));
  }

  getValue() {
    return this.#value;
  }

  #setValue(value) {
    this.#value = value;
  }

  hasValue() {
    return Boolean(this.#value) || 0 === this.#value;
  }
};
