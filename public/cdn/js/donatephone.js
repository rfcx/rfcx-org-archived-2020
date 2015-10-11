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
      this.$form.on('submit', onFormSubmit.bind(this));
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

    // Set token value in hidden input to value obtained from API
    sendTokenRequest: function() {
      // Change to actual values when backend will be ready.
      var res = this._sendAjax({
        type: 'GET',
        url: '/someurl'
      });
      res.success(function(data) {
        if (data && data.tokenid) {
          this.$tokenInput.val(data.tokenid);
        }
      }.bind(this));
      res.error(function() {
        console.log('Error getting api token. Check ajax parameters');
      }.bind(this));
    },
    //checkRecaptcha: function() {
    //  var res = this._sendAjax({
    //    type: 'POST',
    //    url: '/checkrecaptcha',
    //    data: this.$form.serialize()
    //  }, false);
    //  res.success(function(data) {
    //    console.log('data', data);
    //    //this.sendUserData();
    //  }).bind(this);
    //  res.error(function(data) {
    //    alert('Error processing data.')
    //  });
    //},
    sendUserData: function() {
      var res = this._sendAjax({
        type: 'POST',
        url: '/donatephone',
        data: this.$form.serialize()
      }, false);
      res.success(function(data){
        this.showStep(3);
      }.bind(this));
      res.error(function(){
        alert('Error processing data.')
      }.bind(this));
    },
    _sendAjax: function(params, silent) {
      silent = silent || true;
      return $.ajax({
        type: params.type,
        url: params.url,
        data: params.data || null,
        beforeSend: function() {
          if (!silent) {
            // show loading spinner
          }
        },
        complete: function() {
          if (!silent) {
            // hide loading spinner
          }
        }
      });
    },
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