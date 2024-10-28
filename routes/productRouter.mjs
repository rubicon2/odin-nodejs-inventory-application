import { Router } from 'express';
import * as productController from '../controllers/productController.mjs';

const appRouter = Router();

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

appRouter.post('/new', productController.postNewProductForm);
appRouter.post('/:id/edit', productController.postEditProductForm);
appRouter.post('/:id/review/new', productController.postNewProductReviewForm);
appRouter.post(
  '/:id/review/:review_id/edit',
  productController.postEditProductReviewForm,
);

export default appRouter;
