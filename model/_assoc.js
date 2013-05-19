exports.getAssoc = function() {

  var Assoc = { 
    hasOne: [
      { parent: "Diagnostic", child: "Spectrum", as: "Spectrum" },
      { parent: "Spectrum", child: "Diagnostic", as: "Diagnostic" }
    ], 
    hasMany: [
      { parent: "Source", child: "Spectrum", as: "Spectrum" },
      { parent: "Source", child: "Diagnostic", as: "Diagnostic" }
    ]
  };

  return Assoc;
};