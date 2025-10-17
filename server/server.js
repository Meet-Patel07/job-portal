import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import companyRoutes from "./routes/companyRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();
const app = express();

// Connect MongoDB
await connectDB();
await connectCloudinary();

app.use(cors());

// IMPORTANT: Svix requires raw body
app.post("/webhooks", express.raw({ type: "application/json" }), clerkWebhooks);

app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

// Normal JSON parsing for other routes
app.get("/", (req, res) => res.send("✅ API Working"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
