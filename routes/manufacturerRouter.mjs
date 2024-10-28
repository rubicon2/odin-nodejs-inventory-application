import { Router } from 'express';
import * as manufacturerController from '../controllers/manufacturerController.mjs';

const appRouter = Router();

appRouter.get('/', manufacturerController.getManufacturers);
appRouter.get('/new', manufacturerController.getNewManufacturerForm);
appRouter.get('/:id', manufacturerController.getManufacturer);
appRouter.get('/:id/edit', manufacturerController.getEditManufacturerForm);

appRouter.post('/new', manufacturerController.postNewManufacturerForm);
appRouter.post('/:id/edit', manufacturerController.postEditManufacturerForm);

export default appRouter;
