var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_APP_KEY);

module.exports = {
  sendEmail: function(opts) {
    var message = {
      "html": opts.html,
      "subject": opts.subject,
      "from_email": "admin@rfcx.org",
      "from_name": "Rainforest Connection",
      "to": [{
        "email": opts.email,
        "name": opts.name || null
      }],
      "headers": {
        "Reply-To": "contact@rfcx.org"
      },
      "important": opts.important
    };
    var async = false;
    var ip_pool = "Main Pool";
    var date = new Date();
    var send_at = date.toUTCString();
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
      console.log(result);
    }, function (e) {
      // Mandrill returns the error as an object with name and message keys
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
  }
};