import "./config/instrument.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controllers/webhooks.js";

// Initialize Express
const app = express();

// Connect to Database
await connectDB();

// Middlewares (place cors before routes)
app.use(cors());

// 👇 Clerk Webhooks route — uses raw body for Svix signature verification
app.post("/webhooks", express.raw({ type: "*/*" }), clerkWebhooks);

// 👇 All other routes use json
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API Working"));

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Port
const PORT = process.env.PORT || 5000;

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
