const client = require("prom-client");

const uploadsTotal = new client.Counter({
    name: "app_uploads_total",
    help: "Total number of image uploads",
    labelNames: ["status"], 
});

module.exports = { uploadsTotal };
