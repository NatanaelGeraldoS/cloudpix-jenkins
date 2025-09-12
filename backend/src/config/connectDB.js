const {
    sequelize,
    User,
    Image,
    Portfolio,
    PortfolioImage,
    PortfolioTechnology,
    PortfolioKeyFeature,
    Certification,
} = require("../models");

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected!");

        if (process.env.ENV_TYPE !== "Production") {
            // Order the sync process
            await User.sync({ alter: true });
            console.log("User table synced.");

            await Image.sync({ alter: true });
            console.log("Image table synced.");

            await Portfolio.sync({ alter: true });
            console.log("Portfolio table synced.");

            await PortfolioImage.sync({ alter: true });
            console.log("Portfolio Image table synced.");

            await PortfolioTechnology.sync({ alter: true });
            console.log("Portfolio Technology table synced.");

            await PortfolioKeyFeature.sync({ alter: true });
            console.log("Portfolio Key Feature table synced.");

            await Certification.sync({ alter: true });
            console.log("Certification table synced.");

            console.log("All models synced in order.");
        }
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
