require('dotenv').config();
const genericConnectionObject = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dialect: 'postgres',
  pool: {
    max: 20,
    min: 5,
  },
  ssl: true,
  dialectOptions: {
    ssl: {
      required: true,
      rejectUnauthorized: false
    },
  },
};

module.exports = genericConnectionObject;
