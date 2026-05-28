const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const productValidationRules = require("../validators/productValidator");

const validate = require("../middleware/validate");

const router = express.Router();


// GET all products
router.get("/", getProducts);


// GET single product
router.get("/:id", getProductById);


// CREATE product
router.post(
  "/",
  productValidationRules,
  validate,
  createProduct
);


// UPDATE product
router.put(
  "/:id",
  productValidationRules,
  validate,
  updateProduct
);


// DELETE product
router.delete("/:id", deleteProduct);


module.exports = router;