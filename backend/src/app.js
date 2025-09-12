// backend/src/app.js
const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const promBundle = require("express-prom-bundle");

const app = express();

// --- Core middleware ---
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

// --- Metrics otomatis (Prometheus) ---
const metrics = promBundle({
    includeMethod: true,
    includePath: true, // pakai path ternormalisasi (ex: /items/:id)
    includeStatusCode: true,
    promClient: { collectDefaultMetrics: {} },
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5], // histogram latency
});
app.use(metrics);

// --- Static uploads ---
const uploadsDir = path.join(__dirname, "../uploads"); // sesuaikan jika berbeda
app.use("/uploads", express.static(uploadsDir));

// --- Healthcheck ---
app.get("/healthz", (_req, res) => res.json({ status: "ok" }));

// --- Routes lama kamu ---
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const certificationRoutes = require("./routes/certificationRoutes");

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/portfolios", portfolioRoutes);
app.use("/api/certifications", certificationRoutes);

module.exports = app;
