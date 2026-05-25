// client/src/utils/api.js
// Axios instance. All API calls in the app go through this single client.
// The proxy in package.json routes /api calls to localhost:5000 in dev.

import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Named exports used by components
export const fetchProjects = () =>
  api.get("/projects").then((res) => res.data.data);

export const createProject = (data) => api.post("/projects", data);

export const sendMessage = (data) => api.post("/contact", data);

export default api;
