var RFCX = {
  currentPage: null,
  pageLoaded:new Date(),
  isIsolated: false,
  isHTTPS: (window.location.protocol.indexOf("https") > -1),
  fn: { load: {}, reactiveUi: {}, initializeUi: {}, video: {},
    ui: {
      all: {}, intro: {}, about: {}, get_involved: {}, team:{}, media: {}, video: {}
    }
  },
  cdn: { rfcx: null, rfcxVendor: null, rfcxStatic:"//d4bl4mvczhn5i.cloudfront.net/", bootstrap: null, cdnJs: null, videoJs: null },
  mapObj: null,
  timer: { windowResize: null, windowScroll: null },
  bodyWidth: $('.container-narrow').innerWidth(),
  overflowMarginWidth: 250,
  renderForMobile: false,
  renderForTouch: $("html").hasClass("touch"),
  transitionAt: { intro: 418, about: 30, get_involved: 30, media: 30 },
  nodeEnv: null,
  appVersion: null,
  donateAmount: 50,
  speedTest: { kB: 100, expireMinutes: 2 },
  snapJsObj: null,
  olark: { allow: true, excludePaths: ["/","/video"], displayDelay: 15 },
  scrollQueues: {
    loadFollowButtons: {
      whenVisible: { intro: ".rfcx-row-sctn-join" },
      position: 1000, mobilePosition: 1000, isLoaded: false }
  },
  social: {
    addThis: { pubId: "", env: [ "production", "development" ] },
    followButtons: { env: [ "production", "development" ] }
  }
};

$(function(){
  
  $.ajaxSetup({ cache:true });
  
  RFCX.setDevMode();

  RFCX.renderForMobile = (parseInt($("body").css("min-width")) < 512);

  for (i in RFCX.fn.load) { RFCX.fn.load[i](); }
  for (i in RFCX.fn.ui[RFCX.currentPage]) { RFCX.fn.ui[RFCX.currentPage][i](); }
  for (i in RFCX.fn.ui.all) { RFCX.fn.ui.all[i](); };

  RFCX.fn.initializeUi.setupMobileMenu();
  RFCX.fn.initializeUi.onResize();
  RFCX.fn.initializeUi.onScroll();
  RFCX.fn.initializeUi.externalizeModalPopups();

  RFCX.setOlark();

});


