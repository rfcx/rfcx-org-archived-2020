RFCX.press = {
  data: [],
  container: $(".rfcx-row-press-clippings .span12"),
  html: ""
};

RFCX.fn.ui.press.loadPressClippings = function(){

  RFCX.fn.insertCss(RFCX.cdn.rfcx+"/css/rfcx-press.css");

  $.getScript(RFCX.cdn.rfcxVendor+"/jquery-isotope/2.0.0/jquery-isotope.min.js",function(){
    $.getScript(RFCX.cdn.rfcxVendor+"/string.js/1.9.0/string.min.js",function(){
      $.getScript(RFCX.cdn.rfcxGithub+"/rfcx-clippings/clippings.js?v="+Math.random(),function(){
        
        // sort by date, descending
        RFCX.press.data.sort(RFCX.fn.sortBy("date", false, function(a){return (new Date(a).valueOf()) }));
      
        for (i in RFCX.press.data) {
          RFCX.press.html += ""
            +"<div class='rfcx-press-clipping-container'"
            +" data-category='transition'"
            +">"
            +"<a target='_blank' href='"+RFCX.press.data[i].uri+"'>"
            +"<div class='rfcx-press-clipping-clickable'>"

            +RFCX.press.data[i].date
            +"<br />"
            +RFCX.press.data[i].publication

            +"</div>"
            +"</a>"
            +"<div class='fb-like' data-href='"+RFCX.press.data[i].uri+"' data-width='80' data-layout='button_count' data-action='like' data-show-faces='false' data-share='false'></div>"

            +"</div>";
        }

//        RFCX.fn.reactiveUi.loadFollowButtons();

        RFCX.press.container.html(RFCX.press.html);
        RFCX.press.container.isotope({
          itemSelector: '.rfcx-press-clipping-container',
          layoutMode: 'fitRows'
        });

     
      });
    });
  });

}


RFCX.fn.sortBy = function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = [-1, 1][+!!reverse];

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}

// RFCX.fn.sortByDate = function(a, b, sortDescending){
//   if (sortDescending) {
//     return b.date.localeCompare(a.date);
// //    return (new Date(b.date+"T12:00:00.000Z").valueOf()) - (new Date(a.date+"T12:00:00.000Z").valueOf());
//   } else {
// //    return (new Date(a.date+"T12:00:00.000Z").valueOf()) - (new Date(b.date+"T12:00:00.000Z").valueOf());
//     return a.date.localeCompare(b.date);
//   }
// }
