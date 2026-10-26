const express = require("express");
const cors = require("cors");
const fs = require("node:fs");
const path = require("node:path");
const createProjectRouter = require("./routes/projects");
const createContactRouter = require("./routes/contact");

// Creating the HTTP application never loads .env or connects to MongoDB.
function createApp({
  clientBuildPath = path.resolve(__dirname, "../client/dist"),
  allowedOrigins = process.env.CLIENT_URL || "http://127.0.0.1:5173",
  projectAdminToken = process.env.PROJECT_ADMIN_TOKEN || "",
  database = require("./config/db"),
  Project = require("./models/Project"),
  Message = require("./models/Message"),
  logger = console,
} = {}) {
  const app = express();
  const normalizeOrigin = (value) => value.trim().replace(/\/+$/, "");
  const origins = allowedOrigins.split(",").map(normalizeOrigin).filter(Boolean);

  app.use(cors({
    origin(origin, callback) {
      if (!origin || origins.includes("*") || origins.includes(normalizeOrigin(origin))) {
        callback(null, true);
        return;
      }
      callback(Object.assign(new Error("Origin not allowed"), { status: 403 }));
    },
  }));
  app.use(express.json());

  app.use("/api/projects", createProjectRouter({ database, Project, logger, projectAdminToken }));
  app.use("/api/contact", createContactRouter({ database, Message, logger }));
  app.get("/api", (req, res) => {
    res.json({
      status: "ok",
      message: "Portfolio API is running.",
      endpoints: ["/api/health", "/api/projects", "/api/contact"],
    });
  });
  app.get("/api/health", (req, res) => {
    const status = database.getDatabaseStatus();
    res.status(status.connected ? 200 : 503).json({
      status: status.connected ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      database: status,
    });
  });

  const clientIndexPath = path.join(clientBuildPath, "index.html");
  if (fs.existsSync(clientIndexPath)) {
    app.use(express.static(clientBuildPath));
    app.get("*", (req, res, next) => {
      // Missing API endpoints and files must retain a real 404, not SPA HTML.
      if (req.path === "/api" || req.path.startsWith("/api/") ||
          req.path.startsWith("/assets/") || path.extname(req.path) || !req.accepts("html")) {
        next();
        return;
      }
      res.sendFile(clientIndexPath);
    });
  }

  app.use((req, res) => res.status(404).json({ error: "Route not found" }));
  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    if (err.type === "entity.parse.failed") {
      return res.status(400).json({ error: "Invalid JSON request body" });
    }
    if (err.type === "entity.too.large") {
      return res.status(413).json({ error: "Request body too large" });
    }
    if (err.status === 415) return res.status(415).json({ error: "Unsupported request encoding" });
    if (err.status === 400) return res.status(400).json({ error: "Bad request" });
    if (err.status === 403) return res.status(403).json({ error: "Origin not allowed" });
    logger.error(err.stack || err.message);
    res.status(500).json({ error: "Internal server error" });
  });
  return app;
}

module.exports = { createApp };
