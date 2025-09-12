const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const PortfolioImage = require("./PortfolioImage");
const PortfolioTechnology = require("./PortfolioTechnology");
const { userId, commonOptions } = require("../config/baseModelConfig");

const Portfolio = sequelize.define(
    "portfolio",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        github: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        previewLink: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userId,
    },
    commonOptions
);

module.exports = Portfolio;
