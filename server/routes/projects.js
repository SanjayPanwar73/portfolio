const express = require("express");
const { body, matchedData, validationResult } = require("express-validator");
const { timingSafeEqual } = require("node:crypto");

function createProjectRouter({ database, Project, logger, projectAdminToken }) {
  const router = express.Router();
  router.get("/", async (req, res) => {
    if (!database.isDatabaseReady()) {
      return res.status(503).json({
        success: false,
        error: "Projects API is temporarily unavailable because the database connection is offline.",
        data: [],
      });
    }
    try {
      const projects = await Project.find().sort({ createdAt: -1 });
      res.json({ success: true, count: projects.length, data: projects });
    } catch (err) {
      logger.error(err.stack || err.message);
      res.status(500).json({ success: false, error: "Unable to load projects right now." });
    }
  });

  router.post("/", (req, res, next) => {
    if (!projectAdminToken) {
      return res.status(503).json({ success: false, error: "Project updates are not configured" });
    }
    const token = (req.get("Authorization") || "").match(/^Bearer (.+)$/i)?.[1] || "";
    const supplied = Buffer.from(token);
    const expected = Buffer.from(projectAdminToken);
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      res.set("WWW-Authenticate", "Bearer");
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    next();
  }, [
    body("title").isString().withMessage("Title must be text").bail().trim()
      .notEmpty().withMessage("Title is required").bail()
      .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),
    body("description").isString().withMessage("Description must be text").bail().trim()
      .notEmpty().withMessage("Description is required").bail()
      .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),
    body("techStack").isArray({ min: 1 }).withMessage("techStack must be a non-empty array"),
    body("techStack.*").isString().withMessage("Technologies must be text").bail().trim()
      .notEmpty().withMessage("Technologies cannot be empty"),
    ...["githubUrl", "liveUrl", "imageUrl"].map((field) =>
      body(field).optional().isString().withMessage(`${field} must be text`).bail().trim()),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    if (!database.isDatabaseReady()) {
      return res.status(503).json({
        success: false,
        error: "Projects cannot be saved right now because the database connection is offline.",
      });
    }
    try {
      const project = await Project.create(matchedData(req));
      res.status(201).json({ success: true, data: project });
    } catch (err) {
      logger.error(err.stack || err.message);
      res.status(err.name === "ValidationError" ? 400 : 500).json({
        success: false,
        error: err.name === "ValidationError" ? "Invalid project details" : "Unable to save the project right now.",
      });
    }
  });
  return router;
}

module.exports = createProjectRouter;
