import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.mjs';

const appRouter = Router();

appRouter.get('/', categoryController.getCategories);
appRouter.get('/new', categoryController.getNewCategoryForm);
appRouter.get('/:id', categoryController.getCategory);
appRouter.get('/:id/edit', categoryController.getEditCategoryForm);

appRouter.post('/new', categoryController.postNewCategoryForm);
appRouter.post('/:id/edit', categoryController.postEditCategoryForm);
appRouter.post('/:id/delete', categoryController.deleteCategory);

export default appRouter;
