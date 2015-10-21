"use strict";

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

  // Modal form with Donor info update
  var formUpdate = {
    $form: $('#formUpdate'),
    $inputAddress: $('#inputDonorAddress'),
    $inputStreet: $('#inputDonorStreet'),
    $inputCity: $('#inputDonorCity'),
    $inputState: $('#inputDonorState'),
    $inputZip: $('#inputDonorZip'),
    $inputCountry: $('#inputDonorCountry'),
    init: function() {
      this.bindEvents();
    },
    bindEvents: function() {
      this.$form.on('submit', this.onSubmit.bind(this));
      this.$form.on('keyup change', '.js-address-field', this.onAddressChanged.bind(this));
    },
    setValues: function(data) {
      // fullfill all values from selected Donor except complex address field
      this.$form.find('.js-form-input').each(function() {
        var $this = $(this);
        var name = $this.attr('name');
        if (name !== 'ADDRESS') {
          $this.val(data[name] || data.merges[name] || '');
        }
      });
      // Split address complex object into separate fields
      if (data.merges && data.merges.ADDRESS) {
        var address = data.merges.ADDRESS;
        this.$inputStreet.val(address['addr1'] || '');
        this.$inputCity.val(address.city || '');
        this.$inputState.val(address.state || '');
        this.$inputZip.val(address.zip || '');
        this.$inputCountry.val(address.country || '');
      }
    },
    onSubmit: function(ev) {
      ev.preventDefault();
      this.saveData();
    },
    onAddressChanged: function() {
      var address = {
        street  : this.$inputStreet.val(),
        city    : this.$inputCity.val(),
        state   : this.$inputState.val(),
        zip     : this.$inputZip.val(),
        country : this.$inputCountry.val()
      };
      // if one of the address fields is empty then clear address input
      for (var key in address) {
        if (address.hasOwnProperty(key)) {
          if (!address[key].length) {
            this.$inputAddress.val('');
            return;
          }
        }
      }
      // concatenate address fields into one mailchimp address string
      var fullAddress = $.trim([address.street, address.city, address.state, address.zip, address.country].join('  '));
      this.$inputAddress.val(fullAddress);
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