const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { commonOptions, userId } = require("../config/baseModelConfig");

const Image = sequelize.define(
    "image",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Automatically generates UUID
            primaryKey: true,
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId,
    },
    commonOptions
);

module.exports = Image;
