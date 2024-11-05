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
  const { id } = await db.addCategory({
    name,
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
  const { name } = req.body;
  await db.updateCategory(id, {
    id,
    name,
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
