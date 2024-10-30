import { Router } from 'express';
import * as manufacturerController from '../controllers/manufacturerController.mjs';
import multer from 'multer';

const appRouter = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/manufacturers');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = file.mimetype.slice(-3);
    const fileName = file.fieldname + '-' + uniqueSuffix + '.' + fileExtension;
    cb(null, fileName);
  },
});
const upload = multer({ storage });

appRouter.get('/', manufacturerController.getManufacturers);
appRouter.get('/new', manufacturerController.getNewManufacturerForm);
appRouter.get('/:id', manufacturerController.getManufacturer);
appRouter.get('/:id/edit', manufacturerController.getEditManufacturerForm);

appRouter.post(
  '/new',
  upload.single('img'),
  manufacturerController.postNewManufacturerForm,
);
appRouter.post(
  '/:id/edit',
  upload.single('img'),
  manufacturerController.postEditManufacturerForm,
);

export default appRouter;
