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
const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// GET all products (Public)
router.get("/", getProducts);

// GET single product (Public)
router.get("/:id", getProductById);

// CREATE product (Admin only)
router.post(
  "/",
  verifyToken,
  adminMiddleware,
  productValidationRules,
  validate,
  createProduct
);

// UPDATE product (Admin only)
router.put(
  "/:id",
  verifyToken,
  adminMiddleware,
  productValidationRules,
  validate,
  updateProduct
);

// DELETE product (Admin only)
router.delete("/:id", verifyToken, adminMiddleware, deleteProduct);

module.exports = router;