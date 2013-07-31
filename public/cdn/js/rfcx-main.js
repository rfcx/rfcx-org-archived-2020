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
    center:[2,60],
    zoom: 2
  });
  
  var mapUrls = {
    tiles: 'http://a.tiles.mapbox.com/v3/rfcx.map-3tqdi8se/{z}/{x}/{y}.png?as',
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

$(function(){
    $('#stripe-donate-button').click(function(){
      var token = function(res){
        var $input = $('<input type=hidden name=stripeToken />').val(res.id);
        $('form').append($input).submit();
      };

      StripeCheckout.open({
        key: 'pk_test_t9ZzGqE7SlzQzSyGVmLaDj8K',
        address: false,
        amount: 5000,
        currency: 'usd',
        name: 'Rainforest Connection',
        description: 'Make a kind donation',
        image: RFCX.cdnDomain+'/img/logo/logo-square-stripe.128.png',
        panelLabel: 'Donate',
        token: token
      });

      return false;
    });
});
