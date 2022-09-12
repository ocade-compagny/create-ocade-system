import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config()



const algorithm = 'aes-256-ctr';
// Le longueur de la secretKey doit être de 32 caractères.
const secretKey = process.env.CRYPTO_KEY;
const iv = crypto.randomBytes(16);

const Encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return JSON.stringify({
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  });
};

const Decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
  return decrpyted.toString();
};

export { Encrypt, Decrypt };