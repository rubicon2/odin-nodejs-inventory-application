import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.mjs';
import multer from 'multer';

const appRouter = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/categories');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = file.mimetype.slice(-3);
    const fileName = file.fieldname + '-' + uniqueSuffix + '.' + fileExtension;
    cb(null, fileName);
  },
});
const upload = multer({ storage });

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
