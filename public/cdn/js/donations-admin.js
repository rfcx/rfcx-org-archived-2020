$(function () {

  $('#loadingContainer').fadeOut();

  var localData = {};

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
      this.$list.on('click', '.js-edit-row', this.onEditClick.bind(this));
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
    onEditClick: function(ev) {
      var $this = $(ev.currentTarget);
      var id    = $this.attr('data-id');
      formUpdate.setValues(localData[id]);
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
            this.reformatLocalData(data);
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
    reformatLocalData: function(data) {
      for (var i=0; i < data.length; i++) {
        localData[data[i].id] = data[i];
      }
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

  var formUpdate = {
    $form: $('#formUpdate'),
    init: function() {
      this.bindEvents();
    },
    bindEvents: function() {
      this.$form.on('submit', this.onSubmit.bind(this));
    },
    setValues: function(data) {
      this.$form.find('.js-form-input').each(function() {
        var $this = $(this);
        var name = $this.attr('name');
        $this.val(data[name] || data.merges[name] || '');
      });
    },
    onSubmit: function(ev) {
      ev.preventDefault();
      this.saveData();
    },
    saveData: function() {
      var ajaxObj = $.ajax({
        type: this.$form.attr('method'),
        url: this.$form.attr('action'),
        data: this.$form.serialize(),
        beforeSend: function() {
          loadingSpinner.show();
        },
        complete: function() {
          loadingSpinner.hide();
        }
      });
      ajaxObj.done(function(res) {
        if (res && res.status == 'success') {
          new rfcxNotification({type: 'success', message: 'Successfully updated.'})
        }
      }.bind(this));
      ajaxObj.fail(function(err) {
        new rfcxNotification({type: 'error', message: 'Error when saving the data.'})
      })
    }
  };

  idSearch.init();
  formUpdate.init();

});