import * as db from '../db/queries.mjs';

async function getManufacturers(req, res) {
  const manufacturers = await db.getAllManufacturers();
  res.render('manufacturers/manufacturerList', {
    title: 'Manufacturers',
    manufacturers,
    isLoggedIn: req.session.isLoggedIn,
  });
}

async function getManufacturer(req, res) {
  const { id } = req.params;
  const [manufacturer, products] = await Promise.all([
    db.getManufacturer(id),
    db.getAllProductsForManufacturer(id),
  ]);
  res.render('manufacturers/manufacturer', {
    title: 'A singular manufacturer',
    manufacturer,
    products,
    isLoggedIn: req.session.isLoggedIn,
  });
}

function getNewManufacturerForm(req, res, next) {
  try {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) throw new Error('You are not logged in.');

    res.render('manufacturers/newManufacturer', { title: 'New manufacturer' });
  } catch (error) {
    next(error);
  }
}

async function postNewManufacturerForm(req, res, next) {
  try {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) throw new Error('You are not logged in.');

    const { name, description } = req.body;

    let buffer = null;
    let mimetype = null;
    if (req.file) {
      buffer = req.file.buffer.toString('base64');
      mimetype = req.file.mimetype;
    }

    const { id } = await db.addManufacturer({
      name,
      description,
      img_data: buffer,
      img_type: mimetype,
    });
    res.status(303).redirect(`/manufacturer/${id}`);
  } catch (error) {
    next(error);
  }
}

async function getEditManufacturerForm(req, res, next) {
  try {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) throw new Error('You are not logged in.');

    const [manufacturer, manufacturers] = await Promise.all([
      db.getManufacturer(req.params.id),
      db.getAllManufacturers(),
    ]);
    res.render(`manufacturers/editManufacturer`, {
      title: 'Edit manufacturer',
      manufacturer,
      manufacturers,
      isLoggedIn,
    });
  } catch (error) {
    next(error);
  }
}

async function postEditManufacturerForm(req, res, next) {
  try {
    const { isLoggedIn } = req.session;
    if (!isLoggedIn) throw new Error('You are not logged in.');

    const id = req.params.id;

    let buffer = null;
    let mimetype = null;
    let { img_data: previous_img_data, img_type: previous_img_type } =
      await db.getManufacturer(id);
    if (req.file) {
      // If a file was added in the form, use it.
      buffer = req.file.buffer.toString('base64');
      mimetype = req.file.mimetype;
    } else {
      // If no new file in the form, just re-use old one.
      buffer = previous_img_data;
      mimetype = previous_img_type;
    }

    // Update with the new details.
    const { name, description } = req.body;
    await db.updateManufacturer(id, {
      id,
      name,
      description,
      img_data: buffer,
      img_type: mimetype,
    });
    res.status(303).redirect(`/manufacturer/${id}`);
  } catch (error) {
    next(error);
  }
}

export {
  getManufacturers,
  getManufacturer,
  getNewManufacturerForm,
  postNewManufacturerForm,
  getEditManufacturerForm,
  postEditManufacturerForm,
};
