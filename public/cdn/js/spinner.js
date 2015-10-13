"use strict";

$(function(){
  var LoadingSpinner = function() {
    var $spinner = $('#spinnerContainer');

    this.show = function() {
      $spinner.show();
    };
    this.hide = function() {
      $spinner.hide();
    };
    return this;
  };

  window.loadingSpinner = new LoadingSpinner();
});