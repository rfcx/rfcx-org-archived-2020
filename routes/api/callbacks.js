exports.run = function(req, res, next, Endpoints, Model) {
  var method = req.method.toLowerCase();
  var path = req.url.toLowerCase();
  var passNext = true;
  for (i in Endpoints[method]) {
    if (Endpoints[method][i].path === path) {
      passNext = false;
      // res.setHeader("Content-Type", Endpoints[method][i].contentType);
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

      console.log(req);

      // Model.Source.find({
      //   source_id: res.urlParams.sourceId
      // }).success(function(Src){
      //   res.json(Src);
      // }).error(function(e){
      //   console.log(e);
      // });
      // res.json([{name:'wine1'}, {name:'wine2'}]);
      // res.end();
    }

  },

  post: {

    postCheckIn: function(req, res, Model) {
      
      parsers.processCheckIn(req,res,function(req, res, d){

        var rtrn = {
          srcId: null,
          checkInId: null,
          time: Math.round((new Date()).valueOf()/1000)
        };
        Model.Source.findOrCreate({
            device_id: d.udid
          }).success(function(Src){
            rtrn.srcId = Src.id;
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
                blob_size: req.files.blob.size,
                app_version: d.appVersion
              }).success(function(Diag){
                rtrn.checkInId = Diag.id;
                for (var g = 0; g < d.specC; g++) {
                  Model.Spectrum.create({
                    source_id: Src.id,
                    diagnostic_id: Diag.id,
                    measured_at: d.specT[g],
                    spectrum: d.specV[g].join(",")
                  }).success(function(Spec){
                  }).error(function(e){
                    console.log("Failure: Spectrum could not be saved...");
                    console.log(e);
                    res.send(rtrn, 500);
                  });
                }

                if (d.lastCheckInId != null) {
                  Model.Diagnostic.find(d.lastCheckInId).success(function(lastDiag){
                    lastDiag.updateAttributes({
                      network_transmit_time: d.lastCheckInDuration
                    }).success(function(){
                    }).error(function(e){
                      console.log("Failure: Last Check In transfer time could not be saved...");
                      console.log(e);
                    });
                  }).error(function(e){
                    console.log(e);
                  });
                }

                res.json(rtrn);
              }).error(function(e){
                console.log("Failure: Sequelize create Diagnostic...");
                console.log(e);
                res.send(rtrn, 500);
              });
          }).error(function(e){
            console.log("Failure: Sequelize findOrCreate Source...");
            console.log(e);
            res.send(rtrn, 500);
        });

      });
    },

    postSourceVersion: function(req, res, Model) {
      var rtrn = {
          time: Math.round((new Date()).valueOf()/1000),
          currAppVersion: null,
          currAppLocation: (process.env.NODE_ENV == "production") ? "http://release.rfcx.org/" : "http://localhost:8080/" ,
          currAppCheckSum: null,
          prevAppVersion: null
        };
      Model.Version.findAll({ where: { available: true }, order: "version_id DESC", limit: 2 }).success(function(versions){
        rtrn.currAppVersion = versions[0].version_id;
        rtrn.currAppLocation += "src-android/"+versions[0].version_id+".apk";
        rtrn.currAppCheckSum = versions[0].checksum;
        if (versions.length > 1) { rtrn.prevAppVersion = versions[1].version_id; }
        
         Model.Source.findOrCreate({
            device_id: req.body.deviceId
          }).success(function(Src){
            Model.Diagnostic.create({
                source_id: Src.id,
                measured_at: new Date(),
                cpu_percent: 0,
                cpu_clock: 0,
                battery_level: 0,
                battery_temperature: 0,
                network_search_time: 0,
                spectra_count: 0,
                internal_luminosity: 0,
                blob_size: 0,
                app_version: "0.0.0"
              }).success(function(Diag){

                console.log(req.body);
              
              }).error(function(e){
                console.log(e);
              });
          }).error(function(e){
            console.log(e);
        });

        res.send(rtrn,200);
      }).error(function(e){
        res.send(rtrn,500);
      });
    }

  }

};