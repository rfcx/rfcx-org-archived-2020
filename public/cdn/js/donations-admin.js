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
      var ajaxObj = $.ajax({
        url: url,
        data: this.$form.serialize(),
        beforeSend: function() {
          loadingSpinner.show();
          $('#searchResults').removeClass('visible');
        },
        complete: function() {
          loadingSpinner.hide();
          $('#searchResults').addClass('visible');
        }
      });
      ajaxObj.done(function(res) {
        if (res && res.data) {
          $('#searchResultsCount').text(res.data.length);
          console.log('success', res.data);
        }
      });
      ajaxObj.fail(function(err) {
        console.log('error', err);
      })
    }
  };

  idSearch.init();

});