import * as db from '../db/queries.mjs';

function getProducts(req, res) {
  // Get products from db
  const products = db.getAllProducts();
  res.render('products/productList', { title: 'Products', products });
}

function getProduct(req, res) {
  // Get product from db with id from params
  const product = db.getProduct(req.params.id);
  res.render('products/product', { title: 'A singular product', product });
}

function getNewProductForm(req, res) {
  // Get list of manufacturers from database to populate dropdown list in form.
  const manufacturers = db.getAllManufacturers();
  res.render('products/newProduct', { title: 'New product', manufacturers });
}

function postNewProductForm(req, res) {
  const { name, manufacturer_id, price, description, available, img } =
    req.body;
  // Add to database.
  db.addProduct({
    name,
    manufacturer_id,
    price,
    description,
    available,
    img,
  });
  res.status(303).redirect('/product');
}

function getEditProductForm(req, res) {
  const product = db.getProduct(req.params.id);
  // Get list of manufacturers from database to populate dropdown list in form.
  const manufacturers = db.getAllManufacturers();
  res.render(`products/editProduct`, {
    title: 'Edit product',
    product,
    manufacturers,
  });
}

function postEditProductForm(req, res) {
  const id = req.params.id;
  const { name, manufacturer_id, price, description, available, img } =
    req.body;
  db.updateProduct(id, {
    id,
    name,
    manufacturer_id: parseInt(manufacturer_id),
    price: parseFloat(price),
    description,
    available: available === 'on' ? true : false,
    img,
  });
  res.status(303).redirect('/product');
}

function deleteProduct(req, res) {
  db.deleteProduct(req.params.id);
  res.status(303).redirect('/product');
}

function getProductReviews(req, res) {}

function getProductReview(req, res) {}

function getNewProductReviewForm(req, res) {}

function postNewProductReviewForm(req, res) {}

function getEditProductReviewForm(req, res) {}

function postEditProductReviewForm(req, res) {}

function deleteProductReview(req, res) {}

export {
  getProducts,
  getProduct,
  getNewProductForm,
  postNewProductForm,
  getEditProductForm,
  postEditProductForm,
  deleteProduct,
  getProductReviews,
  getProductReview,
  getNewProductReviewForm,
  postNewProductReviewForm,
  getEditProductReviewForm,
  postEditProductReviewForm,
  deleteProductReview,
};
