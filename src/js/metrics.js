"use strict";
$( document ).ready(function() {

  var $metricsEl = $('#metricsSection');
  var metricsOffsetTop = 0;
  var metricsHeight = 0;
  var windowHeight = $(window).height();
  var duration = 4000;
  var decimal_places = 1;
  var decimal_factor = Math.pow(10, decimal_places);
  var isCompleted = false;
  var scrollTop = 0;

  calculateDimensions();
  checkForStart();

  function doubleNumberStep(now, tween) {
    var floored_number = Math.floor(now) / decimal_factor,
        target = $(tween.elem);

    floored_number = floored_number.toFixed(decimal_places);
    target.text(floored_number);
  }

  function init(el, number, isDouble) {
    if (!$(el).length) return;
    isDouble = isDouble !== undefined? isDouble : false;
    var opts = {
      number: isDouble? number * decimal_factor : number,
      easing: 'easeInOut',
    }
    if (isDouble) {
      opts.numberStep = doubleNumberStep;
    }
    $(el).animateNumber(opts, duration);
  }

  function calculateDimensions() {
    metricsOffsetTop = $metricsEl.offset().top; // remove .top to avoid console error on landing page
    metricsHeight = $metricsEl.height();
    windowHeight = $(window).height();
  }

  function startAnimation() {
    if (isCompleted) return;
    isCompleted = true;
    init('#numberHectares', 26);
    init('#numberDays', 4629);
    init('#numberTons', 6.5, true);
    init('#numberCars', 1.3, true);
  }

  function checkForStart() {
    if ((scrollTop + windowHeight / 2) > metricsOffsetTop || (scrollTop + windowHeight) > (metricsOffsetTop + metricsHeight)){
      startAnimation();
    }
  }

  $(window).resize(function() {
    calculateDimensions();
    scrollTop = $(this).scrollTop();
    checkForStart();
  });

  $(window).scroll(function() {
    scrollTop = $(this).scrollTop();
    checkForStart();
 });

});
