import express from 'express';
import 'dotenv/config';

import productRouter from './routes/productRouter.mjs';
import manufacturerRouter from './routes/manufacturerRouter.mjs';
import categoryRouter from './routes/categoryRouter.mjs';

import * as db from './db/queries.mjs';

const PORT = process.env.PORT || 8000;

const app = express();
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

app.use('/product', productRouter);
app.use('/manufacturer', manufacturerRouter);
app.use('/category', categoryRouter);

app.get('/', async (req, res) => {
  const products = await db.getAllProducts();
  res.render('index', {
    title: 'Hello, world!',
    products,
  });
});

// If no prior routes have been matched, show 404.
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - page not found' });
});

// Error handling.
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render('error', { title: 'Error', error });
});

app.listen(PORT, () => console.log('Server listening on port', PORT));
