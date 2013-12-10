RFCX.video = {
  offset: [0, 0, 0], obj: null, id: null, version: null, forceYouTube: false, posterUri: "", sizes: [
      [1920,1080,5500], [1280,720,2500], [854,480,1100], [640,360,600]
    ], mobileSize: 3, followUp: { excludePaths: [ "/video" ] }
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
        
        var gPos = $(this).offset();
        RFCX.video.offset = [gPos.top, gPos.left, parseInt($(this).width())];
        
        if (RFCX.renderForTouch) { RFCX.fn.video.place(this);
        } else {
          $(this).click(function(){ RFCX.fn.video.setup(this); });
          $(".video-link .fa-play").click(function(){ RFCX.fn.video.setup(this); });
        } 

      });
      $.getScript(RFCX.cdn.rfcxVendor+"/video.js/"+videoJsVersion+"/vjs.youtube.min.js");
    });
  });
}

RFCX.fn.video.prepare = function() {

    var refBox = $(".video-box-page");
    $((RFCX.renderForMobile) ? "#rfcx-container" : "body").append(
        "<div class=\"video-box video-box-outer\""
          +" data-video-id=\""+refBox.attr("data-video-id")+"\""
          +" data-video-version=\""+refBox.attr("data-video-version")+"\""
          +" data-video-youtube=\""+refBox.attr("data-video-youtube")+"\""
          +" data-video-cc=\""+refBox.attr("data-video-cc")+"\""
          +" data-video-run-followup=\""+refBox.attr("data-video-run-followup")+"\""
          +">"
        +"<img src=\""+RFCX.cdn.rfcx+"/img/intro/16x9.16.gif\" class=\"rfcx-trans-50 video-box-bg\">"
        +"<i class=\"fa fa-play-circle-o\"></i>"
        +"</div>"
        +"<div class=\"video-box-outer-backdrop rfcx-trans-0\"></div>"
      );
    $("#rfcx-container").append("<div class=\"video-box video-box-followup rfcx-trans-0 rfcx-crnr-10\"></div>");
    RFCX.fn.video.followUp(false);
}

RFCX.fn.video.vttTags = function(shortNames) {
  var rtrn = "", longNames = { en:"English", fr:"Français" };
  for (var i = 0; i < shortNames.length; i++) {
    rtrn += "<track srclang=\""+shortNames[i]+"\" label=\""+longNames[shortNames[i]]+"\""
        +" src=\""+RFCX.cdn.rfcx+"/vtt/"+RFCX.video.id+"/"+RFCX.video.id+"."+shortNames[i]+".vtt?v="+RFCX.appVersion+"\""
        +" kind=\"captions\""+((i==0) ? " default" : "")+" />";
  } return rtrn;
}

