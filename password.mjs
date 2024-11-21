import 'dotenv/config';

const valid_password_hash = process.env.PASSWORD_HASH;

console.log(valid_password_hash);

function hashString(str) {
  // Return a hash of the string.
  return str;
}

export default function checkPassword(password) {
  return hashString(password) === valid_password_hash;
}
