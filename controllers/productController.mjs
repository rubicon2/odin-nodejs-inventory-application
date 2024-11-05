import fs from 'node:fs/promises';
import * as db from '../db/queries.mjs';

async function getProducts(req, res) {
  // Get products from db
  const products = await db.getAllProducts();
  res.render('products/productList', { title: 'Products', products });
}

async function getProduct(req, res) {
  // Get product from db with id from params
  const product = await db.getProduct(req.params.id);
  const categories = await db.getAllCategoriesForProduct(req.params.id);
  const images = await db.getAllImagesForProduct(req.params.id);
  res.render('products/product', {
    title: 'A singular product',
    product,
    categories,
    images,
  });
}

async function getNewProductForm(req, res) {
  // Get list of manufacturers from database to populate dropdown list in form.
  const manufacturers = await db.getAllManufacturers();
  const categories = await db.getAllCategories();
  res.render('products/newProduct', {
    title: 'New product',
    manufacturers,
    categories,
  });
}

async function postNewProductForm(req, res) {
  const { name, manufacturer_id, price, description, available, category_ids } =
    req.body;
  // Add to database.
  const { id } = await db.addProduct({
    name,
    manufacturer_id,
    price,
    description,
    available,
  });
  await db.addCategoriesForProduct(id, category_ids);
  res.status(303).redirect(`/product/${id}`);
}

async function getEditProductForm(req, res) {
  // Once things are working, find a way to make this not terrible??
  // Or is it not terrible already? Hmmmmmmmm...
  const product = await db.getProduct(req.params.id);
  // Get list of manufacturers from database to populate dropdown list in form.
  const manufacturers = await db.getAllManufacturers();
  const categories = await db.getAllCategories();
  const selectedCategoryIds = await db
    .getAllCategoriesForProduct(req.params.id)
    .map((category) => category.id);
  const images = await db.getAllImagesForProduct(req.params.id);
  res.render(`products/editProduct`, {
    title: 'Edit product',
    product,
    manufacturers,
    images,
    categories,
    selectedCategoryIds,
  });
}

async function postEditProductForm(req, res) {
  const id = req.params.id;
  const {
    name,
    manufacturer_id,
    price,
    description,
    available,
    img,
    category_ids,
  } = req.body;
  await db.updateProduct(id, {
    id,
    name,
    manufacturer_id: parseInt(manufacturer_id),
    price: parseFloat(price),
    description,
    available: available === 'on' ? true : false,
    img,
  });
  await db.updateCategoriesForProduct(id, category_ids);
  res.status(303).redirect(`/product/${id}`);
}

async function deleteProduct(req, res) {
  await db.deleteProduct(req.params.id);
  res.status(303).redirect('/product');
}

async function postNewProductImageForm(req, res) {
  const { id } = req.params;
  const { alt_text } = req.body;
  const { path: img_url } = req.file;
  await db.addProductImage(id, img_url, alt_text);
  res.status(303).redirect(`/product/${id}`);
}

async function deleteProductImage(req, res) {
  const { id, image_id } = req.params;
  // Delete the file.
  const { img_url } = await db.getProductImage(image_id);
  fs.unlink(img_url).catch((error) => console.error(error));
  // Remove the database entry that links to that file.
  await db.deleteProductImage(image_id);
  res.status(303).redirect(`/product/${id}`);
}

export {
  getProducts,
  getProduct,
  getNewProductForm,
  postNewProductForm,
  getEditProductForm,
  postEditProductForm,
  deleteProduct,
  postNewProductImageForm,
  deleteProductImage,
};
