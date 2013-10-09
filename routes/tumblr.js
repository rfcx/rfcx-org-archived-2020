exports.refreshTumblrCache = function(req, res, fs) {
  var https = require('https'),
    jsonPath = "./cache/tumblr-"+process.env.TUMBLR_SUBDOMAIN+"-tmp.json",
    jsonPathFinal = "./cache/tumblr-"+process.env.TUMBLR_SUBDOMAIN+".json" ;
    console.log(jsonPath);
  https.get("https://api.tumblr.com"
    +"/v2/blog/"+process.env.TUMBLR_SUBDOMAIN+".tumblr.com/posts"
    +"?api_key="+process.env.TUMBLR_OAUTH_CONSUMER_KEY,
    function(res) {
      if (fs.existsSync(jsonPath)) { fs.unlinkSync(jsonPath); }
      res.on('data', function(d) {
        fs.appendFile(jsonPath, d, "utf-8", function(e){ if (e) throw e; });
      }).on("close", function(d){
        if (fs.existsSync(jsonPathFinal)) { fs.unlinkSync(jsonPathFinal); }
        fs.rename(jsonPath, jsonPathFinal, function (err) { if (err) throw err; });
      });
    }).on('error', function(e) { console.error(e); }
  );
  res.end();
};
