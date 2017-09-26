"use strict";
$( document ).ready(function() {

  var hash;
  if (window.location && window.location.hash) {
    hash = window.location.hash.substring(1);
  }
  if (hash && hash.length) {
    changeActiveHash(hash);
  }

  $('.js-column-btn').on('click', function() {
    var name = $(this).attr('data-name');
    changeActiveHash(name);
  });

  function changeActiveHash(name) {
    $('.js-variable-content.active').removeClass('active');
    $('.js-variable-content[data-name="' + name + '"]').addClass('active');
  }
});
