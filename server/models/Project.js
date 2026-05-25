// server/models/Project.js
// Mongoose schema for portfolio projects.
// Fields: title, description, techStack (array), githubUrl, liveUrl, imageUrl, createdAt.

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    techStack: {
      type: [String],
      required: [true, "Tech stack is required"],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one technology is required",
      },
    },
    githubUrl: {
      type: String,
      trim: true,
      default: "",
    },
    liveUrl: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
