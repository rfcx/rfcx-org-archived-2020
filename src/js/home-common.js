"use strict";
$( document ).ready(function() {

  $('.js-map-point').click(function(ev) {
    var site = $(this).attr('data-name');
    changeActiveSite(site);
  });

  function changeActiveSite(site) {
    $('.js-map-point.active, .js-map-column.active').removeClass('active');
    $('.js-map-point[data-name="' + site +'"], .js-map-column[data-name="' + site +'"]').addClass('active');
  };

  function validateFormAttrs() {
    var replyTo = $('#_replyto').val().trim(),
        subject = $('#_subject').val().trim(),
        message = $('#message').val().trim(),
        gotcha  = $('#_gotcha').val();
    var flag = true;
    if (!!gotcha.length || !replyTo.length || !subject.length || !message.length) {
      flag = false;
    }
    $('#_replyto').toggleClass('invalid', !replyTo.length);
    $('#_subject').toggleClass('invalid', !subject.length);
    $('#message').toggleClass('invalid', !message.length);
    return flag;
  }

  // Show and play youTube video
  $('#youtubePlayBtn1, #youtubePlayBtn2').click(function() {
    $('#youTubeIframe').attr('src', 'https://www.youtube.com/embed/xPK2Ch90xWo?rel=0&hd=1&autoplay=1');
    $('#videoArea').addClass('playing-video');
  });

  var $contactForm = $('#contactForm');
  $('#contactForm').submit(function(ev) {
    ev.preventDefault();
    if (!validateFormAttrs()) {
      return false;
    }
    jQuery.ajax({
      url: $contactForm.attr('action'),
      method: $contactForm.attr('method'),
      data: $contactForm.serialize(),
      dataType: "json",
      beforeSend: function() {
        $contactForm.addClass('loading');
      }
    })
    .done(function(data) {
      $contactForm[0].reset();
      new Noty({
        type: 'success',
        text: 'Message succeffully sent',
        timeout: 3000
      }).show();
    })
    .fail(function(err) {
      console.log('Error sending email', err);
      new Noty({
        type: 'error',
        text: 'There was an error in process of sending a message. Please try again later or send it directly to contact@rfcx.org',
      }).show();
    })
    .always(function() {
      $contactForm.removeClass('loading');
    });
    return false;
  })

});

