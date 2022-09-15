export const capitalise = (string="") => string.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

  
/** Dectection d'un double click */
export const dbClick = e => e.detail == 2;

/** Vide un champs si double click */
export const vide = (e, handle, defaut="") => { if (dbClick(e)) { handle(defaut) }};