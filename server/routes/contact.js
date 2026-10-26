const express = require("express");
const { body, matchedData, validationResult } = require("express-validator");

function createContactRouter({ database, Message, logger }) {
  const router = express.Router();
  router.post("/", [
    body("name").isString().withMessage("Name must be text").bail().trim()
      .notEmpty().withMessage("Name is required").bail()
      .isLength({ max: 100 }).withMessage("Name too long"),
    body("email").isString().withMessage("Email must be text").bail().trim()
      .isLength({ max: 254 }).withMessage("Email too long").bail()
      .isEmail().withMessage("Invalid email address")
      .normalizeEmail(),
    body("message").isString().withMessage("Message must be text").bail().trim()
      .isLength({ min: 10, max: 2000 }).withMessage("Message must be between 10 and 2000 characters"),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    if (!database.isDatabaseReady()) {
      return res.status(503).json({
        success: false,
        error: "Contact form submissions are temporarily unavailable because the database connection is offline.",
      });
    }
    try {
      const message = await Message.create(matchedData(req));
      res.status(201).json({
        success: true,
        message: "Message received! I'll get back to you soon.",
        data: { id: message._id, createdAt: message.createdAt },
      });
    } catch (err) {
      logger.error(err.stack || err.message);
      res.status(err.name === "ValidationError" ? 400 : 500).json({
        success: false,
        error: err.name === "ValidationError" ? "Invalid contact details" : "Unable to save your message right now.",
      });
    }
  });
  return router;
}

module.exports = createContactRouter;
