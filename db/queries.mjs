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
    name: 'SG Bass',
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

let categories = {
  0: {
    id: 0,
    name: 'Electric guitars',
  },
  1: {
    id: 1,
    name: 'Bass guitars',
  },
  2: {
    id: 2,
    name: 'Acoustic guitars',
  },
  3: {
    id: 3,
    name: 'Drum kits',
  },
  4: {
    id: 4,
    name: 'Musical instruments',
  },
  5: {
    id: 5,
    name: 'Accessories',
  },
};

let products_to_categories = {
  0: {
    id: 0,
    product_id: 5,
    category_id: 0,
  },
  1: {
    id: 1,
    product_id: 5,
    category_id: 4,
  },
  2: {
    id: 2,
    product_id: 1,
    category_id: 4,
  },
  3: {
    id: 3,
    product_id: 1,
    category_id: 1,
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

function getAllCategories() {
  return Array.from(Object.values(categories));
}

function getCategory(id) {
  return categories[id];
}

function addCategory(category) {
  const id = getNextId(categories);
  categories[id] = {
    id,
    ...category,
  };
}

function updateCategory(id, updates) {
  categories[id] = {
    ...categories[id],
    ...updates,
  };
}

function deleteCategory(id) {
  delete categories[id];
  // Remove all entries that map this category to a product.
  const productCategories = Array.from(
    Object.values(products_to_categories),
  ).filter((row) => id == row.category_id);
  for (const row of productCategories) {
    delete products_to_categories[row.id];
  }
}

function getAllProductCategories() {
  return Array.from(Object.values(products_to_categories));
}

function getAllCategoriesForProduct(id) {
  return getAllProductCategories()
    .filter((row) => row.product_id == id)
    .map((row) => categories[row.category_id]);
}

function getAllProductsInCategory(id) {
  return getAllProductCategories()
    .filter((row) => row.category_id == id)
    .map((row) => products[row.product_id]);
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
  getAllCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  getAllProductCategories,
  getAllCategoriesForProduct,
  getAllProductsInCategory,
};
