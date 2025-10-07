import express from "express";
import { Webhook } from "svix";
import bodyParser from "body-parser";
import User from "./models/User.js"; // adjust path if needed
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Important: Use raw body for verification
app.use("/webhooks", bodyParser.raw({ type: "application/json" }));

app.post("/webhooks", async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = req.body; // raw buffer
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-signature": req.headers["svix-signature"],
      "svix-timestamp": req.headers["svix-timestamp"],
    };

    const event = wh.verify(payload, headers); // <--- CRITICAL LINE

    console.log("✅ Webhook verified successfully:", event.type);

    if (event.type === "user.created") {
      const data = event.data;
      await User.create({
        clerkId: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url,
      });
      console.log("👤 User saved to MongoDB");
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    return res.status(400).json({ error: "Invalid Webhook Signature" });
  }
});

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
