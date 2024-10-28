import express from 'express';
import 'dotenv/config';

import productRouter from './routes/productRouter.mjs';
import manufacturerRouter from './routes/manufacturerRouter.mjs';
import categoryRouter from './routes/categoryRouter.mjs';

const PORT = process.env.PORT || 8000;

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use('/product', productRouter);
app.use('/manufacturer', manufacturerRouter);
app.use('/category', categoryRouter);

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Hello, world!',
    products: [
      {
        id: 0,
        name: 'Strat',
        available: true,
        price: 99.99,
        description: 'Mega guitar',
        img: '/default.jpg',
      },
      {
        id: 1,
        name: 'Tele',
        available: true,
        price: 99.99,
        description: 'Mega guitar',
        img: '/default.jpg',
      },
    ],
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