RFCX.fn.video.place = function(containerObj) {
  var jqCont = $(containerObj);
  RFCX.video.id = jqCont.attr("data-video-id");
  RFCX.video.version = jqCont.attr("data-video-version");
  RFCX.video.cc = parseInt(jqCont.attr("data-video-cc"));
  var wndw = [parseInt(jqCont.width()),Math.round(9*parseInt(jqCont.width())/16)];
  var offset = [0,0];
  if ((typeof jqCont.attr("data-video-height") != "undefined")) {
    wndw[1] = parseInt(jqCont.attr("data-video-height"));
    offset[0] = Math.round((16*wndw[1]/9-wndw[0])/2);
    wndw[0] = Math.round(16*wndw[1]/9);
    jqCont.css("overflow","hidden");
  }
  if ((typeof jqCont.attr("data-video-controls") != "undefined")) {
    RFCX.video.controls = (parseInt(jqCont.attr("data-video-controls"))==1);
  } else { RFCX.video.controls = true; }
  if ((typeof jqCont.attr("data-video-run-followup") != "undefined")) {
    RFCX.video.runFollowUp = (parseInt(jqCont.attr("data-video-run-followup"))===1);
  } else { RFCX.video.runFollowUp = false; }
  if (!RFCX.video.forceYouTube) {
    var sz = RFCX.video.sizes, vidSz = sz[sz.length-1], bw = RFCX.getBandwidthKb();
    RFCX.video.posterUri = RFCX.cdn.rfcxStatic+"/video/"+RFCX.video.id+"/"+RFCX.video.id+"-poster.jpg?v="+RFCX.appVersion;
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
      var uriBase = RFCX.cdn.rfcxStatic+"/video/"+RFCX.video.id
          +"/v"+RFCX.video.version+"/"+RFCX.video.id+"-v"+RFCX.video.version+".",
          vidUri = uriBase + vidSz[1];

      console.log("window width: "+wndw[0]+" -> playing: "+vidSz[0]+"x"+vidSz[1]+" ("+vidSz[2]+"kb/s)");
      var vttPreUri = "";
      var playerHtml = "<video class=\"video-js vjs-default-skin\" controls preload=\"auto\""
              +" id=\"rfcx-video-player-"+RFCX.video.id+"\""
              +" poster=\""+RFCX.video.posterUri+"\""
              +" width=\""+wndw[0]+"\" height=\""+wndw[1]+"\""
              +" style=\"width:"+wndw[0]+"px;height:"+wndw[1]+"px;left:-"+offset[0]+"px;\""
              +">"
          +"<source src=\"//www.youtube.com/watch?v="+jqCont.attr("data-video-youtube")+"\" type=\"video/youtube\" />"
          +"<source src=\""+vidUri+".mp4\" type=\"video/mp4\" />"
          +"<source src=\""+vidUri+".webm\" type=\"video/webm\" />"
          +"<source src=\""+vidUri+".flv\" type=\"video/flv\" />"
          +"<source src=\""+uriBase+"240.3gp\" type=\"video/3gp\" />"
          +((RFCX.video.cc==0) ? "" : RFCX.fn.video.vttTags(["en"]))
          +"</video>";
      RFCX.video.previousHtml = jqCont.html();
      jqCont.html(playerHtml);

      videojs("rfcx-video-player-"+RFCX.video.id, { "techOrder": ["html5","flash","youtube"], "preload": "auto", "autoplay":true, "controls":RFCX.video.controls }).ready(function(){
        RFCX.video.obj = this;
        RFCX.video.obj.on("pause", function(){
          analytics.track("video_pause", { label: RFCX.video.id, value: RFCX.fn.video.percentComplete });
          if (RFCX.renderForTouch && !RFCX.fn.video.isFullScreen()){ jqCont.html(RFCX.video.previousHtml); RFCX.fn.video.followUp(true); }
        });
        RFCX.video.obj.on("ended", function(){
          if (RFCX.video.runFollowUp) { RFCX.fn.video.close(); } else { jqCont.html(RFCX.video.previousHtml); RFCX.fn.video.reset(); }
        });
        analytics.track("video_play", { label: RFCX.video.id });
        devLog("video-loaded");
      });
    }
  }
  if (RFCX.video.forceYouTube) {
    jqCont.html("<iframe id=\"rfcx-video-player-"+RFCX.video.id+"\" frameborder=\"0\" class=\"\""
        +" src=\"//www.youtube.com/embed/"+jqCont.attr("data-video-youtube")
          +"?playerapiid=rfcx-video-player-"+RFCX.video.id
          +"&amp;origin="+encodeURIComponent(window.location.origin)
          +"&amp;enablejsapi=1"
          +"&amp;iv_load_policy=3"
          +"&amp;cc_load_policy=0"
          +"&amp;disablekb=0"
          +"&amp;wmode=transparent"
          +"&amp;controls=1"
          +"&amp;showinfo=0"
          +"&amp;modestbranding=1"
          +"&amp;rel=0"
          +"&amp;autoplay=1"
          +"&amp;loop=0"
        +"\""
        +" width=\""+wndw[0]+"\" height=\""+wndw[1]+"\""
        +" style=\"width:100%;\"></iframe>")
  }
  if (RFCX.video.runFollowUp) {
    RFCX.fn.video.htmlClose(jqCont);
  }
}

