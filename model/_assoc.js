exports.getAssoc = function() {

  var Assoc = { 
    hasOne: [
    ], 
    hasMany: [
      { parent: "Source", child: "Spectrum", as: "Spectrum" },
      { parent: "Source", child: "Diagnostic", as: "Diagnostic" },
      { parent: "Version", child: "Source", as: "Source" },
      { parent: "Version", child: "Diagnostic", as: "Checkin" },
      { parent: "Diagnostic", child: "Spectrum", as: "Spectra" }
    ]
  };

  return Assoc;
};