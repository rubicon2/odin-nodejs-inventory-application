import * as db from '../db/queries.mjs';

async function getCategories(req, res) {
  const categories = await db.getAllCategories();
  res.render('categories/categoryList', {
    title: 'Categories',
    categories,
    isLoggedIn: req.session.isLoggedIn,
  });
}

async function getCategory(req, res) {
  const { id } = req.params;
  const [category, products] = await Promise.all([
    db.getCategory(id),
    db.getAllProductsInCategory(id),
  ]);
  res.render('categories/category', {
    title: 'A singular category',
    category,
    products,
    isLoggedIn: req.session.isLoggedIn,
  });
}

async function getNewCategoryForm(req, res, next) {
  try {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) throw new Error('You are not logged in.');

    // Get list of manufacturers from database to populate dropdown list in form.
    const categories = await db.getAllCategories();
    res.render('categories/newCategory', {
      title: 'New category',
      categories,
      isLoggedIn,
    });
  } catch (error) {
    next(error);
  }
}

async function postNewCategoryForm(req, res, next) {
  try {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) throw new Error('You are not logged in.');

    const { name } = req.body;
    const { buffer, mimetype } = req.file;
    const { id } = await db.addCategory({
      name,
      img_data: buffer.toString('base64'),
      img_type: mimetype,
    });
    res.status(303).redirect(`/category/${id}`);
  } catch (error) {
    next(error);
  }
}

async function getEditCategoryForm(req, res, next) {
  try {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) throw new Error('You are not logged in.');

    const category = await db.getCategory(req.params.id);
    res.render(`categories/editCategory`, {
      title: 'Edit category',
      category,
      isLoggedIn,
    });
  } catch (error) {
    next(error);
  }
}

async function postEditCategoryForm(req, res, next) {
  try {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) throw new Error('You are not logged in.');

    const id = req.params.id;

    let buffer = null;
    let mimetype = null;
    let { img_data: previous_img_data, img_type: previous_img_type } =
      await db.getCategory(id);
    if (req.file) {
      // If a file was added in the form, use it.
      buffer = req.file.buffer.toString('base64');
      mimetype = req.file.mimetype;
    } else {
      // If no new file in the form, just re-use old one.
      buffer = previous_img_data;
      mimetype = previous_img_type;
    }

    const { name } = req.body;
    await db.updateCategory(id, {
      id,
      name,
      img_data: buffer,
      img_type: mimetype,
    });
    res.status(303).redirect(`/category/${id}`);
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) throw new Error('You are not logged in.');

    await db.deleteCategory(req.params.id);
    res.status(303).redirect('/category');
  } catch (error) {
    next(error);
  }
}

export {
  getCategories,
  getCategory,
  getNewCategoryForm,
  postNewCategoryForm,
  getEditCategoryForm,
  postEditCategoryForm,
  deleteCategory,
};
