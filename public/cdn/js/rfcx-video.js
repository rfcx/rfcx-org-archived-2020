RFCX.video = {
  offset: [0, 0, 0], obj: null, id: null, version: null, forceYouTube: false, sizes: [
      [1920,1080,5500], [1280,720,2500], [854,480,1100], [640,360,600]
    ], mobileSize: 3
};


RFCX.fn.ui.intro.initVideo = function(){
  RFCX.fn.video.init();
  RFCX.fn.video.prepare();
}

RFCX.fn.ui.video.initVideo = function(){
  RFCX.fn.video.init();
  RFCX.fn.video.prepare();
}

RFCX.fn.video.init = function(){

  var videoJsVersion = "4.2.2";
  RFCX.fn.insertCss(RFCX.cdn.videoJs+"/"+videoJsVersion+"/video-js.css");

  $.getScript(RFCX.cdn.videoJs+"/"+videoJsVersion+"/video.js",function(){
    if (RFCX.cdn.videoJs.indexOf("//") == -1) { videojs.options.flash.swf = RFCX.cdn.videoJs+"/"+videoJsVersion+"/video-js.swf"; }
    $.getScript(RFCX.cdn.rfcxVendor+"/foresight.js/2.0.0/foresight.min.js",function(){
      $(".video-box-page").each(function(){
        if (RFCX.renderForTouch) { RFCX.fn.video.place(this);
        } else { $(this).click(function(){ RFCX.fn.video.setup(this); });
        } 
      });
      $.getScript(RFCX.cdn.rfcxVendor+"/video.js/"+videoJsVersion+"/vjs.youtube.js");
      $.getScript(RFCX.cdn.rfcxVendor+"/video.js/"+videoJsVersion+"/media.youtube.js");
    });
  });
}

