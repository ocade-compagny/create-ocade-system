#!/usr/bin/env node
import { execSync } from "child_process";
import prompts from "prompts";
import { URL } from "url";
import path from "path";
import {writeFileSync} from "fs";


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

const verifyURL = (str) => {
  try { new URL(str) }
  catch (e) { return "L'URL n'est pas valide"; }
  return true;
}

/** Ce script doit:
 * - Demander le nom du projet (package.json) slug
 * ~ Copier le dossier template avec le slug comme nom
 * ~ npm install
 * ~ npm init
 */
const init = async () => {
  console.log("Bienvenue dans l'installateur Ocade System !\n");

  const packageJSON = {
    "name": "",
    "version": "1.0.0",
    "private": true,
    "description": "",
    "author": "Ocade System",
    "keywords": [
      "react", "ocade", "ocade-system"
    ],
    "scripts": {
    },
    "dependencies": {
    },
    "devDependencies": {
    }
  };
  const packages = [
  ];
  const devPackages = [
  ];

  const specifics = {
    title: answer => {
      packageJSON.name = answer.toLowerCase().replace(/ /g, "-");
      packageJSON.description = `Code de l'application web pour ${answer}`;
    }
  };

  const questions = [
    ["title", "Nom du projet", "text"]    
  ];


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

  for (const q of questions) {
    const response = await ask(q);
    if (Object.keys(specifics).includes(q[0])) specifics[q[0]](response);
  }

  console.log("Package Json", packageJSON);
  // Récupération du path où est éxécuter la commande npm init create-ocade-system
  const myPath = process.cwd();
  // Copie du dossier template en remplaçant le nom par le slug du title renseigné.
  execSync(`cp -r ${path.resolve(path.dirname(process.argv[1]), "../@ocade-compagny/create-ocade-system/template")} ${path.resolve(myPath, packageJSON.name)}`);
  // Ecrire la configuration Package Json
  writeFileSync(
    path.resolve(myPath, packageJSON.name, "package.json"), 
    packageJSON,
    {
      encoding: "utf8",
      flag: "w+",
    }
  );
}
init();
