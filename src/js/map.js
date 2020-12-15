mapboxgl.accessToken = 'pk.eyJ1IjoicmZjeCIsImEiOiJoMEptMnlJIn0.LPKrjG_3AeYB5cqsyLpcrg';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/rfcx/ck9g6dci83g3x1io8dl27r7aq',
  center: [15, 10],
  zoom: 2,
  attributionControl: false
});

var geojson = {
  type: 'FeatureCollection',
  features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [101.343109, -0.589724]
      },
      properties: {
        title: 'Sumatra',
        description: 'Washington, D.C.'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [13.1535811, 4.6125522]
      },
      properties: {
        title: 'Cameroon',
        description: 'San Francisco, California'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-78.333000, 0.217000]
      },
      properties: {
        title: 'Cerro Blanco, Ecuador',
        description: 'San Francisco, California'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-77.471400, -5.697800]
      },
      properties: {
        title: 'Alto Mayo, Peru',
        description: 'San Francisco, California'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-58.873399, 0.303640]
      },
      properties: {
        title: 'Tembé Tribal Reserve, Northern Brazil',
        description: 'San Francisco, California'
      }
    }
  ]
};


// add markers to map
geojson.features.forEach(function (marker) {

  // create a HTML element for each feature
  var el = document.createElement('div');
  el.className = 'marker';

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({
        offset: 25
      }) // add popups
      .setHTML('<h3>' + marker.properties.title + '</h3><p>'))
    .addTo(map);
});