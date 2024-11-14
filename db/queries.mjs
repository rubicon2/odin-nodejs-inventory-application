import pool from './pool.mjs';

async function getAllProducts() {
  const { rows } = await pool.query(`
    SELECT *
    FROM (
      SELECT DISTINCT ON (id)
        p.id AS id,
        p.manufacturer_id,
        p.name AS name,
        p.available,
        p.price,
        p.description,
        pi.img_url,
        pi.alt_text
      FROM products AS p
      LEFT JOIN product_images AS pi ON pi.product_id = p.id
    ) AS result
    ORDER BY result.name;
  `);
  return rows;
}

async function getProduct(id) {
  const { rows } = await pool.query(
    `
    SELECT
      p.id,
      p.manufacturer_id,
      m.id AS manufacturer_id,
      m.name AS manufacturer_name,
      m.img_url AS manufacturer_img_url,
      p.name,
      p.available,
      p.price,
      p.description
    FROM products AS p
    LEFT JOIN manufacturers AS m ON m.id = p.manufacturer_id
    WHERE p.id = $1
    `,
    [id],
  );
  return rows[0];
}

async function addProduct(product) {
  const { name, manufacturer_id, price, description, available } = product;
  const { rows } = await pool.query(
    'INSERT INTO products (manufacturer_id, name, available, price, description) VALUES ($1, $2, $3, $4, $5) RETURNING * ',
    [manufacturer_id, name, available, price, description],
  );
  return rows[0];
}

async function updateProduct(id, updates) {
  const { name, manufacturer_id, price, description, available } = updates;
  await pool.query(
    `UPDATE products
    SET
      name = $1,
      manufacturer_id = $2,
      price = $3,
      description = $4,
      available =  $5
    WHERE id = $6
    `,
    [name, manufacturer_id, price, description, available, id],
  );
}

async function deleteProduct(id) {
  // This should automatically deal with any entries in other tables where this row's id is used as a foreign key
  // due to FOREIGN KEY ON DELETE CASCADE in the schema.
  await pool.query('DELETE FROM products WHERE id = $1', [id]);
}

async function getAllManufacturers() {
  const { rows } = await pool.query(
    'SELECT * FROM manufacturers ORDER BY name',
  );
  return rows;
}

