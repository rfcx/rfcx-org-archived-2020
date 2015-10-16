$(function () {

  $('#loadingContainer').fadeOut();

  var donationsOpts = {
    fixedColsCount: 2,
    url: 'mailchimp/get',
    sortedColumnIndex: 1,
  };

  var donationsAdmin = {
    mailchimpData: {},
    init: function() {
      this.bindEvents();
      this.initDataTable();
    },
    bindEvents: function() {
      $('#dataTable').on('click', '.js-edit-row', this.onChangeRow.bind(this));
    },
    onChangeRow: function(ev) {
      var $this = $(ev.target);
      console.log('Clicked ID:', $this.data('id'));
    },
    initDataTable: function() {
      this.dataTable = $('#dataTable').DataTable({
        fixedColumns: {
          leftColumns: donationsOpts.fixedColsCount
        },
        "order": [[ donationsOpts.sortedColumnIndex, "asc" ]],
        "processing": true,
        "scrollX": true,
        "ajax": {
          url: donationsOpts.url,
          dataSrc: function(d) {
            this.mailchimpData = d.data;
            return d.data;
          }
        },
        "columns": [
          {
            "mData": null,
            "bSortable": false,
            "mRender": function(data) {
              return '<a class="fa fa-edit js-edit-row" data-id="' + data.id +'" href="javascript:void(0);"></a>';
            }
          },
          {"data": "email"},
          {"data": "merges.NAME_DONOR"},
          {"data": "merges.COUNT"},
          {"data": "merges.NOTE_DONOR"},
          {"data": "merges.NOTE_ADMIN"},
          {"data": "merges.ADDRESS"},
          {"data": "merges.PHOTO"},
          {"data": "merges.EMAIL_REAL"},
          {"data": "merges.REGISTERED"},
          {"data": "merges.RECEIVED"},
          {"data": "merges.NAME_ADMIN"},
          {"data": "merges.VALUE_USD"}
        ]
      });
    }
  };

  donationsAdmin.init();

});