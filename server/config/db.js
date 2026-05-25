// server/config/db.js
// Establishes the Mongoose connection and exposes connection state helpers.

const mongoose = require("mongoose");

mongoose.set("bufferCommands", false);

let lastConnectionError = null;

const getMongoUri = () => process.env.MONGO_URI || process.env.MONGODB_URI || "";
const isDatabaseReady = () => mongoose.connection.readyState === 1;

const getDatabaseStatus = () => ({
  connected: isDatabaseReady(),
  readyState: mongoose.connection.readyState,
  error: lastConnectionError,
});

mongoose.connection.on("connected", () => {
  lastConnectionError = null;
});

mongoose.connection.on("error", (err) => {
  lastConnectionError = err.message;
});

mongoose.connection.on("disconnected", () => {
  if (!lastConnectionError) {
    lastConnectionError = "MongoDB disconnected.";
  }
});

const connectDB = async () => {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    lastConnectionError = "Missing MONGO_URI or MONGODB_URI environment variable.";
    console.warn(`MongoDB connection skipped: ${lastConnectionError}`);
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS:
        Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 5000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    lastConnectionError = err.message;
    console.error(`MongoDB connection error: ${err.message}`);
    return false;
  }
};

module.exports = { connectDB, getDatabaseStatus, isDatabaseReady };
