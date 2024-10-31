import { Router } from 'express';
import * as productController from '../controllers/productController.mjs';
import multer from 'multer';

const appRouter = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = file.mimetype.slice(-3);
    const fileName = file.fieldname + '-' + uniqueSuffix + '.' + fileExtension;
    cb(null, fileName);
  },
});
const upload = multer({ storage });

appRouter.get('/', productController.getProducts);
appRouter.get('/new', productController.getNewProductForm);
appRouter.get('/:id', productController.getProduct);
appRouter.get('/:id/delete', productController.deleteProduct);
appRouter.get('/:id/edit', productController.getEditProductForm);
appRouter.get('/:id/review', productController.getProductReviews);
appRouter.get('/:id/review/new', productController.getNewProductReviewForm);
appRouter.get('/:id/review/:review_id', productController.getProductReview);
appRouter.get(
  '/:id/review/:review_id/edit',
  productController.getEditProductReviewForm,
);

appRouter.post(
  '/new',
  upload.array('img', 20),
  productController.postNewProductForm,
);
appRouter.post(
  '/:id/edit',
  upload.array('img', 20),
  productController.postEditProductForm,
);

appRouter.post('/:id/review/new', productController.postNewProductReviewForm);
appRouter.post(
  '/:id/review/:review_id/edit',
  productController.postEditProductReviewForm,
);

export default appRouter;
