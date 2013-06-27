exports.defineModel = function(sequelize, DataTypes) {
  return sequelize.define(
    "Alert", {
      triggered_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: true
        }
      },
      message: {
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