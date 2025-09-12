const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME, // Database name
    process.env.DB_USER, // Username
    process.env.DB_PASS, // Password
    {
        host: process.env.DB_HOST, // Hostname
        dialect: "mysql", // Database type
    }
);

module.exports = sequelize;
