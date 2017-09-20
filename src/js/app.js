"use strict";
$( document ).ready(function() {

  var menuTimeout;
  $('#menuBtn').on('touchend click', function() {
    clearTimeout(menuTimeout);
    // wait for some short time to have better transition
    menuTimeout = setTimeout(function() {
      $('#mobileMenu').toggleClass('opened');
    }, 300);
  });

  // get all site names from html elements
  // var sites = getSitesNames();

  // function getSitesNames() {
  //   var icons = $('.js-map-point');
  //   return $.map(icons, function(icon){
  //     return $(icon).attr('data-name');
  //   });
  // }

  $('.js-map-point').click(function(ev) {
    var site = $(this).attr('data-name');
    changeActiveSite(site);
  });

  function changeActiveSite(site) {
    console.log('changeActiveSite', site);
    $('.js-map-point.active, .js-map-column.active').removeClass('active');
    $('.js-map-point[data-name="' + site +'"], .js-map-column[data-name="' + site +'"]').addClass('active');
  };


  // function goes through all sites periodically and highlights one
  // function startChangeSiteInterval() {
  //   var currentSiteIndex = 1;
  //   setInterval(function(){
  //     if (currentSiteIndex === sites.length) { currentSiteIndex = 0; }
  //     changeActiveSite(sites[currentSiteIndex++]);
  //   }, 5000);
  // }

  // if (sites.length) {
  //   changeActiveSite(sites[0]);
  //   if (sites.length > 1) {
  //     startChangeSiteInterval();
  //   }
  // }

  // Show and play youTube video
  $('#youtubePlayBtn1, #youtubePlayBtn2').click(function() {
    $('#youTubeIframe').attr('src', 'http://www.youtube.com/embed/xPK2Ch90xWo?rel=0&hd=1&autoplay=1');
    $('#videoArea').addClass('playing-video');
  });

  $('.js-column-btn').on('click', function() {
      var name = $(this).attr('data-name');
      $('.js-variable-content.active').removeClass('active');
      $('.js-variable-content[data-name="' + name + '"]').addClass('active');
  });

});

