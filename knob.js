let knobs = document.querySelectorAll('.knob.component');

knobs.length &&
  knobs.forEach( knob => KnobInput(knob) );

function KnobInput( container ) {
  let knob = getKnob(container);
  let center = getCenter(knob);

  let elCurrentlyDragging = null;

  /** Desktop (drag) **/
  knob.addEventListener('dragstart', dragstart);
  knob.addEventListener('dragend', dragend);
  document.addEventListener('dragover', dragover);

  /** Non-Desktop (touch) **/
  knob.addEventListener('touchmove', touchmove);

  function dragstart(event) {
    setElCurrentlyDragging(event.target);
    setDragImage(event);
  }

  function dragend() {
    setElCurrentlyDragging(null);
  }

  function dragover(event) {
    if( ! isDraggingKnob() ) {
      return;
    }

    let mouse = getMousePosition(event);
    let knobAngle = mouseAngleToKnobAngle(getMouseAngle(mouse));

    setKnobAngle(knobAngle);
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
    let touch = getTouchPosition(event);
    let knobAngle = touch && mouseAngleToKnobAngle(getMouseAngle(touch));

    knobAngle && setKnobAngle(knobAngle);
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

  function getKnobSelector() {
    return '.knob.body';
  }

  function getKnob(parentEl) {
    return parentEl.querySelector(getKnobSelector());
  }

  function getCenter(knob) {
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

  function getMouseAngle(mouse) {
    let dist = getDistance(mouse);
    let arcsine = radToDeg(getArcsine(dist));

    return arcsineToAngle(arcsine, dist);
  }

  function mouseAngleToKnobAngle(mouseDegrees) {
    return -1 * (mouseDegrees - 90)
  }

  function setKnobAngle(degrees) {
    knob.style.transform = `rotate(${degrees}deg)`;
  }
}
