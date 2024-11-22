import { createHash, randomBytes } from 'node:crypto';
import 'dotenv/config';

import pool from './pool.mjs';

const SESSION_SECRET = process.env.SESSION_SECRET;

function generateSalt() {
  const bytes = randomBytes(32);
  return bytes.toString('hex');
}

function generateHash(str) {
  const hash = createHash('sha256');
  hash.update(str);
  return hash.digest('hex');
}

async function checkUserCredentials(username, password) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE username = $1 LIMIT 1`,
    [username],
  );
  if (rows.length === 0) throw new Error('User does not exist.');

  const { password_salt, password_hash } = rows[0];
  const hash_to_check = generateHash(password + password_salt + SESSION_SECRET);
  return hash_to_check === password_hash;
}

export { generateSalt, generateHash, checkUserCredentials };
