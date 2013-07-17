var RFCX = {
  "currentPage": null
};

$(function(){
  
  if (RFCX.currentPage === "about") {
    setTimeout("animateAlertsInForest();",1000);
    initMap();
  }

});

function animateAlertsInForest() {
	$("div.screen-container div.alert-help").each(function(i){
		$(this).delay(500*i).fadeIn(function(){
			$(this).addClass("hint--always");
		});
	});
}

var rfcxMap;

function initMap() {

  rfcxMap = new L.Map('map-container', {
    center:[10,-120],
    zoom: 1
  });
  
  var mapUrls = {
    tiles: 'http://a.tiles.mapbox.com/v3/rfcx.map-3tqdi8se/{z}/{x}/{y}.png',
    json: 'http://rfcx.cartodb.com/api/v2/viz/67b0fa66-ee40-11e2-8244-3085a9a9563c/viz.json'
  };

  L.tileLayer(mapUrls.tiles, {
    attribution: 'Mapbox <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>'
  }).addTo(rfcxMap);
  
  cartodb.createLayer(rfcxMap, mapUrls.json)
    .addTo(rfcxMap).on('done', function(layer) {
        //do stuff
    }).on('error', function(err) {
      alert("some error occurred: " + err);
    });

}

    // var map;
    // function init(){
    //   // initiate leaflet map
    //   map = new L.Map('map-container', { 
    //     center: [10,-120],
    //     zoom: 1
    //   })

      
    //  L.tileLayer('http://tiles.mapbox.com/v3/base.live-land-tr/{z}/{x}/{y}.png', {
    //  // L.tileLayer('https://dnv9my2eseobd.cloudfront.net/v3/cartodb.map-4xtxp73f/{z}/{x}/{y}.png', {
    //     attribution: 'Mapbox <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>'
    //   }).addTo(map);


    //   var layerUrl = 'http://rfcx.cartodb.com/api/v2/viz/67b0fa66-ee40-11e2-8244-3085a9a9563c/viz.json';


    //   cartodb.createLayer(map, layerUrl)
    //    .addTo(map)
    //    .on('done', function(layer) {
    //     // change the query for the first layer
    //     var subLayerOptions = {
    //       sql: "SELECT * FROM example_cartodbjs_1 where adm0_a3 = 'USA'",
    //       cartocss: "#example_cartodbjs_1{marker-fill: #109DCD; marker-width: 5; marker-line-color: white; marker-line-width: 0;}"
    //     }

    //     layer.getSubLayer(0).set(subLayerOptions);
    //   }).on('error', function() {
    //     //log the error
    //   });
    // }  