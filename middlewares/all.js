var url = require("url");

exports.middleware = {

  allowCrossDomain: function(req, res, next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","X-Requested-With");
    next();
  },

  getSetLocale: function(req, res, next) {
    req.locale = "en";
    req.locale_url = "";
    var localeSection = req.url.substr(0,1+req.url.lastIndexOf("/")),
        localeOptions = [ "en", "de", "ru" ];
    var urls = []; for (i in localeOptions) { urls.push("/"+localeOptions[i]+"/"); }

    if (urls.indexOf(localeSection) > -1) {
      req.locale = localeOptions[urls.indexOf(localeSection)];
      req.locale_url = "/"+req.locale;
      req.url = req.url.substr(("/"+req.locale).length);
      // TO DO: maybe add something so that un-supported locales still render, but fallback to "en"
 //   } else if (localeSection.length > 0) {
 //     req.url = req.url.substr(localeSection.length-1);
    }
    req.i18n.setLocale(req.locale);
    next();
  },

 checkAdminPassword: function(req, res, next) {
    var userPassword = req.body.adminpassword || req.query.adminpassword;
    if (!userPassword) {
      return sendJson(res, 'error', 'Missing admin password field');
    }
    if (userPassword !== process.env.PHONE_DONATION_ADMIN_PASSWORD) {
      return sendJson(res, 'error', 'Wrong password.');
    }
    else {
      next();
    }
  }

};

function sendJson(res, type, msg) {
  res.status(type == 'success'? 200 : 403).json({
    status: type,
    message: msg
  })
}
