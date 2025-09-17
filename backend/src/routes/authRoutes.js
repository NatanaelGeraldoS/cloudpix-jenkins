const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const { User } = require("../models");
const sequelize = require("../config/db");
const validateEmail = require("../helpers/validateEmail");

const router = express.Router();
router.get("/health", (_req, res) => res.json({ status: "ok" }));
// Register
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const t = await sequelize.transaction();

    try {
        if (!username || username.trim().length === 0) {
            return res.status(422).json({
                message: "Username is required and cannot be empty.",
            });
        }

        if (!password || password.trim().length === 0) {
            return res.status(422).json({
                message: "Password is required and cannot be empty.",
            });
        }

        if (!email || email.trim().length === 0) {
            return res.status(422).json({
                message: "Email is required and cannot be empty.",
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                message:
                    "Invalid email format. Please provide a valid email address.",
            });
        }

        const checkIsEmailUsed = await User.findOne({ where: { email } });
        if (checkIsEmailUsed) {
            return res
                .status(409)
                .json({ message: "Email already registered" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create(
            {
                username,
                email,
                password: hashedPassword,
            },
            { transaction: t }
        );
        await t.commit();
        res.json(user);
    } catch (err) {
        await t.rollback();
        res.status(400).json({ message: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user)
            return res.status(404).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        const { password: _, ...userWithoutPassword } = user.dataValues;

        res.json({ token, user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/me", authMiddleware, async (req, res) => {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: "Invalid token" });

    res.json({
        id: req.user.id,
        username: req.user.username,
    });
});

module.exports = router;
