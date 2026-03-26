
// src/config.js
export const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://my-project-1-2-by8h.onrender.com" // your Render backend URL
    : "http://localhost:5000";                    // for local development