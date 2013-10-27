var RFCX = {
  currentPage: null,
  fn: {
    load: {},
    reactiveUi: {},
    initializeUi: {},
    ui: { all: {}, intro: {}, about: {}, get_involved: {}, team:{}, media: {} }
  },
  cdn: { rfcx: null, bootstrap: null },
  mapObj: null,
  timer: { windowResize: null, windowScroll: null },
  bodyWidth: $('.container-narrow').innerWidth(),
  overflowMarginWidth: 250,
  renderForMobile: false,
  transitionAt: { intro: 418, about: 30, get_involved: 30, media: 30 },
  nodeEnv: null,
  donateAmount: 50,
  videoOffset: [0, 0, 0],
  scrollQueues: {
    loadFollowButtons: {
      whenVisible: { intro: ".rfcx-row-intro-join" },
      position: 1000, mobilePosition: 1000, isLoaded: false }
  },
  social: {
    addThis: { pubId: "", env: [ "production", "development" ] },
    followButtons: { env: [ "production", "development" ] }
  }
};



$(function(){
  
  $.ajaxSetup({ cache:true });

  RFCX.renderForMobile = (parseInt($("body").css("min-width")) < 512);

  for (i in RFCX.fn.load) { RFCX.fn.load[i](); }
  for (i in RFCX.fn.ui[RFCX.currentPage]) { RFCX.fn.ui[RFCX.currentPage][i](); }
  for (i in RFCX.fn.ui.all) { RFCX.fn.ui.all[i](); };

  RFCX.fn.initializeUi.setupMobileMenu();

  RFCX.fn.initializeUi.onResize();
  RFCX.fn.initializeUi.onScroll();

});


RFCX.fn.initializeUi.onResize = function() {
  if (!RFCX.renderForMobile) {
    RFCX.fn.reactiveUi.modifyMastheadWidth();
    $(window).resize(function(){
      clearTimeout(RFCX.timer.windowResize);
      RFCX.timer.windowResize = setTimeout(function(){
        RFCX.fn.reactiveUi.modifyMastheadWidth();
      },100);
    });
  }
}

RFCX.fn.initializeUi.onScroll = function() {
    $(window).scroll(function(){
      clearTimeout(RFCX.timer.windowScroll);
      RFCX.timer.windowScroll = setTimeout(function(){
        RFCX.fn.reactiveUi.scrollQueues();
      },50);
    });
}

RFCX.fn.initializeUi.hideMobileHeader = function() {
  setTimeout(function(){
    window.scrollTo(0, 1);
   }, 50);
}

RFCX.fn.initializeUi.setupMobileMenu = function() {
  if (RFCX.renderForMobile) {
    $(".masthead .menu-toggle").click(function(){
      RFCX.fn.reactiveUi.toggleMobileMenu();
    });
  }
}

RFCX.fn.reactiveUi.toggleMobileMenu = function() {
  
  var bttnIcon = ["block","none"];
  var menuHeight = 174;
  if (parseInt($(".masthead ul").css("height")) > 0) {
    bttnIcon = ["none","block"];
    menuHeight = 0;
  }
  $(".masthead ul").css({height:menuHeight+"px"});
  $(".masthead").css({marginBottom:menuHeight+"px"});

  $(".masthead .menu-toggle .fa-chevron-up").css({display:bttnIcon[0]});
  $(".masthead .menu-toggle .fa-reorder").css({display:bttnIcon[1]});
};


RFCX.fn.reactiveUi.scrollQueues = function() {
  var scrollPosition = $(window).scrollTop() + $(window).height();
  for (func in RFCX.scrollQueues) {
    if  (!RFCX.scrollQueues[func].isLoaded) {
      var runAtPosition = (RFCX.scrollQueues[func].whenVisible[RFCX.currentPage]!=null) ? $(RFCX.scrollQueues[func].whenVisible[RFCX.currentPage]).offset().top : ((RFCX.renderForMobile) ? RFCX.scrollQueues[func].position : RFCX.scrollQueues[func].mobilePosition);
      if (scrollPosition >= runAtPosition) {
        RFCX.fn.reactiveUi[func]();
        RFCX.scrollQueues[func].isLoaded = true;
      }
    }
  }
}

RFCX.fn.reactiveUi.modifyMastheadWidth = function() {
  var newWidth = RFCX.bodyWidth+RFCX.overflowMarginWidth+Math.floor(($('body').innerWidth()-RFCX.bodyWidth)/2);
  $(".dynamic-crop-right").css("width",newWidth);
}

RFCX.fn.insertCss = function(url) {
  var s = document.createElement("link");
  s.rel = "stylesheet"; s.type = "text/css"; s.async = true;
  var id = "css-"+Math.round(Math.random()*100000); s.id = id;
  s.href = url;
  var x = document.getElementsByTagName("head")[0]; x.appendChild(s);
}

