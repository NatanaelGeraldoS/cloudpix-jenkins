const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const { getExtension } = require("../helpers/getExtension");
const sequelize = require("../config/db");
const { Image } = require("../models");
const { uploadsTotal } = require('../monitoring/Metrics');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) =>
        cb(null, `${Date.now()}${getExtension(file.originalname)}`),
});

const upload = multer({ storage });

// Get all images for a user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const images = await Image.findAll({ where: { userId: req.user.id } });
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Upload an image
router.post(
    "/upload",
    authMiddleware,
    upload.single("image"),
    async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const image = await Image.create(
                {
                    filename: req.file.filename,
                    userId: req.user.id,
                },
                { transaction: t }
            );

            await t.commit();

            uploadsTotal.inc({ status: "success" });

            res.json(image);
        } catch (err) {
            await t.rollback();

            uploadsTotal.inc({ status: "failure" });

            res.status(500).json({ message: err.message });
        }
    }
);

module.exports = router;
