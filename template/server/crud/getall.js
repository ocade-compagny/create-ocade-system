import pool from "../index.js";

export const GetAll = (table, options) => {
  const { req, res, query } = options;

  return new Promise((resolve, reject) => {
    pool.query(query, [], (err, results) => {
      if (err) return reject(console.log(`${err}`));
      resolve();
    });
  });
};