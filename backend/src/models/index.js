const sequelize = require("../config/db");
const User = require("./User");
const Image = require("./Image");
const Portfolio = require("./Portfolio");
const PortfolioImage = require("./PortfolioImage");
const PortfolioTechnology = require("./PortfolioTechnology");
const PortfolioKeyFeature = require("./PortfolioKeyFeature");
const Certification = require("./Certifications");

// Define Associations
Portfolio.hasMany(PortfolioImage, {
    foreignKey: "portfolioId",
    as: "images",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

PortfolioImage.belongsTo(Portfolio, {
    foreignKey: "portfolioId",
    as: "portfolio",
});

Portfolio.hasMany(PortfolioTechnology, {
    foreignKey: "portfolioId",
    as: "technologies",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

PortfolioTechnology.belongsTo(Portfolio, {
    foreignKey: "portfolioId",
    as: "portfolio",
});

Portfolio.hasMany(PortfolioKeyFeature, {
    foreignKey: "portfolioId",
    as: "keyFeatures",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

PortfolioKeyFeature.belongsTo(Portfolio, {
    foreignKey: "portfolioId",
    as: "portfolio",
});

module.exports = {
    sequelize,
    User,
    Image,
    Portfolio,
    PortfolioImage,
    PortfolioTechnology,
    PortfolioKeyFeature,
    Certification,
};
