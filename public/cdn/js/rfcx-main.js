var RFCX = {
  currentPage: null,
  pageLoaded:new Date(),
  fn: { load: {}, reactiveUi: {}, initializeUi: {}, ui: {
      all: {}, intro: {}, about: {}, get_involved: {}, team:{}, media: {}
    }
  },
  cdn: { rfcx: null, bootstrap: null },
  mapObj: null,
  timer: { windowResize: null, windowScroll: null },
  bodyWidth: $('.container-narrow').innerWidth(),
  overflowMarginWidth: 250,
  renderForMobile: false,
  transitionAt: { intro: 418, about: 30, get_involved: 30, media: 30 },
  nodeEnv: null,
  appVersion: null,
  donateAmount: 50,
  video: { offset: [0, 0, 0], obj: null, id: null, version: null, forceYouTube: false },
  speedTest: { kB: 100, expireMinutes: 2 },
  snapJsObj: null,
  olark: { allow: true, excludePaths: ["/intro"], displayDelay: 10 },
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
  
  RFCX.setDevMode();

  RFCX.renderForMobile = (parseInt($("body").css("min-width")) < 512);

  for (i in RFCX.fn.load) { RFCX.fn.load[i](); }
  for (i in RFCX.fn.ui[RFCX.currentPage]) { RFCX.fn.ui[RFCX.currentPage][i](); }
  for (i in RFCX.fn.ui.all) { RFCX.fn.ui.all[i](); };

  RFCX.fn.initializeUi.setupMobileMenu();
  RFCX.fn.initializeUi.onResize();
  RFCX.fn.initializeUi.onScroll();

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
  $.getScript(RFCX.cdn.bootstrap+"/twitter-bootstrap/2.3.2/js/bootstrap.min.js",function(){});
}

RFCX.fn.load.jqueryAnimateScroll = function(){
  if (!RFCX.renderForMobile) { $.getScript(RFCX.cdn.rfcxVendor+"/jquery-animate-scroll/1.0.5/animatescroll.js",function(){}); }
}

 RFCX.fn.load.hintCss = function() {
  if (!RFCX.renderForMobile) { RFCX.fn.insertCss(RFCX.cdn.rfcxVendor+"/hint.css/1.3.0/hint.min.css"); }
}

RFCX.fn.load.addThis = function() {
  for (var i = 0; i < RFCX.social.addThis.env.length; i++) { if (RFCX.nodeEnv === RFCX.social.addThis.env[i]) {
    $.getScript("//s7.addthis.com/js/300/addthis_widget.js#pubid="+RFCX.social.addThis.pubId, function(){
      addthis.layers({ theme: "transparent", 
        share: { position: "right", numPreferredServices: 4 }/*,
        whatsnext: { recommendedTitle: "Hello" }*/
      });
  }); break; } }
}

