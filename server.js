// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4, parse } = require("uuid");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
];

// Root route
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Product API! Go to /api/products to see all products."
  );
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});
// GET /api/products/:id - Get a specific product
app.get("/api/products/:id", (req, res) => {
  const ProductID = req.params.id;
  const product = products.find(
    (specificProduct) => specificProduct.id === ProductID
  );
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});
// POST /api/products - Create a new product
app.post("/api/products", (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || !price || !category) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock: inStock || false,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});
// PUT /api/products/:id - Update a product
app.put("/api/products/:id", (req, res) => {
  const ProductID = req.params.id;
  const { name, description, price, category, inStock } = req.body;

  const productIndex = products.findIndex((p) => p.id === ProductID);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const updatedProduct = {
    ...products[productIndex],
    name,
    description,
    price,
    category,
    inStock: inStock !== undefined ? inStock : products[productIndex].inStock,
  };

  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
});
// DELETE /api/products/:id - Delete a product
app.delete("/api/products/:id", (req, res) => {
  const ProductID = req.params.id;
  products = products.filter(
    (specificProduct) => specificProduct.id !== ProductID
  );
  res.status(204).send();
});
// Example route implementation for GET /api/products
// app.get("/api/products", (req, res) => {
//   res.json(products);
// });

// TODO: Implement custom middleware for:
// - Request logging
const requestLoggingMiddleware = (req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
};
// - Authentication
const authenticationMiddleware = (req, res, next) => {
  if (req.headers.authorization === "validUserToken") {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
// - Error handling
const errorHandlingMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
};

// Apply middlewares
app.use(requestLoggingMiddleware);
app.use(authenticationMiddleware);
app.use(errorHandlingMiddleware);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
