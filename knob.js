let knobs = document.querySelectorAll('.knob.component');

knobs.length &&
  knobs.forEach( knob => KnobInput({ el: knob }) );

function KnobInput(settings) {
  /**
   * @var {object} settings
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
  if( ! isValidSettings() ) {
    return;
  }

  let knob = getKnob();
  let center = getCenter();

  let elCurrentlyDragging = null;

  initializeKnob();

  /** Desktop (drag) **/
  knob.addEventListener('dragstart', dragstart);
  knob.addEventListener('dragend', dragend);
  document.addEventListener('dragover', dragover);

  /** Non-Desktop (touch) **/
  knob.addEventListener('touchmove', touchmove);

  function isValidSettings() {
    return Boolean( settings.el ) &&
      ( ! settings.initialAngle || parseFloat(settings.initialAngle) );
  }

  function initializeKnob() {
    initializeSettings();
    initializeRotationAmount();
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

  function initializeRotationAmount() {
    setKnobAngle(clientAngleToKnobAngle(settings.initialAngle));
  }

  function dragstart(event) {
    setElCurrentlyDragging(knob);
    setDragImage(event);
  }

  function dragend() {
    setElCurrentlyDragging(null);
  }

  function dragover(event) {
    isDraggingKnob() && rotateKnobToClientPosition(getMousePosition(event));
  }

  function isDraggingKnob() {
    return null !== elCurrentlyDragging;
  }

  function setDragImage(event) {
    event.dataTransfer.setDragImage(document.createElement('div'), 0, 0);
  }

  function setElCurrentlyDragging(el) {
    elCurrentlyDragging = el;
  }

  function getMousePosition(event) {
    return {
      x: event.pageX,
      y: event.pageY,
    };
  }

  function touchmove(event) {
    rotateKnobToClientPosition(getTouchPosition(event));
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

  function rotateKnobToClientPosition(position) {
    position && setKnobAngle(clientAngleToKnobAngle(getClientAngle(position)));
  }

  function getKnobSelector() {
    return '.knob.body';
  }

  function getKnob() {
    return settings.el.querySelector(getKnobSelector());
  }

  function getCenter() {
    let rect = knob.getBoundingClientRect();

    return {
      x: (rect.left + rect.right)/2,
      y: (rect.top + rect.bottom)/2,
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

  function getDistance(mouse) {
    return {
      x: getDistX(mouse),
      y: getDistY(mouse),
      hyp: getDistHyp(mouse),
    }
  }

  function getArcsine(dist) {
    return Math.asin( dist.y / dist.hyp );
  }

  function radToDeg(angle) {
    return angle * (180/Math.PI);
  }

  function arcsineToAngle(arcsine, dist) {
    return ( dist.x > 0 ) ? arcsine : (180 - arcsine)
  }

  function getClientAngle(clientPosition) {
    let dist = getDistance(clientPosition);
    let arcsine = radToDeg(getArcsine(dist));

    return arcsineToAngle(arcsine, dist);
  }

  function clientAngleToKnobAngle(degrees) {
    return -1 * (degrees - 90)
  }

  function setKnobAngle(degrees) {
    knob.style.transform = `rotate(${degrees}deg)`;
  }
}
