#! /usr/bin/env node

const { Client } = require('pg');

const SQL = `
  CREATE TABLE IF NOT EXISTS "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
  )
  WITH (OIDS=FALSE);

  ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

  CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR ( 128 ) NOT NULL UNIQUE,
    password_salt VARCHAR ( 64 ) NOT NULL,
    password_hash VARCHAR ( 64 ) NOT NULL
  );

  INSERT INTO users ( username, password_salt, password_hash ) VALUES (
    'lemon',
    '488fd974e96af67e3d41e1b3316712832a7573a0b3d82e263846dd9f274e1065',
    '4b589abb04717dcc27b3294e2b9a95c01704a1a5b77b7e16dd8acd1da1c9e855'
  ) ON CONFLICT DO NOTHING;

  CREATE TABLE IF NOT EXISTS manufacturers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ) NOT NULL UNIQUE,
    description TEXT,
    img_data BYTEA,
    img_type VARCHAR ( 20 )
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    manufacturer_id INTEGER REFERENCES manufacturers ( id ) ON DELETE RESTRICT,
    name VARCHAR ( 255 ) NOT NULL,
    available BOOL NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ) NOT NULL UNIQUE,
    img_data BYTEA NOT NULL,
    img_type VARCHAR ( 20 ) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS product_categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id INTEGER REFERENCES products ( id ) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories ( id ) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS product_categories_p_id_index ON product_categories ( product_id );
  CREATE INDEX IF NOT EXISTS product_categories_c_id_index ON product_categories ( category_id );

  CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id INTEGER REFERENCES products ( id ) ON DELETE CASCADE,
    img_data BYTEA NOT NULL,
    img_type VARCHAR ( 20 ) NOT NULL,
    alt_text VARCHAR ( 255 ) NOT NULL
  );

  CREATE INDEX IF NOT EXISTS product_images_p_id_index ON product_images ( product_id );
`;

async function main() {
  try {
    const connectionString = process.argv[2];
    if (!connectionString) throw new Error('No db uri specified');
    console.log('Initializing database...');
    const client = new Client({ connectionString });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('Done');
  } catch (error) {
    console.error(error);
  }
}

main();
