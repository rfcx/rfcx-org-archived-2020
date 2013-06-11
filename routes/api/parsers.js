var zlib = require("zlib");
var fs = require("fs");

exports.parsers = {

  processCheckIn: function(req,res,callback) {
    var unZippedPath = "/tmp/"+(new Date()).valueOf()+".json";
    var unZippedStream = fs.createWriteStream(unZippedPath);
    fs.createReadStream(req.files.blob.path).pipe(zlib.createGunzip()).pipe(unZippedStream);
    unZippedStream.on("close",function(){
      fs.readFile(unZippedPath,function(err,unZippedJSON){
        if (err) {
          console.log("Failed to open unzipped JSON file: "+unZippedPath);
        } else {
          
          var json = JSON.parse(unZippedJSON);

          var d = {
            sent: new Date(),
            udid: req.body.udid,
            specC: 0,
            specT: [],
            specV: []
          };

          callback(req,res,parseCheckInJSON(d,json));

          fs.unlink(unZippedPath, function(err){
            if (err) { console.log("Failed to delete unzipped JSON file after usage..."); }
          });

        }
      });
    });

  } // end of processCheckIn


}

function parseCheckInJSON(d, json) {

  d.isCharging = json.powr;
  d.isCharged = json.chrg;
  d.batteryLevel = json.batt;
  d.batteryTemp = json.temp;
  d.networkSearch = json.srch;

  d.lum = (json.lumn !== null) ? json.lumn.split(",") : [];
  d.lumAvg = 0;
  d.cpuP = (json.cpuP !== null) ? json.cpuP.split(",") : [];
  d.cpuPAvg = 0;
  d.cpuC = (json.cpuC !== null) ? json.cpuC.split(",") : [];
  d.cpuCAvg = 0;
  for (var i = 0; i < d.lum.length; i++) { d.lumAvg = d.lumAvg + parseInt(d.lum[i]); }
    if (d.lumAvg > 0) { d.lumAvg = Math.round(d.lumAvg / d.lum.length); }
  for (var i = 0; i < d.cpuP.length; i++) { d.cpuPAvg = d.cpuPAvg + parseInt(d.cpuP[i]); }
    if (d.cpuPAvg > 0) { d.cpuPAvg = Math.round(d.cpuPAvg / d.cpuP.length); }
  for (var i = 0; i < d.cpuC.length; i++) { d.cpuCAvg = d.cpuCAvg + parseInt(d.cpuC[i]); }
    if (d.cpuCAvg > 0) { d.cpuCAvg = Math.round(d.cpuCAvg / d.cpuC.length); }

  d.sent = Date.parse(json.sent);
  var dateMs = parseInt(d.sent.valueOf());
  
  var specTimes = json.specT.split(",");
  for (var i = 0; i < specTimes.length; i++) {
    d.specT[i] = new Date(dateMs-(parseInt(specTimes[i],16)*1000));
  }
  d.specC = specTimes.length;
  
  var specGroup = json.specV.split("*");
  for (var g = 0; g < d.specC; g++) {
    d.specV[g] = [];
    var specHex = specGroup[g].split(",");
    for (var i = 0; i < specHex.length; i++) { d.specV[g][i] = parseInt(specHex[i], 16); }
  }
  return d;
}