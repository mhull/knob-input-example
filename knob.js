
KnobInput({
  el: document.querySelector('.knob.component'),
})

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
 */
function KnobInput(settings) {
  if( ! isValidSettings() ) {
    return;
  }

  let knob = getKnob();
  let input = getInput();
  let center = getCenter();

  let isDraggingKnob = false;

  let currentAngle = null;
  let currentValue = null;

  let currentInteractionInitialKnobAngle = null;
  let currentInteractionInitialClientAngle = null;

  initializeKnob();

  function initializeKnob() {
    initializeSettings();
    rotateKnobToAngle(settings.initialAngle);
    setInputValue(settings.initialAngle);
    addEventListeners();
  }

  function isValidSettings() {
    return Boolean( settings.el ) &&
      ( ! settings.initialAngle || parseFloat(settings.initialAngle) );
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
    updateSetting( 'initialAngle', parseFloat(settings.initialAngle) || getDefaultSettings().initialAngle );
  }

  function updateSetting( key, value ) {
    settings[key] = value;
  }

  function getDefaultSettings() {
    return {
      initialAngle: 90,
    }
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

    rotateKnobToAngle(newKnobAngle);
    setInputValue(newKnobAngle);
  }

  function getAngle(position) {
    let dist = getDistance(position);
    let arcsine = radToDeg(getArcsine(dist));

    return arcsineToAngle(arcsine, dist);
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
      ( 360 + arcsine ) % 360 :
      (180 - arcsine);
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
    value && rotateKnobToAngle(value);
  }
}
