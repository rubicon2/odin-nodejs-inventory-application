import * as db from '../db/queries.mjs';
import fs from 'node:fs/promises';

async function getManufacturers(req, res) {
  const manufacturers = await db.getAllManufacturers();
  res.render('manufacturers/manufacturerList', {
    title: 'Manufacturers',
    manufacturers,
  });
}

async function getManufacturer(req, res) {
  const manufacturer = await db.getManufacturer(req.params.id);
  res.render('manufacturers/manufacturer', {
    title: 'A singular manufacturer',
    manufacturer,
  });
}

function getNewManufacturerForm(req, res) {
  res.render('manufacturers/newManufacturer', { title: 'New manufacturer' });
}

async function postNewManufacturerForm(req, res) {
  const { name, description } = req.body;
  const img_url = req.file.path;
  const { id } = await db.addManufacturer({
    name,
    description,
    img_url,
  });
  res.status(303).redirect(`/manufacturer/${id}`);
}

async function getEditManufacturerForm(req, res) {
  const [manufacturer, manufacturers] = await Promise.all([
    db.getManufacturer(req.params.id),
    db.getAllManufacturers(),
  ]);
  res.render(`manufacturers/editManufacturer`, {
    title: 'Edit manufacturer',
    manufacturer,
    manufacturers,
  });
}

async function postEditManufacturerForm(req, res) {
  const id = req.params.id;

  let img_url = '';
  let { img_url: previous_img_url } = await db.getManufacturer(id);
  if (req.file) {
    img_url = req.file.path;
    // Delete previous logo file if there is a new file to upload.
    fs.unlink(previous_img_url).catch((error) => console.error(error));
  } else {
    // If no new file in req, just re-use old one.
    img_url = previous_img_url;
  }

  // Update with the new details.
  const { name, description } = req.body;
  await db.updateManufacturer(id, { id, name, description, img_url });
  res.status(303).redirect(`/manufacturer/${id}`);
}

export {
  getManufacturers,
  getManufacturer,
  getNewManufacturerForm,
  postNewManufacturerForm,
  getEditManufacturerForm,
  postEditManufacturerForm,
};
