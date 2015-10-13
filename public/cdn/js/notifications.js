"use strict";

// Create a constructor in window scope
var rfcxNotification = function() {};

$(function() {
  // Container where we will append all messages
  var $notificationsContainer = $('#notificationsContainer');
  // Event which fired when one of the messages is closed
  $notificationsContainer.on('close.bs.alert', '.alert', onCloseAlert);

  function onCloseAlert() {
    // When we closed all of messages, then close the notification container
    if ($notificationsContainer.find('.alert').length == 1) {
      $notificationsContainer.empty().removeClass('visible');
    }
  }

  // Message constructor
  rfcxNotification = function(opts) {
    // jsrender templates
    var templates = {
      error:   $('#alertTmpl'),
      success: $('#successTmpl'),
      info:    $('#infoTmpl')
    };

    // create random id for every message for further access via DOM
    var _elId = 'alert' + Math.random().toString().substring(2);
    var data = {
      _id: _elId,
      type: 'info',
      message: ''
    };

    $.extend(data, opts);

    // generate message html with data
    var $html = templates[data.type].render(data);

    // show notifications container and append new message
    $notificationsContainer.addClass('visible').append($html);

    // Hide current message in 7 seconds
    setTimeout(function() {
      var $el = $('#' + _elId);
      if ($el.length) {
        $('#' + _elId).alert('close');
      }
    }, 7000);
  }
});