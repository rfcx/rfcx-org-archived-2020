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
        validate: {
          isInt: true,
          min: 0,
          max: 100
        }
      },
      cpu_clock: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
          min: 0,
          max: 800
        }
      },
      battery_level: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
          min: 0,
          max: 100
        }
      },
      battery_temperature: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
          min: -20,
          max: 99
        }
      },
      network_search_time: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
          min: 0,
          max: 300
        }
      },
      internal_luminosity: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
          min: 0,
          max: 65536
        }
      },
      spectra_count: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
          min: 0,
          max: 256
        }
      }
    },{
      // column naming customization
    });
};