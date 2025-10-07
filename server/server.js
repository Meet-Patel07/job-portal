import express from "express";
import dotenv from "dotenv";
import { Webhook } from "svix";
import bodyParser from "body-parser";
import User from "./models/User.js";

dotenv.config();
const app = express();

/**
 * 🧩 Middleware — only RAW body for this webhook route
 * Important: this must come BEFORE express.json() or any global body parser
 */
app.post(
  "/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

      const headers = {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      };

      // Verify signature using raw body buffer
      const evt = wh.verify(req.body, headers);
      console.log("✅ Webhook verified:", evt.type);

      const data = evt.data;

      if (evt.type === "user.created") {
        await User.create({
          clerkId: data.id,
          email: data.email_addresses[0]?.email_address,
          firstName: data.first_name,
          lastName: data.last_name,
        });
      } else if (evt.type === "user.deleted") {
        await User.findOneAndDelete({ clerkId: data.id });
      }

      res.status(200).json({ success: true });
    } catch (err) {
      console.error("❌ Webhook verification failed:", err.message);
      res.status(400).json({ error: "Invalid Webhook Signature" });
    }
  }
);

/**
 * Other app routes (after webhook route)
 */
app.use(express.json());
app.get("/", (req, res) => res.send("Server running fine"));

app.listen(3000, () => console.log("🚀 Server listening on port 3000"));
