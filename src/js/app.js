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
  var sites = getSitesNames();

  function getSitesNames() {
    var icons = $('.js-map-point');
    return $.map(icons, function(icon){
      return $(icon).attr('data-name');
    });
  }

  function changeActiveSite(site) {
    $('.js-map-point.active, .js-map-column.active').removeClass('active');
    $('[data-name="' + site +'"]').addClass('active');
  };

  // function goes through all sites periodically and highlights one
  function startChangeSiteInterval() {
    var currentSiteIndex = 1;
    setInterval(function(){
      if (currentSiteIndex === sites.length) { currentSiteIndex = 0; }
      changeActiveSite(sites[currentSiteIndex++]);
    }, 5000);
  }

  if (sites.length) {
    changeActiveSite(sites[0]);
    if (sites.length > 1) {
      startChangeSiteInterval();
    }
  }

});

