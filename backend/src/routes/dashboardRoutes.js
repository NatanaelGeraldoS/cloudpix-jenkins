const express = require("express");
const multer = require("multer");
const { Portfolio, Certification } = require("../models");
const authMiddleware = require("../middleware/authMiddleware");
const sequelize = require("../config/db");

const router = express.Router();

router.get("/get-widgets-counter", authMiddleware, async (req, res) => {
    try {
        const portfolio_counts = await Portfolio.count({
            where: { userId: req.user.id },
        });
        const certification_counts = await Certification.count({
            where: { userId: req.user.id },
        });
        res.status(200).json({
            portfolio_counter: portfolio_counts,
            certification_counter: certification_counts,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
