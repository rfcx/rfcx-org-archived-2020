"use strict"; // should allow for variables and req statements to use let, const, etc.
// check for environmental variable file and load if present
const fs        = require("fs"),
    extend    = require('util')._extend,
    recaptcha = require("./helpers/recaptcha.js"),
    i18n = require('i18n-2');

let env, app;

if (fs.existsSync("./config/env_vars.js")) {
  env = require("./config/env_vars.js").env;
  for (i in env) { process.env[i] = env[i]; }
}

// New Relic Initialization
if (process.env.NODE_ENV === "production") {
  process.env.NEW_RELIC_HOME = __dirname+"/config"; require('newrelic');
}

// Load Production Version ID
process.env.productionVersionId = require("./config/version.js").productionVersionId;

// Express Initialization
let express = require("express"), routes = require("./routes"),
  http = require("http"), path = require("path"), errorHandler = require("errorhandler"),
  morganLogger = require("morgan"), methodOverride = require("method-override"),
  favicon = require("serve-favicon"),
  compression = require("compression"), serveStatic = require("serve-static"),
  bodyParser = require('body-parser'),
  donatePhoneRoutes = require('./routes/donate-phone.js'),
  middleware = require("./middlewares/all.js").middleware;
app = express();

i18n.expressBind(app, {
  //setup some locales - other locales default to en silently
  locales: ['en', 'ru', 'de'],
  defaultLocale: 'en',
  extension: '.json',
});

app.set('title', 'Rainforest Connection');
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon('./public/cdn/img/logo/favicon.ico'));
app.use(morganLogger('dev'));
app.use(methodOverride());
app.use(middleware.allowCrossDomain);
app.use(middleware.getSetLocale);
app.use(compression());
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}

// ===========================
// FRONT-END REQUESTS
// =========

// Create a donor when user submits form on /donate/phone page
app.post('/donate_phone/donor', [recaptcha.validate], donatePhoneRoutes.putMailChimpEntry );

// ===========================
// ADMIN REQUESTS
// =========

// Get all entries of a mailchimp list
app.get('/mailchimp/get', donatePhoneRoutes.getMailChimpListDetails);
// Find entry by specified query
app.get('/mailchimp/search', [middleware.checkAdminPassword], donatePhoneRoutes.searchMailChimpList);
// Simple password check for admin login. If passes through middleware then return success
app.post('/donate_phone/check_password', [middleware.checkAdminPassword], donatePhoneRoutes.validateUser );
// Update existing donor info
app.post('/donate_phone/donor/update', [middleware.checkAdminPassword], donatePhoneRoutes.updateMailChimpEntry );
// Crate new donor by Admin
app.post('/donate_phone/donor/create', [middleware.checkAdminPassword], donatePhoneRoutes.putMailChimpEntry );

app.get('/ks', function(req,res){
  res.writeHead(302, { "Location": "http://r-f.cx/1zDaQ0L" } );
  res.end();
});
app.get('/ks/next', function(req,res){
  res.writeHead(302, { "Location": "/donate" } );
  res.end();
});
app.get('/ks/facebook', function(req,res){
  res.writeHead(302, { "Location": "https://www.facebook.com/RainforestCx" } );
  res.end();
});
app.get('/ks/twitter', function(req,res){
  res.writeHead(302, { "Location": "https://twitter.com/RainforestCx" } );
  res.end();
});

app.get('/health_check', routes.returnHealthCheck );

for (var i = 0; i < routes.navItems.length; i++) {
  app.get(routes.navItems[i][2], function(req, res){ routes.page(req, res, process); });
}

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log(
    app.get('title')+' (port '+app.get('port')+') ('+process.env.NODE_ENV+')'
    +((process.env.NODE_ENV=== 'production') ? (' ('+process.env.productionVersionId+')') : '')
  );
});
