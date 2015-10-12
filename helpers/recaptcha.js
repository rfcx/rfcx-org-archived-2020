var request = require('request'),
    ip      = require('../helpers/ip.js');

exports.validate = function(req, res, next) {
  var body     = req.body;
  var clientIp = ip.getIp(req);
  // if request body is not parsed
  if (!body) {
    console.log('Donatephone Post Error: req.body is not defined or empty.');
    return sendJson(res, 'error', 'Internal server error.');
  }

  var recaptchaToken = body['g-recaptcha-response'];
  // if user has not checked recaptcha checkbox
  if (!recaptchaToken || !recaptchaToken.length) {
    return sendJson(res, 'error', 'Recaptcha task is not resolved');
  }

  // if getIp method returned undefined value
  if (!ip) {
    return sendJson(res, 'error', 'Cannot resolve client\'s ip address');
  }

  // Send verify request to Google
  request.post({
    url: 'https://www.google.com/recaptcha/api/siteverify',
    formData: {
      secret: process.env.RECAPTCHA_SECRET_KEY || '',
      response: recaptchaToken,
      remoteip: clientIp
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Donatephone Post Error: Google Recaptcha server error.');
      return sendJson(res, 'error', 'Internal server error.');
    }
    try {
      var parsedBody = JSON.parse(body);
      if (parsedBody.success == true) {
        next();
      }
      else {
        return sendJson(res, 'error', 'Recaptcha is not valid');
      }
    }
    catch(e) {
      console.log('Donatephone Post Error: Error while parsing body from Google Recapthca.');
      return sendJson(res, 'error', 'Internal server error.');
    }
  });
};

function sendJson(res, type, msg) {
  res.status(type == 'success'? 200 : 403).json({
    status: type,
    message: msg
  })
}