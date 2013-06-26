exports.defineModel = function(sequelize, DataTypes) {
  return sequelize.define(
    "Audio", {
      measured_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: true
        }
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true,
          min: 0
        }
      },
      length: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true,
          min: 0
        }
      }
    },{
      // column naming customization
      instanceMethods: {
        // customized instance methods
      },
      tableName: "AudioMeta"
    });
};