
/*
 * GET home page.
 */

function setJadeVars(process, navItems, jV) {
  var inProd = (process.env.NODE_ENV === "production");
  jV.title += (inProd ? "" : (" ("+process.env.NODE_ENV+")"));
  jV.segment_io_client_id =  process.env.SEGMENT_IO_CLIENT_ID;
  jV.bootstrap_location = inProd ? "//netdna.bootstrapcdn.com" : "/vendor";
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

exports.contact = function(req, res, process, navItems, Model){
  res.render("home", setJadeVars(process, navItems, {
    current_page: "home",
    title: "Rainforest Connection"
  }));
};

