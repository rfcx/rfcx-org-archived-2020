exports.run = function(req, res, next, Endpoints, Model) {
  var method = req.method.toLowerCase();
  var path = req.url.toLowerCase();
  for (i in Endpoints[method]) {
    if (Endpoints[method][i].path === path) {
      callbacks[Endpoints[method][i].callback](req, res, Model);
    }
  }
  return next();
};

var callbacks = {};

callbacks.createSource = function(req, res, Model) {
  console.log("asdf");
};