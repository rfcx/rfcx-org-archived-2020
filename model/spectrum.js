exports.defineModel = function(sequelize, DataTypes) {
  return sequelize.define(
    "Spectrum", {
      measured_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: true
        }
      },
      spectrum: {
        type: DataTypes.TEXT,
        validate: {
        }
      }
    },{
      // column naming customization
      instanceMethods: {
        // customized instance methods
      },
      tableName: "Spectra"
    });
};