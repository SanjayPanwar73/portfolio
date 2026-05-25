/**
 * config/seed.js — Database seeder
 *
 * Run with: npm run seed (from the /server directory)
 *
 * This clears the Projects collection and inserts 4 sample projects.
 * Safe to re-run at any time — it drops existing projects first.
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from the server directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const Project = require("../models/Project");

const sampleProjects = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-stack online store with user authentication, product catalog, shopping cart, and Stripe payment integration. Features real-time inventory updates and order tracking.",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Stripe", "Redux"],
    githubUrl: "https://github.com/yourusername/ecommerce-platform",
    liveUrl: "https://ecommerce-demo.vercel.app",
    imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=600",
    featured: true,
  },
  {
    title: "Real-Time Chat App",
    description:
      "A WebSocket-powered chat application supporting multiple rooms, direct messages, file sharing, and emoji reactions. Built with Socket.io for sub-100ms message delivery.",
    techStack: ["React", "Socket.io", "Node.js", "MongoDB", "JWT"],
    githubUrl: "https://github.com/yourusername/realtime-chat",
    liveUrl: "https://chat-demo.netlify.app",
    imageUrl: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=600",
    featured: true,
  },
  {
    title: "Task Management Dashboard",
    description:
      "A Kanban-style project management tool with drag-and-drop cards, team collaboration features, deadline tracking, and automated email reminders.",
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    githubUrl: "https://github.com/yourusername/task-dashboard",
    liveUrl: "https://tasks-demo.vercel.app",
    imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600",
    featured: false,
  },
  {
    title: "Weather Forecast App",
    description:
      "A beautiful weather application with 7-day forecasts, location search, animated weather icons, and a historical data chart. Consumes OpenWeatherMap API.",
    techStack: ["React", "Chart.js", "OpenWeatherMap API", "CSS Modules"],
    githubUrl: "https://github.com/yourusername/weather-app",
    liveUrl: "https://weather-demo.netlify.app",
    imageUrl: "https://images.unsplash.com/photo-1504608524841-42584120d693?w=600",
    featured: false,
  },
];

const seed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing projects
    await Project.deleteMany({});
    console.log("🗑️  Cleared existing projects");

    // Insert sample projects
    const inserted = await Project.insertMany(sampleProjects);
    console.log(`🌱 Seeded ${inserted.length} projects:`);
    inserted.forEach((p) => console.log(`   • ${p.title}`));

    console.log("\n✨ Seed complete!");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("📪 MongoDB connection closed");
    process.exit(0);
  }
};

seed();
