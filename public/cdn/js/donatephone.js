"use strict";

$(function(){

  var donatephone = {
    // First method to call
    init: function() {
      this.initCache();
      this.sendTokenRequest();
      this.bindEvents();
    },

    // Set cached values for jQuery and common objects
    initCache: function() {
        this.$form = $('#donateForm');
        this.$getStarted = $('#getStartedBtn');
        this.$tokenInput = $('#tokenInput');
    },

    // Bind events
    bindEvents: function() {
      this.$form.on('change', '.js-select-phones-qty', onPhonesQtyChanged.bind(this));
      this.$getStarted.click(onGetStartedClick.bind(this));

      function onPhonesQtyChanged(e) {
        var $this = $(e.target);
        // add 's' symbol in the end of word 'smartphone' if select's value is greater than 1
        this.$form.find('.js-smartphones-word').find('.js-many').toggleClass('visible', parseInt($this.val()) > 1);
      }

      function onGetStartedClick() {
        this.showStep(2);
      }
    },

    // Show step by index
    showStep: function (index) {
      var $step = $('#donatePhoneStep' + index);
      $step.slideDown();
    },

    // Set token value in hidden input to value obtained from API
    sendTokenRequest: function() {
      var self = this;
      // Change to actual values when backend will be ready.
      $.ajax({
        type: 'GET',
        url: '/someurl',
        success: function(res) {
          if (res && res.tokenid) {
            self.$tokenInput.val(res.tokenid);
          }
        },
        error: function() {
          console.log('Error getting api token. Check ajax parameters');
        }
      });
    }
  };

  donatephone.init();

});