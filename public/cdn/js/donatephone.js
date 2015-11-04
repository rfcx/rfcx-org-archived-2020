"use strict";

$(function(){

  var donatephone = {
    // First method to call
    init: function() {
      this.initCache();
      this.bindEvents();
    },

    // Set cached values for jQuery and common objects
    initCache: function() {
        this.$form = $('#donateForm');
        this.$getStarted = $('#getStartedBtn');
    },

    // Bind events
    bindEvents: function() {
      // Onchange phone number select
      this.$form.on('change', '.js-select-phones-qty', onPhonesQtyChanged.bind(this));
      // onSubmit overall form
      this.$form.on('submit', onFormSubmit.bind(this));
      // onClick for Get Started btn
      this.$getStarted.click(onGetStartedClick.bind(this));

      function onPhonesQtyChanged(e) {
        var $this = $(e.target);
        // add 's' symbol in the end of word 'smartphone' if select's value is greater than 1
        this.$form.find('.js-smartphones-word').find('.js-many').toggleClass('visible', parseInt($this.val()) > 1);
      }

      function onFormSubmit(e) {
        e.preventDefault();
        this.sendUserData();
        return false;
      }

      function onGetStartedClick() {
        this.showStep(2);
      }
    },

    // Show step by index
    showStep: function (index) {
      var $step = $('#donatePhoneStep' + index);
      if (!$step.hasClass('slidedDown')) {
        $step.velocity("slideDown", function() {
          $step.addClass('slidedDown');
          this._scrollToPos($step.offset().top);
        }.bind(this));
      }
    },

    sendUserData: function() {
      var res = this._sendAjax({
        type: this.$form.attr('method'),
        url: this.$form.attr('action'),
        data: this.$form.serialize()
      }, false);
      res.success(function(data){
        if (!data) {
          return new rfcxNotification({type: 'error', message: 'Server has not responded.'})
        }
        if (data.status == 'success') {
          console.log('email', data.email);
          location.href = '/donate/instructions?token=' + data.email.substring(0,6);
        }
        else if (data.status == 'error') {
          if (grecaptcha) {
            grecaptcha.reset();
          }
          return new rfcxNotification({type: 'error', message: data.message})
        }
      }.bind(this));
      res.error(function(data){
        new rfcxNotification({type: 'error', message: data.responseJSON.message || 'Sever error.'});
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
      }.bind(this));
    },

    // Common method for ajax
    _sendAjax: function(params, silent) {
      silent = silent || false;
      return $.ajax({
        type: params.type,
        url: params.url,
        data: params.data || null,
        beforeSend: function() {
          if (!silent) {
            loadingSpinner.show();
          }
        },
        complete: function() {
          if (!silent) {
            loadingSpinner.hide();
          }
        }
      });
    },

    // Smooth page scrolling
    _scrollToPos: function (pos, cb) {
      $("html").velocity("scroll",
        {
          offset: pos,
          mobileHA: false,
          complete: function () {
            if(cb) cb();
          }
        }
      );
    }
  };

  donatephone.init();

});