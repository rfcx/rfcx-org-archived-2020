exports.defineModel = function(sequelize, DataTypes) {
  return sequelize.define(
    "Sound", {
      measured_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: true
        }
      },
      guid: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
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
    });};