RFCX.fn.initializeUi.onResize = function() {
  if (!RFCX.renderForMobile) {
    RFCX.fn.reactiveUi.modifyOverWidthElements();
    $(window).resize(function(){
      clearTimeout(RFCX.timer.windowResize);
      RFCX.timer.windowResize = setTimeout(function(){
        RFCX.fn.reactiveUi.modifyOverWidthElements();
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
  setTimeout(function(){ window.scrollTo(0, 1); }, 50);
}

RFCX.fn.initializeUi.setupMobileMenu = function() {
  if (RFCX.renderForMobile) {
    RFCX.fn.insertCss(RFCX.cdn.rfcxVendor+"/snap.js/1.9.2/snap.css");
    $.getScript(RFCX.cdn.rfcxVendor+"/snap.js/1.9.2/snap.min.js",function(){
      RFCX.snapJsObj = new Snap({
        element: document.getElementById("rfcx-container"),
        disable: "left"
      });
    });
    $(".masthead .menu-toggle").click(function(){
        RFCX.snapJsObj.open("right");
    });
  }
}


RFCX.fn.initializeUi.externalizeModalPopups = function() {
  $("#rfcx-container .modal").each(function(){
    var modal = $(this).clone();
    $(modal).appendTo("body");
    $(this).remove();
  });
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

RFCX.fn.reactiveUi.modifyOverWidthElements = function() {
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
        RFCX.donateAmount = Math.round($("#rfcx-donate-amount").val());
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
  $.getScript(RFCX.cdn.bootstrap+"/twitter-bootstrap/2.3.2/js/bootstrap.min.js");
}

RFCX.fn.load.jqueryAnimateScroll = function(){
  $.getScript(RFCX.cdn.rfcxVendor+"/jquery-animate-scroll/1.0.5/animatescroll.js");
}

 RFCX.fn.load.hintCss = function() {
//  if (!RFCX.renderForMobile) { RFCX.fn.insertCss(RFCX.cdn.rfcxVendor+"/hint.css/1.3.0/hint.min.css"); }
  if (!RFCX.renderForMobile) { RFCX.fn.insertCss(RFCX.cdn.rfcxVendor+"/hint.css/1.3.0/hint.css"); }
}

RFCX.fn.load.addThis = function() {
  if (!RFCX.isIsolated) {
    for (var i = 0; i < RFCX.social.addThis.env.length; i++) { if (RFCX.nodeEnv === RFCX.social.addThis.env[i]) {
      $.getScript("//s7.addthis.com/js/300/addthis_widget.js#pubid="+RFCX.social.addThis.pubId, function(){
        addthis.layers({ theme: "transparent", 
          share: { position: "right", numPreferredServices: 4 }/*,
          whatsnext: { recommendedTitle: "Hello" }*/
        });
    }); break; } }
  }
}

RFCX.fn.load.browserDetect = function() {
  if (!RFCX.renderForMobile) {
    $.getScript(RFCX.cdn.rfcxVendor+"/browser-detect/browser-detect.min.js",function(){
      if (BrowserDetect.browser==="Explorer") {
        if (BrowserDetect.version <= 8) {
          RFCX.video.forceYouTube = true;
          if ($("#map-container").length > 0) { RFCX.fn.insertCss("//libs.cartocdn.com/cartodb.js/v3/themes/css/cartodb.ie.css"); }
        }
        if (BrowserDetect.version <= 7) {
          RFCX.regressFontAwesome();
        }
      }
  });}
}

RFCX.fn.ui.about.initMap = function(){

  RFCX.fn.insertCss("//libs.cartocdn.com/cartodb.js/v3/themes/css/cartodb.css");
  $.getScript("//libs.cartocdn.com/cartodb.js/v3/cartodb.js",function(){

    RFCX.mapObj = new L.Map('map-container', {
      center:[2,60], zoom: (!RFCX.renderForMobile) ? 2 : 1, zoomControl: false
    });
    
    var mapUrls = {
      tiles: '//a.tiles.mapbox.com/v3/rfcx.map-3tqdi8se/{z}/{x}/{y}.png?as',
      json: '//rfcx.cartodb.com/api/v2/viz/40cabcb8-56d0-11e3-87d7-3085a9a9563c/viz.json?+v='+RFCX.appVersion
    };

    L.tileLayer(mapUrls.tiles, {
      attribution: 'Mapbox <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>'
    }).addTo(RFCX.mapObj);
    
    cartodb.createLayer(RFCX.mapObj, mapUrls.json, {https:RFCX.isHTTPS}).addTo(RFCX.mapObj)
      .on('done', function(layer){
      }).on('error', function(err){
      });
    });
}

RFCX.fn.ui.about.animateHelpCalls = function() {
  setTimeout(function(){
    $("div.screen-container div.alert-help").each(function(i){
      $(this).delay(500*i).fadeIn(function(){
        $(this).addClass("hint--always");
      });
    });
  }, 2000);
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


RFCX.toggleAddThis = function(onOff) {
  var newDisplay = "none";
  if (onOff) { newDisplay = "block"; }
  $(".addthis-smartlayers-desktop").css("display",newDisplay);
}

RFCX.toggleBanner = function(onOff,inputObj) {
  
  if (inputObj==null) { var inputObj = {}; }
  var id = (typeof inputObj.id=="undefined") ? "" : inputObj.id;
  var bannerContainer = $("#rfcx-banner-alert-"+id);
  
  if (onOff && (bannerContainer.length==0)) {
    var color = (typeof inputObj.color=="undefined") ? "green" : inputObj.color;
    var yPos = (typeof inputObj.yPos=="undefined") ? 0 : parseInt(inputObj.yPos);
    var text = (typeof inputObj.text=="undefined") ? "Enter a message..." : inputObj.text;
    var href = (typeof inputObj.href=="undefined") ? "#" : inputObj.href;
    var wd = Math.round(1.556*$("#rfcx-container").width());
    var classIndex = { green:"success", gray:"", grey:"", red:"danger", blue:"action", yellow:"warning", marine:"info", black:"inverse"};
    var colorClass = (typeof classIndex[color] == "undefined") ? "" : classIndex[color];
    RFCX.toggleBanner(false,{ "id":id });
    $("#rfcx-container").append("<div class=\"dynamic-crop-right rfcx-banner-alert-container\""
          +" id=\"rfcx-banner-alert-"+id+"\""
          +" style=\"top:"+yPos+"px;\">"
        +"<a class=\"btn btn-"+colorClass+" rfcx-crnr-all-off rfcx-trans-linear rfcx-banner-alert-inner rfcx-banner-alert-btn\""
        +" style=\"width:"+wd+"px;max-width:"+wd+"px;\" href=\""+href+"\">"+text+"</a>"
        +"<i class=\"btn-"+colorClass+" fa fa-times rfcx-banner-alert-inner rfcx-banner-alert-close\""
          +" onClick=\"RFCX.toggleBanner(false,{id:'"+id+"'});\""
          +" title=\"Remove this alert\" />"
      +"</div>");
    RFCX.fn.reactiveUi.modifyOverWidthElements();
    $("#rfcx-banner-alert-"+id).animate({height:$("#rfcx-banner-alert-"+id+" .rfcx-banner-alert-btn").outerHeight()+"px"});
  } else if (onOff && (bannerContainer.length > 0)) {
    bannerContainer.animate({height:"0px"},function(){ $(this).remove(); RFCX.toggleBanner(onOff,inputObj); });
  } else if (!onOff) {
    bannerContainer.animate({height:"0px"},function(){ $(this).remove(); });
  }
}

RFCX.setDevMode = function() {
  if (typeof window.console === "undefined") { window.console = function(msg){ }; }
  window.devLog = function(msg){ if (RFCX.nodeEnv!=="production") { console.log(msg); } };
  if (typeof window.analytics === "undefined") {
    window.analytics = { track: function(name,opt){ console.log("analytics: "+name); } }
  }
}

RFCX.regressFontAwesome = function() {
  $("#font-awesome-4").remove();
  RFCX.fn.insertCss(RFCX.cdn.bootstrap+"/font-awesome/3.2.1/css/font-awesome.min.css");
  RFCX.fn.insertCss(RFCX.cdn.bootstrap+"/font-awesome/3.2.1/css/font-awesome-ie7.min.css");
  var classPairs = [
    ["fa-play-circle-o","icon-play-circle"],["fa-play","icon-play"],["fa-facebook-square","icon-facebook-sign"],
    ["fa-twitter-square","icon-twitter-sign"],["fa-google-plus-square","icon-google-plus-sign"],
    ["fa-instagram","icon-instagram"],["fa-linkedin-square","icon-linkedin-sign"],["fa-flickr","icon-flickr"],
    ["fa-github-square","icon-github-sign"],["fa-sort-up","icon-sort-up"]
  ];
  for (var i = 0; i < classPairs.length; i++) {
    $("."+classPairs[i][0]).addClass(classPairs[i][1]).removeClass("fa");    
  }
}

RFCX.setOlark = function(setOnOff) {
  if (setOnOff!=null) { RFCX.olark.allow = setOnOff; }
  var sincePageLoad = (((new Date()).valueOf()-RFCX.pageLoaded.valueOf())/1000);
  if (sincePageLoad<=RFCX.olark.displayDelay) {
    if (typeof olark != "undefined") { olark('api.box.hide'); }
    setTimeout("RFCX.setOlark()",750);
  } else if (RFCX.olark.allow) {
    if (typeof olark != "undefined") {
      var canRender = true; for (var i = 0; i < RFCX.olark.excludePaths.length; i++) { if (RFCX.olark.excludePaths[i]===window.location.pathname) { canRender = false; } }
      if (canRender) { olark('api.box.show'); }
    }
  }
}

RFCX.forceOlark = function() {
  RFCX.olark.displayDelay = 0;
  RFCX.olark.allow = true;
  olark('api.box.show');
  olark('api.box.expand');
}

RFCX.getBandwidthKb = function() {
  var kb = 0;
  if ((typeof foresight != "undefined") && (typeof foresight.connKbps != "undefined")) {
    var kb = Math.round(foresight.connKbps);
    if (kb==(RFCX.speedTest.kB*8)) { kb = 0; }
    console.log("Bandwidth measured to be "+((kb==0) ? "very high" : (kb+"Kb/s")));
    analytics.track("bandwidth_test", { label: RFCX.speedTest.kB+"KB_download", value: kb });
  } else {
    RFCX.video.forceYouTube;
    console.log("Bandwidth measurements not yet available. Defaulting to higher bandwidth (for now).");
  }
  return kb;
}
