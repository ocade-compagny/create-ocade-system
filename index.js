#!/usr/bin/env node
import { execSync } from "child_process";
import prompts from "prompts";
import path from "path";
import {writeFileSync} from "fs";
import { dockerCompose } from "./docker-compose.js";
import { README } from "./template/README.js";

/** Class permettant d'installer le system ocade */
class Install {
  constructor () {
    this.myPath = process.cwd(); /** path local où est effectuer le téléchargement */
    this.answers = {}; /** Réponses aux questions posées */
    this.init(); /** Initialisation de la class (permet d'utiliser async/await) */
  }

  async init () {
    console.log("Bienvenue dans l'installateur Ocade System !\n");
    await this.questions(); /** Pose les questions */
    await this.questionsTemplate(); /** Pose les questions du template React */
    this.copieTemplate(); /** Copie le template */
    this.createPointEnv(); /** Création du fichier .env */
    this.createDockerCompose(); /** Création du fichier docker-compose.yml */
    this.createServerPackageJson(); /** Création du fichier package.json du serveur */
    this.installServerDependencies(); /** Installation des dépendances du serveur */
    this.installReactApp(); /** Installation de l'app react */
    this.initDepotGit(); /** Initialisation du dépot git */
    this.installHusky(); /** Installation de husky */
    this.runDockerCompose(); /** Lancement de docker-compose */
    this.runBuildNodeSass(); /** install node-sass avec la bonne version de linux (celle du docker) */
    this.createReadme(); /** Création du fichier README.md */
    this.showFinishInstallation(); /** Affiche la fin de l'installation */
  }

  /** Methodes permettant de poser une questions */
  async ask(q) {
    const response = await prompts({
      type: q[2],
      name: q[0],
      message: q[1],
      validate: (value) => {
        if (q[3]) {
          return q[3](value);
        }
        if (q[2] === "text") {
          return value.trim().length > 0 ? true : q[0]+" ne peut pas être vide"
        }
        return true
      }
    });
    if (q[2] === "text") {
      return response[q[0]].trim().replace(/\/+$/g, "");
    }
    return response[q[0]];
  }

  /** Questions posées et réponse stockées dans this.answers */
  async questions () {
    return new Promise(async (resolve) => {
      const questions = [
        ["APP_NAME", "Nom du projet", "text"],    
        ["ENV", "Environnement production", "toggle"],    
        ["MYSQL_USER", "Mysql user", "text"],
        ["MYSQL_PASSWORD", "Mysql password", "text"],
        ["MYSQL_DATABASE", "Mysql database", "text"],
      ];
      /** ASK Questions */
      for (const q of questions) this.answers[q[0]] = await this.ask(q);
      this.answers["APP_NAME_SLUG"] = this.answers["APP_NAME"].toLowerCase().replace(/ /g, "-");
      resolve();
    });
  }

  /** Questions posées et réponse stockées dans this.answers */
  async questionsTemplate () {
    return new Promise(async (resolve) => {
      const response = await prompts([
        {
          type: 'multiselect',
          name: 'templates',
          message: 'Template React ?',
          choices: [
            { title: 'Native', value: '' },
            { title: 'Redux Toolkit', value: '@ocade-compagny/redux-toolkit' },
          ]
        },
        {
          type: 'toggle',
          name: 'pm2',
          message: 'Utiliser pm2 ? (monitoring server)',
          initial: true
        }
      ]);
      if (response.templates.length > 0  && response.templates[0] !== "") {
        this.answers["TEMPLATE_REACT"] = `npx create-react-app application --template ${response.templates[0]}`;
        console.log(`✅  "${response.templates[0]}" installation choisie  !`);
      } else {
        this.answers["TEMPLATE_REACT"] = "npx create-react-app application";
        console.log(`✅ Native installation choisie  !`);
      }
      console.log("responses !!!", this.answers)
      resolve();
    });
  }

  /** Copie le template */
  copieTemplate() {
    execSync(`cp -r ${ path.resolve(path.dirname(process.argv[1]), "../@ocade-compagny/create-ocade-system/template") } ${ path.resolve(this.myPath, this.answers.APP_NAME_SLUG ) }`);
  }

