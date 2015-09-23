"use strict";
function setSquImg(inputObj){

  if ((typeof $ === "undefined") && (inputObj.complete)) {
    var wait = setTimeout(function(){setSquImg(inputObj)},333);
  } else {
    var obj = $(inputObj);
    // I've removed redundant js code from here because we placed images center/center using css.
    obj.css({visibility:"visible"}).animate({opacity:1},500);
  }
}
