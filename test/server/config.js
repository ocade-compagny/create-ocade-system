import dotenv from 'dotenv';
dotenv.config()

const CONFIG = {};

CONFIG.env = process.env.ENV;

CONFIG.app = {};
CONFIG.app.name = process.env.APP_NAME;


CONFIG.api = {};
CONFIG.api.port = process.env.SERVER_PORT;
CONFIG.api.url = process.env.SERVER_URL;

CONFIG.application = {};
CONFIG.application.port = process.env.REACT_PORT;
CONFIG.application.url = process.env.REACT_URL;

CONFIG.bdd = {};
CONFIG.bdd.user = process.env.MYSQL_USER;
CONFIG.bdd.pwd = process.env.MYSQL_PASSWORD;
CONFIG.bdd.host = process.env.MYSQL_HOST_IP;
CONFIG.bdd.port = process.env.MYSQL_PORT;
CONFIG.bdd.name = process.env.MYSQL_DATABASE;
CONFIG.bdd.debug = process.env.MYSQL_DEBUG;
CONFIG.bdd.stringifyObjects = process.env.MYSQL_STRINGIFY_OBJECTS;

/** key = 32 caractères ! */
CONFIG.crypto = {};
CONFIG.crypto.key = process.env.CRYPTO_KEY;

export { CONFIG }