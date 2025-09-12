const express = require("express");
const multer = require("multer");
const { Certification } = require("../models");
const authMiddleware = require("../middleware/authMiddleware");
const sequelize = require("../config/db");
const getExtension = require("../helpers/getExtension");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) =>
        cb(null, `${Date.now()}${getExtension(file.originalname)}`),
});

const upload = multer({ storage });

router.get("/", authMiddleware, async (req, res) => {
    try {
        const certifications = await Certification.findAll({
            where: { userId: req.user.id },
        });
        res.status(200).json(certifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/get-all", async (req, res) => {
    try {
        const certifications = await Certification.findAll();
        res.status(200).json(certifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put(
    "/put-certification",
    authMiddleware,
    upload.fields([{ name: "image", maxCount: 1 }]), // Ensure only one image
    async (req, res) => {
        const t = await sequelize.transaction();
        try {
            let certification;

            // Extract file name from uploaded image
            const imageFile =
                req.files && req.files.image
                    ? req.files.image[0].filename
                    : null;

            if (req.body.id) {
                certification = await Certification.findOne({
                    where: { id: req.body.id, userId: req.user.id },
                });

                if (certification) {
                    await certification.update(
                        {
                            name: req.body.name,
                            description: req.body.description,
                            organization: req.body.organization,
                            dateAwarded: req.body.dateAwarded,
                            expiration: req.body.expiration,
                            category: req.body.category,
                            imageLink: imageFile || certification.imageLink, // Keep old image if no new file
                        },
                        { transaction: t }
                    );
                } else {
                    certification = await Certification.create(
                        {
                            userId: req.user.id,
                            name: req.body.name,
                            description: req.body.description,
                            organization: req.body.organization,
                            dateAwarded: req.body.dateAwarded,
                            expiration: req.body.expiration,
                            category: req.body.category,
                            imageLink: imageFile,
                        },
                        { transaction: t }
                    );
                }
            } else {
                certification = await Certification.create(
                    {
                        userId: req.user.id,
                        name: req.body.name,
                        description: req.body.description,
                        organization: req.body.organization,
                        dateAwarded: req.body.dateAwarded,
                        expiration: req.body.expiration,
                        category: req.body.category,
                        imageLink: imageFile,
                    },
                    { transaction: t }
                );
            }

            await t.commit();

            res.json(certification);
        } catch (err) {
            await t.rollback();
            res.status(500).json({ message: err.message });
        }
    }
);

router.get("/get-detail-certification", authMiddleware, async (req, res) => {
    try {
        const certificationId = req.query.id;
        if (!certificationId) {
            return res
                .status(400)
                .json({ message: "Certification ID is required" });
        }
        const certification = await Certification.findOne({
            where: { userId: req.user.id, id: certificationId },
        });
        res.status(200).json(certification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get("/get-detail-data-certification", async (req, res) => {
    try {
        const certificationId = req.query.id;
        if (!certificationId) {
            return res
                .status(400)
                .json({ message: "Certification ID is required" });
        }
        const certification = await Certification.findOne({
            where: { id: certificationId },
        });
        res.status(200).json(certification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.delete("/delete-certification", authMiddleware, async (req, res) => {
    try {
        const certificationId = req.query.id; // Use query params for GET requests
        if (!certificationId) {
            return res
                .status(400)
                .json({ message: "Certification ID is required" });
        }
        const certification = await Certification.findOne({
            where: { id: certificationId },
        });
        if (!certification) {
            return res
                .status(404)
                .json({ message: "Certification Id not found!" });
        }

        await Certification.destroy({
            where: { id: certificationId },
        });
        res.status(200).json("Certification successfully deleted");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get(
    "/get-widget-counter-certifications",
    authMiddleware,
    async (req, res) => {
        try {
            const certifications = await Certification.count({
                where: { userId: req.user.id },
            });
            res.status(200).json(certifications);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

module.exports = router;
