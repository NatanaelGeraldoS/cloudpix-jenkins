const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Portfolio = require("./Portfolio");
const { commonOptions, userId } = require("../config/baseModelConfig");

const PortfolioTechnology = sequelize.define(
    "portfolio_technology",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        portfolioId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Portfolios",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId,
    },
    commonOptions
);

module.exports = PortfolioTechnology;
