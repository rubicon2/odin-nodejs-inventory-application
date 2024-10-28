// This represents the resulting query after mashing up all the info from
// the product and manufacturer tables, for example.
let products = [
  {
    id: 0,
    name: 'Tele',
    available: true,
    price: 99.99,
    description: 'Mega guitar',
    img: '/default.jpg',
    manufacturer_id: 0,
    manufacturer_name: 'Fender',
  },
  {
    id: 1,
    name: 'SG',
    available: true,
    price: 99.99,
    description: 'Mega guitar',
    img: '/default.jpg',
    manufacturer_id: 1,
    manufacturer_name: 'Gibson',
  },
];

let manufacturers = [
  {
    id: 0,
    name: 'Fender',
  },
  {
    id: 1,
    name: 'Gibson',
  },
];

function getProducts(req, res) {
  // Get products from db
  res.render('products/productList', { title: 'Products', products });
}

function getProduct(req, res) {
  // Get product from db with id from params
  const product = products[req.params.id];
  res.render('products/product', { title: 'A singular product', product });
}

function getNewProductForm(req, res) {
  // Get list of manufacturers from database to populate dropdown list in form.
  res.render('products/newProduct', { title: 'New product', manufacturers });
}

function postNewProductForm(req, res) {
  const { name, manufacturer_id, price, description, available, img } =
    req.body;
  // Add to database.
  products.push({
    id: products.length,
    name,
    manufacturer_id,
    price,
    description,
    available,
    img,
  });
  res.status(303).redirect('/product');
}

function getEditProductForm(req, res) {
  const product = products[req.params.id];
  res.render(`products/editProduct`, {
    title: 'Edit product',
    product,
    manufacturers,
  });
}

function postEditProductForm(req, res) {
  const id = req.params.id;
  const { name, manufacturer_id, price, description, available, img } =
    req.body;
  products = products.map((product) => {
    if (product.id == id) {
      return {
        id,
        name,
        manufacturer_id: parseInt(manufacturer_id),
        price: parseFloat(price),
        description,
        available: available === 'on' ? true : false,
        img,
      };
    } else {
      return product;
    }
  });
  res.status(303).redirect('/product');
}

function deleteProduct(req, res) {
  products = products.filter((product) => product.id != req.params.id);
  res.status(303).redirect('/product');
}

function getProductReviews(req, res) {}

function getProductReview(req, res) {}

function getNewProductReviewForm(req, res) {}

function postNewProductReviewForm(req, res) {}

function getEditProductReviewForm(req, res) {}

function postEditProductReviewForm(req, res) {}

function deleteProductReview(req, res) {}

export {
  getProducts,
  getProduct,
  getNewProductForm,
  postNewProductForm,
  getEditProductForm,
  postEditProductForm,
  deleteProduct,
  getProductReviews,
  getProductReview,
  getNewProductReviewForm,
  postNewProductReviewForm,
  getEditProductReviewForm,
  postEditProductReviewForm,
  deleteProductReview,
};
