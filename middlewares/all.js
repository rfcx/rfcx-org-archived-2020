var url = require("url");

exports.middleware = {

  allowCrossDomain: function(req, res, next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","X-Requested-With");
    next();
  },

  getSetLanguage: function(req, res, next) {
    req.language = "en";
    req.language_url = "";
    var languageSection = req.url.substr(0,1+req.url.lastIndexOf("/")),
        languageOptions = [ "en", "de", "ru" ];
    var urls = []; for (i in languageOptions) { urls.push("/"+languageOptions[i]+"/"); }

    if (urls.indexOf(languageSection) > -1) {
      req.language = languageOptions[urls.indexOf(languageSection)];
      req.language_url = "/"+req.language;
      req.url = req.url.substr(("/"+req.language).length);
      // TO DO: maybe add something so that un-supported languages still render, but fallback to "en"
 //   } else if (languageSection.length > 0) {
 //     req.url = req.url.substr(languageSection.length-1);
    }
    next();
  },

}