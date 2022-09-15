import pool from "../index.js";

export const Query = query => {
  return new Promise((resolve, reject) => {
    pool.query(query, [], (err, results) => {
      if (err) return reject(console.log(`Erreur Query SQL: ${err}`));
      resolve();
    });
  });
};