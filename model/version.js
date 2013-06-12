exports.defineModel = function(sequelize, DataTypes) {
  return sequelize.define(
    "Version", {
      version_id: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
        }
      },
      released: {
        type: DataTypes.DATE,
        defaultValue: null,
        validate: {
          isDate: true
        }
      },
      available: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        validate: {
          isBoolean: true
        }
      }
    },{
      // column naming customization
    });
};