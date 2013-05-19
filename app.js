// check for environmental variable file and load if present
var fs = require("fs");
if (fs.existsSync("./config/env_vars.js")) {
  var env = require("./config/env_vars.js").env;
  for (i in env) { process.env[i] = env[i]; }
}

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
var modelNames = [ "source" , "spectrum", "diagnostic"];
var db = require("./config/sequelize.js").createConnection(Sequelize,process.env);
var Model = require("./model/_all.js").createModel(db,Sequelize,modelNames);

// Express Initialization
var express = require("express"), routes = require("./routes"),
  http = require("http"), path = require("path");
var app = express();
app.configure(function(){
  app.set("title", "Rainforest Connection API");
  app.set("port", process.env.PORT || 8080);
  app.set("views", __dirname + "/views");
  app.set("view engine", "jade");
  app.use(express.favicon());
  app.use(express.logger("dev"));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, "public")));
});

app.configure("development", function(){
  app.use(express.errorHandler());
});

// API Initialization
var apiCb_ = require("./routes/api/callbacks.js"), apiEp = require("./routes/api/endpoints.js").endpoints;
function apiCb(req, res, next) { apiCb_.run(req, res, next, apiEp, Model); }
for (i in apiEp.get) { app.get(apiEp.get[i].path, apiCb); }
for (i in apiEp.post) { app.post(apiEp.post[i].path, apiCb); }

// Define Endpoints
app.get("/", routes.index);

app.post("/", function(req, res){

  var date = new Date();
  var udid = req.body.udid;
  var json = JSON.parse(req.body.json);
  var specHex = json.spec.split(",");
  var spec = [];
  for (var i = 0; i < specHex.length; i++) { spec[i] = parseInt(specHex[i], 16); }


  var body = ""+date.valueOf();
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

http.createServer(app).listen(app.get("port"), function(){
  console.log(app.get("title")+" (port "+app.get("port")+") ("+process.env.NODE_ENV+")");
});
