
//######################################################################################
// Author: ricocheting.com
// Version: v2.0
// Date: 2011-03-31
// Description: displays the amount of time until the "dateFuture" entered below.

// NOTE: the month entered must be one less than current month. ie; 0=January, 11=December
// NOTE: the hour is in 24 hour format. 0=12am, 15=3pm etc
// format: dateFuture1 = new Date(year,month-1,day,hour,min,sec)
// example: dateFuture1 = new Date(2003,03,26,14,15,00) = April 26, 2003 - 2:15:00 pm

var dateFuture1 = new Date(2014,5,16,10,0,0);

// TESTING: comment out the line below to print out the "dateFuture" for testing purposes
//document.write(dateFuture +"<br />");


//###################################
//nothing beyond this point
function GetCount(ddate,iid){

  dateNow = new Date(); //grab current date
  amount = ddate.getTime() - dateNow.getTime(); //calc milliseconds between dates
  delete dateNow;

  // if time is already past
  if(amount < 0){
    document.getElementById(iid).innerHTML="Now!";
  }
  // else date is still good
  else{
    days=0;hours=0;mins=0;secs=0;out="";

    amount = Math.floor(amount/1000);//kill the "milliseconds" so just secs

    days=Math.floor(amount/86400);//days
    amount=amount%86400;

    hours=Math.floor(amount/3600);//hours
    amount=amount%3600;

    mins=Math.floor(amount/60);//minutes
    amount=amount%60;

    secs=Math.floor(amount);//seconds

    if(days != 0){out += days +" "+((days==1)?"day":"days")+", ";}
    if(hours != 0){out += hours +" "+((hours==1)?"hour":"hours")+", ";}
    out += mins +" "+((mins==1)?"min":"mins")+", ";
    out += secs +" "+((secs==1)?"sec":"secs")+", ";
    out = out.substr(0,out.length-2);
    document.getElementById(iid).innerHTML=out;

    setTimeout(function(){GetCount(ddate,iid)}, 1000);
  }
}

window.onload=function(){
  GetCount(dateFuture1, 'campaign-countdown');
};




RFCX.fn.video.setupExtra = function(animationDuration) {
  $(".masthead .logo, .menu-toggle").animate({opacity:0},500);
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
  $(".masthead .logo, .menu-toggle").animate({opacity:1},500,function(){

  });
}


RFCX.fn.ui.campaign.initMap = function(){ RFCX.fn.ui.about.initMap(); }
RFCX.fn.ui.campaign.animateHelpCalls = function() { RFCX.fn.ui.about.animateHelpCalls(); }
RFCX.fn.ui.campaign.loadFollowButtons = function() { RFCX.fn.reactiveUi.loadFollowButtons(); }

RFCX.fn.ui.ks.loadFollowButtons = function() { RFCX.fn.reactiveUi.loadFollowButtons(); }



