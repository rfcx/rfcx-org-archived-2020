// check for environmental variable file and load if present
var fs = require("fs");
if (fs.existsSync("./config/env_vars.js")) {
  var env = require("./config/env_vars.js").env;
  for (i in env) { process.env[i] = env[i]; }
}

// Load Production Version ID
process.env["productionVersionId"] = require("./config/version.js").productionVersionId;

// NodeFly Monitoring Initialization
var nodefly = require("./config/nodefly.js").nodefly;
require('nodefly').profile( process.env.NODEFLY_ID, nodefly.app, nodefly.options);

// Segment.io Analytics Initialization
if (process.env.NODE_ENV !== "test") {
  var analytics = require("analytics-node");
  analytics.init({secret:process.env.SEGMENT_IO_SECRET});
}

// Sequelize Database ORM Initialization
var Sequelize = require("sequelize");
var modelNames = [ "source" , "spectrum", "diagnostic", "version", "audio", "message", "alert"];
var db = require("./config/sequelize.js").createConnection(Sequelize,process.env);
var Model = require("./model/_all.js").createModel(db,Sequelize,modelNames);

// Express Initialization
var express = require("express"), routes = require("./routes"),
  http = require("http"), path = require("path");
var app = express();
app.configure(function(){
  app.set("title", "Rainforest Connection");
  app.set("port", process.env.PORT || 8080);
  app.use(express.bodyParser());
  app.set("views", __dirname + "/views");
  app.set("view engine", "jade");
  app.use(express.favicon("./public/cdn/img/logo/favicon.ico"));
  app.use(express.logger("dev"));
  app.use(express.methodOverride());
  app.use(app.router);
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



// Web Initialization
app.get("/", function(req, res){
  if  ( (process.env.NODE_ENV === "production") && (req.host !== "rfcx.org") ) {
      console.log("Received request at '"+req.host+"'. Redirecting to https://rfcx.org/.");
      res.writeHead(302, { "Location": "https://rfcx.org/" } );
      res.end();
  } else {
    fs.readFile("./public/_old_site/index.html", function (e, d) {
      if (e) throw e;
      res.setHeader("Content-Type", "text/html");
      res.setHeader("Content-Length", d.length);
      res.send(d);
    });
  }
});

var navItems = [ ["home","Home"], ["about","About"], ["get_involved","Get Involved"], ["media","Media"] ];
app.get("/home", function(req, res){ routes[navItems[0][0]](req, res, process, navItems, Model); });
app.get("/about", function(req, res){ routes.about(req, res, process, navItems, Model); });
app.get("/get_involved", function(req, res){ routes.get_involved(req, res, process, navItems, Model); });
app.get("/media", function(req, res){ routes.media(req, res, process, navItems, Model); });



http.createServer(app).listen(app.get("port"), function(){
  console.log(  app.get("title")
                +" (port "+app.get("port")+")"
                +" ("+process.env.NODE_ENV+")"
                +((process.env.NODE_ENV=== "production") ? (" ("+process.env.productionVersionId+")") : "")
                );
});
