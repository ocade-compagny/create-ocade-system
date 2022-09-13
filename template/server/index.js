import { CONFIG } from "./config.js";
import cors from "cors";
import express from "express";
import mysql from "mysql";
import Routes from "./routes.js";
import { Init } from "./init.js";



/** Creation server Express **/
const app = express();

  /** CORS **/
  /** Gestion des CORS **/
  console.log("Gestion des CORS...");
  app.use(cors());

  /** Permet de récupérer le body des requetes. **/
  app.use(express.json());

  /** Evite les erreurs de cross origin (à changer pour la production pour des raisons de sécurité) **/
  app.use( 
    (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEAD,PATCH, OPTIONS');
      next();
    }
  );

  /** Catch les erreurs */
  app.on("uncaughtException", (req, res) => { res.status(500).end(); });   

const initServer = async () => {
  /** Chargement des routes **/
  console.log("Chargement des routes...");
  Routes(app);

  console.log("Création d'une connexion mysql...");
  const connect = mysql.createConnection({
    host: CONFIG.bdd.host,
    user: CONFIG.bdd.user,
    password: CONFIG.bdd.pwd,
    port: CONFIG.bdd.port,
    debug: CONFIG.bdd.debug === "true",
    stringifyObjects: CONFIG.bdd.stringifyObjects === "true"
  });

  /** Test de la connexion **/
  console.log("Test de la connexion à la base de données...");
  const connectPromise = () => new Promise((resolve, reject) => {
    connect.connect(err => { err ? console.log("Erreur lors de la connexion BDD", err) : resolve("Connexion réussie !"); });
  });
  await connectPromise();

  /** Creation de la BDD si existe pas **/
  console.log("Création de la BDD si existe pas...");
  const createBDDPromise = () => new Promise((resolve, reject) => {
    connect.query(`CREATE DATABASE IF NOT EXISTS \`${CONFIG.bdd.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`, [], (err, result) => {
      err ? console.log(err) : resolve();
    });
  });
  await createBDDPromise()

  /** Création d'un pool mysql (permet d'exécuter nos futures requêtes) **/
  console.log("Création d'un pool mysql (permet d'exécuter nos futures requêtes)...");
  const pool =  mysql.createPool({
    host: CONFIG.bdd.host,
    user: CONFIG.bdd.user,
    password: CONFIG.bdd.pwd,
    database: CONFIG.bdd.name,
    port: CONFIG.bdd.port,
    debug: false,
    stringifyObjects: CONFIG.bdd.stringifyObjects === "true"
  });

  /** Test de la connexion à la BDD **/
  console.log("Test de la connexion à la BDD...");
  pool.getConnection(function (err, connection) {
    return err 
      ? console.log("Erreur", err)
      : console.log(`Connexion à la BDD '${CONFIG.bdd.name}' réussie !`);
  });

  console.log("Initialisation de la BDD...");
  await Init(pool);
  
  /** Service de App React sur root "/" */
  console.log("Service de App React sur root '/'...");
  if(CONFIG.env === "prod") {
    const serverFolder = process.cwd();
    app.use(express.static(`${serverFolder}/../application/build`));
    app.get('/', function(req, res) {
        res.sendFile(`${serverFolder}/../application/build/index.html`);
    });
  }

  /** Server écoute */
  app.listen(CONFIG.api.port, () => {
    console.log(`\nServer Node Express écoute sur le port: ${CONFIG.api.port}\n`);
  });

  return pool;
};

export default initServer();