RFCX.fn.video.close = function() {
  var playerHeight = $("#rfcx-video-player-"+RFCX.video.id).height();
  RFCX.fn.video.reset();
  if (!RFCX.renderForTouch) {
    $(document).off("keyup");
    var jqVideoBoxOuter = $(".video-box-outer");
    jqVideoBoxOuter.css({height:playerHeight+"px"}).html("<img src=\""+RFCX.cdn.rfcx+"/img/intro/16x9.16.gif\" class=\"rfcx-trans-0 video-box-bg\"/><i class=\"fa fa-play-circle-o\"></i>");
    $(".video-box-outer .video-box-bg").animate({opacity:0.5},1000);
    jqVideoBoxOuter.animate({
      top: RFCX.video.offset[0]+"px", left: RFCX.video.offset[1]+"px", width: RFCX.video.offset[2]+"px", height:$(".video-box-page").height()+"px", borderWidth: "4px"
    },500,function(){
      $(".banner-video").animate({marginBottom:"10px"});
      $(".video-box-outer, .video-box-outer-backdrop").css({display:"none"});
      RFCX.toggleAddThis(true);
      RFCX.setOlark(true);
      RFCX.fn.video.followUp(true);
    });
  }
}

RFCX.fn.video.reset = function() {
  if (RFCX.video.obj != null) {
    analytics.track("video_stop", { label: RFCX.video.id, value: RFCX.fn.video.percentComplete() });
    RFCX.video.obj.dispose();
    RFCX.video.obj = null;
  } else {
    analytics.track("video_stop", { label: RFCX.video.id, value: null });
  }
}

RFCX.fn.video.htmlClose = function(jqCont) {
  if (!RFCX.renderForTouch) {
    jqCont.append("<a href=\"javascript:RFCX.fn.video.close()\""
          +" title=\"Stop/Close\""
          +" class=\"video-player-close rfcx-trans-linear hover-trans-67 rfcx-trans-33 rfcx-crnr-10\">"
          +"<i class=\"fa fa-times\"></i></a>");
  }
}

