var RFCX = {
  currentPage: null,
  load: {},
  cdn: { rfcx: null, bootstrap: null },
  ui: { all: {}, intro: {}, about: {}, get_involved: {}, media: {} },
  reactiveUi: {},
  initializeUi: {},
  mapObj: null,
  timer: { windowResize: null, windowScroll: null },
  bodyWidth: $('.container-narrow').innerWidth(),
  overflowMarginWidth: 250,
  renderForMobile: false,
  transitionAt: { intro: 418, about: 30, get_involved: 30, media: 30 },
  nodeEnv: null,
  donateAmount: 50,
  videoOffset: [0, 0, 0],
  addThis: { pubId: "", env: [ "production", "development" ] },
  followButtons: { env: [ "production", "development" ] }
};



$(function(){
  
  $.ajaxSetup({ cache:true });

  RFCX.renderForMobile = (parseInt($("body").css("min-width")) < 512);

  for (i in RFCX.load) { RFCX.load[i](); }
  for (i in RFCX.ui[RFCX.currentPage]) { RFCX.ui[RFCX.currentPage][i](); }
  for (i in RFCX.ui.all) { RFCX.ui.all[i](); };

//  RFCX.initializeUi.hideMobileHeader();
  RFCX.initializeUi.setupMobileMenu();

  RFCX.initializeUi.onResize();
  RFCX.initializeUi.onScroll();

});


RFCX.initializeUi.onResize = function() {
  if (!RFCX.renderForMobile) {
    RFCX.reactiveUi.modifyMastheadWidth();
    $(window).resize(function(){
      clearTimeout(RFCX.timer.windowResize);
      RFCX.timer.windowResize = setTimeout(function(){
        RFCX.reactiveUi.modifyMastheadWidth();
      },100);
    });
  }
}

RFCX.initializeUi.onScroll = function() {
  if (!RFCX.renderForMobile) {
    $(window).scroll(function(){
      clearTimeout(RFCX.timer.windowScroll);
      RFCX.timer.windowScroll = setTimeout(function(){
//        RFCX.reactiveUi.modifyFollowButtons();
      },5);
    });
  }
}

RFCX.initializeUi.hideMobileHeader = function() {
  setTimeout(function(){
    window.scrollTo(0, 1);
   }, 0);
}

RFCX.initializeUi.setupMobileMenu = function() {
  if (RFCX.renderForMobile) {
    $(".masthead .menu-toggle").click(function(){
      RFCX.reactiveUi.toggleMobileMenu();
    });
  }
}

RFCX.reactiveUi.toggleMobileMenu = function() {
  
  var bttnIcon = ["block","none"];
  var menuHeight = 174;
  if (parseInt($(".masthead ul").css("height")) > 0) {
    bttnIcon = ["none","block"];
    menuHeight = 0;
  }
  $(".masthead ul").css({height:menuHeight+"px"});
  $(".masthead").css({marginBottom:menuHeight+"px"});
//  $(".banner-video").css({marginTop:menuHeight+"px"});

  $(".masthead .menu-toggle .icon-chevron-up").css({display:bttnIcon[0]});
  $(".masthead .menu-toggle .icon-reorder").css({display:bttnIcon[1]});
};

// RFCX.reactiveUi.modifyFollowButtons = function() {
//   var scrollPosition = $(window).scrollTop();
//   var socialButtonColor = "000000";
//   if (scrollPosition <= RFCX.transitionAt[RFCX.currentPage]) {
//     socialButtonColor = "ffffff";
//   } else if (scrollPosition < (RFCX.transitionAt[RFCX.currentPage]+10)) {
//     socialButtonColor = "888888";
//   }
//   $(".aticon-facebook, .aticon-twitter, .aticon-google_follow, .at4-show .at4-arrow, .at4-hide .at4-arrow").css({color:"#"+socialButtonColor});
// }

