#!/usr/bin/env node
import { execSync } from "child_process";
import prompts from "prompts";
import path from "path";
import {writeFileSync} from "fs";
import { dockerCompose } from "./docker-compose.js";

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
    this.copieTemplate(); /** Copie le template */
    this.createPointEnv(); /** Création du fichier .env */
    this.createDockerCompose(); /** Création du fichier docker-compose.yml */
    this.createServerPackageJson(); /** Création du fichier package.json du serveur */
    this.installServerDependencies(); /** Installation des dépendances du serveur */
    this.initDepotGit(); /** Initialisation du dépot git */
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

  /** Copie le template */
  copieTemplate() {
    execSync(`cp -r ${path.resolve(path.dirname(process.argv[1]), "../@ocade-compagny/create-ocade-system/template")} ${path.resolve(this.myPath, this.answers.APP_NAME_SLUG )}`);
  }

  /** Génération du fichier .env */
  createPointEnv() {
    const env = `
    APP_NAME=${this.answers.APP_NAME}
    ENV="${this.answers.ENV ? "production" : "development"}"
    MYSQL_USER=${this.answers.MYSQL_USER}
    MYSQL_PASSWORD=${this.answers.MYSQL_PASSWORD}
    MYSQL_DATABASE=${this.answers.MYSQL_DATABASE}
    MYSQL_HOST_IP="127.0.0.1"
    MYSQL_PORT="3306"
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
        "dev": "nodemon index.js"
      },
      "keywords": ["Express", "Node"],
      "author": "Valentin Charrier",
      "license": "ISC",
      "dependencies": {
        "dotenv": "^8.2.0",
        "express": "^4.17.1",
        "mysql2": "^2.1.0",
        "nodemon": "^2.0.4",
        "helmet": "^6.0.0",
      }
    };
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
    │                OCADE SYSTEM               │
    │                                           │
    ╰───────────────────────────────────────────╯
  
    `);
    execSync(`cd ${path.resolve(this.myPath, this.answers.APP_NAME_SLUG, "server")} && npm i -g npm-check-updates && ncu -u && npm install`, { stdio: "inherit" });
  }

  /** Initialisation du dépôt git */
  initDepotGit() {
    console.log("🔥 Initialisation du dépôt git");
    execSync(`cd ${path.resolve(this.myPath, this.answers.APP_NAME_SLUG)} && git config --global init.defaultBranch master`, { stdio: "inherit" });
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
  }

}
new Install();