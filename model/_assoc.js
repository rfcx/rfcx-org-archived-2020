exports.getAssoc = function() {

  var Assoc = { 
    hasOne: [
    ], 
    hasMany: [
      { parent: "Source", child: "Spectrum", as: "Spectrum" },
      { parent: "Source", child: "Diagnostic", as: "Diagnostic" },
      { parent: "Source", child: "Message", as: "Message" },
      { parent: "Source", child: "Alert", as: "Alert" },
      { parent: "Version", child: "Source", as: "Source" },
      { parent: "Version", child: "Diagnostic", as: "Checkin" },
      { parent: "Diagnostic", child: "Spectrum", as: "Spectrum" },
      { parent: "Diagnostic", child: "Message", as: " Message" }
    ]
  };

  return Assoc;
};