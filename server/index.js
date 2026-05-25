// server/index.js
// Entry point: loads env vars, connects MongoDB, mounts routes, starts server.

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const { connectDB, getDatabaseStatus } = require("./config/db");
const projectRoutes = require("./routes/projects");
const contactRoutes = require("./routes/contact");

const app = express();
const clientBuildPath = path.resolve(__dirname, "../client/build");
const clientIndexPath = path.join(clientBuildPath, "index.html");
const hasClientBuild = fs.existsSync(clientIndexPath);

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);

app.get("/api", (req, res) => {
  res.json({
    status: "ok",
    message: "Portfolio API is running.",
    endpoints: ["/api/health", "/api/projects", "/api/contact"],
  });
});

app.get("/api/health", (req, res) => {
  const database = getDatabaseStatus();
  const status = database.connected ? "ok" : "degraded";

  res.status(database.connected ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    database,
  });
});

if (hasClientBuild) {
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }

    res.sendFile(clientIndexPath);
  });
}

app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    const { connected } = getDatabaseStatus();
    console.log(
      `Server running on port ${PORT}${connected ? "" : " (database offline)"}`
    );
  });
};

startServer();
