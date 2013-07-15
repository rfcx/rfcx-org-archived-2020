
/*
 * GET home page.
 */

function setJadeVars(process, navItems, jV) {
  var inProd = (process.env.NODE_ENV === "production");
  jV.app_version = process.env.productionVersionId;
  jV.node_env = process.env.NODE_ENV;
  jV.title += (inProd ? "" : (" ("+process.env.NODE_ENV+")"));
  jV.segment_io_client_id =  process.env.SEGMENT_IO_CLIENT_ID;
  jV.addthis_pubid = process.env.ADDTHIS_PUBID;
  jV.bootstrap_cdn = inProd ? "//netdna.bootstrapcdn.com" : "/vendor";
  jV.googlelibs_cdn = inProd ? "//ajax.googleapis.com/ajax/libs" : "/vendor";
  jV.cdnjs_cdn = inProd ? "//cdnjs.cloudflare.com/ajax/libs" : "/vendor";
  jV.rfcx_cdn = inProd ? "//d1b38lwmn11w1.cloudfront.net/www" : "/cdn";
  jV.rfcx_vendor_cdn = inProd ? "//d1b38lwmn11w1.cloudfront.net/vendor" : "/vendor";
  jV.nav_items = navItems;
  return jV;
}

exports.home = function(req, res, process, navItems, Model){
  res.render("home", setJadeVars(process, navItems, {
    current_page: "home",
    title: "Rainforest Connection"
  }));
};

exports.about = function(req, res, process, navItems, Model){
  res.render("about", setJadeVars(process, navItems, {
    current_page: "about",
    title: "What is Rainforest Connection?"
  }));
};

exports.get_involved = function(req, res, process, navItems, Model){
  res.render("get_involved", setJadeVars(process, navItems, {
    current_page: "get_involved",
    title: "Rainforest Connection"
  }));
};

exports.media = function(req, res, process, navItems, Model){
  res.render("media", setJadeVars(process, navItems, {
    current_page: "media",
    title: "Rainforest Connection"
  }));
};