RFCX.fn.video.prepare = function() {

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

RFCX.fn.video.place = function(containerObj) {
  var jqCont = $(containerObj);
  RFCX.video.id = jqCont.attr("data-video-id");
  RFCX.video.version = jqCont.attr("data-video-version");
  if (!RFCX.video.forceYouTube) {
    var sz = RFCX.video.sizes, vidSz = sz[sz.length-1], wndw = [parseInt(jqCont.width()),parseInt(jqCont.height())], bw = RFCX.getBandwidthKb(),
    posterImg = (RFCX.renderForTouch) ? "//d3gq709nndn9uy.cloudfront.net/cdn/img/intro/video-poster.512.jpg" : "";
    // set video size based on window width (or smallest for mobile devices)
    if (RFCX.renderForMobile) { vidSz = sz[RFCX.video.mobileSize];
    } else { for (var i = sz.length-1; i >= 0; i--) { if ((1.1 * sz[i][0]) >= wndw[0]) { vidSz = sz[i]; break; } } }
    // Check bandwidth against bitrate of chosen size
    if ((bw>0) && ((bw*1.33) <= vidSz[2])) {
      for (var i = 0; i < sz.length; i++ ) {
        if ((bw*1.33) > sz[i][2]) { vidSz = sz[i]; break; } else if (i==(sz.length-1)) { RFCX.video.forceYouTube = true; }
      }
    }

    if (!RFCX.video.forceYouTube) {
      var uriBase = "//d4bl4mvczhn5i.cloudfront.net/video/"+RFCX.video.id
          +"/v"+RFCX.video.version+"/"+RFCX.video.id+"-v"+RFCX.video.version+".",
          vidUri = uriBase + vidSz[1],
          posterUri = (RFCX.renderForTouch) ? $(".video-box-page .video-box-poster").attr("src") : ""
          ;

      console.log("window width: "+wndw[0]+" -> playing: "+vidSz[0]+"x"+vidSz[1]+" ("+vidSz[2]+"kb/s)");
      var playerHtml = "<video id=\"rfcx-video-player\" class=\"video-js vjs-default-skin\""
              +" controls preload=\"auto\" poster=\""+posterUri+"\""
              +" width=\""+wndw[0]+"\" height=\""+wndw[1]+"\" style=\"width:100%;\">"
          +"<source src=\"http://www.youtube.com/watch?v="+jqCont.attr("data-video-youtube")+"\" type=\"video/youtube\" />"
          +"<source src=\""+vidUri+".mp4\" type=\"video/mp4\" />"
          +"<source src=\""+vidUri+".webm\" type=\"video/webm\" />"
          +"<source src=\""+vidUri+".flv\" type=\"video/flv\" />"
      //    +"<source src=\""+vidUri+"."+size+".3gp\" type=\"video/3gp\" />"
          +"<track kind=\"captions\" src=\""+RFCX.cdn.rfcx+"/vtt/"+RFCX.video.id+"/"+RFCX.video.id+".en.vtt?v="+Math.random()+"\""
              +" srclang=\"en\" label=\"English\" default />"
          +"</video>";
      jqCont.html(playerHtml);

      videojs("rfcx-video-player", { "techOrder": ["html5","flash","youtube"], "preload": "auto", "autoplay":true, "controls":true }).ready(function(){
        RFCX.video.obj = this;
        RFCX.video.obj.on("pause", function(){ console.log("video paused"); });
        RFCX.video.obj.on("ended", function(){ RFCX.fn.video.close(); });
        analytics.track("video_play", { label: RFCX.video.id });
        devLog("video-loaded");
      });
    }
  }
  if (RFCX.video.forceYouTube) {
    jqCont.html("<iframe id=\"rfcx-video-player\" frameborder=\"0\" class=\"\""
        +" src=\"http://www.youtube.com/embed/"+jqCont.attr("data-video-youtube")
          +"?enablejsapi=1"+"&iv_load_policy=3"+"&playerapiid=rfcx-video-player"
          +"&disablekb=1"+"&wmode=transparent"+"&controls=1"+"&showinfo=0"
          +"modestbranding=1"+"&rel=0"+"&autoplay=1"+"&loop=0"
          +"&origin="+encodeURIComponent(window.location.origin)
        +jqCont.attr("data-video-youtube")+"\""
        +" width=\""+parseInt(jqCont.width())+"\" height=\""+parseInt(jqCont.height())+"\""
        +" style=\"width:100%;\"></iframe>")
  }
  RFCX.fn.video.htmlClose(jqCont);
}

RFCX.fn.video.close = function() {
  var playerHeight = $("#rfcx-video-player").height();
  if (RFCX.video.obj != null) {
    var percentComplete = Math.round(100*RFCX.video.obj.currentTime()/RFCX.video.obj.duration());
    analytics.track("video_stop", { label: RFCX.video.id, value: percentComplete });
    RFCX.video.obj.dispose();
    RFCX.video.obj = null;
  } else {
    analytics.track("video_stop", { label: RFCX.video.id, value: null });
  }
  if (!RFCX.renderForTouch) {
    $(document).off("keyup");
    var jqVideoBoxOuter = $("div.video-box-outer");
    jqVideoBoxOuter.css({height:playerHeight+"px"}).html("<img src=\""+RFCX.cdn.rfcx+"/img/intro/16x9.16.gif\" class=\"rfcx-trans-0 video-box-bg\"/><i class=\"fa fa-play-circle-o\"></i>");
    $("div.video-box-outer .video-box-bg").animate({opacity:0.5},1000);
    jqVideoBoxOuter.animate({
      top: RFCX.video.offset[0]+"px", left: RFCX.video.offset[1]+"px", width: RFCX.video.offset[2]+"px", height:$("div.video-box-page").height()+"px", borderWidth: "4px"
    },500,function(){
      $(".banner-video").animate({marginBottom:"0px"});
      $("div.video-box-outer, div.video-box-outer-backdrop").css({display:"none"});
      RFCX.toggleAddThis(true);
      RFCX.setOlark(true);
    });
  }
  RFCX.fn.video.followUp(RFCX.video.id);
}

RFCX.fn.video.htmlClose = function(jqCont) {
  if (!RFCX.renderForTouch) {
    jqCont.append("<a href=\"javascript:RFCX.fn.video.close()\""
          +" title=\"Stop/Close\""
          +" class=\"video-player-close rfcx-trans-linear hover-trans-67 rfcx-trans-33 rfcx-crnr-10 rfcx-crnr-t-off rfcx-crnr-r-off\">"
          +"<i class=\"fa fa-times\"></i></a>");
  }
}

RFCX.fn.video.setup = function(videoBox) {

    $("div.video-box-page").each(function(){
      var gPos = $(this).offset();
      RFCX.video.offset = [gPos.top, gPos.left, parseInt($(this).width())];
    });

    var jqVideoBoxOuter = $("div.video-box-outer");
    jqVideoBoxOuter.css({ top: RFCX.video.offset[0]+"px", left: RFCX.video.offset[1]+"px", width:RFCX.video.offset[2]+"px", height:"auto", display:"block" });
    RFCX.toggleAddThis(false);
    var videoWidthPct = 75;
    $("body").animatescroll({scrollSpeed:500}); var vidHt = Math.round(9*(videoWidthPct/100)*$("body").width()/16);
    var bannerVideo = $(".banner-video").animate({marginBottom:(vidHt-(380+76))+"px"}).offset();
    $(".video-box-outer-backdrop").css({display:"block",opacity:0,height:vidHt+"px"}).animate({
      opacity:1
    },function(){
      RFCX.setOlark(false);
      $("div.video-box-outer .video-box-bg").animate({opacity:0},1000);
      jqVideoBoxOuter.animate({
        top: "0px", left: ((100-videoWidthPct)/2)+"%", width: videoWidthPct+"%", borderWidth: "0px"
      },500,function(){
        RFCX.fn.video.place(this);
        $(document).keyup(function(e) {
          if (e.keyCode == 27) { RFCX.fn.video.close(); }
        });
      });
    });
}

RFCX.fn.video.followUp = function(vidId) {
  console.log("video follow up: "+vidId);
}