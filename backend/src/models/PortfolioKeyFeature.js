const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Portfolio = require("./Portfolio");
const { commonOptions, userId } = require("../config/baseModelConfig");

const PortfolioKeyFeature = sequelize.define(
    "portfolio_key_feature",
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
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId,
    },
    commonOptions
);

module.exports = PortfolioKeyFeature;
