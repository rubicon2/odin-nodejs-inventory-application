import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import 'dotenv/config';

import accountRouter from './routes/accountRouter.mjs';
import productRouter from './routes/productRouter.mjs';
import manufacturerRouter from './routes/manufacturerRouter.mjs';
import categoryRouter from './routes/categoryRouter.mjs';
import pool from './db/pool.mjs';

const PORT = process.env.PORT || 8000;
const SESSION_SECRET = process.env.SESSION_SECRET;

const app = express();
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

// Set up session for logging in/out.
const pgSimpleStore = new connectPgSimple(session);

app.use(
  session({
    store: new pgSimpleStore({
      pool,
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);

app.use((req, res, next) => {
  if (req.session.isLoggedIn == null) {
    req.session.isLoggedIn = false;
  }
  next();
});

app.use('/account', accountRouter);
app.use('/product', productRouter);
app.use('/manufacturer', manufacturerRouter);
app.use('/category', categoryRouter);

app.get('/', async (req, res) => {
  res.status(303).redirect('/product');
});

// If no prior routes have been matched, show 404.
app.use((req, res) => {
  res
    .status(404)
    .render('404', {
      title: '404 - page not found',
      isLoggedIn: req.session.isLoggedIn,
    });
});

// Error handling.
app.use((error, req, res, next) => {
  console.error(error);
  res
    .status(500)
    .render('error', {
      title: 'Error',
      isLoggedIn: req.session.isLoggedIn,
      error,
    });
});

app.listen(PORT, () => console.log('Server listening on port', PORT));
