var url = "https://staging-api.rfcx.org/streams"
var token = "" // RFCx token

mapboxgl.accessToken = 'pk.eyJ1IjoicmZjeCIsImEiOiJoMEptMnlJIn0.LPKrjG_3AeYB5cqsyLpcrg';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/rfcx/ck9g6dci83g3x1io8dl27r7aq',
  center: [15, 10],
  zoom: 2,
  attributionControl: false
});

map.scrollZoom.disable();
map.addControl(new mapboxgl.NavigationControl(), 'top-right');

$.ajaxSetup({
  headers: {
    'Authorization': 'Bearer ' + token
  }
});

$.getJSON(url, function (data) {

  var locations = data.filter(function(x){ return x.latitude !== null && x.longitude != null});

  $.each( locations, function (key, value) {
    var el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker(el)
      .setLngLat([value.longitude,value.latitude])
      .setPopup(new mapboxgl.Popup({offset: 25})
      .setHTML('<h3>' + value.country_name + '</h3>'))
      .addTo(map);

      console.log(value);
  });
});