import { Router } from 'express';
import multer from 'multer';
import * as productImageController from '../controllers/productImageController.mjs';

const appRouter = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/product-images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = file.mimetype.slice(-3);
    const fileName = file.fieldname + '-' + uniqueSuffix + '.' + fileExtension;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

appRouter.get('/', productImageController.getProductImages);
appRouter.get('/new', productImageController.getNewProductImageForm);
appRouter.get('/:id', productImageController.getProductImage);

appRouter.post(
  '/new',
  upload.single('img'),
  productImageController.postNewProductImageForm,
);
appRouter.post('/:id/delete', productImageController.deleteProductImage);

export default appRouter;
