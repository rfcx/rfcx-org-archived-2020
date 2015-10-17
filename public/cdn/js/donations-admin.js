$(function () {

  $('#loadingContainer').fadeOut();

  var idSearch = {
    $form: $('#formSearchMailchimpId'),
    init: function() {
      this.bindEvents();
    },
    bindEvents: function() {
      this.$form.on('submit', this.onFormSubmit.bind(this));
    },
    onFormSubmit: function(ev) {
      ev.preventDefault();
      var url = this.$form.attr('action');
      var ajaxObj = $.get(url, this.$form.serialize());
      ajaxObj.done(function(data) {
        console.log('success', data);
      });
      ajaxObj.fail(function(err) {
        console.log('error', err);
      })
    }
  };

  idSearch.init();

});