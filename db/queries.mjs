// This represents the resulting query after mashing up all the info from
// the product and manufacturer tables, for example.
let products = {
  5: {
    id: 5,
    name: 'Tele',
    available: true,
    price: 99.99,
    description: 'Mega guitar',
    img: '/default.jpg',
    manufacturer_id: 0,
    manufacturer_name: 'Fender',
  },
  1: {
    id: 1,
    name: 'SG',
    available: true,
    price: 99.99,
    description: 'Mega guitar',
    img: '/default.jpg',
    manufacturer_id: 1,
    manufacturer_name: 'Gibson',
  },
};

let manufacturers = {
  0: {
    id: 0,
    name: 'Fender',
  },
  1: {
    id: 1,
    name: 'Gibson',
  },
};

function getAllProducts() {
  return Array.from(Object.values(products));
}

function getProduct(id) {
  return products[id];
}

function addProduct(product) {
  const id = getNextId(products);
  products[id] = {
    id,
    ...product,
  };
}

function updateProduct(id, updates) {
  products[id] = {
    ...products[id],
    ...updates,
  };
}

function deleteProduct(id) {
  delete products[id];
}

function getAllManufacturers() {
  return Array.from(Object.values(manufacturers));
}

function getManufacturer(id) {
  return manufacturers[id];
}

function addManufacturer(manufacturer) {
  const id = getNextId(manufacturers);
  manufacturers[id] = {
    id,
    ...manufacturer,
  };
}

function updateManufacturer(id, updates) {
  manufacturers[id] = {
    ...manufacturers[id],
    ...updates,
  };
}

function getNextId(obj) {
  const arr = Array.from(Object.values(obj)).sort((a, b) => a.id - b.id);
  return arr[arr.length - 1].id + 1;
}

export {
  getAllProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllManufacturers,
  getManufacturer,
  addManufacturer,
  updateManufacturer,
};
