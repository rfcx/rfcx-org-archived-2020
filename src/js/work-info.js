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
    var $target = $('.js-variable-content[data-name="' + name + '"]');
    if ($target.length) {
      $('.js-variable-content.active').removeClass('active');
      $target.addClass('active');
    }
  }
});
