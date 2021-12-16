/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
// for sequelize-cli use(sequelize-cli can not run ts)
require('dotenv').config();

const {
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_HOST,
  DB_PORT
} = process.env;

module.exports = {
  development: {
      dialect: 'sqlite',
      storage: 'database.sqlite',
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            // because self signed certificate
            rejectUnauthorized: false,
        },
    },
    define: {
        paranoid: false,
        freezeTableName: false,
        charset: 'utf8',
    },
  }
};