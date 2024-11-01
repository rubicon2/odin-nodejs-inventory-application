import fs from 'node:fs/promises';
import * as db from '../db/queries.mjs';

function getProducts(req, res) {
  // Get products from db
  const products = db.getAllProducts();
  res.render('products/productList', { title: 'Products', products });
}

function getProduct(req, res) {
  // Get product from db with id from params
  const product = db.getProduct(req.params.id);
  const categories = db.getAllCategoriesForProduct(req.params.id);
  const images = db.getAllImagesForProduct(req.params.id);
  res.render('products/product', {
    title: 'A singular product',
    product,
    categories,
    images,
  });
}

function getNewProductForm(req, res) {
  // Get list of manufacturers from database to populate dropdown list in form.
  const manufacturers = db.getAllManufacturers();
  const categories = db.getAllCategories();
  res.render('products/newProduct', {
    title: 'New product',
    manufacturers,
    categories,
  });
}

function postNewProductForm(req, res) {
  const {
    name,
    manufacturer_id,
    price,
    description,
    available,
    img,
    category_ids,
  } = req.body;
  // Add to database.
  const { id } = db.addProduct({
    name,
    manufacturer_id,
    price,
    description,
    available,
    img,
  });
  const img_files = req.files;
  db.addProductImages(id, img_files);
  db.addCategoriesForProduct(id, category_ids);
  res.status(303).redirect(`/product/${id}`);
}

function getEditProductForm(req, res) {
  const product = db.getProduct(req.params.id);
  // Get list of manufacturers from database to populate dropdown list in form.
  const manufacturers = db.getAllManufacturers();
  const categories = db.getAllCategories();
  const selectedCategoryIds = db
    .getAllCategoriesForProduct(req.params.id)
    .map((category) => category.id);
  const images = db.getAllImagesForProduct(req.params.id);
  res.render(`products/editProduct`, {
    title: 'Edit product',
    product,
    manufacturers,
    images,
    categories,
    selectedCategoryIds,
  });
}

function postEditProductForm(req, res) {
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
  db.updateProduct(id, {
    id,
    name,
    manufacturer_id: parseInt(manufacturer_id),
    price: parseFloat(price),
    description,
    available: available === 'on' ? true : false,
    img,
  });
  db.updateCategoriesForProduct(id, category_ids);
  const img_files = req.files;
  db.addProductImages(id, img_files);
  res.status(303).redirect(`/product/${id}`);
}

function deleteProduct(req, res) {
  db.deleteProduct(req.params.id);
  res.status(303).redirect('/product');
}

function postNewProductImageForm(req, res) {
  const { id } = req.params;
  const { alt_text } = req.body;
  const { path: img_url } = req.file;
  db.addProductImage(id, img_url, alt_text);
  res.status(303).redirect(`/product/${id}`);
}

function deleteProductImage(req, res) {
  const { id, image_id } = req.params;
  // Delete the file.
  const { img_url } = db.getProductImage(image_id);
  fs.unlink(img_url).catch((error) => console.error(error));
  // Remove the database entry that links to that file.
  db.deleteProductImage(image_id);
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
