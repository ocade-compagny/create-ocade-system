#!/usr/bin/env node
import { execSync } from "child_process";
import prompts from "prompts";
import path from "path";
import {writeFileSync} from "fs";
import {dockerCompose} from "./install/docker-compose.js";


const ask = async (q) => {
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
    return '"'+response[q[0]].trim().replace(/\/+$/g, "")+'"';
  }
  return response[q[0]];
}

const init = async () => {
  console.log("Bienvenue dans l'installateur Ocade System !\n");

  const questions = [
    ["APP_NAME", "Nom du projet", "text"],    
    ["ENV", "Environnement production", "toggle"],    
    ["MYSQL_USER", "Mysql user", "text"],
    ["MYSQL_PASSWORD", "Mysql password", "text"],
    ["MYSQL_DATABASE", "Mysql database", "text"],
  ];
  const answers = {};

  console.log(`

  ╭───────────────────────────────────────────╮
  │                                           │
  │                    O S                    │
  │                                           │
  │         INSTALLATION OCADE/SYSTEM         │
  │             (REACT/NODE/MYSQL)            │
  │                                           │
  ╰───────────────────────────────────────────╯

  `);

  /** ASK Questions */
  for (const q of questions) answers[q[0]] = await ask(q);
  answers["APP_NAME_SLUG"] = answers["APP_NAME"].toLowerCase().replace(/ /g, "-").replaceAll('"', "");

  /** Path du dossier de téléchargement local */
  const myPath = process.cwd();

  /** Copie du dossier template */
  // execSync(`cp -r ${path.resolve(path.dirname(process.argv[1]), "../@ocade-compagny/create-ocade-system/template")} ${path.resolve(myPath, packageJSON.name)}`);
  execSync(`cp -r ${path.resolve(path.dirname(process.argv[1]), "./template")} ${path.resolve(myPath, answers.APP_NAME_SLUG )}`);


  /** Génération du fichier .env */
  const env = `
APP_NAME=${answers.APP_NAME}
ENV=${answers.ENV ? "production" : "development"}
MYSQL_USER=${answers.MYSQL_USER}
MYSQL_PASSWORD=${answers.MYSQL_PASSWORD}
MYSQL_DATABASE=${answers.MYSQL_DATABASE}
MYSQL_HOST_IP="127.0.0.1"
MYSQL_PORT="3306"
MYSQL_DEBUG=${answers.ENV ? false : true}
MYSQL_STRINGIFY_OBJECTS="true"
APP_NAME_SLUG=${answers.APP_NAME_SLUG}
SERVER_PORT=8000
SERVER_URL="http://localhost:8000"
REACT_PORT=3000
REACT_URL="http://localhost:3000"
CRYPTO_KEY="Ph93DKXTT384GJFe?6G3Ft5t4#5DnSCg"
`;
writeFileSync(path.resolve(myPath, answers.APP_NAME_SLUG, ".env"), env);

  /** Génération du fichier docker-compose.yml */
  const dockerComposeYml = dockerCompose(answers);
  writeFileSync(path.resolve(myPath, answers.APP_NAME_SLUG, "docker-compose.yml"), dockerComposeYml);
  
  
}
init();
