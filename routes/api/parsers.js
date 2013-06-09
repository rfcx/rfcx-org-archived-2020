exports.parsers = {

  parseCheckIn: function(req) {
    var d = {
      date: new Date(),
      udid: req.body.udid,
      spec: []
    };
    
    var json = JSON.parse(req.body.json);
    
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
    for (var i = 0; i < d.lum.length; i++) { d.lumAvg = d.lumAvg + d.lum[i]; }
      if (d.lumAvg > 0) { d.lumAvg = Math.round(d.lumAvg / d.lum.length); }
    for (var i = 0; i < d.cpuP.length; i++) { d.cpuPAvg = d.cpuPAvg + d.cpuP[i]; }
      if (d.cpuPAvg > 0) { d.cpuPAvg = Math.round(d.cpuPAvg / d.cpuP.length); }
    for (var i = 0; i < d.cpuC.length; i++) { d.cpuCAvg = d.cpuCAvg + d.cpuC[i]; }
      if (d.cpuCAvg > 0) { d.cpuCAvg = Math.round(d.cpuCAvg / d.cpuC.length); }
    
    var specGroup = json.spec.split("*");
    d.specCount = specGroup.length;
    for (var g = 0; g < specGroup.length; g++) {
      d.spec[g] = [];
      var specHex = specGroup[g].split(",");
      // for (var i = 0; i < specHex.length; i++) { d.spec[g][i] = parseInt(specHex[i], 16); }
      d.spec[g] = specHex;
    }

    return d;
  }

}