exports.defineModel = function(sequelize, DataTypes) {
  return sequelize.define(
    "Source", {
      device_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
        }
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isFloat: true,
          min: -90,
          max: 90
        }
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isFloat: true,
          min: -180,
          max: 180
        }
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
        }
      }
    },{
      // column naming customization
    });
};