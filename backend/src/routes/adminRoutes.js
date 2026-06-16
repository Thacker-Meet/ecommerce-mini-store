const express = require("express");
const router = express.Router();
const { getRevenue } = require("../controllers/adminController");
const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/revenue", verifyToken, adminMiddleware, getRevenue);

module.exports = router;
