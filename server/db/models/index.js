import Sequelize from 'sequelize';

import { ENV } from '../../config';
import sequelizeConfig from '../sequelize_config.json';
import shopModel from './shop';
import shop_appModel from './shop_app';
import applicationModel from './application';

const config = sequelizeConfig[ENV];

const db = {};

const { database, username, password } = config;

const sequelize = config.use_env_variables ? new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, { dialect: 'mysql', host: process.env.DB_HOST, port: process.env.DB_PORT }) : new Sequelize(database, username, password, config);

db.Shop = sequelize.import('Shop', shopModel);
db.Shop_app = sequelize.import('Shop_app', shop_appModel);
db.Application = sequelize.import('Application', applicationModel);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export { db as Models, sequelize };
