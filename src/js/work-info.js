"use strict";
$( document ).ready(function() {

  $('.js-column-btn').on('click', function() {
    var name = $(this).attr('data-name');
    $('.js-variable-content.active').removeClass('active');
    $('.js-variable-content[data-name="' + name + '"]').addClass('active');
  });

});
