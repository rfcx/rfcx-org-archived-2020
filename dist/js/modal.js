"use strict";
$( document ).ready(function() {

  $('.js-show-subscr-modal').click(function(ev) {
    ev.preventDefault();
    $('#modalSubscribe').addClass('visible');
    return false;
  });

  $('#btnCloseModal').click(function() {
    $('#modalSubscribe').removeClass('visible');
  });

  $('#formSubscribe').submit(function(ev) {
    ev.preventDefault();
    return false;
  })

});
