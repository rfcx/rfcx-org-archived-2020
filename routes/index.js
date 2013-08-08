
/*
 * GET home page.
 */

var navItems = [
    [ "home", "Home", "Rainforest Connection | Protecting rainforests with real-time data" ],
    [ "about", "About", "About" ],
    [ "get_involved", "Get Involved", "Get Involved" ],
    [ "media", "Media", "Media" ],
    [ "blog", "Blog", "Blog" ]
  ];


function setJadeVars(process, jV) {
  var inProd = (process.env.NODE_ENV === "production");
  jV.app_version = process.env.productionVersionId;
  jV.node_env = process.env.NODE_ENV;
  jV.title += (inProd ? "" : (" ("+process.env.NODE_ENV+")"));
  jV.segment_io_client_id =  process.env.SEGMENT_IO_CLIENT_ID;
  jV.addthis_pubid = process.env.ADDTHIS_PUBID;
  jV.bootstrap_cdn = inProd ? "//netdna.bootstrapcdn.com" : "/vendor";
  jV.googlelibs_cdn = inProd ? "//ajax.googleapis.com/ajax/libs" : "/vendor";
  jV.cdnjs_cdn = inProd ? "//cdnjs.cloudflare.com/ajax/libs" : "/vendor";
  jV.rfcx_cdn = inProd ? "//d3gq709nndn9uy.cloudfront.net/cdn" : "/cdn";
  jV.rfcx_vendor_cdn = inProd ? "//d3gq709nndn9uy.cloudfront.net/vendor" : "/vendor";
  jV.nav_items = navItems;
  return jV;
}

exports.navItems = navItems;

exports.page = function(req, res, process, Model){
  var navItem = [];
  for (var i = 0; i < navItems.length; i++) {
    if (req.route.path.substr(1) === navItems[i][0]) {
      navItem = navItems[i]; break;
    }
  }
  res.setHeader("Access-Control-Allow-Origin","*");
  res.render(navItem[0], setJadeVars(process, {
    current_page: navItem[0],
    title: navItem[2]
  }));
};

exports.redirectToHomePage = function(req,res) {
  res.writeHead(302, { "Location": "http://rfcx.org/" } );
  res.end();
};
