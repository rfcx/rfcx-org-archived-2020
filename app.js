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
  bodyParser = require("body-parser"), favicon = require("serve-favicon"),
  compression = require("compression"), serveStatic = require("serve-static"),
  middlewares = require("./middlewares/all.js").middlewares;
var app = express();

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_KEY && process.env.AWS_S3_BUCKET_AUDIO) {
  var knoxAudio = require("knox").createClient({
    key: process.env.AWS_ACCESS_KEY_ID, secret: process.env.AWS_SECRET_KEY, bucket: process.env.AWS_S3_BUCKET_AUDIO
  });
}

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

//app.configure(function(){
  app.set("title", "Rainforest Connection");
  app.set("port", process.env.PORT || 8080);
  app.use(bodyParser.urlencoded());
  app.set("views", __dirname + "/views");
  app.set("view engine", "jade");
  app.use(favicon("./public/cdn/img/logo/favicon.ico"));
  app.use(morganLogger("dev"));
  app.use(methodOverride());
  app.use(middlewares.allowCrossDomain);
//  app.use(app.router);
  app.use(compression());
  app.use(serveStatic(path.join(__dirname, "public")));
//});

if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
}

app.param("source_id",function(req,res,next,source_id){
  if (req.url_params == null) { req.url_params = {}; }
  req.urlParams = {};
  req.urlParams.source_id = parseInt(source_id);
  req.url_params.source_id = parseInt(source_id);
  next();
});


app.param("event_id",function(req,res,next,event_id){
  if (req.url_params == null) { req.url_params = {}; }
  req.url_params.event_id = parseInt(event_id); next();
});

app.param("audio_id",function(req,res,next,audio_id){
  if (req.url_params == null) { req.url_params = {}; }
  req.url_params.audio_id = audio_id; next();
});

app.param("audio_start",function(req,res,next,audio_start){
  if (req.url_params == null) { req.url_params = {}; }
  req.url_params.audio_start = parseInt(audio_start); next();
});


// API Initialization
var apiCb_ = require("./routes/api/callbacks.js"), apiEp = require("./routes/api/endpoints.js").endpoints;
function apiCb(req, res, next) { apiCb_.run(req, res, next, apiEp, Model); }
for (i in apiEp.get) { app.get(apiEp.get[i].path, apiCb); }
for (i in apiEp.post) { app.post(apiEp.post[i].path, apiCb); }

app.get("/referral/bonne_app", routes.redirectToHomePage );
app.get("/intro", routes.redirectToHomePage );
app.get("/video", routes.redirectToHomePage );


app.get("/ks-vid-1", function(req,res){
  res.writeHead(302, { "Location": "http://r-f.cx/1rqEukw" } );
  res.end();
});
app.get("/ks-vid-2", function(req,res){
  res.writeHead(302, { "Location": "http://r-f.cx/1wnFit0" } );
  res.end();
});

app.get("/ks-redirect", function(req,res){
  var sendString = "This redirect will become active upon Kickstarter launch, early in the morning on Tuesday, 24 June.";
  res.send(sendString);
  // res.writeHead(302, { "Location": "https://www.kickstarter.com/projects/topherwhite/1912716008?token=868c071b" } );
  // res.end();
});

app.get("/ks", function(req,res){
  res.writeHead(302, { "Location": "https://www.kickstarter.com/projects/topherwhite/1912716008?token=868c071b" } );
  res.end();
});

app.get("/media", function(req,res){
  res.writeHead(302, { "Location": "https://secure.flickr.com/photos/rainforestcx/sets/72157645045151716/" } );
  res.end();
});

app.get("/ranger-app",  routes.toRanger);


app.get("/health_check", routes.returnHealthCheck );


app.get('/api/1/event/:event_id', function(req,res){

  res.send(
    {
      source: {
        source_id: 1,
        cpu_percent: 88,
        cpu_clock: 66,
        battery_level: 100,
        battery_temperature: 28,
        app_version: "0.3.1"
      },
      triggered_at: (new Date()).toISOString(),
      audio_start: 223242,
      pagerduty_incident_key: "",
      audio_uri: /*"https://"+req.headers.host+"/api/1"
        +"/source/1"
        +"/audio/"+"2014-05-14-03-42"
        +"/"+223242
        +"/rfcx.m4a"*/
        "https://rfcx-audio.s3.amazonaws.com/m4a/1/2014-05-14-03-42-src1-8k.mp3"
        ,
      geo: {
        lat: -0.876,
        lng: 100.816
      }
    }
  );
});


app.get('/api/1/source/:source_id/audio/:audio_id/:audio_start/rfcx.m4a', function(req,res){

  res.contentType("audio/mp4");
  knoxAudio.getFile('/m4a/'+req.url_params.source_id
      +'/'+req.url_params.audio_id+'-src'+req.url_params.source_id+'-8k.m4a',
        function(err, audioStream){
                    audioStream.pipe(res);
  });

});

app.get('/alrt/:event_id', function(req,res){
  if (  (process.env.NODE_ENV==="production")
    &&  (   (req.host!=="rfcx.org")
        ||  (req.headers["x-forwarded-proto"]!=="https")
        )
    ) {
    res.writeHead(302, { "Location": "https://rfcx.org"+req.path } );
    res.end();
  } else {
    res.send({event_id:req.url_params.event_id});
  }
});


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
