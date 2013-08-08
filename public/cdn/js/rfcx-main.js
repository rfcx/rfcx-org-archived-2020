var RFCX = {
  currentPage: null,
  cdn: { rfcx: null, bootstrap: null },
  windowResizeTimer: null,
  bodyWidth: $('.container-narrow').innerWidth(),
  overflowMarginWidth: 250,
  transitionAt: { home: 418, about: 30, get_involved: 30, media: 30 },
  nodeEnv: null,
  donateAmount: 50,
  addThisPubId: ''
};

RFCX.setMastheadWidth = function() {
  var newWidth = RFCX.bodyWidth+RFCX.overflowMarginWidth+Math.floor(($('body').innerWidth()-RFCX.bodyWidth)/2);
  $(".dynamic-crop-right").css("width",newWidth);
  console.log("Width: "+newWidth);
}

RFCX.emailSubscribeSubmit = function() {
  $("#mc-embedded-subscribe-form").each(function(){
    $(this).submit();
  });
}



$(function(){
  
  if (RFCX.currentPage === "about") {
    setTimeout("animateAlertsInForest();",1000);
    initMap();
  }

  RFCX.loadScripts();
  RFCX.setMastheadWidth();

});

RFCX.loadScripts = function() {

  $.getScript(RFCX.cdn.bootstrap+"/twitter-bootstrap/2.3.2/js/bootstrap.min.js");  
  RFCX.stripeSetup();
  RFCX.loadAddThis();
}

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


$(window).resize(function(){
    clearTimeout(RFCX.windowResizeTimer);
    RFCX.windowResizeTimer = setTimeout("RFCX.setMastheadWidth();",100);
});

$(window).scroll(function(){
  var scrollPosition = $(window).scrollTop();
  var socialButtonColor = "000000";
  if (scrollPosition <= RFCX.transitionAt[RFCX.currentPage]) {
    socialButtonColor = "ffffff";
  } else if (scrollPosition < (RFCX.transitionAt[RFCX.currentPage]+10)) {
    socialButtonColor = "888888";
  }
  $(".aticon-facebook, .aticon-twitter, .aticon-google_follow").css({color:"#"+socialButtonColor});
});

RFCX.loadAddThis = function() {
  if (RFCX.nodeEnv === "production") {
    $.getScript("//s7.addthis.com/js/300/addthis_widget.js#pubid="+RFCX.addThisPubId, function(){
        addthis.layers({
          'theme':'transparent', 'share':{ 'position':'left', 'numPreferredServices':4 },
          'follow' : { 'services':[
            { 'service':'facebook', 'id':'RainforestCx' },
            { 'service':'twitter', 'id':'RainforestCx' },
            { 'service': 'google_follow', 'id': 'u/0/b/110790947035627675960/110790947035627675960'}
          ]
        }
      });
    });
  }
}



RFCX.stripeSetup = function(){

  if ($("#stripe-payment-button").length > 0) {

    $.getScript("https://checkout.stripe.com/v2/checkout.js", function(){
      $("#stripe-payment-button").click(function(){
        var token = function(res){
          var $input = $('<input type=hidden name=stripeToken />').val(res.id);
          $('form').append($input).submit();
        };
        StripeCheckout.open({
          key: 'pk_test_t9ZzGqE7SlzQzSyGVmLaDj8K',
          address: false,
          amount: (100*RFCX.donateAmount),
          currency: 'usd',
          name: 'Rainforest Connection',
          description: 'Make a kind donation',
          image: RFCX.cdn.rfcx+'/img/logo/logo-square-stripe.128.png',
          panelLabel: 'Donate',
          token: token
        });
        return false;
      });
    });
  }
}


