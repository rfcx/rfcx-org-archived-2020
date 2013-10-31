
/*
 * GET home page.
 */

var navItems = [
//  [ page-id, nav-title, uri-path, page-title, show-in-nav, is-isolated ]
    [ "intro", "Intro", "/intro", "Rainforest Connection | Protecting rainforests with real-time data", true, false ],
    [ "about", "About", "/about", "About", true, false ],
    [ "get_involved", "Get Involved", "/get_involved", "Get Involved", true, false ],
    [ "blog", "Blog", "/blog", "Blog", false, false ],
    [ "team", "Team", "/team", "Team", false, false ],
    [ "forum", "Forum", "http://tumblr.rfcx.org/", "", true, false ],

    [ "video", null, "/video", "Rainforest Connection | Protecting rainforests with real-time data", false, true ]
  ];

var socialMedia = [
  [ "facebook", "https://www.facebook.com/RainforestCx", "facebook-square", "Check us out on Facebook!"],
  [ "twitter", "https://twitter.com/RainforestCx", "twitter-square", "Check us out on Twitter!"],
  [ "google-plus", "https://plus.google.com/u/0/b/110790947035627675960/110790947035627675960/posts", "google-plus-square", "Check us out on Google+!"],
  [ "linkedin", "http://www.linkedin.com/company/rainforest-connection", "linkedin-square", "Check us out on LinkedIn!"],
  [ "instagram", "http://www.linkedin.com/company/rainforest-connection", "instagram", "Check us out on Instagram!"],
  [ "flickr", "http://www.linkedin.com/company/rainforest-connection", "flickr", "Check us out on Flickr!"],
  [ "github", "http://www.linkedin.com/company/rainforest-connection", "github-square", "Check us out on Github!"]
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
  jV.videojs_cdn = inProd ? "//vjs.zencdn.net" : "/vendor/video.js"
  jV.cdnjs_cdn = inProd ? "//cdnjs.cloudflare.com/ajax/libs" : "/vendor";
  jV.rfcx_cdn = inProd ? "//d3gq709nndn9uy.cloudfront.net/cdn" : "/cdn";
  jV.rfcx_vendor_cdn = inProd ? "//d3gq709nndn9uy.cloudfront.net/vendor" : "/vendor";
  jV.nav_items = navItems;
  jV.social_media = socialMedia;
  return jV;
}

exports.navItems = navItems;

exports.page = function(req, res, process, Model){
  var navItem = [];
  for (var i = 0; i < navItems.length; i++) {
    if (req.route.path === navItems[i][2]) {
      navItem = navItems[i]; break;
    }
  }
  res.setHeader("Access-Control-Allow-Origin","*");
  res.render(navItem[0], setJadeVars(process, {
    current_page: navItem
  }));
};

exports.redirectToHomePage = function(req,res) {
  res.writeHead(302, { "Location": "http://rfcx.org/" } );
  res.end();
};

exports.returnHealthCheck = function(req,res) {
  res.send("rfcx");
};
