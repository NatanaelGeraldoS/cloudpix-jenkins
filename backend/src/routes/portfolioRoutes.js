const express = require("express");
const multer = require("multer");
const {
    Portfolio,
    PortfolioImage,
    PortfolioTechnology,
    PortfolioKeyFeature,
} = require("../models");
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
        const portfolios = await Portfolio.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: PortfolioImage,
                    as: "images",
                },
                {
                    model: PortfolioTechnology,
                    as: "technologies",
                },
                {
                    model: PortfolioKeyFeature,
                    as: "keyFeatures",
                },
            ],
        });
        res.status(200).json(portfolios);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/get-all", async (req, res) => {
    try {
        const portfolios = await Portfolio.findAll({
            include: [
                {
                    model: PortfolioImage,
                    as: "images",
                },
                {
                    model: PortfolioTechnology,
                    as: "technologies",
                },
                {
                    model: PortfolioKeyFeature,
                    as: "keyFeatures",
                },
            ],
        });
        res.status(200).json(portfolios);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put(
    "/put-portfolio",
    authMiddleware,
    upload.fields([
        {
            name: "images",
            maxCount: 10,
        },
    ]),
    async (req, res) => {
        const t = await sequelize.transaction();
        try {
            var technologies = JSON.parse(req.body.technologies || "[]");
            var keyFeatures = JSON.parse(req.body.keyFeatures || "[]");
            let portfolio;

            if (req.body.id) {
                portfolio = await Portfolio.findOne({
                    where: { id: req.body.id, userId: req.user.id },
                });

                if (portfolio) {
                    await portfolio.update(
                        {
                            title: req.body.title,
                            description: req.body.description,
                            type: req.body.type,
                            github: req.body.github,
                            previewLink: req.body.previewLink,
                        },
                        { transaction: t }
                    );
                } else {
                    portfolio = await Portfolio.create(
                        {
                            userId: req.user.id,
                            title: req.body.title,
                            description: req.body.description,
                            type: req.body.type,
                            github: req.body.github,
                            previewLink: req.body.previewLink,
                        },
                        { transaction: t }
                    );
                }
            } else {
                portfolio = await Portfolio.create(
                    {
                        userId: req.user.id,
                        title: req.body.title,
                        description: req.body.description,
                        type: req.body.type,
                        github: req.body.github,
                        previewLink: req.body.previewLink,
                    },
                    { transaction: t }
                );
            }

            if (req.files && req.files.images && req.files.images.length > 0) {
                if (req.body.id) {
                    await PortfolioImage.destroy({
                        where: { portfolioId: portfolio.id },
                        transaction: t,
                    });
                }

                await Promise.all(
                    req.files.images.map((file) =>
                        PortfolioImage.create(
                            {
                                portfolioId: portfolio.id,
                                filename: file.filename,
                                userId: req.user.id,
                            },
                            { transaction: t }
                        )
                    )
                );
            }

            if (technologies && technologies.length > 0) {
                if (req.body.id) {
                    await PortfolioTechnology.destroy({
                        where: { portfolioId: portfolio.id },
                        transaction: t,
                    });
                }

                await Promise.all(
                    technologies.map((technology) =>
                        PortfolioTechnology.create(
                            {
                                portfolioId: portfolio.id,
                                name: technology,
                                userId: req.user.id,
                            },
                            { transaction: t }
                        )
                    )
                );
            }

            if (keyFeatures && keyFeatures.length > 0) {
                if (req.body.id) {
                    await PortfolioKeyFeature.destroy({
                        where: { portfolioId: portfolio.id },
                        transaction: t,
                    });
                }

                await Promise.all(
                    keyFeatures.map((keyFeature) =>
                        PortfolioKeyFeature.create(
                            {
                                portfolioId: portfolio.id,
                                description: keyFeature,
                                userId: req.user.id,
                            },
                            { transaction: t }
                        )
                    )
                );
            }

            await t.commit();

            res.json(portfolio);
        } catch (err) {
            await t.rollback();
            res.status(500).json({ message: err.message });
        }
    }
);

router.get("/get-detail-portfolio", authMiddleware, async (req, res) => {
    try {
        const portfolioId = req.query.id;
        if (!portfolioId) {
            return res
                .status(400)
                .json({ message: "Portfolio ID is required" });
        }
        const portfolio = await Portfolio.findOne({
            where: { userId: req.user.id, id: portfolioId },
            include: [
                {
                    model: PortfolioImage,
                    as: "images",
                },
                {
                    model: PortfolioTechnology,
                    as: "technologies",
                },
                {
                    model: PortfolioKeyFeature,
                    as: "keyFeatures",
                },
            ],
        });
        res.status(200).json(portfolio);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get("/get-detail-data-portfolio", async (req, res) => {
    try {
        const portfolioId = req.query.id;
        if (!portfolioId) {
            return res
                .status(400)
                .json({ message: "Portfolio ID is required" });
        }
        const portfolio = await Portfolio.findOne({
            where: { id: portfolioId },
            include: [
                {
                    model: PortfolioImage,
                    as: "images",
                },
                {
                    model: PortfolioTechnology,
                    as: "technologies",
                },
                {
                    model: PortfolioKeyFeature,
                    as: "keyFeatures",
                },
            ],
        });
        res.status(200).json(portfolio);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.delete("/delete-portfolio", authMiddleware, async (req, res) => {
    try {
        const portfolioId = req.query.id; // Use query params for GET requests
        if (!portfolioId) {
            return res
                .status(400)
                .json({ message: "Portfolio ID is required" });
        }
        const portfolio = await Portfolio.findOne({
            where: { id: portfolioId },
        });
        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio Id not found!" });
        }

        await Portfolio.destroy({
            where: { id: portfolioId },
        });
        res.status(200).json("Portfolio successfully deleted");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get(
    "/get-widget-counter-portfolios",
    authMiddleware,
    async (req, res) => {
        try {
            const portfolios = await Portfolio.count({
                where: { userId: req.user.id },
            });
            res.status(200).json(portfolios);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

module.exports = router;
