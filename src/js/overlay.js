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
          videoId: 'L0UK1GMtjig',
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