exports.refreshTumblrCache = function(req,res) {
  var https = require('https'),
    fs = require("fs"),
    jsonPath = "./cache/tumblr-"+process.env.TUMBLR_SUBDOMAIN+"-tmp.json",
    jsonPathFinal = "./cache/tumblr-"+process.env.TUMBLR_SUBDOMAIN+".json" ;
  https.get("https://api.tumblr.com"
    +"/v2/blog/"+process.env.TUMBLR_SUBDOMAIN+".tumblr.com/posts"
    +"?api_key="+process.env.TUMBLR_OAUTH_CONSUMER_KEY,
    function(res) {
      if (fs.existsSync(jsonPath)) { fs.unlinkSync(jsonPath); }
      res.on('data', function(d) {
        fs.appendFile(jsonPath, d, "utf-8", function(e){ if (e) throw e; });
      }).on("close", function(d){
        if (fs.existsSync(jsonPathFinal)) { fs.unlinkSync(jsonPathFinal); }
        fs.rename(jsonPath, jsonPathFinal, function (e) {
          if (e) throw e;
          console.log("Tumblr JSON saved to "+jsonPathFinal);
        });
      });
    }).on('error', function(e) { console.error(e); }
  );
  res.end();
};
