import { Router } from 'express';
import * as productController from '../controllers/productController.mjs';
import multer from 'multer';

const appRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

appRouter.get('/', productController.getProducts);
appRouter.get('/new', productController.getNewProductForm);
appRouter.get('/:id', productController.getProduct);
appRouter.get('/:id/edit', productController.getEditProductForm);

appRouter.post('/new', upload.none(), productController.postNewProductForm);
appRouter.post(
  '/:id/edit',
  upload.none(),
  productController.postEditProductForm,
);
appRouter.post('/:id/delete', productController.deleteProduct);

appRouter.post(
  '/:id/image/new',
  upload.single('img'),
  productController.postNewProductImageForm,
);

appRouter.post(
  '/:id/image/:image_id/delete',
  productController.deleteProductImage,
);

export default appRouter;
