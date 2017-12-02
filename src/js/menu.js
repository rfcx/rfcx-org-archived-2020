"use strict";
$( document ).ready(function() {

  var menuTimeout;
  $('#menuBtn').on('touchend click', function() {
    clearTimeout(menuTimeout);
    // wait for some short time to have better transition
    menuTimeout = setTimeout(function() {
      $('#mobileMenu').toggleClass('opened');
    }, 300);
  });

});