async function getAllProductsForManufacturer(id) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM (
      SELECT DISTINCT ON (id)
        p.id AS id,
        p.manufacturer_id,
        p.name AS name,
        p.available,
        p.price,
        p.description,
        pi.img_url,
        pi.alt_text
      FROM products AS p
      LEFT JOIN product_images AS pi ON pi.product_id = p.id
      WHERE manufacturer_id = $1
    ) AS result
    ORDER BY result.name;
  `,
    [id],
  );
  return rows;
}

async function getManufacturer(id) {
  const { rows } = await pool.query(
    'SELECT * FROM manufacturers WHERE id = $1',
    [id],
  );

  return rows[0];
}

async function addManufacturer(manufacturer) {
  const { name, description, img_url } = manufacturer;
  const { rows } = await pool.query(
    'INSERT INTO manufacturers (name, description, img_url) VALUES ($1, $2, $3) RETURNING *',
    [name, description, img_url],
  );
  return rows[0];
}

async function updateManufacturer(id, updates) {
  const { name, description, img_url } = updates;
  await pool.query(
    `UPDATE manufacturers SET name = $1, description = $2, img_url = $3 WHERE id = $4`,
    [name, description, img_url, id],
  );
}

async function getAllCategories() {
  const { rows } = await pool.query('SELECT * FROM categories ORDER BY name');
  return rows;
}

async function getCategory(id) {
  const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [
    id,
  ]);
  return rows[0];
}

async function addCategory(category) {
  const { name, img_url } = category;
  const { rows } = await pool.query(
    'INSERT INTO categories (name, img_url) VALUES ($1, $2) RETURNING *',
    [name, img_url],
  );
  return rows[0];
}

async function updateCategory(id, updates) {
  const { name, img_url } = updates;
  await pool.query(
    'UPDATE categories SET name = $1, img_url = $2 WHERE id = $3',
    [name, img_url, id],
  );
}

async function deleteCategory(id) {
  // This should automatically delete any entries in the product_categories table,
  // due to FOREIGN KEY ON DELETE CASCADE in the schema.
  await pool.query('DELETE FROM categories WHERE id = $1', [id]);
}

async function getAllProductCategories() {
  const { rows } = await pool.query(
    'SELECT * FROM product_categories ORDER BY name',
  );
  return rows;
}

async function getAllProductToCategoryRowsForProduct(id) {
  const { rows } = await pool.query(
    'SELECT * FROM product_categories WHERE product_id = $1',
    [id],
  );
  return rows;
}

async function getAllCategoriesForProduct(id) {
  const { rows } = await pool.query(
    'SELECT * FROM categories JOIN product_categories ON categories.id = product_categories.category_id WHERE product_categories.product_id = $1 ORDER BY categories.name',
    [id],
  );
  return rows;
}

async function addCategoriesForProduct(product_id, category_ids) {
  // If no category ids are selected, the parameter will be null, and
  // we will want to return an empty array.
  if (!category_ids) return [];
  const added_rows = [];
  for (const category_id of category_ids) {
    const { rows } = await pool.query(
      'INSERT INTO product_categories (product_id, category_id) VALUES ($1, $2)',
      [product_id, category_id],
    );
    added_rows.push(...rows);
  }
  return added_rows;
}

async function updateCategoriesForProduct(product_id, category_ids) {
  // Delete all existing entries that link a category to this product.
  await pool.query('DELETE FROM product_categories WHERE product_id = $1', [
    product_id,
  ]);
  // Add the new ones.
  addCategoriesForProduct(product_id, category_ids);
}

async function getAllProductsInCategory(id) {
  // Why does it need to be distinct on id AND category id?
  // This is because if you only select it to have a DISTINCT id,
  // if there is more than one row with different category_ids, all but one of
  // those will effectively be discarded - and the one left may not
  // necessarily relate to the category we are querying for!
  // So ensure all rows with all categories are returned from the subquery,
  // and filter out with the final WHERE on the resulting set.
  const { rows } = await pool.query(
    `
    SELECT *
    FROM (
      SELECT DISTINCT ON (id, category_id)
        p.id AS id,
        p.manufacturer_id,
        p.name AS name,
        p.available,
        p.price,
        p.description,
        pi.img_url,
        pi.alt_text,
        pc.category_id
      FROM products AS p
      LEFT JOIN product_images AS pi ON pi.product_id = p.id
      LEFT JOIN product_categories AS pc ON p.id = pc.product_id
    ) AS result
    WHERE category_id = $1
    ORDER BY result.name;
  `,
    [id],
  );
  return rows;
}

async function getAllProductImages() {
  const { rows } = await pool.query('SELECT * FROM product_images');
  return rows;
}

async function getProductImage(id) {
  const { rows } = await pool.query(
    'SELECT * FROM product_images WHERE id = $1',
    [id],
  );
  return rows[0];
}

async function getAllImagesForProduct(id) {
  const { rows } = await pool.query(
    'SELECT * FROM product_images WHERE product_id = $1',
    [id],
  );
  return rows;
}

async function addProductImage(product_id, img_url, alt_text) {
  const { rows } = await pool.query(
    'INSERT INTO product_images (product_id, img_url, alt_text) VALUES ($1, $2, $3)',
    [product_id, img_url, alt_text],
  );
  return rows;
}

async function deleteProductImage(id) {
  await pool.query('DELETE FROM product_images WHERE id = $1', [id]);
}

export {
  getAllProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllManufacturers,
  getManufacturer,
  addManufacturer,
  updateManufacturer,
  getAllProductsForManufacturer,
  getAllCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  getAllProductCategories,
  getAllProductToCategoryRowsForProduct,
  getAllCategoriesForProduct,
  addCategoriesForProduct,
  updateCategoriesForProduct,
  getAllProductsInCategory,
  getAllProductImages,
  getProductImage,
  getAllImagesForProduct,
  addProductImage,
  deleteProductImage,
};
