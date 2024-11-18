import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.mjs';
import multer from 'multer';

const appRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

appRouter.get('/', categoryController.getCategories);
appRouter.get('/new', categoryController.getNewCategoryForm);
appRouter.get('/:id', categoryController.getCategory);
appRouter.get('/:id/edit', categoryController.getEditCategoryForm);

appRouter.post(
  '/new',
  upload.single('img'),
  categoryController.postNewCategoryForm,
);
appRouter.post(
  '/:id/edit',
  upload.single('img'),
  categoryController.postEditCategoryForm,
);
appRouter.post('/:id/delete', categoryController.deleteCategory);

export default appRouter;
