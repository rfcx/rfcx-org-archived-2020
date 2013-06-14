exports.run = function(req, res, next, Endpoints, Model) {
  var method = req.method.toLowerCase();
  var path = req.url.toLowerCase();
  var passNext = true;
  for (i in Endpoints[method]) {
    if (Endpoints[method][i].path === path) {
      passNext = false;
      res.setHeader("Content-Type", Endpoints[method][i].contentType);
      callbacks[method][Endpoints[method][i].callback](req, res, Model);
      break;
    }
  }
  if (passNext) { return next(); }
};

var parsers = require("./parsers.js").parsers;
var callbacks = {

  get: {

    getSource: function(req, res, Model) {
      res.send([{name:'wine1'}, {name:'wine2'}]);
      res.end();
    }

  },

  post: {

    postCheckIn: function(req, res, Model) {
      
      parsers.processCheckIn(req,res,function(req, res, d){

        var rtrn = {
          time: Math.round((new Date()).valueOf()/1000),
          diagId: null
        };
        Model.Source.findOrCreate({
            device_id: d.udid
          }).success(function(Src){
            Model.Diagnostic.create({
                source_id: Src.id,
                measured_at: new Date(d.sent.valueOf()),
                cpu_percent: d.cpuPAvg,
                cpu_clock: d.cpuCAvg,
                battery_level: d.batteryLevel,
                battery_temperature: d.batteryTemp,
                network_search_time: d.networkSearch,
                spectra_count: d.specC,
                internal_luminosity: d.lumAvg,
                blob_size: req.files.blob.size
              }).success(function(Diag){
                rtrn.diagId = Diag.id;
                for (var g = 0; g < d.specC; g++) {
                  Model.Spectrum.create({
                    source_id: Src.id,
                    diagnostic_id: Diag.id,
                    measured_at: d.specT[g],
                    spectrum: d.specV[g].join(",")
                  }).success(function(Spec){
                  }).error(function(e){
                    console.log("Failure: Spectrum could not be saved...");
                    res.send(rtrn, 500);
                  });
                }
                res.send(rtrn, 202);
              }).error(function(e){
                console.log("Failure: Sequelize create Diagnostic...");
                res.send(rtrn, 500);
              });
          }).error(function(e){
            console.log("Failure: Sequelize findOrCreate Source...");
            res.send(rtrn, 500);
        });

      });
    },

    postSourceVersion: function(req, res, Model) {
      var rtrn = {
          time: Math.round((new Date()).valueOf()/1000),
          currAppVersion: null,
          currAppLocation: null,
          currAppCheckSum: null,
          prevAppVersion: null
        };
      Model.Version.findAll({ order: "version_id DESC", limit: 2, where: { available: true } }).success(function(versions){
        rtrn.currAppVersion = versions[0].version_id;
        rtrn.currAppLocation = "http://release.rfcx.org/src-android/"+versions[0].version_id+".apk";
        rtrn.currAppCheckSum = versions[0].checksum;
        if (versions.length > 1) { rtrn.prevAppVersion = versions[1].version_id; }
        res.send(rtrn,200);
      }).error(function(e){
        res.send(rtrn,500);
      });
    }

  }

};