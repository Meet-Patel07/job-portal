import getRawBody from "raw-body";
import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const payload = await getRawBody(req); // read raw bytes
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const evt = wh.verify(payload, headers); // ✅ Verified Clerk event
    console.log("✅ Webhook verified:", evt.type);

    const { type, data } = evt;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: data.email_addresses?.[0]?.email_address || "",
          image: data.image_url || "",
          resume: "",
        };

        const newUser = await User.create(userData);
        console.log("👤 User created in DB:", newUser);
        break;
      }

      case "user.updated": {
        const updateData = {
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: data.email_addresses?.[0]?.email_address || "",
          image: data.image_url || "",
        };
        const updatedUser = await User.findByIdAndUpdate(data.id, updateData, {
          new: true,
        });
        console.log("🧩 User updated:", updatedUser);
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log("🗑️ User deleted:", data.id);
        break;
      }

      default:
        console.log("⚙️ Unhandled event type:", type);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook processing error:", err.message);
    res.status(400).json({ error: err.message });
  }
};
