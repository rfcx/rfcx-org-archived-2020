


RFCX.fn.video.setupExtra = function(animationDuration) {
  $(".masthead .logo, .menu-toggle, .is-on, .ks-logo").animate({opacity:0},500);
  $(".video-box-outer-backdrop-extra").html(""
    +"<imc src=\""+$(".masthead .logo").attr("src")+"\" class=\"logo rfcx-trans-0\" />"
    );
  $(".video-box-outer-backdrop-extra").css({display:"block",opacity:0,height:"76px",top:0+"px"}).animate({
      opacity:0.5
  },function(){
    $(".video-box-outer-backdrop-extra .logo").animate({opacity:1},500);
  });
}

RFCX.fn.video.followUpExtra = function(showHide) {
  $(".masthead .logo, .menu-toggle, .is-on, .ks-logo").animate({opacity:1},500,function(){

  });
}


RFCX.fn.ui.campaign.initMap = function(){ RFCX.fn.ui.about.initMap(); }
RFCX.fn.ui.campaign.animateHelpCalls = function() { RFCX.fn.ui.about.animateHelpCalls(); }
RFCX.fn.ui.campaign.loadFollowButtons = function() { RFCX.fn.reactiveUi.loadFollowButtons(); }

RFCX.fn.ui.ks.loadFollowButtons = function() { RFCX.fn.reactiveUi.loadFollowButtons(); }

// RFCX.fn.ui.update.loadFollowButtons = function() { RFCX.fn.reactiveUi.loadFollowButtons(); }



$(function() {

    
    
    $('.btn-custom-facebook').on('click', function() {
        var w = 580, h = 300,
                left = (screen.width/2)-(w/2),
                top = (screen.height/2)-(h/2);
            
            
            if ((screen.width < 480) || (screen.height < 480)) {
                window.open ('http://www.facebook.com/share.php?u=http://r-f.cx/1mbKMiA', '', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
            } else {
                window.open ('http://www.facebook.com/share.php?u=http://r-f.cx/1mbKMiA', '', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);   
            }
    });
    
    $('.btn-custom-twitter').on('click', function() {
        var loc = encodeURIComponent('http://r-f.cx/1iCrd8m'),
                title = "Amazing! Rainforest Connection: Phones turned to Forest Guardians ",
                w = 580, h = 300,
                left = (screen.width/2)-(w/2),
                top = (screen.height/2)-(h/2);
                
            window.open('http://twitter.com/share?text=' + title + '&url=' + loc, '', 'height=' + h + ', width=' + w + ', top='+top +', left='+ left +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
    });


    $('.btn-custom-kickstarter').on('click', function() { window.location = "http://r-f.cx/1lN1smh"; });

    

    
});


