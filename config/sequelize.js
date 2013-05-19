exports.createConnection = function(Sequelize, Env) {
  console.log("Database: "+Env.RDS_HOSTNAME);
  return new Sequelize(
    Env.RDS_DB_NAME,
    Env.RDS_USERNAME,
    Env.RDS_PASSWORD,
    {
      host: Env.RDS_HOSTNAME,
      port: Env.RDS_PORT,
      maxConcurrentQueries: 100,
      dialect: "mysql",
      define: {
        underscored: true,
        charset: "utf8",
        collate: "utf8_general_ci",
        timestamps: true
      },
      pool: {
        maxConnections: 5,
        maxIdleTime: 30
      },
      logging: false
    }
  );
};