// server/seed.js
// Run with: node seed.js
// Drops existing projects and inserts 4 sample projects for development.

require("dotenv").config();
const mongoose = require("mongoose");
const Project = require("./models/Project");

const sampleProjects = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-stack shopping platform with cart, Stripe payments, JWT auth, and an admin dashboard. Built for high performance with Redis caching.",
    techStack: ["React", "Node.js", "MongoDB", "Express", "Stripe", "Redis"],
    githubUrl: "https://github.com/yourusername/ecommerce",
    liveUrl: "https://ecommerce-demo.vercel.app",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600",
  },
  {
    title: "Real-Time Chat App",
    description:
      "WebSocket-powered chat application with rooms, typing indicators, read receipts, and file sharing. Supports thousands of concurrent users.",
    techStack: ["React", "Socket.io", "Node.js", "MongoDB", "AWS S3"],
    githubUrl: "https://github.com/yourusername/chat-app",
    liveUrl: "https://chatapp-demo.vercel.app",
    imageUrl: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600",
  },
  {
    title: "DevOps Dashboard",
    description:
      "Monitoring dashboard for CI/CD pipelines with real-time metrics, deployment history, alert management, and Slack integrations.",
    techStack: ["React", "TypeScript", "GraphQL", "PostgreSQL", "Docker"],
    githubUrl: "https://github.com/yourusername/devops-dashboard",
    liveUrl: "https://devops-demo.vercel.app",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
  },
  {
    title: "AI Writing Assistant",
    description:
      "Browser extension that integrates GPT-4 for grammar correction, tone adjustment, and creative writing suggestions across any website.",
    techStack: ["JavaScript", "React", "OpenAI API", "Chrome Extension API"],
    githubUrl: "https://github.com/yourusername/ai-writer",
    liveUrl: "https://chrome.google.com/webstore/detail/ai-writer",
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Project.deleteMany({});
  await Project.insertMany(sampleProjects);
  console.log(`✅ Seeded ${sampleProjects.length} projects`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
