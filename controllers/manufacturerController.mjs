import * as db from '../db/queries.mjs';

function getManufacturers(req, res) {
  // Get manufacturers from db
  const manufacturers = db.getAllManufacturers();
  res.render('manufacturers/manufacturerList', {
    title: 'Manufacturers',
    manufacturers,
  });
}

function getManufacturer(req, res) {
  // Get product from db with id from params
  const manufacturer = db.getManufacturer(req.params.id);
  res.render('manufacturers/manufacturer', {
    title: 'A singular manufacturer',
    manufacturer,
  });
}

function getNewManufacturerForm(req, res) {
  res.render('manufacturers/newManufacturer', { title: 'New manufacturer' });
}

function postNewManufacturerForm(req, res) {
  const { name, description } = req.body;
  // Add to database.
  db.addManufacturer({
    name,
    description,
  });
  res.status(303).redirect('/manufacturer');
}

function getEditManufacturerForm(req, res) {
  const manufacturer = db.getManufacturer(req.params.id);
  const manufacturers = db.getAllManufacturers();
  res.render(`manufacturers/editManufacturer`, {
    title: 'Edit manufacturer',
    manufacturer,
    manufacturers,
  });
}

function postEditManufacturerForm(req, res) {
  const id = req.params.id;
  const { name, description } = req.body;
  db.updateManufacturer(id, { id, name, description });
  res.status(303).redirect('/manufacturer');
}

export {
  getManufacturers,
  getManufacturer,
  getNewManufacturerForm,
  postNewManufacturerForm,
  getEditManufacturerForm,
  postEditManufacturerForm,
};
