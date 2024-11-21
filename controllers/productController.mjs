import * as db from '../db/queries.mjs';

async function getProducts(req, res) {
  const products = await db.getAllProducts();
  res.render('products/productList', {
    title: 'Products',
    products,
    isLoggedIn: req.session.isLoggedIn,
  });
}

async function getProduct(req, res) {
  const { id } = req.params;
  const [product, categories, images] = await Promise.all([
    db.getProduct(id),
    db.getAllCategoriesForProduct(id),
    db.getAllImagesForProduct(id),
  ]);
  res.render('products/product', {
    title: 'A singular product',
    product,
    categories,
    images,
    isLoggedIn: req.session.isLoggedIn,
  });
}

async function getNewProductForm(req, res) {
  // Get list of manufacturers from database to populate dropdown list in form.
  const [manufacturers, categories] = await Promise.all([
    db.getAllManufacturers(),
    db.getAllCategories(),
  ]);
  res.render('products/newProduct', {
    title: 'New product',
    manufacturers,
    categories,
    isLoggedIn: req.session.isLoggedIn,
  });
}

async function postNewProductForm(req, res) {
  const { name, manufacturer_id, price, description, available, category_ids } =
    req.body;
  const { id } = await db.addProduct({
    name,
    manufacturer_id,
    price,
    description,
    available,
    isLoggedIn: req.session.isLoggedIn,
  });
  await db.addCategoriesForProduct(id, category_ids);
  res.status(303).redirect(`/product/${id}`);
}

async function getEditProductForm(req, res) {
  const { id } = req.params;
  const [product, productCategories, images, manufacturers, categories] =
    await Promise.all([
      db.getProduct(id),
      db.getAllCategoriesForProduct(id),
      db.getAllImagesForProduct(id),
      db.getAllManufacturers(),
      db.getAllCategories(),
    ]);
  const selectedCategoryIds = productCategories.map(
    (category) => category.category_id,
  );
  res.render(`products/editProduct`, {
    title: 'Edit product',
    product,
    manufacturers,
    images,
    categories,
    selectedCategoryIds,
    isLoggedIn: req.session.isLoggedIn,
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
  await Promise.all([
    db.updateProduct(id, {
      id,
      name,
      manufacturer_id: parseInt(manufacturer_id),
      price: parseFloat(price),
      description,
      available: available === 'on' ? true : false,
      img,
    }),
    db.updateCategoriesForProduct(id, category_ids),
  ]);
  res.status(303).redirect(`/product/${id}`);
}

async function deleteProduct(req, res) {
  await db.deleteProduct(req.params.id);
  res.status(303).redirect('/product');
}

async function postNewProductImageForm(req, res) {
  const { id } = req.params;
  const { alt_text } = req.body;
  const { buffer, mimetype } = req.file;
  await db.addProductImage(id, buffer.toString('base64'), mimetype, alt_text);
  res.status(303).redirect(`/product/${id}`);
}

async function deleteProductImage(req, res) {
  const { id, image_id } = req.params;
  // Remove the database entry that contains the file.
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
