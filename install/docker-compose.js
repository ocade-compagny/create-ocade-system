export const dockerCompose = () => `
# Version Dockerfile
version: "3.4"

# Variables d'environnement à injecter dans certains container. Il permettent d'être utilisées dans le contener
x-common-variables: &common-variables
  # User base de données mysql
  MYSQL_USER: $MYSQL_USER
  # Mot de passe base de données mysql
  MYSQL_PASSWORD: $MYSQL_PASSWORD
  # Nom de la base de données mysql
  MYSQL_DATABASE: $MYSQL_DATABASE
  # Port de la base de données mysql
  MYSQL_PORT: $MYSQL_PORT
  # Utilisateur de la base de données
  # Debug de la base de données activé/désactivé
  MYSQL_DEBUG : $MYSQL_DEBUG
  # Activation de la fonction de stringification des données de la base de données
  MYSQL_STRINGIFY_OBJECTS: $MYSQL_STRINGIFY_OBJECTS

  # Environnement 
  ENV: $ENV
  # Nom de l'application
  APP_NAME: $APP_NAME
  # Slug de l'application
  APP_NAME_SLUG: "$APP_NAME_SLUG"
  # Port de l'application React
  REACT_PORT: $REACT_PORT
  # Url de l'application React
  REACT_URL: $REACT_URL
  # Port du server express
  SERVER_PORT: $SERVER_PORT
  # Url du server express
  SERVER_URL: SERVER_URL

  # Cypto
  CRYPTO_KEY: $CRYPTO_KEY

# Les différents services
services:
  # Mysql
  mysql-db:
    # Image de la base de données utilisé
    image: mysql:5.7
    # Nom du container
    container_name: $APP_NAME_SLUG-mysql
    # Variables d'environnement importé dans le contener
    environment:
      # Importation des variables d'environnement définit au début du fichier
      <<: *common-variables
      # Variables d'environnement spécifique au container
      MYSQL_HOST: localhost
      MYSQL_ROOT_PASSWORD: root
    ports:
      # Port Local: Port container permet d'ouvrir le port du contener et le diriger vers le port local
      - $MYSQL_PORT:$MYSQL_PORT
    # Redémarrage automaitque si erreur
    restart: on-failure
    # Volumes permet de partage des données entre le contener et le système hôte
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql

  # PHP My Admin
  phpmyadmin:
    # PHP My Admin doit attendre que Mysql soit démarré avant de se lancé, il dépend du service mysql-db
    depends_on:
      # Service Mysql définit au dessus
      - mysql-db
    # Image de PHP My Admin
    image: phpmyadmin/phpmyadmin
    # Nom du container
    container_name: $APP_NAME_SLUG-phpadmin
    # Variables d'environnement importé dans le contener
    environment:
      PMA_HOST: mysql-db
    # Lien réseaux entre les container
    links:
      - mysql-db:mysql-db
    # Notre port 8080 on redirige vers le port 80 du contener
    ports:
      - 8080:80
    # Redémarrage automaitque si erreur
    restart: on-failure

  # Serveur Express
  server:
    # Construction de l'image à partir du Dockerfile présent dans le dossier server (copie des dossiers du server express + npm install + npm run start)
    build: ./server
    # Nom du container
    container_name: $APP_NAME_SLUG-server
    # Redémarrage automaitque si erreur
    restart: on-failure
    # Connexion vers l'extérieur grâce à la connexion de la machine host (l'ordinateur local)
    # network_mode: "host"
    # Express à besoin de communiquer avec la BDD pour fonctionner, il dépend du service mysql-db
    depends_on:
      - mysql-db
    # Variables d'environnement importé dans le contener
    environment:
      <<: *common-variables
      # Variables d'environnement spécifique au contener
      $MYSQL_HOST_IP: mysql-db
    ports:
      # Redirection du port 8000 du système hôte vers le port 8000 du contener
      - $SERVER_PORT:$SERVER_PORT
    volumes:
      # On met tout le dossier local (ensemble de tout le projet dans /app)
      # Le fait de tout mettre va permettre d'une part de créer un lien entre le dossier local et le dossier dans le contener et d'autre part, on va utiliser le même volumes pour l'application React pour que le server puisse aller communiquer avec les fichier de l'application React. Sinon, il ne les connait pas.
      - .:/app
    links:
      # Lien entre le container server et le container mysql-db
      - mysql-db
    # Permet de démarrer le server express lors du lancement du container
    command: npm start

  # Application React
  react:
    # Construction de l'image à partir du Dockerfile présent dans le dossier client (copie des dossiers du client react + npm install + npm run start)
    build: ./application
    # Nom du container
    container_name: $APP_NAME_SLUG-application
    # Variables d'environnement importé dans le contener
    environment:
      <<: *common-variables
      NODE_PATH: src
    ports:
      # Redirection du port 3000 du système hôte vers le port 3000 du contener
      - $REACT_PORT:$REACT_PORT
    volumes:
      # On met tout le dossier local (ensemble de tout le projet dans /app)
      - .:/app
    links:
      # Lien entre le container react et le server (application react va fetcher le server, elle doit pouvoir avoir accès à son url d'exposition)
      - server
    # Permet de démarrer l'application React lors du lancement du contener
    command: npm start

  # Compilateur scss
  sass:
    depends_on:
      - server
    build: 
      context: ./application
      dockerfile: Dockerfile-Sass
    # Nom du container
    container_name: $APP_NAME_SLUG-sass
    restart: unless-stopped
    volumes:
      # On met tout le dossier local (ensemble de tout le projet dans /app)
      - .:/app
    # Permet de démarrer l'application React lors du lancement du contener
    command: npm run build-scss && npm run scss
  `;