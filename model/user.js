exports.defineModel = function(sequelize, DataTypes) {
  return sequelize.define(
    "User", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
        }
      },
      guid: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
        }
      },
      last_check_in_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: true
        }
      }
    },{
      // column naming customization
      instanceMethods: {
        // customized instance methods
      }
    });
};