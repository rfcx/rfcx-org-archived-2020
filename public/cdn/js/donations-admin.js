$(function () {

  $('#loadingContainer').fadeOut();

  var table = $('#dataTable').DataTable({
    fixedColumns: {
      leftColumns: 2
    },
    "order": [[ 1, "asc" ]],
    "processing": true,
    "scrollX": true,
    "ajax": "mailchimp/get",
    "columns": [
      {
        "mData": null,
        "bSortable": false,
        "mRender": function(data, type, full) {
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

  $('#dataTable').on('click', '.js-edit-row', onChangeRow);

  function onChangeRow() {
    var $this = $(this);
    console.log('tt', $this.data('id'));
  }

});