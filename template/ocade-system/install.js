const fs = require("fs");
const {execSync} = require("child_process");
/** Exécute une commande bash
 * ```
 * cmd: (string) Commande à exécuter
 * ```
 */
const exec = options => {
  const {
    cmd,
    cwd
  } = options;
  execSync(cmd, {cwd: cwd ? cwd : "./", stdio: "inherit"});
};

const readline = require("readline");
const { CONNREFUSED } = require("dns");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const dirname = () => process.cwd();
const appFolder = dirname() + "/application";
const envFile = dirname() + "/.env";

/** Pose une question et récupère la réponse de l'utilisateur
 * ```
 * text: (string) La question
 * fallback: (function) Fonction de rappel
 * ```
 */
const question = (text, fallback = "") => {
  return new Promise((resolve) => {
    text = "◼ " + text;
    text = (fallback.length) ? text + " (" + fallback + ")" : text;
    text += "\n    ▸ ";
    rl.question(text, (answer) => {
      setTimeout(() => {
        if (answer.length) {
          resolve(answer);
        } else {
          resolve(fallback);
        }
      }, 300);
    });
  });
};

/** Rechercher et remplacer dans un fichier
 * ```
 * file: (string) Path du fichier
 * search: (string) Pattern à rechercher
 * replace: (string) Chaîne de remplacement
 * ```
 */
const replace = (file, search, replace) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) reject(err);
      if (typeof data !== "undefined") {
        const result = data.replace(search, replace);
        fs.writeFile(file, result, 'utf8', err => err ? console.log(err) : resolve());
      }
    });
  })
}


/** Saut de ligne */
const br = () => console.log("\n");

/** Stylise la sortie d'information dans le terminal */
const information = (info, level = "") => {
  if (level === "") return console.log(`⚙️  ${info}...`)
  if (level === "success") return console.log(`✅  ${info} !`);
  if (level === "danger") return console.log(`⛔  ${info} !`);
  if (level === "info") return console.log(`💡  ${info} !`);
  if (level === "fire") return console.log(`❤️‍🔥  ${info}`);
};

const slugify = (str) => {
  str = str.replace(/^\s+|\s+$/g, '');
  // Make the string lowercase
  str = str.toLowerCase();
  // Remove accents, swap ñ for n, etc
  let from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
  let to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
  for (let i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }
  // Remove invalid chars
  str = str.replace(/[^a-z0-9 -]/g, '') 
  // Collapse whitespace and replace by -
  .replace(/\s+/g, '-') 
  // Collapse dashes
  .replace(/-+/g, '-'); 
  return str;
}


