// server/index.js
// Entry point: loads env vars, connects MongoDB, mounts routes, starts server.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, getDatabaseStatus } = require("./config/db");
const projectRoutes = require("./routes/projects");
const contactRoutes = require("./routes/contact");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);

app.get("/api/health", (req, res) => {
  const database = getDatabaseStatus();
  const status = database.connected ? "ok" : "degraded";

  res.status(database.connected ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    database,
  });
});

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
