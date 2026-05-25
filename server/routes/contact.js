// server/routes/contact.js
// POST /api/contact — validates and saves a contact form submission to MongoDB.
// Returns 201 on success or 400/500 with error details.

const express = require("express");
const { body, validationResult } = require("express-validator");
const { isDatabaseReady } = require("../config/db");
const Message = require("../models/Message");

const router = express.Router();

router.post(
  "/",
  [
    body("name")
      .trim()
      .notEmpty().withMessage("Name is required")
      .isLength({ max: 100 }).withMessage("Name too long"),
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email address")
      .normalizeEmail(),
    body("message")
      .trim()
      .notEmpty().withMessage("Message is required")
      .isLength({ min: 10, max: 2000 })
      .withMessage("Message must be between 10 and 2000 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    if (!isDatabaseReady()) {
      return res.status(503).json({
        success: false,
        error:
          "Contact form submissions are temporarily unavailable because the database connection is offline.",
      });
    }

    try {
      const msg = await Message.create(req.body);
      res.status(201).json({
        success: true,
        message: "Message received! I'll get back to you soon.",
        data: { id: msg._id, createdAt: msg.createdAt },
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

module.exports = router;