/** AUTOMATIQUE SCRIPT */
(async () => {
  /** Welcome */
  br()
  information(`Bienvenue dans l'univers Ocade System ! \n
    Vous êtes à l'aube d'une nouvelle ère... Nous avons besoin d'informations pour initialiser votre projet !`, "fire");
  br();

  /** ----- Initialisation de l'application -------- */
  information("Début de l'initialisation de l'application", "info");

  /** Récupération des informations du l'utilisateur */
  projectName = await question("Nom du projet ?");
  // serverPort = await question("Port d'écoute du server Node Js ? (8000) ");
  // serverPort = serverPort === "" ? 8000 : parseInt(serverPort);
  bddUser = await question("User BDD ?");
  bddPwd = await question("Password BDD ?");
  // bddHost = await question("Host BDD ? (127.0.0.1)");
  // bddHost = (bddHost.length) ? bddHost : "127.0.0.1";
  // bddPort = await question("Port BDD ? (3306)");
  // bddPort = (bddPort.length) ? bddPort : "3306";
  bddName = await question("BDD name ?");
  adminIdentifiant = await question("Identifiant du compte administrateur du site ?");
  adminPwd = await question("Password du compte administrateur du site ?");


  /** Actualisation du nom du projet */
  information("Actualisation du nom du projet");
  regexp = new RegExp(`---projectName---`, "g");
  regexp2 = new RegExp(`---projectNameSlug---`, "g");
  await replace(`${appFolder}/package.json`, regexp, slugify(projectName));
  await replace(`${appFolder}/public/index.html`, regexp, projectName);
  await replace(envFile, regexp, projectName);
  await replace(envFile, regexp2, slugify(projectName));
  information("Terminé", "success");
  console.log("\n")

  /** Actualisation de l'environnement */
  information("Actualisation de l'environnement en développement");
  regexp = new RegExp(`---dev---`, "g");
  await replace(envFile, regexp, "dev");
  information("Terminé", "success");
  console.log("\n")

  /** Actualisation du port du server */
  // information("Actualisation du port d'écoute du server Node Js");
  // regexp = new RegExp(`---server-port---`, "g");
  // await replace(envFile, regexp, serverPort);
  // information("Terminé", "success");
  // console.log("\n")

  /** Actualisation utilisateur mysql */
  information("Actualisation de l'utilisateur de la BDD");
  regexp = new RegExp(`---bdd-user---`, "g");
  await replace(envFile, regexp, bddUser);
  information("Terminé", "success");
  console.log("\n")

  /** Actualisation mot de passe mysql */
  information("Actualisation du mot de passe de la BDD");
  regexp = new RegExp(`---bdd-pwd---`, "g");
  await replace(envFile, regexp, bddPwd);
  information("Terminé", "success");
  console.log("\n")

  /** Actualisation de l'host mysql */
  // information("Actualisation de l'host de la BDD");
  // regexp = new RegExp(`---bdd-host---`, "g");
  // await replace(envFile, regexp, bddHost);
  // information("Terminé", "success");
  // console.log("\n")

  /** Actualisation du port mysql */
  // information("Actualisation du port de la BDD");
  // regexp = new RegExp(`---bdd-port---`, "g");
  // await replace(envFile, regexp, bddPort);
  // information("Terminé", "success");
  // console.log("\n")

  /** Actualisation du nom de la BDD */
  information("Actualisation du nom de la BDD");
  regexp = new RegExp(`---bdd-name---`, "g");
  await replace(envFile, regexp, bddName);
  information("Terminé", "success");
  console.log("\n")

  /** Actualisation de l'identifiant de l'administrateur */
  information("Actualisation de l'identifiant de l'administrateur");
  regexp = new RegExp(`---admin-identifiant---`, "g");
  await replace(envFile, regexp, adminIdentifiant);
  information("Terminé", "success");
  console.log("\n")

  /** Actualisation du mot de passe de l'administrateur */
  information("Actualisation du mot de passe de l'administrateur");
  regexp = new RegExp(`---admin-pwd---`, "g");
  await replace(envFile, regexp, adminPwd);
  information("Terminé", "success");
  console.log("\n")

  /** Npm Cache Clear */
  information("Npm Cache Clear")
  exec({
    cmd: "sudo npm cache clear --force",
    cwd: `${dirname()}`
  });

  /** Install Global npm-check-updates */
  information("Installation globale de npm-check-updates")
  exec({
    cmd: "sudo npm install -g npm-check-updates",
    cwd: `${dirname()}`
  });

  /** Npm install */
  information("Upgrade package.json et installation des dépendances Javascript de l'application")
  exec({
    cmd: "ncu -u && npm install",
    cwd: `${dirname()}/application`
  });

  /** ----- Initialisation du server Node js -------- */
  /** Npm install */
  information("Upgrade package.json et installation des dépendances Javascript du server")
  exec({
    cmd: "ncu -u && npm install",
    cwd: `${dirname()}/server`
  }); 

  /** Run Docker */
  information("Lancement Docker (react, express, mysql, phpmyadmin)")
  exec({
    cmd: "docker-compose up -d --remove-orphans",
    cwd: `${dirname()}`
  }); 

//   /** Explication PM2 */
//   console.log(" -------------------------------------------------")
//   console.log(`| 💻 Server Node JS                               |
// |                                                 |
// | ❤️‍🔥 Démarrer: npm run pm2-start                 |
// | ❤️‍🔥 Arrêter: npm run pm2-stop                   |
// | ❤️‍🔥 Lister: npm run pm2-list                    |
// | ❤️‍🔥 Monitorer: npm run pm2-monitor              |
// | ❤️‍🔥 Supprimer: npm run pm2-delete               |
// | ❤️‍🔥 Voir: npm run pm2-show                      |
// |                                                 | 
//                                                   |
// | 💡 En utilisant PM2:                            |
// | ✅ Votre server exposera sur le port ${serverPort}       |
// | ✅ Url Server sera: http://127.0.0.1:${serverPort}       |
// |                                                 |
// | 🫡 Fait en bon usage !                          |
// |                                                 |
//  -------------------------------------------------`)

//  br()
//  console.log(" -------------------------------------------------")
//  console.log(`💡 A vous de jouer ! 

// Terminal 1: 
// Lancer Docker (virtualise l'installation de la BDD)
// $ docker-compose up -d

// Terminal 2: Application
// Si vous voulez PM2:
// $ cd server && npm run pm2-start && npm run pm2-monitor

// Pour dev, optez pour:
// $ node server/index.js

// Terminal 3: Server
// $ cd application && npm run start

// Terminal 4: Mysql
// $ mysql -u'${bddUser}' -h'${bddHost}' -P${bddPort} -p'${bddPwd}'
// `)

  /** End */
  console.log("\n");
  process.exit(0);
})();