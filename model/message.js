exports.defineModel = function(sequelize, DataTypes) {
  return sequelize.define(
    "Message", {
      received_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: true
        }
      },
      origin: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
        }
      },
      body: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
        }
      }
    },{
      // column naming customization
      instanceMethods: {
        // customized instance methods
      }
    });
};