RFCX.fn.load.browserDetect = function() {
  if (!RFCX.renderForMobile) {
    $.getScript(RFCX.cdn.rfcxVendor+"/browser-detect/browser-detect.min.js",function(){
      if (BrowserDetect.browser==="Explorer") {
        if (BrowserDetect.version <= 8) { RFCX.video.forceYouTube = true; }
        if (BrowserDetect.version <= 7) { RFCX.regressFontAwesome(); }
      }
  });}
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

  var videoJsVersion = "4.2.2";
  RFCX.fn.insertCss(RFCX.cdn.videoJs+"/"+videoJsVersion+"/video-js.css");

  $.getScript(RFCX.cdn.videoJs+"/"+videoJsVersion+"/video.js",function(){
    if (RFCX.cdn.videoJs.indexOf("//") == -1) { videojs.options.flash.swf = RFCX.cdn.videoJs+"/"+videoJsVersion+"/video-js.swf"; }
    $.getScript(RFCX.cdn.rfcxVendor+"/foresight.js/2.0.0/foresight.min.js",function(){
      $.getScript(RFCX.cdn.rfcxVendor+"/video.js/"+videoJsVersion+"/vjs.youtube.js",function(){
        $.getScript(RFCX.cdn.rfcxVendor+"/video.js/"+videoJsVersion+"/media.youtube.js",function(){
          $(".video-box-page").each(function(){
            if (RFCX.renderForMobile) { RFCX.placeVideo(this);
            } else { $(this).click(function(){ RFCX.setupVideo(this); });
            } 
  });});});});});
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
    $("body").append(
        "<div class=\"video-box video-box-outer\""
          +" data-video-id=\""+refBox.attr("data-video-id")+"\""
          +" data-video-version=\""+refBox.attr("data-video-version")+"\""
          +" data-video-youtube=\""+refBox.attr("data-video-youtube")+"\">"
        +"<img src=\""+RFCX.cdn.rfcx+"/img/intro/16x9.16.gif\" class=\"rfcx-trans-50 video-box-bg\">"
        +"<i class=\"fa fa-play-circle-o\"></i>"
        +"</div>"
        +"<div class=\"video-box-outer-backdrop rfcx-trans-0\"></div>");
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


RFCX.setupVideo = function(videoBox) {

    $("div.video-box-page").each(function(){
      var gPos = $(this).offset();
      RFCX.video.offset = [gPos.top, gPos.left, parseInt($(this).width())];
    });

    var jqVideoBoxOuter = $("div.video-box-outer");
    jqVideoBoxOuter.css({ top: RFCX.video.offset[0]+"px", left: RFCX.video.offset[1]+"px", width:RFCX.video.offset[2]+"px", display:"block" });
    RFCX.toggleAddThis(false);
    $("body").animatescroll({scrollSpeed:500});
    $(".video-box-outer-backdrop").css({display:"block",opacity:0}).animate({
      opacity:1
    },function(){
      RFCX.setOlark(false);
      $("div.video-box-outer .video-box-bg").animate({opacity:0},1000);
      jqVideoBoxOuter.animate({
        top: "0px", left: "0%", width: "100%", borderWidth: "0px"
      },500,function(){
        RFCX.placeVideo(this);
        $(document).keyup(function(e) {
          if (e.keyCode == 27) { RFCX.closeVideo(); }
        });
      });
    });
}

RFCX.placeVideo = function(containerObj) {
  var jqCont = $(containerObj);
  RFCX.video.id = jqCont.attr("data-video-id");
  RFCX.video.version = jqCont.attr("data-video-version");
  if (!RFCX.video.forceYouTube) {
    var videoLocation = "//d4bl4mvczhn5i.cloudfront.net/video"+"/"+RFCX.video.id+"/"+RFCX.video.id+"-v"+RFCX.video.version+".";
    videoLocation += (RFCX.renderForMobile) ? "477" : "720";
      var playerHtml =  "<video id=\"rfcx-video-player\" class=\"video-js vjs-default-skin\""
              +" width=\""+parseInt(jqCont.width())+"\" height=\""+parseInt(jqCont.height())+"\""
              +" style=\"width:100%;\">"
          +"<source src=\"http://www.youtube.com/watch?v="+jqCont.attr("data-video-youtube")+"\" type=\"video/youtube\" />"
          +"<source src=\""+videoLocation+".mp4\" type=\"video/mp4\" />"
          +"<source src=\""+videoLocation+".flv\" type=\"video/flv\" />"
          +"<source src=\""+videoLocation+".webm\" type=\"video/webm\" />"
      //    +"<source src=\""+videoLocation+"."+size+".3gp\" type=\"video/3gp\" />"
          +"<track kind=\"captions\" src=\""+RFCX.cdn.rfcx+"/vtt/"+RFCX.video.id+"/"+RFCX.video.id+".en.vtt?v="+Math.random()+"\""
              +" srclang=\"en\" label=\"English\" default />"
          +"</video>";
      jqCont.html(playerHtml);
      videojs("rfcx-video-player", { "techOrder": ["html5","flash","youtube"], "preload": "auto", "autoplay":true, "controls":true }).ready(function(){
        RFCX.video.obj = this;
        RFCX.video.obj.on("pause", function(){ console.log("video paused"); });
        RFCX.video.obj.on("ended", function(){ RFCX.closeVideo(); });
        analytics.track("video_play", { label: RFCX.video.id });
        devLog("video-loaded");
      });
    } else {
      jqCont.html("<iframe id=\"rfcx-video-player\" class=\"\""
          +" src=\"http://www.youtube.com/embed/"+jqCont.attr("data-video-youtube")
            +"?enablejsapi=1"+"&iv_load_policy=3"+"&playerapiid=rfcx-video-player"
            +"&disablekb=1"+"&wmode=transparent"+"&controls=1"+"&showinfo=0"
            +"modestbranding=1"+"&rel=0"+"&autoplay=1"+"&loop=0"
            +"&origin="+encodeURIComponent(window.location.origin)
          +jqCont.attr("data-video-youtube")+"\""
          +" width=\""+parseInt(jqCont.width())+"\" height=\""+parseInt(jqCont.height())+"\""
          +" style=\"width:100%;\"></iframe>")
    }
    RFCX.closeVideoHtml(jqCont);
}

RFCX.closeVideo = function() {
  if (RFCX.video.obj != null) {
    var percentComplete = Math.round(100*RFCX.video.obj.currentTime()/RFCX.video.obj.duration());
    analytics.track("video_stop", { label: RFCX.video.id, value: percentComplete });
    RFCX.video.obj.dispose();
    RFCX.video.obj = null;
  } else {
    analytics.track("video_stop", { label: RFCX.video.id, value: null });
  }
  $(document).off("keyup");
  var jqVideoBoxOuter = $("div.video-box-outer");
  jqVideoBoxOuter.html("<img src=\""+RFCX.cdn.rfcx+"/img/intro/16x9.16.gif\" class=\"rfcx-trans-0 video-box-bg\" /><i class=\"fa fa-play-circle-o\"></i>");
  $("div.video-box-outer .video-box-bg").animate({opacity:0.5},1000);
  jqVideoBoxOuter.animate({
    top: RFCX.video.offset[0]+"px", left: RFCX.video.offset[1]+"px", width: RFCX.video.offset[2]+"px", borderWidth: "4px"
  },500,function(){
    $("div.video-box-outer, div.video-box-outer-backdrop").css({display:"none"});
    RFCX.toggleAddThis(true);
    RFCX.setOlark(true);
  });
}

RFCX.closeVideoHtml = function(jqCont) {
  if (!RFCX.renderForMobile) {
    jqCont.append("<a href=\"javascript:RFCX.closeVideo()\""
          +" class=\"video-player-close rfcx-trans-linear hover-trans-67 rfcx-trans-33 rfcx-crnr-10 rfcx-crnr-t-off rfcx-crnr-r-off\">"
          +"<i class=\"fa fa-times\"></i></a>");
  }
}

RFCX.toggleAddThis = function(onOff) {
  var newDisplay = "none";
  if (onOff) { newDisplay = "block"; }
  $(".addthis-smartlayers-desktop-right").css("display",newDisplay);
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
    window.analytics = { track: function(name,opt){ console.log("analytics: "+name); console.log(opt); } }
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
