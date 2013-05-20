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
      var d = parsers.parseCheckIn(req);
      
      Model.Source.findOrCreate({
          device_id: d.udid
        }).success(function(Src){
          Model.Diagnostic.create({
              source_id: Src.id,
              measured_at: d.date,
              cpu_percent: d.cpuPAvg,
              cpu_clock: d.cpuCAvg,
              battery_level: d.batteryLevel,
              battery_temperature: d.batteryTemp,
              network_search_time: d.networkSearch
            }).success(function(Diag){
              Model.Spectrum.create({
                source_id: Src.id,
                diagnostic_id: Diag.id,
                spectrum: d.spec.join(",")
              }).success(function(Spec){
                console.log("Successfully completed Check-In chain...");
              }).error(function(e){
                console.log("Failure: Sequelize create Spectrum...");
              });
            }).error(function(e){
              console.log("Failure: Sequelize create Diagnostic...");
            });
        }).error(function(e){
          console.log("Failure: Sequelize findOrCreate Source...");
      });

      // var body = ""+d.date.valueOf();
      // res.send(body);
    }

  }

};