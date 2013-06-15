exports.getAssoc = function() {

  var Assoc = { 
    hasOne: [
      { parent: "Diagnostic", child: "Spectrum", as: "Spectrum" },
      { parent: "Spectrum", child: "Diagnostic", as: "Diagnostic" },
      { parent: "Source", child: "Version", as: "AppVersion" }
    ], 
    hasMany: [
      { parent: "Source", child: "Spectrum", as: "Spectrum" },
      { parent: "Source", child: "Diagnostic", as: "Diagnostic" }
    ]
  };

  return Assoc;
};