  /** Génération du fichier .env */
  createPointEnv() {
    const env = `
    APP_NAME=${this.answers.APP_NAME}
    ENV="${this.answers.ENV ? "production" : "development"}"
    MYSQL_USER=${this.answers.MYSQL_USER}
    MYSQL_PASSWORD=${this.answers.MYSQL_PASSWORD}
    MYSQL_DATABASE=${this.answers.MYSQL_DATABASE}
    MYSQL_HOST_IP="localhost"
    MYSQL_PORT=3306
    MYSQL_DEBUG=${this.answers.ENV ? false : true}
    MYSQL_STRINGIFY_OBJECTS="true"
    APP_NAME_SLUG=${this.answers.APP_NAME_SLUG}
    SERVER_PORT=8000
    SERVER_URL="http://localhost:8000"
    REACT_PORT=3000
    REACT_URL="http://localhost:3000"
    `;
    writeFileSync(path.resolve(this.myPath, this.answers.APP_NAME_SLUG, ".env"), env);
  }

  /** Génération du fichier docker-compose.yml */
  createDockerCompose() {
    writeFileSync(path.resolve(this.myPath, this.answers.APP_NAME_SLUG, "docker-compose.yml"), dockerCompose(this.answers));
  }

  /** Génération du fichier package.json du serveur */
  createServerPackageJson() {
    const packageJson = {
      "name": `server-${this.answers.APP_NAME_SLUG}`,
      "type": "module",
      "version": "1.0.0",
      "description": "Server Express",
      "main": "index.js",
      "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        "eslint": "./node_modules/eslint/bin/eslint.js --fix --ext .js,.jsx,.ts,.tsx,.mjs ."
      },
      "keywords": [
        "Express",
        "Node"
      ],
      "author": "Valentin Charrier",
      "license": "ISC",
      "dependencies": {
        "dotenv": "^16.0.2",
        "express": "^4.18.1",
        "helmet": "^6.0.0",
        "mysql2": "^2.3.3",
        "nodemon": "^2.0.20"
      },
      "devDependencies": {
        "eslint": "^8.23.1",
        "eslint-config-airbnb-base": "^15.0.0",
        "eslint-config-prettier": "8.5.0",
        "eslint-plugin-import": "^2.26.0",
        "eslint-plugin-prettier": "^4.2.1",
        "prettier": "2.7.1"
      }
    };

    if (this.answers.pm2) {
      /** Ajouter la commande pm2 à notre serveur */
      packageJson.scripts["pm2-start"] = "pm2 start index.js";
      packageJson.scripts["pm2-list"] = "pm2 list";
      packageJson.scripts["pm2-stop"] = "pm2 stop";
      packageJson.scripts["pm2-restart"] = "pm2 restart";
      packageJson.scripts["pm2-delete"] = "pm2 delete";
      packageJson.scripts["pm2-monit"] = "pm2 monit";
      packageJson.scripts["pm2-jlist"] = "pm2 jlist";
      packageJson.scripts["pm2-logs"] = "pm2 logs";
      packageJson.scripts["pm2-startup"] = "pm2 startup";
      packageJson.scripts["pm2-save"] = "pm2 save";
      packageJson.scripts["pm2-unstartup"] = "pm2 unstartup";
    }

