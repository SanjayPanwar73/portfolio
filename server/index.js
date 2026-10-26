// server/index.js
// Production entry point. Tests import app.js without loading environment secrets.
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const { connectDB, getDatabaseStatus } = require("./config/db");
const { createApp } = require("./app");
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  const app = createApp();
  app.listen(PORT, () => {
    const { connected } = getDatabaseStatus();
    console.log(
      `Server running on port ${PORT}${connected ? "" : " (database offline)"}`
    );
  });
};

startServer().catch((err) => {
  console.error("Server startup failed:", err.message);
  process.exitCode = 1;
});