RFCX.fn.load.addThis = function() {
  for (var i = 0; i < RFCX.social.addThis.env.length; i++) { if (RFCX.nodeEnv === RFCX.social.addThis.env[i]) {
    $.getScript("//s7.addthis.com/js/300/addthis_widget.js#pubid="+RFCX.social.addThis.pubId, function(){
      addthis.layers({ theme: "transparent",
        share: { position: "right", numPreferredServices: 4 }/*, whatsnext: { recommendedTitle: "Hello" }*/
      });
    });
    break;
  } }
}

RFCX.fn.reactiveUi.loadFollowButtons = function(){
  for (var i = 0; i < RFCX.social.followButtons.env.length; i++) { if (RFCX.nodeEnv === RFCX.social.followButtons.env[i]) {
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
}


RFCX.fn.load.stripePayments = function(){

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

RFCX.fn.load.bootstrapJs = function(){
  $.getScript(RFCX.cdn.bootstrap+"/twitter-bootstrap/2.3.2/js/bootstrap.min.js",function(){
  });
}

 RFCX.fn.load.hintCss = function() {
  if (!RFCX.renderForMobile) {
    RFCX.fn.insertCss(RFCX.cdn.rfcxVendor+"/hint.css/1.3.0/hint.min.css");
  }
}

RFCX.fn.ui.about.initMap = function(){

  RFCX.fn.insertCss("//libs.cartocdn.com/cartodb.js/v3/themes/css/cartodb.css");

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

RFCX.fn.ui.intro.initVideo = function(){

  RFCX.fn.insertCss(RFCX.cdn.videoJs+"/4.1/video-js.css");

  $.getScript(RFCX.cdn.videoJs+"/4.1/video.js",function(){
    if (RFCX.cdn.videoJs.indexOf("//") == -1) { videojs.options.flash.swf = RFCX.cdn.videoJs+"/4.1/video-js.swf"; }
    console.log("video.js has been loaded");

  });
}

RFCX.fn.ui.about.animateHelpCalls = function() {
  setTimeout(function(){
    $("div.screen-container div.alert-help").each(function(i){
      $(this).delay(500*i).fadeIn(function(){
        $(this).addClass("hint--always");
      });
    });
  }, 1000);
}


RFCX.fn.ui.intro.prepareVideo = function() {

    var refBox = $("div.video-box-page");
    var gPos = refBox.offset();
    RFCX.videoOffset = [gPos.top, gPos.left, parseInt(refBox.width())];
    
    $("body").append(
        "<div class=\"video-box video-box-outer\">"
        +"<img src=\""+RFCX.cdn.rfcx+"/img/intro/16x9.16.gif\" class=\"rfcx-trans-50 video-box-bg\">"
        +"<i class=\"fa fa-play-circle-o\"></i>"
        +"</div>"
        +"<div class=\"video-box-outer-backdrop\"></div>");
}




RFCX.fn.ui.all.emailSubscribeFormSetup = function() {

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

RFCX.fn.ui.all.alertifySetup = function() {
  // $("head").append($("<link rel=\"stylesheet\" type=\"text/css\" />").attr("href", RFCX.cdn.cdnJs+"/alertify.js/0.3.10/alertify.core.css") );
  // $("head").append($("<link rel=\"stylesheet\" type=\"text/css\" />").attr("href", RFCX.cdn.cdnJs+"/alertify.js/0.3.10/alertify.default.css") );
  // $.getScript(RFCX.cdn.cdnJs+"/alertify.js/0.3.10/alertify.min.js",function(){
  // });
}


RFCX.setupVideo = function(videoBox) {

  var videoLink = "http://player.vimeo.com/video/75713955"
        +"?title=0"
        +"&byline=0"
        +"&portrait=1"
        +"&color=c9ff23"
        +"&autoplay=1"
        +"&api=1";

  if (RFCX.renderForMobile) {
    window.open("http://player.vimeo.com/external/72226953.sd.mp4?s=d05a9d0492dc5b6b77758c612016cbb5");
  } else {
    var jqVideoBoxOuter = $("div.video-box-outer");
    jqVideoBoxOuter.css({ top: RFCX.videoOffset[0]+"px", left: RFCX.videoOffset[1]+"px", width:RFCX.videoOffset[2]+"px", display:"block" });
    RFCX.toggleAddThis(false);
    $(window).scrollTop(0);
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
    .html("<img src=\""+RFCX.cdn.rfcx+"/img/intro/16x9.16.gif\" class=\"rfcx-trans-50 video-box-bg\"><i class=\"fa fa-play-circle-o\"></i>")
    .animate({
    top: RFCX.videoOffset[0]+"px", left: RFCX.videoOffset[1]+"px", width: RFCX.videoOffset[2]+"px", borderWidth: "4px"
  },function(){
    $("div.video-box-outer, div.video-box-outer-backdrop").css({display:"none"});
    RFCX.toggleAddThis(true);
  });
}

RFCX.toggleAddThis = function(onOff) {
  var newDisplay = "none";
  if (onOff) { newDisplay = "block"; }
  $(".addthis-smartlayers-desktop-right").css("display",newDisplay);
}

