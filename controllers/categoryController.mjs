import * as db from '../db/queries.mjs';

async function getCategories(req, res) {
  const categories = await db.getAllCategories();
  res.render('categories/categoryList', { title: 'Categories', categories });
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
  });
}

async function getNewCategoryForm(req, res) {
  // Get list of manufacturers from database to populate dropdown list in form.
  const categories = await db.getAllCategories();
  res.render('categories/newCategory', { title: 'New category', categories });
}

async function postNewCategoryForm(req, res) {
  const { name } = req.body;
  const { buffer, mimetype } = req.file;
  const { id } = await db.addCategory({
    name,
    img_data: buffer.toString('base64'),
    img_type: mimetype,
  });
  res.status(303).redirect(`/category/${id}`);
}

async function getEditCategoryForm(req, res) {
  const category = await db.getCategory(req.params.id);
  res.render(`categories/editCategory`, {
    title: 'Edit category',
    category,
  });
}

async function postEditCategoryForm(req, res) {
  const id = req.params.id;

  let img_data = '';
  let img_type = '';
  let { img_data: previous_img_data, img_type: previous_img_type } =
    await db.getCategory(id);
  if (req.file) {
    img_data = req.file.buffer.toString('base64');
    img_type = req.file.mimetype;
  } else {
    // If no new file in req, just re-use old one.
    img_data = previous_img_data;
    img_type = previous_img_type;
  }

  const { name } = req.body;
  await db.updateCategory(id, {
    id,
    name,
    img_data,
    img_type,
  });
  res.status(303).redirect(`/category/${id}`);
}

async function deleteCategory(req, res) {
  await db.deleteCategory(req.params.id);
  res.status(303).redirect('/category');
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
