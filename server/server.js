import express from "express";
import dotenv from "dotenv";
import { Webhook } from "svix";
import bodyParser from "body-parser";
import User from "./models/User.js"; // Adjust the path to your model

dotenv.config();
const app = express();

// Middleware to capture raw body for Clerk webhook verification
app.use(
  "/webhooks",
  bodyParser.raw({ type: "application/json" })
);

// Other routes can use JSON
app.use(express.json());

// Clerk webhook handler
app.post("/webhooks", async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const payload = req.body; // raw body
    const evt = whook.verify(payload, headers);

    console.log("✅ Verified Webhook:", evt.type);

    // Handle event types
    if (evt.type === "user.created") {
      const data = evt.data;
      await User.create({
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        firstName: data.first_name,
        lastName: data.last_name,
      });
    }

    if (evt.type === "user.deleted") {
      const data = evt.data;
      await User.findOneAndDelete({ clerkId: data.id });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Webhook Verification Failed:", error.message);
    res.status(400).json({ error: "Invalid Webhook Signature" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
