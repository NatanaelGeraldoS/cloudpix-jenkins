const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { userId, commonOptions } = require("../config/baseModelConfig");

const Certification = sequelize.define(
    "certification",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        organization: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateAwarded: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        expiration: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageLink: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId,
    },
    commonOptions
);

module.exports = Certification;
