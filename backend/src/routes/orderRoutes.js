const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require("../controllers/orderController");
const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// All routes here are protected
router.post("/", verifyToken, createOrder);
router.get("/my-orders", verifyToken, getMyOrders);
router.get("/", verifyToken, adminMiddleware, getAllOrders);
router.put("/:id/status", verifyToken, adminMiddleware, updateOrderStatus);

module.exports = router;
