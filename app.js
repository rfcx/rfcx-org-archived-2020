// check for environmental variable file and load if present
var fs = require("fs");
if (fs.existsSync("./config/env_vars.js")) {
  var env = require("./config/env_vars.js").env;
  for (i in env) { process.env[i] = env[i]; }
}

// New Relic Initialization
if (process.env.NODE_ENV === "production") {
  process.env.NEW_RELIC_HOME = __dirname+"/config"; require('newrelic');
}

// Load Production Version ID
process.env.productionVersionId = require("./config/version.js").productionVersionId;

// Express Initialization
var express = require("express"), routes = require("./routes"),
  http = require("http"), path = require("path"), errorHandler = require("errorhandler"),
  morganLogger = require("morgan"), methodOverride = require("method-override"),
  favicon = require("serve-favicon"),
  compression = require("compression"), serveStatic = require("serve-static"),
  middlewares = require("./middlewares/all.js").middlewares;
var app = express();

app.set("title", "Rainforest Connection");
app.set("port", process.env.PORT || 8080);
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.use(favicon("./public/cdn/img/logo/favicon.ico"));
app.use(morganLogger("dev"));
app.use(methodOverride());
app.use(middlewares.allowCrossDomain);
app.use(compression());
app.use(serveStatic(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
}

app.get("/ks", function(req,res){
  res.writeHead(302, { "Location": "http://r-f.cx/1zDaQ0L" } );
  res.end();
});
app.get("/ks/next", function(req,res){
  res.writeHead(302, { "Location": "/donate" } );
  res.end();
});
app.get("/ks/facebook", function(req,res){
  res.writeHead(302, { "Location": "https://www.facebook.com/RainforestCx" } );
  res.end();
});
app.get("/ks/twitter", function(req,res){
  res.writeHead(302, { "Location": "https://twitter.com/RainforestCx" } );
  res.end();
});

app.get("/health_check", routes.returnHealthCheck );

for (var i = 0; i < routes.navItems.length; i++) {
  app.get(routes.navItems[i][2], function(req, res){ routes.page(req, res, process); });
}

var server = http.createServer(app).listen(app.get("port"), function(){
  console.log(
    app.get("title")+" (port "+app.get("port")+") ("+process.env.NODE_ENV+")"
    +((process.env.NODE_ENV=== "production") ? (" ("+process.env.productionVersionId+")") : "")
  );
});