    writeFileSync(path.resolve(this.myPath, this.answers.APP_NAME_SLUG, "server", "package.json"), JSON.stringify(packageJson, null, 2), { encoding: "utf8", flag: "w" });
  }

  /** Installation des dépendances du serveur */
  installServerDependencies() {
    // Installation des dépendances
    console.log(`
    ╭───────────────────────────────────────────╮
    │                                           │
    │                   O S                     │
    │                                           │
    │          INSTALLATION DEPENDANCES         │
    │              SERVER EXPRESS               │
    │                                           │
    │               OCADE SYSTEM                │
    │                                           │
    ╰───────────────────────────────────────────╯
  
    `);
    execSync(`cd ${ path.resolve(this.myPath, this.answers.APP_NAME_SLUG, "server") } && sudo npm i -g npm-check-updates && ncu -u && npm install`, { stdio: "inherit" });
  }

  /** Installation de l'app react */
  installReactApp() {
    console.log(`
    ╭───────────────────────────────────────────╮
    │                                           │
    │                   O S                     │
    │                                           │
    │          INSTALLATION REACT APP           │
    │                                           │
    │                OCADE SYSTEM               │
    │                                           │
    ╰───────────────────────────────────────────╯
  
    `);
    execSync(`cd ${ path.resolve(this.myPath, this.answers.APP_NAME_SLUG) } && ${this.answers["TEMPLATE_REACT"]} && cd application && ncu -u && npm install`, { stdio: "inherit" });

    /** On insère les fichiers Dockerfile et .dockerignore */
    execSync(`cp ${ path.resolve(path.dirname(process.argv[1]), "../@ocade-compagny/create-ocade-system/.dockerignore") } ${ path.resolve(this.myPath, this.answers.APP_NAME_SLUG ) }/application`);

    /** On insère les fichiers Dockerfile et Dockerfile */
    execSync(`cp ${ path.resolve(path.dirname(process.argv[1]), "../@ocade-compagny/create-ocade-system/Dockerfile") } ${ path.resolve(this.myPath, this.answers.APP_NAME_SLUG ) }/application`);
  }

  /** Initialisation du dépôt git */
  initDepotGit() {
    console.log("\n🔥 Initialisation du dépôt git");
    /** Suppression du dossier .git dans /app/application */
    execSync(`rm -rf ${ path.resolve(this.myPath, this.answers.APP_NAME_SLUG, "application", ".git") }`, { stdio: "inherit" });
    execSync(`cd ${ path.resolve(this.myPath, this.answers.APP_NAME_SLUG) } && git init`, { stdio: "inherit" });
    /** créer un fichier .gitignore et écrire node_modules build */
    writeFileSync(path.resolve(this.myPath, this.answers.APP_NAME_SLUG, ".gitignore"), "application/node_modules\napplication/package-lock.json\napplication/build\nserver/node_modules\nserver/package-lock.json");
  }

  /** Installation de Husky (eslint code git commit) */
  installHusky() {
    /** npm init -y à la racine pour install husky */
    execSync(`cd ${ path.resolve(this.myPath, this.answers.APP_NAME_SLUG) } && npm init -y && npx husky-init && npm install husky --save-dev && ncu -u && npm install`, { stdio: "inherit" });

    /** Réécriture du fichier .husky/pre-commit */
    writeFileSync(path.resolve(this.myPath, this.answers.APP_NAME_SLUG, ".husky", "pre-commit"), `#!/bin/sh
    . "$(dirname "$0")/_/husky.sh"
    # cd application && npx lint-staged
    cd application && ./node_modules/eslint/bin/eslint.js --fix --ext .js,.jsx,.ts,.tsx,.mjs .
    cd ../server && ./node_modules/eslint/bin/eslint.js --fix --ext .js,.jsx,.ts,.tsx,.mjs .
    `);
  };

  /** Lancement de docker-compose */
  runDockerCompose() {
    console.log("\n🔥 Lancement de docker-compose\n");
    execSync(`cd ${ path.resolve(this.myPath, this.answers.APP_NAME_SLUG) } && docker-compose up -d --build`, { stdio: "inherit" });
  }

  /** Ouvre un shell dans le container React et run build node-sass */
  runBuildNodeSass() {
    execSync(`docker exec -it ${this.answers.APP_NAME_SLUG}-application sh -c "cd /app/application && npm rebuild node-sass"`, { stdio: "inherit" });

    /** Redémarrer le container  */
    execSync(`docker restart ${this.answers.APP_NAME_SLUG}-application`, { stdio: "inherit" });
  }

  /** Création du fichier README.md */
  createReadme() {
    writeFileSync(path.resolve(this.myPath, this.answers.APP_NAME_SLUG, "README.md"), README(this.answers));
  }

  /** Affiche la fin de l'installation */
  showFinishInstallation() {
    console.log(`
    ╭───────────────────────────────────────────╮
    │                                           │
    │                   O S                     │
    │                                           │
    │       FIN INSTALLATION OCADE SYSTEM       │
    │                                           │
    │                                           │
    ╰───────────────────────────────────────────╯
  
    `);

    console.log(`
    ╭─────────────────────────────────────────────────────────────────────╮
    │                                                                     │
    │                             O S                                     │
    │                                                                     │
    │                      COMMANDES UTILES                               │
    │                                                                     │
    │    $ docker-compose up -d  (Démarrer docker)                        │
    │    $ cd /server && npm run start  (Démarrer server Express)         │
    │    $ cd /server && npm run pm2-start  (Lancer minotor Pm2)          │
    │    [Documentation](https://www.npmjs.com/package/pm2)               │
    │    $ cd /application && npm run start  (Lancer React)               │
    │    $ cd /application && npm run build  (Build React)                │
    │                                                                     │
    ╰─────────────────────────────────────────────────────────────────────╯

    `);

    console.log(`✅ Bdd Url:       http://localhost:8080`);
    console.log(`⚙ Bdd User:       ${this.answers.MYSQL_USER}`);
    console.log(`⚙ Bdd Password:   ${this.answers.MYSQL_PASSWORD}`);
    console.log(`⚙ Bdd Database:   ${this.answers.MYSQL_DATABASE}`);
    console.log(`✅ Url Mysql:     http://localhost:3306`);
    console.log(`✅ Url Server:    http://localhost:8000`);
    console.log(`✅ Url React:     http://localhost:3000`);
  }

}
new Install();
