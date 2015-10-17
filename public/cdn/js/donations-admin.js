$(function () {

  $('#loadingContainer').fadeOut();

  var idSearch = {
    $form: $('#formSearchMailchimpId'),
    $results: $('#searchResults'),
    $resultsCount: $('#searchResultsCount'),
    $list: $('#searchResultsList'),
    $tmpl: $('#donateSearchResultItemTmpl'),
    $resetBtn: $('#searchClearBtn'),

    init: function() {
      this.bindEvents();
    },
    bindEvents: function() {
      this.$form.on('submit', this.onFormSubmit.bind(this));
      this.$resetBtn.click(this.resetForm.bind(this));
    },
    resetForm: function() {
      this.$form[0].reset();
      this.resetResults();
    },
    // Hide results block
    resetResults: function() {
      // Results block including title with count
      this.$results.removeClass('visible');
      // Results list block
      this.$list.removeClass('visible');
      // Clear button
      this.$resetBtn.removeClass('visible');
    },
    onFormSubmit: function(ev) {
      ev.preventDefault();
      this.sendAjax();
    },
    sendAjax: function() {
      var url = this.$form.attr('action');
      var ajaxObj = $.ajax({
        url: url,
        data: this.$form.serialize(),
        beforeSend: function() {
          loadingSpinner.show();
          this.resetResults();
        }.bind(this),
        complete: function() {
          loadingSpinner.hide();
          this.$results.addClass('visible');
        }.bind(this)
      });
      ajaxObj.done(function(res) {
        if (res && res.data) {
          var data = res.data;
          this.$resultsCount.text(data.length);
          if (data.length) {
            this.$list.addClass('visible');
            this.$resetBtn.addClass('visible');
            this.renderData(data);
          }
        }
      }.bind(this));
      ajaxObj.fail(function(err) {
        console.log('error', err);
      })
    },
    // Append results to results list
    renderData: function(data) {
      this.$list.find('.js-search-results-item').remove();
      for(var i = 0; i < data.length; i++) {
        var item = data[i];
        var $html = this.$tmpl.render({
          idEmail: item.email,
          name: item.merges.NAME_DONOR,
          count: item.merges.COUNT,
          id: item.id
        });
        this.$list.append($html);
      }
    }
  };

  idSearch.init();

});