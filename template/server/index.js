import { config } from "dotenv";
config({ path: '../.env' });
import express from "express";
import helmet from "helmet";
import mysql2 from "mysql2";


class Server {
  constructor() {
    this.app; /** App Express */
    this.PORT = process.env.SERVER_PORT || 8000; /** Port Express */
    this.connect; /** Connexion à la BDD */
    this.pool; /** Pool de connexion à la BDD, permet de faire des requêtes SQL */
    this.initialisation(); /** Initialisation du server et permet d'utiliser async/await */
  }

  async initialisation () {
    this.initExpress(); /** Initialisation du server Express */
    await this.createConnexionMysql(); /** Création du pool MySQL + Test */
    await this.createBDD(); /** Création de la BDD si existe pas */
    await this.createPoolMysql(); /** Création du pool MySQL + Test */
    this.createRoutes(); /** Initialisation de toutes les routes Express */
    this.listenExpress() /** Ecoute du server Express sur son port */
  }

  /** Initialisation du server Express */
  initExpress() {
    const app = express();
    app.use(helmet());
    app.use(
      express.json({
        limit: "5mb",
        verify: (req, res, buf) => {
          req.rawBody = buf.toString();
        },
      })
    );

    app.on("uncaughtException", (req, res) => {
      res.status(500).end();
    });
    this.app = app
  }

  /** Création de la connexion MySQL */
  createConnexionMysql() {
    return new Promise((resolve, reject) => {
      const connect = mysql2.createConnection({
        host: process.env.MYSQL_HOST_IP,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        port: process.env.MYSQL_PORT,
        debug: process.env.MYSQL_DEBUG === "true",
        stringifyObjects: process.env.MYSQL_STRINGIFY_OBJECTS === "true"
      });
      connect.connect(err => { err ? console.log("Erreur lors de la connexion BDD", err) : resolve("Connexion réussie !"); });
      this.connect = connect;
    })
  }

  /** Création de la BDD si existe pas */
  createBDD() {
    return new Promise((resolve, reject) => {
      this.connect.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`, [], (err, result) => {
        err ? console.log(err) : resolve();
      });
    });
  }

  /** Création du pool MySQL + Test */
  createPoolMysql() {
    return new Promise((resolve, reject) => {
      const pool = mysql2.createPool({
        host: process.env.MYSQL_HOST_IP,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT,
        debug: process.env.MYSQL_DEBUG === "true",
        stringifyObjects: process.env.MYSQL_STRINGIFY_OBJECTS === "true"
      });
      pool.getConnection(function (err, connection) {
        return err
          ? console.log("Erreur", err)
          : console.log(`Connexion à la BDD '${process.env.MYSQL_DATABASE}' réussie !`);
      });
      this.pool = pool;
      resolve();
    });
  }

  /** Initialisation de toutes les routes Express */
  createRoutes() {
    /** Toutes les routes affichent des informaitons */
    this.app.all("/*", function(req, res, next){
      const date = (new Date()).toISOString();
      console.log([date, req.method, req.url, req.headers["user-agent"], req.ip].join("\t"));
      next();
    });

    /** Route de base sert application React */
    if (process.env.ENV === "production") {
      const serverFolder = process.cwd();
      this.app.use(express.static(`${serverFolder}/../application/build`));
      this.app.get('/', function(req, res) {
          res.sendFile(`${serverFolder}/../application/build/index.html`);
      });
    }
  }

  /** Ecoute du server Express */
  listenExpress() {
    this.app.listen(this.PORT);
    console.log("Server started on port "+this.PORT);
  }
}
new Server();