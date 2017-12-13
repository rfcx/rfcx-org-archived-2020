"use strict";

var video = $('#ytplayer');
var closeBtn = $('#overlay__close');
var overlay = $('#overlay');

// Hide overlay
closeBtn.click(function() {
  overlay.css({display: "none"});
});



//This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      //This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;

      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '349',
          width: '560',
          videoId: 'ScrRZuaXtV0',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
          }
        });
      }

      //The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.pauseVideo();
      }

      //The API calls this function when the player's state changes.
      //If the video is stopped (state = 0) the overlay will be shown 
      function onPlayerStateChange(event) {
          var state = player.getPlayerState();
          console.log(state);
          if( state === 0 ) {
            overlay.css({display: "block"});
          }
        }
        
      function stopVideo() {
        player.stopVideo();
      }

      /*
        $(this).append(""

          +"<p class=\"roadgeek rfcx-header\">PLEASE HELP SPREAD THE WORD</p>"
          +"<p class=\"roadgeek rfcx-header rfcx-sub-header\">"
            +"We need your help today. Join us and save the forest."
            +"<br /><br /><br /><br /><br /><br /><br />"+/*"1. "+"Please share this video with your friends"
            +"<br /><br />"
            //            +"2. Stay tuned!"
                      +"</p>"
            
                      +"<span class=\"rfcx-social-like rfcx-fb-like\">"
                        +"<iframe src=\"//www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2Frainforestcx&amp;width&amp;layout=button"+((RFCX.renderForMobile) ? "" : "_count")+"&amp;action=like&amp;show_faces=false&amp;share=true&amp;height=21\" scrolling=\"no\" frameborder=\"0\" allowTransparency=\"true\"></iframe>"
                        +"</span>"
                      +"<span class=\"rfcx-social-like rfcx-tw-like\">"
                        +"<iframe class=\"rfcx-social-iframe rfcx-tw-iframe\" src=\"//platform.twitter.com/widgets/tweet_button.html?text=Check%20out%20this%20video%20by%20@RainforestCx%20|%20A%20new%20way%20to%20stop%20illegal%20logging%20in%20the%20%23rainforest.&amp;related=RainforestCx&amp;url=http://rfcx.org/&amp;count="+((RFCX.renderForMobile) ? "none" : "horizontal")+"\" allowtransparency=\"true\" frameborder=\"0\" scrolling=\"no\"></iframe>"
                        +"</span>"
                      +"<span class=\"rfcx-social-like rfcx-gp-like\">"
                        +"<div class=\"rfcx-social-iframe rfcx-gp-iframe g-plusone\" data-size=\"medium\" data-href=\"http://rfcx.org\" data-annotation=\""+((RFCX.renderForMobile) ? "none" : "bubble")+"\"></div>"
                        +"</span>"
                      +"<a class=\"rfcx-social-like rfcx-social-like-bttm rfcx-at-like addthis_button addthis_pill_style\">"
                        +"</a>"
                      +"<span class=\"rfcx-social-like rfcx-social-like-bttm rfcx-li-like\">"
                        +"<script type=\"IN/Share\" data-url=\"https://rfcx.org/\" data-counter=\"right\"></script>"
                        +"</span>"
                    
                    );
      
      */