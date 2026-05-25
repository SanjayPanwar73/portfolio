// server/routes/projects.js
// GET  /api/projects      — returns all projects sorted newest first
// POST /api/projects      — creates a new project (admin use)
// Validation is handled by express-validator; errors return 400 with detail.

const express = require("express");
const { body, validationResult } = require("express-validator");
const { isDatabaseReady } = require("../config/db");
const Project = require("../models/Project");

const router = express.Router();

// ── GET all projects ──────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  if (!isDatabaseReady()) {
    return res.status(503).json({
      success: false,
      error:
        "Projects API is temporarily unavailable because the database connection is offline.",
      data: [],
    });
  }

  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST create project ───────────────────────────────────────────────────────
router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("techStack")
      .isArray({ min: 1 })
      .withMessage("techStack must be a non-empty array"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    if (!isDatabaseReady()) {
      return res.status(503).json({
        success: false,
        error:
          "Projects cannot be saved right now because the database connection is offline.",
      });
    }

    try {
      const project = await Project.create(req.body);
      res.status(201).json({ success: true, data: project });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

module.exports = router;
