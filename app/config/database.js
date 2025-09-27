const config = require('./postgres.js');

module.exports = {
  production: {
    username: config.user,
    password: config.password,
    database: config.database,
    host: config.host,
    port: config.port,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
