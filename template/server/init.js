import { CONFIG } from "./config.js";
import { Encrypt } from "./crypto.js";

export const Init = async (pool) => {
  return new Promise((resolve, reject) => {
    /** Initialisation table admin  */
    console.log(`Initialisation de table 'admin'...`)
    let query = `CREATE TABLE IF NOT EXISTS \`${CONFIG.bdd.name}\`.\`admin\` (\`id\` INT NOT NULL AUTO_INCREMENT , \`identifiant\` VARCHAR(255) NOT NULL , \`password\` VARCHAR(255) NOT NULL , \`token\` VARCHAR(255) NOT NULL , PRIMARY KEY (\`id\`)) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_general_ci; `;
    pool.query(query, [], (err, results) => {
      if (err) console.log(`${err}`);
      if (results.warningCount === 0) {
        /** Inscription compte utilisateur */
        console.log(`Inscription du compte administrateur...`);
        const idEncrypt = Encrypt(CONFIG.admin.identifiant).replace('"', '\"');
        const pwdEncrypt = Encrypt(CONFIG.admin.pwd).replace('"', '\"');
        query = `INSERT INTO admin (id, identifiant, password, token) VALUES (NULL, '${idEncrypt}', '${pwdEncrypt}', "");`;
        pool.query(query, [], (err, results) => {
          if (err) return console.log(`${err}`);
          if (results.warningCount === 0) {
            console.log(`Inscription du compte administrateur réussie !`);
            console.log(`Suppression de la table "init"`);
            query = `DROP TABLE \`${CONFIG.bdd.name}\`.\`init\`;`;
            pool.query(query, [], (err, results) => {
              if (err) return console.log(`${err}`);
              if (results.warningCount === 0) {
                console.log(`Suppression de la table "init" réussie !`);
              } else {
                console.log(`Suppression de la table "init" à échouée !`);
              }
            });
          } else {
            console.log(`Inscription du compte administrateur échouée !`);
          }
          return resolve();
        })
      } else {
        return resolve();
      }
    });
  });
};