const express = require("express");
const mongoose = require("mongoose");
const { mysqlConnection } = require("../config/mysql");

const router = express.Router();

router.get("/ping", async (req, res) => {
    try {
        // MongoDB test
        const mongoStatus = mongoose.connection.readyState === 1
            ? "MongoDB connected"
            : "MongoDB disconnected";

        // MySQL test
        mysqlConnection.query("SELECT 1", (err) => {
            if (err) {
                return res.status(500).json({
                    mongo: mongoStatus,
                    mysql: "MySQL disconnected",
                });
            }

            res.json({
                mongo: mongoStatus,
                mysql: "MySQL connected",
            });
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router;