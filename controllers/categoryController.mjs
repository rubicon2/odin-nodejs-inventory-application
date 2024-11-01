import * as db from '../db/queries.mjs';

function getCategories(req, res) {
  // Get categories from db
  const categories = db.getAllCategories();
  res.render('categories/categoryList', { title: 'Categories', categories });
}

function getCategory(req, res) {
  // Get category from db with id from params
  const category = db.getCategory(req.params.id);
  const products = db.getAllProductsInCategory(req.params.id);
  res.render('categories/category', {
    title: 'A singular category',
    category,
    products,
  });
}

function getNewCategoryForm(req, res) {
  // Get list of manufacturers from database to populate dropdown list in form.
  const categories = db.getAllCategories();
  res.render('categories/newCategory', { title: 'New category', categories });
}

function postNewCategoryForm(req, res) {
  const { name } = req.body;
  // Add to database.
  const { id } = db.addCategory({
    name,
  });
  res.status(303).redirect(`/category/${id}`);
}

function getEditCategoryForm(req, res) {
  const category = db.getCategory(req.params.id);
  res.render(`categories/editCategory`, {
    title: 'Edit category',
    category,
  });
}

function postEditCategoryForm(req, res) {
  const id = req.params.id;
  const { name } = req.body;
  db.updateCategory(id, {
    id,
    name,
  });
  res.status(303).redirect(`/category/${id}`);
}

function deleteCategory(req, res) {
  db.deleteCategory(req.params.id);
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
