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

CONFIG.admin = {};
CONFIG.admin.identifiant = process.env.ADMIN_ID;
CONFIG.admin.pwd = process.env.ADMIN_PWD;

/** key = 32 caractères ! */
CONFIG.crypto = {};
CONFIG.crypto.key = process.env.CRYPTO_KEY;

CONFIG.colors = {};
CONFIG.colors.white = process.env.COLORS_WHITE;
CONFIG.colors.black = process.env.COLORS_BLACK;
CONFIG.colors.danger = process.env.COLORS_DANGER;
CONFIG.colors.success = process.env.COLORS_SUCCESS;
CONFIG.colors.orange = process.env.COLORS_ORANGE;
CONFIG.colors.blue = process.env.COLORS_BLUE;
CONFIG.colors.purple = process.env.COLORS_PURPLE;
CONFIG.colors.one = process.env.COLORS_ONE;
CONFIG.colors.two = process.env.COLORS_TWO;
CONFIG.colors.three = process.env.COLORS_THREE;
CONFIG.colors.four = process.env.COLORS_FOUR;

export { CONFIG }