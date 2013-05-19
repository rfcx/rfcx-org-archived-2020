exports.createModel = function(sequelize, DataTypes, modelNames) {
  
  var Model = {};
  var Assoc = require(__dirname+"/_assoc.js").getAssoc();

  for (var i = 0; i < modelNames.length; i++) {
    Model[modelNames[i].charAt(0).toUpperCase()+modelNames[i].slice(1)] =
      require(__dirname+"/"+modelNames[i]+".js").defineModel(sequelize, DataTypes);
  }
  
  for (var i in Assoc.hasMany) {
    Model[Assoc.hasMany[i].parent].hasMany(Model[Assoc.hasMany[i].child],{as:Assoc.hasMany[i].as});
  }
  for (var i in Assoc.hasOne) {
    Model[Assoc.hasOne[i].parent].hasOne(Model[Assoc.hasOne[i].child],{as:Assoc.hasOne[i].as});
  }

  var syncChain = new DataTypes.Utils.QueryChainer();
  for (var i in Model) { syncChain.add(Model[i].sync()); }
  syncChain.run()
    .success(function(){ console.log("Model sync success"); })
    .error(function(err){ console.log("Model sync failure -> "+err); });

  return Model;
};