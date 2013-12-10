// check for environmental variable file and load if present
var fs = require("fs");
if (fs.existsSync("./config/env_vars.js")) {
  var env = require("./config/env_vars.js").env;
  for (i in env) { process.env[i] = env[i]; }
}

// Segment.io & New Relic Initialization
if (process.env.NODE_ENV === "production") {
  process.env.NEW_RELIC_HOME = __dirname+"/config"; require('newrelic');
  var analytics = require("analytics-node"); analytics.init({secret:process.env.SEGMENT_IO_SECRET});
}

// Load Production Version ID
process.env.productionVersionId = require("./config/version.js").productionVersionId;

// Express Initialization
var express = require("express"), routes = require("./routes"),
  http = require("http"), path = require("path"),
  middlewares = require("./middlewares/all.js").middlewares;
var app = express();

// TooBusy checks if we are overloaded
if (parseInt(process.env.TOOBUSY_ENABLED)===1) {
  var toobusyConfig = require("./config/toobusy.js").config;
  var toobusy = require('toobusy');
  console.log("Enabling 'toobusy' overload handler");
  app.use(function(req,res,next) {
    if (toobusy()){ res.send(503, toobusyConfig.message); } else { next(); }
  });
}

// Sequelize Database ORM Initialization
var Sequelize = require("sequelize");
var modelNames = [ "source" , "spectrum", "diagnostic", "version", "audio", "message", "alert"];
var db = require("./config/sequelize.js").createConnection(Sequelize,process.env);
var Model = require("./model/_all.js").createModel(db,Sequelize,modelNames);

app.configure(function(){
  app.set("title", "Rainforest Connection");
  app.set("port", process.env.PORT || 8080);
  app.use(express.bodyParser());
  app.set("views", __dirname + "/views");
  app.set("view engine", "jade");
  app.use(express.favicon("./public/cdn/img/logo/favicon.ico"));
  app.use(express.logger("dev"));
  app.use(express.methodOverride());
  app.use(middlewares.allowCrossDomain);
  app.use(app.router);
  app.use(express.compress());
  app.use(express.static(path.join(__dirname, "public")));
});

app.configure("development", function(){
  app.use(express.errorHandler());
});

app.param("source_id",function(req,res,next,source_id){
  req.urlParams = {};
  req.urlParams.source_id = parseInt(source_id);
  next();
});

// API Initialization
var apiCb_ = require("./routes/api/callbacks.js"), apiEp = require("./routes/api/endpoints.js").endpoints;
function apiCb(req, res, next) { apiCb_.run(req, res, next, apiEp, Model); }
for (i in apiEp.get) { app.get(apiEp.get[i].path, apiCb); }
for (i in apiEp.post) { app.post(apiEp.post[i].path, apiCb); }

app.get("/referral/bonne_app", routes.redirectToHomePage );
app.get("/intro", routes.redirectToHomePage );
app.get("/video", routes.redirectToHomePage );

app.get("/health_check", routes.returnHealthCheck );

for (var i = 0; i < routes.navItems.length; i++) {
  app.get(routes.navItems[i][2], function(req, res){ routes.page(req, res, process, Model); });
}

app.get("/tumblr", require("./routes/tumblr.js").refreshTumblrCache );

var server = http.createServer(app).listen(app.get("port"), function(){
  console.log(
    app.get("title")+" (port "+app.get("port")+") ("+process.env.NODE_ENV+")"
    +((process.env.NODE_ENV=== "production") ? (" ("+process.env.productionVersionId+")") : "")
  );
});

process.on('SIGINT', function(){
  server.close();
  if (typeof(toobusy) !== "undefined") { toobusy.shutdown(); }
  process.exit();
});
