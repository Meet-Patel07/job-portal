import "./config/instrument.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controllers/webhooks.js";

// Initialize Express
const app = express();

// Connect Database
await connectDB();

// CORS setup
app.use(cors());

// Clerk Webhook route — must come AFTER express.raw()
app.post("/webhooks", express.raw({ type: "application/json" }), clerkWebhooks);

app.use(express.json());

// Test Route
app.get("/", (req, res) => res.send("API Working ✅"));

// Debug Sentry Route
app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});

// Start Server
const PORT = process.env.PORT || 5000;

// Error handler for Sentry
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