RFCX.reactiveUi.modifyMastheadWidth = function() {
  var newWidth = RFCX.bodyWidth+RFCX.overflowMarginWidth+Math.floor(($('body').innerWidth()-RFCX.bodyWidth)/2);
  $(".dynamic-crop-right").css("width",newWidth);
}



RFCX.load.addThis = function() {
  for (var i = 0; i < RFCX.addThis.env.length; i++) { if (RFCX.nodeEnv === RFCX.addThis.env[i]) {
    $.getScript("//s7.addthis.com/js/300/addthis_widget.js#pubid="+RFCX.addThis.pubId, function(){
      addthis.layers({
        'theme':'transparent', 'share':{ 'position':'right', 'numPreferredServices':4 }
        // , 'follow' : { 'services':[ { 'service':'facebook', 'id':'RainforestCx' }, { 'service':'twitter', 'id':'RainforestCx' }, { 'service': 'google_follow', 'id': 'u/0/b/110790947035627675960/110790947035627675960'} ] }
    }); });
    break;
  } }
}

RFCX.load.followButtons = function(){
  for (var i = 0; i < RFCX.addThis.env.length; i++) { if (RFCX.nodeEnv === RFCX.followButtons.env[i]) {
    setTimeout(function(){
      if ($("a.twitter-follow-button").length > 0) {
        !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
      }
      if ($("div.fb-follow").length > 0) {
        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
      }
      if ($("div.g-follow").length > 0) {
        (function() {
          var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
          po.src = 'https://apis.google.com/js/plusone.js';
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
        })();
      }
    }, 50);
  } }
//    $("a.twitter-follow-button, div.fb-follow, div.g-follow").css({border:"solid 1px black",height:"24px",width:"300px"})

}


