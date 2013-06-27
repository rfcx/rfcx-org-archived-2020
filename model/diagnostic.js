exports.defineModel = function(sequelize, DataTypes) {
  return sequelize.define(
    "Diagnostic", {
      measured_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        validate: {
          isDate: true
        }
      },
      cpu_percent: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true,
          min: 0,
          max: 100
        }
      },
      cpu_clock: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true,
          min: 0,
          max: 800
        }
      },
      battery_percent: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true,
          min: 0,
          max: 100
        }
      },
      battery_temperature: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true,
          min: -20,
          max: 99
        }
      },
      network_search_time: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true,
          min: 0,
          max: 300000
        }
      },
      internal_luminosity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true,
          min: 0,
          max: 65536
        }
      },
      spectra_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true,
          min: 0,
          max: 256
        }
      },
      blob_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true,
          min: 0
        }
      },
      network_transmit_time: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true,
          min: 0,
          max: 300000
        }
      }
    },{
      // column naming customization
      instanceMethods: {
        // customized instance methods
      }
    });
};