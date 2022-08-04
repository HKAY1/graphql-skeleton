require('dotenv').config();//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.app = process.env.APP || 'dev';
CONFIG.appUrl = process.env.APP_URL;
CONFIG.port = process.env.PORT || '2331';
CONFIG.node_env = process.env.NODE_ENV;

CONFIG.mongoose = {
    uri: process.env.MONGOOSE_URI,
    dbName: process.env.MONGOOSE_DB_NAME
}

CONFIG.jwt_secret = process.env.JWT_SECRET;

module.exports = CONFIG;