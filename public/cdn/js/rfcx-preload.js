
function setSquImg(inputObj){

  if ((typeof $ === "undefined") && (inputObj.complete)) {
    var wait = setTimeout(function(){setSquImg(inputObj)},333);
  } else {
    var obj = $(inputObj);
    // This code is redundant because we placed images center/center using css.
//    obj.css("visibility","hidden");
//    var divObj = obj.parent('div.rfcx-thmb');
//    var objDim = {/*lf:0,tp:0,*/wd:parseInt(obj.width()),ht:parseInt(obj.height()),padLf:0,padTp:0};
//    var divDim = {/*lf:0,tp:0,*/
//        wd:parseInt(divObj.outerWidth()), ht:parseInt(divObj.outerHeight()),
//        padLf:parseInt(divObj.css("padding-left")), padTp:parseInt(divObj.css("padding-top"))
//      };
//    objDim.rat = objDim.wd/objDim.ht;
//    divDim.rat = divDim.wd/divDim.ht;
//
//    var baseline = 'wd';
//    if ((objDim.rat >= 1) && (divDim.rat >= 1)) {
//      baseline = (objDim.rat > divDim.rat) ? 'ht' : 'wd';
//    } else if ((objDim.rat < 1) && (divDim.rat < 1)) {
//      baseline = (objDim.rat > divDim.rat) ? 'wd' : 'ht';
//    } else {
//      baseline = (objDim.rat >= divDim.rat) ? 'ht' : 'wd';
//    }
//
//    if (obj.css("visibility")=="hidden") { obj.css({opacity:0}); }
//    if (baseline == "ht") {
//        var newWidth = divDim.ht*objDim.wd/objDim.ht;
//        obj.css({height:Math.round(divDim.ht)+"px",top:Math.round(0-divDim.padTp)+"px",width:Math.round(newWidth)+"px"});
//        obj.css({left:Math.round(0-(((newWidth-divDim.wd)/2)+divDim.padLf))+"px"});
//    } else {
//        var newHeight = divDim.wd*objDim.ht/objDim.wd;
//        obj.css({width:Math.round(divDim.wd+divDim.padLf)+"px",left:Math.round(0-divDim.padLf)+"px",height:Math.round(newHeight)+"px"});
//        obj.css({top:Math.round(0-(((newHeight-divDim.ht)/2)+divDim.padTp))+"px"});
//    }
    obj.css({visibility:"visible"}).animate({opacity:1},500);
  }
}
