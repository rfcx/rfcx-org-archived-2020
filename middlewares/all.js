exports.middlewares = {

  allowCrossDomain: function(req, res, next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","X-Requested-With");
    next();
  },

  productionDomainCorrection: function(req, res, next) {
    if (  (process.env.NODE_ENV==="production")
      &&  (req.host!=="rfcx.org")
//      &&  (req.path.substr(0,8)!=="/vendor/")
//      &&  (req.path.substr(0,5)!=="/cdn/")
      &&  (req.host!=="rainforestconnection.org")
      ) {
        var protocol = req.protocol.toLowerCase();
        res.writeHead(302, { "Location": protocol+"://rfcx.org"+req.path } );
        res.end();
    }
    next();
  }

}