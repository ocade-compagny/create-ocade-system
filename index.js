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

/*
Faire un dépôt "Gatsby-Lib" avec tout : --> remplace components et gatsby-root
  - composants
  - pages
  - templates
  - queries
  - utilitaires :
    - script init/post-install
    - config générale
  - contient un script post install qui ln -s les scripts vers ./lib/scripts

Faire un autre dépôt pour le script d'install --> remplace gatsby-template
  - contient la structure du projet
  - pose des questions pour les composants utilisés, les plugins nécessaires
  - installe tout en mode "dev", c'est à dire que le dépôt est cloné sous ./lib/ et le package.json le considère comme un alias
  - installe toutes les dépendances dans leur dernière version
  - modifie le package.json
  - avertir l'utilisateur qu'il doit paramétrer les polices Google si fonts est true
  - git init

Pour la question du "mode dev" :
* On clone dans un sous-dossier gatsby-lib.
* Ce dossier est dans le gitignore.
* On exécute npm install path/to/gatsby-lib --no-save
-> ça remplace dans node_modules par un symlink MAIS n'altère pas le package.json !


Il faut faire un truc pour que le package.json qui est versionné ne soit pas celui en dev
*/
const init = async () => {
  console.log("Installation  Version 2 !")
}
init();
