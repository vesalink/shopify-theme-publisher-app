import session from 'express-session';
import sequelizeConfig from './sequelize_config.json';

import { ENV } from '../config';

const MySQLStore = require('express-mysql-session')(session);

const config = sequelizeConfig[ENV];
const { host, database, username, password } = config;

const options = {
  host: config.use_env_variables ? process.env.DB_HOST : host,
  port: config.use_env_variables ? process.env.DB_PORT : 3309,
  user: config.use_env_variables ? process.env.DB_USER : username,
  password: config.use_env_variables ? process.env.DB_PASSWORD : password,
  database: config.use_env_variables ? process.env.DB_DATABASE : database
};

const store = new MySQLStore(options);

store.on('connect', () => {
  console.log(`===> 😊  Connected to Mysql Server for Session storage ${database}. . .`);
});

export default store;
