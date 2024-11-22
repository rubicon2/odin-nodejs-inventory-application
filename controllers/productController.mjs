import * as db from '../db/queries.mjs';

async function getProducts(req, res, next) {
  try {
    const products = await db.getAllProducts();
    res.render('products/productList', {
      title: 'Products',
      products,
      isLoggedIn: req.session.isLoggedIn,
    });
  } catch (error) {
    next(error);
  }
}

async function getProduct(req, res, next) {
  try {
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
  } catch (error) {
    next(error);
  }
}

async function getNewProductForm(req, res, next) {
  // All controller stuff that accesses the db should be in try/catch
  // so when the promise gets resolved it will throw the error and express
  // will catch it properly with the in-built error handling.
  try {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) throw new Error('You are not logged in.');

    // Get list of manufacturers from database to populate dropdown list in form.
    const [manufacturers, categories] = await Promise.all([
      db.getAllManufacturers(),
      db.getAllCategories(),
    ]);
    res.render('products/newProduct', {
      title: 'New product',
      manufacturers,
      categories,
      isLoggedIn,
    });
  } catch (error) {
    next(error);
  }
}

async function postNewProductForm(req, res, next) {
  try {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) throw new Error('You are not logged in.');

    const {
      name,
      manufacturer_id,
      price,
      description,
      available,
      category_ids,
    } = req.body;
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
  } catch (error) {
    next(error);
  }
}

async function getEditProductForm(req, res, next) {
  try {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) {
      throw new Error('You are not logged in.');
    }

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
      isLoggedIn,
    });
  } catch (error) {
    next(error);
  }
}

async function postEditProductForm(req, res, next) {
  try {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) throw new Error('You are not logged in.');

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
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) throw new Error('You are not logged in.');

    await db.deleteProduct(req.params.id);
    res.status(303).redirect('/product');
  } catch (error) {
    next(error);
  }
}

async function postNewProductImageForm(req, res, next) {
  try {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) throw new Error('You are not logged in.');

    const { id } = req.params;
    const { alt_text } = req.body;
    const { buffer, mimetype } = req.file;
    await db.addProductImage(id, buffer.toString('base64'), mimetype, alt_text);
    res.status(303).redirect(`/product/${id}`);
  } catch (error) {
    next(error);
  }
}

async function deleteProductImage(req, res, next) {
  try {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) throw new Error('You are not logged in.');

    const { id, image_id } = req.params;
    // Remove the database entry that contains the file.
    await db.deleteProductImage(image_id);
    res.status(303).redirect(`/product/${id}`);
  } catch (error) {
    next(error);
  }
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
