const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders } = require("../controllers/orderController");
const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// All routes here are protected
router.post("/", verifyToken, createOrder);
router.get("/my-orders", verifyToken, getMyOrders);
router.get("/", verifyToken, adminMiddleware, getAllOrders);

module.exports = router;
