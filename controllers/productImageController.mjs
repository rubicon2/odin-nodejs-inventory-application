import * as db from '../db/queries.mjs';

async function getProductImages(req, res) {
  const productImages = db.getAllProductImages();
  res.render('productImages/productImageList', {
    title: 'Product images',
    productImages,
  });
}

async function getProductImage(req, res) {
  const productImage = await db.getProductImage(req.params.id);
  res.render('productImages/productImage', {
    title: 'Product image',
    productImage,
  });
}

async function getNewProductImageForm(req, res) {
  const products = await db.getAllProducts();
  res.render('productImages/newProductImage', {
    title: 'New product image',
    products,
  });
}

async function postNewProductImageForm(req, res) {
  const { product_id, alt_text } = req.body;
  const image = req.file;
  await db.addProductImage(product_id, image, alt_text);
  res.status(303).redirect('/product-image');
}

async function deleteProductImage(req, res) {
  await db.deleteProductImage(req.params.id);
  res.status(303).redirect('/product-image');
}

export {
  getProductImages,
  getProductImage,
  getNewProductImageForm,
  postNewProductImageForm,
  deleteProductImage,
};