RFCX.load.stripePayments = function(){

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

RFCX.load.bootstrapJs = function(){
  $.getScript(RFCX.cdn.bootstrap+"/twitter-bootstrap/2.3.2/js/bootstrap.min.js",function(){
  });
}

RFCX.load.hintCss = function() {
  $("head").append($("<link rel=\"stylesheet\" type=\"text/css\" media=\"only screen and (min-width: 1088px)\" />").attr("href", RFCX.cdn.rfcxVendor+"/hint.css/1.2.2/hint.min.css") );
}


RFCX.ui.about.initMap = function(){

  $("head").append($("<link rel=\"stylesheet\" type=\"text/css\" />").attr("href", "//libs.cartocdn.com/cartodb.js/v3/themes/css/cartodb.css") );

  $.getScript("//libs.cartocdn.com/cartodb.js/v3/cartodb.js",function(){

    RFCX.mapObj = new L.Map('map-container', {
      center:[2,60],
      zoom: (!RFCX.renderForMobile) ? 2 : 1,
      zoomControl: false
    });
    
    var mapUrls = {
      tiles: 'http://a.tiles.mapbox.com/v3/rfcx.map-3tqdi8se/{z}/{x}/{y}.png?as',
      json: 'http://rfcx.cartodb.com/api/v2/viz/67b0fa66-ee40-11e2-8244-3085a9a9563c/viz.json'
    };

    L.tileLayer(mapUrls.tiles, {
      attribution: 'Mapbox <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>'
    }).addTo(RFCX.mapObj);
    
    cartodb.createLayer(RFCX.mapObj, mapUrls.json).addTo(RFCX.mapObj)
      .on('done', function(layer){

      }).on('error', function(err){
        console.log("an error occurred: " + err);
      }); 
      
    });
}

RFCX.ui.about.animateHelpCalls = function() {
  setTimeout(function(){
    $("div.screen-container div.alert-help").each(function(i){
      $(this).delay(500*i).fadeIn(function(){
        $(this).addClass("hint--always");
      });
    });
  }, 1000);
}


RFCX.ui.intro.prepareVideo = function() {

    var refBox = $("div.video-box-page");
    var gPos = refBox.offset();
    RFCX.videoOffset = [gPos.top, gPos.left, parseInt(refBox.width())];
    
    $("body").append(
        "<div class=\"video-box video-box-outer\">"
        +"<img src=\""+RFCX.cdn.rfcx+"/img/intro/16x9.16.gif\" class=\"rfcx-trans-50 video-box-bg\">"
        +"<i class=\"icon-play-circle\"></i>"
        +"</div>"
        +"<div class=\"video-box-outer-backdrop\"></div>");
}




RFCX.ui.all.emailSubscribeFormSetup = function() {

  if ($("form.rfcx-form").length > 0) {
    $.getScript(RFCX.cdn.cdnJs+"/parsley.js/1.1.16/parsley.min.js",function(){
      $("#mc-embedded-subscribe-form").submit(function(){
        var isEmailValid = $("input.input-large.email").parsley("validate");
        if (!isEmailValid) {
          alert("Please enter a valid e-mail.");
        }
        return isEmailValid;
      });
      $("#mc-embedded-subscribe-form a.btn-success").click(function(){
        $("#mc-embedded-subscribe-form").submit();
      });
    });
  }

}

RFCX.ui.all.alertifySetup = function() {
  // $("head").append($("<link rel=\"stylesheet\" type=\"text/css\" />").attr("href", RFCX.cdn.cdnJs+"/alertify.js/0.3.10/alertify.core.css") );
  // $("head").append($("<link rel=\"stylesheet\" type=\"text/css\" />").attr("href", RFCX.cdn.cdnJs+"/alertify.js/0.3.10/alertify.default.css") );
  // $.getScript(RFCX.cdn.cdnJs+"/alertify.js/0.3.10/alertify.min.js",function(){
  // });
}


RFCX.setupVideo = function(videoBox) {

  var videoLink = "http://player.vimeo.com/video/72226953"
        +"?title=0"
        +"&byline=0"
        +"&portrait=1"
        +"&color=c9ff23"
        +"&autoplay=1"
        +"&api=1";

  if (RFCX.renderForMobile) {
    window.open(videoLink);
  } else {
    // var jqVideoBoxOrig = $(videoBox);
    // var gPos = jqVideoBoxOrig.offset();
    // RFCX.videoOffset = [gPos.top, gPos.left, parseInt(jqVideoBoxOrig.width())];
    var jqVideoBoxOuter = $("div.video-box-outer");

    jqVideoBoxOuter.css({ top: RFCX.videoOffset[0]+"px", left: RFCX.videoOffset[1]+"px", width:RFCX.videoOffset[2]+"px", display:"block" });
//    jqVideoBoxOrig.css({display:"none"});

    RFCX.toggleAddThis(false);

    $(".video-box-outer-backdrop").css({display:"block",opacity:0}).animate({
      opacity:1
    },function(){

      jqVideoBoxOuter.animate({
        top: "24px", left: "0%", width: "100%", borderWidth: "0px"
      },function(){
        $(this).html("<iframe src=\""+videoLink.replace(/&/g,"&amp;")+"\""
          +" width=\""+parseInt($(this).width())+"\" height=\""+parseInt($(this).height())+"\""
          +" frameborder=\"0\" style=\"width:100%;\""
          +" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");

        $(document).keyup(function(e) {
          if (e.keyCode == 27) { RFCX.closeVideo(); }
        });

      });

    });


  }
}

RFCX.closeVideo = function() {
  $("div.video-box-outer")
    .html("<img src=\""+RFCX.cdn.rfcx+"/img/intro/16x9.16.gif\" class=\"rfcx-trans-50 video-box-bg\"><i class=\"icon-play-circle\"></i>")
    .animate({
    top: RFCX.videoOffset[0]+"px", left: RFCX.videoOffset[1]+"px", width: RFCX.videoOffset[2]+"px"
  },function(){
    $("div.video-box-outer, div.video-box-outer-backdrop").css({display:"none"});
    RFCX.toggleAddThis(true);
  });
}

RFCX.toggleAddThis = function(onOff) {
  var newDisplay = "none";
  if (onOff) { newDisplay = "block"; }
  $(".at4-share-outer-right").css("display",newDisplay);
}

