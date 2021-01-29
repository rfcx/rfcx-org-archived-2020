var url = "https://api.rfcx.org/public/projects?include_location=true"

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

$.getJSON(url, function (data) {

  var locations = data.filter(function (x) {
    return x.latitude !== null && x.longitude != null
  });

  $.each(locations, function (key, value) {
    var el = document.createElement('div');
    el.className = 'marker';

    var coordinates = [value.longitude, value.latitude]

    new mapboxgl.Marker(el)
      .setLngLat([value.longitude, value.latitude])
      .setPopup(new mapboxgl.Popup({offset: 25})
      .setHTML('<h3>' + value.name + '</h3>' + '<p>' +value.description+ '</p>'))
      .addTo(map);

    el.addEventListener('click', function () {
      map.flyTo({
        center: coordinates,
        zoom: 8
      });
    });
  });
});