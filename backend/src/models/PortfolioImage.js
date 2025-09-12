const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Portfolio = require("./Portfolio");
const { commonOptions, userId } = require("../config/baseModelConfig");

const PortfolioImage = sequelize.define(
    "portfolio_image",
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
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId,
    },
    commonOptions
);

module.exports = PortfolioImage;
