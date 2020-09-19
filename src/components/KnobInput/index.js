import './style.scss';
import template from './template.html';

import Knob from '../../models/Knob';

/**
 * @param {object} settings
 *
 * @property element
 *   (Required) Element whose innerHTML will be replaced with component template
 *
 * @property initialValue
 *   (Default: 0)
 */
export default function(settings) {
  let knob;
  let input;
  let initialValue;

  initialize();

  function initialize() {
    injectTemplate();

    initialValue = settings.initialValue || 0;

    setKnob();
    setInput();

    setInputValue(initialValue);
    addEventListeners();
  }

  function setKnob() {
    knob = new Knob({
      element: getKnobElement(),
      initialValue,
    });
  }

  function getKnobElement() {
    return settings.element.querySelector(getKnobSelector());
  }

  function getKnobSelector() {
    return '.knob.body';
  }

  function setInput() {
    input = settings.element.querySelector('.knob.input input');
  }

  function injectTemplate() {
    let container = settings.element;

    container.classList.add('knob', 'component')
    container.innerHTML = template;
  }

  function setInputValue(value) {
    input.value = value;
  }

  function addEventListeners() {
    input.addEventListener('change', changeInputValue);
    knob.on('rotate', handleRotateEvent);
  }

  function handleRotateEvent(e) {
    setInputValue(knob.getValue(e.data));
  }

  function changeInputValue(event) {
    let value = parseFloat(event.target.value);
    (value || 0 === value) && knob.rotateTo({value});
  }
}
