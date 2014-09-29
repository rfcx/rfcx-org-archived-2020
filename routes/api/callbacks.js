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
    },

    getEvent: function(req, res, Model) {

      var req = {

        blah: "blah"

      };

      res.send(req);
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
          sourceId: null,
          checkInId: null,
          time: Math.round((new Date()).valueOf()/1000)
        };

        Model.Version.count({ where: { name: d.appVersion } }).success(function(versionCount){
          if (versionCount > 0) {
            Model.Version.find({ where: { name: d.appVersion } }).success(function(Ver){
              Model.Source.findOrCreate({
                  device_uuid: d.uuid
                }).success(function(Src){
                  Ver.addSource(Src).success(function(){}).error(function(e){console.log(e);});
                  rtrn.sourceId = Src.id;
                  Model.Diagnostic.create({
                      source_id: Src.id,
                      measured_at: new Date(d.sent.valueOf()),
                      cpu_percent: d.cpuPAvg,
                      cpu_clock: d.cpuCAvg,
                      battery_percent: d.batteryPercent,
                      battery_temperature: d.batteryTemp,
                      network_search_time: d.networkSearch,
                      spectra_count: d.specC,
                      internal_luminosity: d.lumAvg,
                      blob_size: req.files.blob.size
                    }).success(function(Diag){
                      Ver.addCheckin(Diag).success(function(){}).error(function(e){console.log(e);});
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

                      for (var m = 0; m < d.sms.length; m++) {
                        Model.Message.create({
                          received_at: new Date(d.sms[m][0]),
                          origin: d.sms[m][1],
                          body: d.sms[m][2],
                          source_id: Src.id,
                          diagnostic_id: Diag.id
                        }).success(function(Msg){}).error(function(e){console.log(e);});
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
            }).error(function(e){
              console.log("Failure: Sequelize find version Source...");
              console.log(e);
            });
          } else {
            console.log("Stated app version NOT found in database...");
            res.send(rtrn, 500);
          }
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
      Model.Version.findAll({ where: { available: true }, order: "name DESC", limit: 2 }).success(function(Vers){
        rtrn.currAppVersion = Vers[0].name;
        rtrn.currAppLocation += "src-android/"+Vers[0].name+".apk";
        rtrn.currAppCheckSum = Vers[0].checksum;
        if (Vers.length > 1) { rtrn.prevAppVersion = Vers[1].name; }
        
         Model.Source.findOrCreate({
            device_uuid: req.body.deviceId
          }).success(function(Src){
            Model.Diagnostic.create({
                source_id: Src.id,
                measured_at: new Date()
              }).success(function(Diag){
//                Vers[0].addCheckin(Diag).success(function(){}).error(function(e){console.log(e);});
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
    },

    postSourceAlert: function(req, res, Model) {
      var rtrn = {
          time: Math.round((new Date()).valueOf()/1000)
        };
      res.json(rtrn);
    },





    postMappingRegister: function(req, res, Model) {
      var rtrn = {
          currentTime: Math.round((new Date()).valueOf()/1000),
          user: {}
        };
 
        Model.User.findOrCreate({
                  where: {
                    name: "topherwhite"
                  }
                }).success(function(Usr){

            if (Usr[0].guid == null) {
              require('crypto').randomBytes(6, function(ex, buf) {
                Usr[0].updateAttributes({
                  guid: buf.toString('hex')
                }).success(function(){
                }).error(function(e){
                    console.log(e);
                });
              });
            }

          res.send(rtrn, 200);
        }).error(function(e){
          console.log("Failure: Sequelize findOrCreate User...");
          console.log(e);
          res.send(rtrn, 500);
        });


    }





  }

};


// function updateSourceMeta(Model,Src,versionId) {

//   Model.Version.find({ where: { name: versionId } }).success(function(Ver){
//     console.log(Ver.id);
//   }).error(function(e){
//     console.log(e);
//   });


//     // Src.updateAttributes({
//     //     last_check_in_time: new Date()
//     //   }).success(function(){
//     //   }).error(function(e){
//     //     console.log(e);
//     //   });

// }

// function getVersionByName(Model, versionName, callback) {
//   Model.Version.find({ where: { name: versionId } }).success(function(Ver){
//     console.log(Ver.id);
//   }).error(function(e){
//     console.log(e);
//   });
// }

