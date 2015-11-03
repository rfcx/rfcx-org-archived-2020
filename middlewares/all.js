exports.middlewares = {

  allowCrossDomain: function(req, res, next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","X-Requested-With");
    next();
  },

  checkAdminPassword: function(req, res, next) {
    var userPassword = req.body.adminpassword || req.query.adminpassword;
    if (!userPassword) {
      return sendJson(res, 'error', 'Missing admin password field');
    }
    if (userPassword !== process.env.PHONE_DONATION_ADMIN_PASSWORD) {
      return sendJson(res, 'error', 'Wrong password.');
    }
    else {
      next();
    }
  }

};

function sendJson(res, type, msg) {
  res.status(type == 'success'? 200 : 403).json({
    status: type,
    message: msg
  })
}