RFCX.fn.video.setup = function(videoBox) {

    RFCX.fn.video.followUp(false);
    var jqVideoBoxOuter = $(".video-box-outer");
    jqVideoBoxOuter.css({ top: RFCX.video.offset[0]+"px", left: RFCX.video.offset[1]+"px", width:RFCX.video.offset[2]+"px", height:"auto", display:"block" });
    RFCX.toggleAddThis(false);
    $("body").animatescroll({scrollSpeed:500});
    var videoWidthPct = 75, bodyWd = $("body").width(), vidHt = Math.round(9*(videoWidthPct/100)*bodyWd/16);
    var bannerHt = $(".banner-video").innerHeight()+$(".masthead").innerHeight();
    if (vidHt < bannerHt) { vidHt = bannerHt; videoWidthPct = 100*(16*bannerHt/9)/bodyWd; }
    var bannerVideo = $(".banner-video").animate({marginBottom:(vidHt-bannerHt+10)+"px"}).offset();
    $(".video-box-outer-backdrop").css({display:"block",opacity:0,height:vidHt+"px"}).animate({
      opacity:1
    },function(){
      RFCX.setOlark(false);
      $(".video-box-outer .video-box-bg").animate({opacity:0},1000);
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

RFCX.fn.video.percentComplete = function() {
  return Math.round(100*RFCX.video.obj.currentTime()/RFCX.video.obj.duration());
}

RFCX.fn.video.isFullScreen = function() {
  var rtrn = false;
  if (RFCX.renderForTouch) {
    $("video").each(function(){
      rtrn = this.webkitDisplayingFullscreen;
    });
  }
  return rtrn;
}

RFCX.fn.video.followUp = function(showHide) {
  var followUpBox = $(".video-box-followup");
  var runFollowUp = true; for (var i = 0; i < RFCX.video.followUp.excludePaths.length; i++) { if (RFCX.video.followUp.excludePaths[i]===window.location.pathname) { runFollowUp = false; } }
  if (runFollowUp && showHide) {
    var boxOffset = $(".video-box-page").offset();
    followUpBox.css({
      top: (boxOffset.top-10)+"px", left: (boxOffset.left-10-parseInt($("#rfcx-container").offset().left))+"px",
      width: (RFCX.video.offset[2]+20)+"px", height:($(".video-box-page").height()+20)+"px",
      display: "block" }).animate({opacity:1},"slow",function(){
        $("#rfcx-video-player-"+RFCX.video.id).remove();
        $(this).append(""

          +"<p class=\"roadgeek rfcx-header\">PLEASE HELP US SPREAD THE WORD</p>"
          +"<p class=\"roadgeek rfcx-header rfcx-sub-header\">"
            +"We need your help today to make this dream a reality."
            +"<br /><br /><br /><br /><br /><br /><br />"+/*"1. "+*/"Please share this video with your friends"
            +"<br /><br />"
//            +"2. Stay tuned!"
          +"</p>"

          +"<span class=\"rfcx-social-like rfcx-fb-like\">"
            +"<iframe src=\"//www.facebook.com/plugins/like.php?href=http%3A%2F%2Frfcx.org%2F&amp;width&amp;layout=button"+((RFCX.renderForMobile) ? "" : "_count")+"&amp;action=like&amp;show_faces=false&amp;share=false&amp;height=21\" scrolling=\"no\" frameborder=\"0\" allowTransparency=\"true\"></iframe>"
            +"</span>"
          +"<span class=\"rfcx-social-like rfcx-tw-like\">"
            +"<iframe class=\"rfcx-social-iframe rfcx-tw-iframe\" src=\"//platform.twitter.com/widgets/tweet_button.html?text=Check%20out%20this%20video%20by%20@RainforestCx%20—%20A%20new%20way%20to%20stop%20illegal%20logging%20in%20the%20%23rainforest.&amp;related=RainforestCx&amp;url=http://rfcx.org&amp;count="+((RFCX.renderForMobile) ? "none" : "horizontal")+"\" allowtransparency=\"true\" frameborder=\"0\" scrolling=\"no\"></iframe>"
            +"</span>"
          +"<span class=\"rfcx-social-like rfcx-gp-like\">"
            +"<div class=\"rfcx-social-iframe rfcx-gp-iframe g-plusone\" data-size=\"medium\" data-href=\"http://rfcx.org\" data-annotation=\""+((RFCX.renderForMobile) ? "none" : "bubble")+"\"></div>"
            +"</span>"
          +"<a class=\"rfcx-social-like rfcx-at-like addthis_button addthis_pill_style\">"
            +"</a>"
        
        );
        $.getScript("//apis.google.com/js/plusone.js");
        addthis.counter(".rfcx-at-like");
      // if (RFCX.renderForTouch) {
      // } else {
      // }    

      /*
      <div class="addthis_toolbox addthis_floating_style addthis_counter_style" style="left:50px;top:50px;">
<a class="addthis_button_facebook_like" fb:like:layout="box_count"></a>
<a class="addthis_button_tweet" tw:count="vertical"></a>
<a class="addthis_button_google_plusone" g:plusone:size="tall"></a>
<a class="addthis_counter"></a>
</div>*/  
      
      });
    analytics.track("video_followup", { label: RFCX.video.id });
  } else {
    followUpBox.animate({opacity:0},function(){
      $(this).css({display:"none"}).html(""
        +"<div class=\"video-followup-bg rfcx-trans-85\"></div>"
        +"<div class=\"video-followup-x\" onClick=\"RFCX.fn.video.followUp(false)\">"
          +"<i class=\"fa fa-times\"></i>"
        +"</div>"
      );
      if (RFCX.renderForTouch && ($("#rfcx-video-player-"+RFCX.video.id).length===0)) { $(".video-box-page").each(function(){ RFCX.fn.video.place(this); }); }
    });

    
  }
}

RFCX.fn.infoGraphicVideo = function(containerObj) {

  RFCX.fn.video.place(containerObj);
  // var box = $(".infographic-box");
  // var ht = parseInt(box.height());
  // var wd = parseInt(box.width());
  // var vidWd = 16*ht/9;
  // $(".infographic-box").css({width:wd+"px",height:ht+"px",overflow:"hidden"}).html("<iframe src=\"//rfcx-static.s3.amazonaws.com/video/vid02/v2/vid02-v2.480.mp4\" style=\"position:absolute;left:-"+Math.round((vidWd-wd)/2)+"px;width:"+vidWd+"px;height:100%;\" border=\"0\" frameborder=\"0\"></iframe>");

}

RFCX.fn.infoGraphicVideoSetup = function() {



}
