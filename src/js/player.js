"use strict";
$( document ).ready(function() {

  var resizeTimeout;

  if(!$('#waveform').length) return;

  let wavesurferOpts = {
    container: '#waveform',
    waveColor: '#ffffff',
    progressColor: '#fa4e00',
    barHeight: 30,
    barWidth: 5,
    cursorColor: 'rgba(255,255,255,0)'
  };

  var wavesurfer = WaveSurfer.create(wavesurferOpts);

  wavesurfer.on('play', showPauseBtn);
  wavesurfer.on('pause', showPlayBtn);
  wavesurfer.on('finish', showPlayBtn);
  $(window).resize(onResize);
  $('#forestBtn').click(onPlayPauseClick);

  function showPlayBtn() {
    $('#forestBtn').removeClass('icon-pause').addClass('icon-play');
  }

  function showPauseBtn() {
    $('#forestBtn').removeClass('icon-play').addClass('icon-pause');
  }

  function onResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      if (wavesurfer) {
        wavesurfer.drawBuffer();
      }
    }, 500);
  }

  function onPlayPauseClick() {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  }

  wavesurfer.load('audio/demo.mp3');

});
