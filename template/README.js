export const README = (answers) => `
# ${answers.APP_NAME}
Cette application à été conçue avec la structure [Ocade System](https://github.com/ocade-compagny/create-ocade-system)

## Ocade System, c'est quoi ce truc ?
Architecture dockerisée permettant de créer une application complexe (front + back + bdd + ...).
[![React](https://img.shields.io/badge/github-blue?style=for-the-badge)](https://github.com/hamzamohdzubair/redant)
[![Node](https://img.shields.io/badge/book-blueviolet?style=for-the-badge)](https://hamzamohdzubair.github.io/redant/)
[![Mysql](https://img.shields.io/badge/API-yellow?style=for-the-badge)](https://docs.rs/crate/redant/latest)
[![Adminer](https://img.shields.io/badge/Crates.io-orange?style=for-the-badge)](https://crates.io/crates/redant)

## Ocade System, comment l'utiliser ?
Avant de lancer la commande d'initialisation vous devez vous assurer d'avoir plusieurs librairies d'installées sur votre ordinateur:
* [Node JS + npm](https://nodejs.org/en/)
* [Docker](https://docs.docker.com/engine/install/)
* Docker doit être démarré (sous linux: \`systemctl start docker\`)
* Lancer la commande d'initialisation:
\`\`\`
npm init @ocade-compagny/ocade-system@latest
\`\`\`
Répondez aux questions posées par le système et l'installation se lancera automatiquement.

## Structure Ocade System
![Schema Ocade Système](./ocade-system.svg)

## Explications, une image c'est bien mais c'est pas clair..!
* Adminer: interface graphque pour gérer la base de données
* Mysql: base de données utilisant le language SQL
* Node JS: serveur web
* Exec Tools: exécution de commandes sur le server (example: curl, wget, ...)
* React: framework javascript pour créer des interfaces graphiques
* Banque de composants: composants (design Ocade System) réutilisables pour créer des interfaces graphiques.
* Docker: dockerisation de toute la structure Ocade System. Exécuter le \`docker-file.yml\` avec la commande \`docker-compose up -d\`

## Le développement sans Docker ?
Vous pouvez développer hors du système Docker. Pour réussir à le faire, vous devez:
* Créer une BDD mysql (ouvert sur le port 3306).
* Avoir une instance PhpMyAdmin ou autre ouvert sur le port 8080 et pointant sur la bdd port 3306 (cette étape est facultative).
* Avoir Node Js et npm d'installé sur la machine.

### Pour commencer à developper:
* Assurez-vous que votre instance MySql est bien démarrée.
* Le fichier \`.env\` contient les données d'identification à la BDD. Renseignez les correctement.
* Déplacez-vous dans le dossier \`server\` et lancez la commande \`npm run start\`.
* Déplacez-vous dans le dossier \`application\` et lancez la commande \`npm run start\`

### Ok et le build de l'application ?
Lorsque votre application est prêt à être déployée:
* Bdd: exportez et importez votre bdd sur votre serveur de déploiement.
* Server Express: rien de particulier à faire. Vous devrez le lancez sur votre server de déploiement avec la même commande \`npm run start\`. Un utilitaire pratique pour gérer vos instances Express sur les serveurs de déploiement est la librarie \`pm2\`.
* React: vous avez seulement à lancer la commande \`npm run build\` dans le dossier application. Un dossier de build sera généré.
* Changer la variable d'environnement du fichier \`.env\`  ENV="development" à  ENV="production"
`;