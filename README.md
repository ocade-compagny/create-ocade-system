# Create Ocade System

## Qu'est-ce que c'est Ocade System ?
Architecture suivante:
* `Mysql + Adminer` (Bdd Mysql + une interface visuelle des données (Adminer))
* `Node` server Express qui permet la jonction entre le front et la Bdd. De plus le choix de Node Js à été fait pour pouvoir aussi simplement faire du traitement sur des fichiers, exécuter des actions sur le server, etc lors de la création d'outil par exemple.
* `React` Application front souple permettant.
* `Node Sass` Les composants de l'application React permettent l'utilisation de fichier scss ce qui simplifie la compréhension et la maintenabilité du code.
* `Banque de composant` (à venir) 
* `docker-compose.yml` Fichier d'orchestration de tout ce système sous cloche dans des containers afin de ne pas à avoir besoin d'une architecture complexe sur lors de l'installation.

* Installation du Système Ocade:
```
npm init @ocade-compagny/ocade-system@latest
```
