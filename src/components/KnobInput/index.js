import './style.scss';

/**
 * @param {object} settings
 *
 * @property el
 *   (Required) Knob component root element
 *
 * @property initialAngle
 *   Default: 90
 *
 *   Angle at which the knob value indicator should be initialized. Angle measurement is defined as follows:
 *     - An xy-plane containing the device viewport is imagined to be the overall context
 *     - The center of DOM element given by `settings.el` is the origin of the xy-plane
 *     - From here, we follow standard trigonometric angle measurement definition:
 *       - The angle's vertex point is defined to be the origin
 *       - Measurement begins at the positive x-axis (i.e. The zero angle is the positive x-axis itself)
 *       - Measurement in the positive direction is defined to be counter-clockwise
 *       - Measurement in the negative direction is defined to be clockwise
 *
 * @property {object} range
 *   Default: null
 *   The set of values the knob input may take on
 *
 *   @property {object} min
 *     @property {number} angle
 *     @property {number} value
 *
 *   @property {object} max
 *     @property {number} angle
 *     @property {number} value
 */
export default function(settings) {
  if( ! isValidSettings() ) {
    return;
  }

  let knob = getKnob();
  let input = getInput();
  let center = getCenter();

  let isDraggingKnob = false;

  let currentAngle = null;

  let currentInteractionInitialKnobAngle = null;
  let currentInteractionInitialClientAngle = null;

  initializeKnob();

  function initializeKnob() {
    initializeSettings();
    setInputValue(getInitialValue());
    rotateKnobToAngle(settings.initialAngle);
    addEventListeners();
  }

  function isValidSettings() {
    return isValidDomElement() &&
      isValidInitialAngle() &&
      isValidMin() &&
      isValidMax();
  }

  function isValidDomElement() {
    return settings.el?.matches('.knob.component');
  }

  function isValidInitialAngle() {
    return ! settings.initialAngle || parseFloat(settings.initialAngle);
  }

  function isValidMin() {
    return ! settings.range?.min ||
      ('number' === typeof settings.range?.min?.angle && 'number' === typeof settings.range?.min?.value);
  }

  function isValidMax() {
    return ! settings.range?.max ||
      'number' === typeof settings.range?.max?.angle && 'number' === typeof settings.range?.max?.value;
  }

  function getKnob() {
    return settings.el.querySelector(getKnobSelector());
  }

  function getKnobSelector() {
    return '.knob.body';
  }

  function getInput() {
    return settings.el.querySelector('.knob.input input');
  }

  function getCenter() {
    let rect = knob.getBoundingClientRect();

    return {
      x: (rect.left + rect.right)/2,
      y: (rect.top + rect.bottom)/2,
    }
  }

  function initializeSettings() {
    updateSetting('range', getInitialRange());
    updateSetting('initialAngle', parseFloat(settings.initialAngle) || getDefaultSettings().initialAngle);
  }

  function getInitialRange() {
    return {
      min: getInitialMin(),
      max: getInitialMax(),
    };
  }

  function getInitialMin() {
    return settings.range?.min || getDefaultSettings().range.min;
  }

  function getInitialMax() {
    return settings.range?.max || getDefaultSettings().range.max;
  }

  function getDefaultSettings() {
    return {
      initialAngle: 225,
      range: {
        min: {
          angle: 225,
          value: 0,
        },
        max: {
          angle: -45,
          value: 100
        },
      },
    }
  }

  function updateSetting(key, value) {
    settings[key] = value;
  }

  function getInitialValue() {
    return getValueForAngle(settings.initialAngle);
  }

  function getValueForAngle(angle) {
    return getArcPercentForAngle(angle) * getExtremeValuesDiff() + settings.range.min.value;
  }

  function getArcPercentForAngle(angle) {
    return Math.abs(angle - settings.range.min.angle) / getExtremeValuesAngleDiff();
  }

  function getExtremeValuesDiff() {
    return Math.abs(settings.range.max.value - settings.range.min.value);
  }

  function getDirectionSign() {
    return settings.range.max.angle > settings.range.min.angle ? 1 : -1;
  }

  function getExtremeValuesAngleDiff() {
    return Math.abs(settings.range.max.angle - settings.range.min.angle);
  }

  function rotateKnobToAngle(angle) {
    setCurrentAngle(angle);
    setKnobCssRotationAmount(angleToCssAngle(angle));
  }

  function setCurrentAngle(angle) {
    currentAngle = angle;
  }

  function setKnobCssRotationAmount(degrees) {
    knob.style.transform = `rotate(${degrees}deg)`;
  }

  function setInputValue(value) {
    input.value = value;
  }

  function addEventListeners() {
    /** Desktop (drag) **/
    knob.addEventListener('dragstart', dragstart);
    knob.addEventListener('dragend', dragend);
    document.addEventListener('dragover', dragover);

    /** Non-Desktop (touch) **/
    knob.addEventListener('touchstart', touchstart);
    knob.addEventListener('touchmove', touchmove);

    input.addEventListener('change', changeInputValue);
  }

  function dragstart(event) {
    setDraggingKnob(true);

    let position = getMousePosition(event);
    initializeInteraction(position);

    setDragImage(event);
  }

  function setDraggingKnob(value) {
    isDraggingKnob = Boolean(value);
  }

  function getMousePosition(event) {
    return {
      x: event.pageX,
      y: event.pageY,
    };
  }

  function initializeInteraction(position) {
    setCurrentInteractionInitialKnobAngle(currentAngle);
    setCurrentInteractionInitialClientAngle(getAngle(position));
  }

  function setCurrentInteractionInitialKnobAngle(angle) {
    currentInteractionInitialKnobAngle = angle;
  }

  function setCurrentInteractionInitialClientAngle(angle) {
    currentInteractionInitialClientAngle = angle;
  }

  function setDragImage(event) {
    event.dataTransfer.setDragImage(document.createElement('div'), 0, 0);
  }

  function dragend() {
    setDraggingKnob(false);
  }

  function dragover(event) {
    isDraggingKnob && updateKnobFromClientPosition(getMousePosition(event));
  }

  function updateKnobFromClientPosition(position) {
    let angle = getAngle(position);

    let amountRotated = angle - currentInteractionInitialClientAngle;
    let newKnobAngle = currentInteractionInitialKnobAngle + amountRotated;

    if(! isAngleInRange(newKnobAngle)) {
      newKnobAngle = replaceOutOfRangeAngle(newKnobAngle);
    }

    rotateKnobToAngle(newKnobAngle);
    setInputValue(getValueForAngle(newKnobAngle));
  }

  function getAngle(position) {
    let dist = getDistance(position);
    let arcsine = radToDeg(getArcsine(dist));

    return arcsineToAngle(arcsine, dist);
  }

  function isAngleInRange(angle) {
    return getDirectionSign() > 0 ?
      settings.range.min.angle < angle && angle < settings.range.max.angle :
      settings.range.max.angle < angle && angle < settings.range.min.angle;
  }

  function replaceOutOfRangeAngle(angle) {
    return (getArcPercentForAngle(angle) < 0.5) ? settings.range.min.angle : settings.range.max.angle;
  }

  function getDistance(mouse) {
    return {
      x: getDistX(mouse),
      y: getDistY(mouse),
      hyp: getDistHyp(mouse),
    }
  }

  function getDistX(mouse) {
    return mouse.x - center.x;
  }

  function getDistY(mouse) {
    return center.y - mouse.y;
  }

  function getDistHyp(mouse) {
    let distXSquared = Math.pow( getDistX( mouse), 2 );
    let distYSquared = Math.pow( getDistY( mouse ), 2 );

    return Math.sqrt( distXSquared + distYSquared );
  }

  function getArcsine(dist) {
    return Math.asin( dist.y / dist.hyp );
  }

  function radToDeg(angle) {
    return angle * (180/Math.PI);
  }

  function arcsineToAngle(arcsine, dist) {
    return ( dist.x > 0 ) ?
      getFullRotationCount() + arcsine :
      getFullRotationCount() + (180 - arcsine);
  }

  function getFullRotationCount() {
    return Math.floor( currentAngle / 360 );
  }

  function angleToCssAngle(degrees) {
    return -1 * (degrees - 90)
  }

  function touchstart(event) {
    initializeInteraction(getTouchPosition(event));
  }

  function touchmove(event) {
    updateKnobFromClientPosition(getTouchPosition(event));
  }

  function getTouchPosition(event) {
    return isValidTouch(event) &&
      {
        x: event.changedTouches[0].pageX,
        y: event.changedTouches[0].pageY,
      };
  }

  function isValidTouch(event) {
    return event.isTrusted && isSingleTouch(event);
  }

  function isSingleTouch(event) {
    return 1 === event.changedTouches.length;
  }

  function changeInputValue(event) {
    let value = parseFloat(event.target.value);
    (value || 0 === value) && rotateKnobToValue(value);
  }

  function rotateKnobToValue(value) {
    rotateKnobToAngle(getAngleForValue(value));
  }

  function getAngleForValue(value) {
    return getValuePercent(value) * getExtremeValuesAngleDiff() * getDirectionSign() + settings.range.min.angle;
  }

  function getValuePercent(value) {
    return Math.abs(value - settings.range.min.value) / getExtremeValuesDiff();
  }
}
