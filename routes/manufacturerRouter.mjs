import { Router } from 'express';
import * as manufacturerController from '../controllers/manufacturerController.mjs';
import multer from 'multer';

const appRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

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
