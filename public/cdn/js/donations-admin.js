$(function() {

  $('#loadingContainer').fadeOut();

  var table = $('#dataTable').DataTable({
    "processing": true,
    "scrollX": true,
    "ajax": "mailchimp/get",
    "columns": [
      { "data": "email" },
      { "data": "merges.NAME_DONOR" },
      { "data": "merges.COUNT" },
      { "data": "merges.NOTE_DONOR" },
      { "data": "merges.NOTE_ADMIN" },
      { "data": "merges.ADDRESS" },
      { "data": "merges.PHOTO" },
      { "data": "merges.EMAIL_REAL" }
    ]
  });

  new $.fn.dataTable.FixedColumns(table);

});