import CONFIG from './config.json';

/** 
 * Fetch Api Server Node
 * ```
 * root ex: /categories/getall/
 * data ex: { id: 10, prenom: "Valentin" }
 * ```
 */
export const Api = async (root, data, jsonResponse=true) => {
  const requete = await fetch(`${CONFIG.api.url}${CONFIG.api.port}${root}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    method: "POST",
    body: JSON.stringify(data)
  });
  const reponse = jsonResponse ? await requete.json() : await requete; 
}