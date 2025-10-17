import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("🧾 Webhook received");

    let data, type;

    // If Svix headers exist, verify the request (production)
    if (
      req.headers["svix-id"] &&
      req.headers["svix-timestamp"] &&
      req.headers["svix-signature"]
    ) {
      const CLERK_WEBHOOK_SECRET = "whsec_sFYLi9J0p9tEFU/LrJ4nREx9ePsB/VxO";
      const whook = new Webhook(CLERK_WEBHOOK_SECRET);

      const payload = req.body.toString("utf8");
      whook.verify(payload, {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      });

      ({ data, type } = JSON.parse(payload));
    } else {
      // Local testing / NGROK bypass
      ({ data, type } = req.body);
    }

    if (!data || !type) {
      console.log("⚠️ Invalid payload: missing data/type");
      return res
        .status(400)
        .json({ success: false, message: "Invalid payload" });
    }

    // Handle events individually
    const eventType = type?.toLowerCase(); // normalize

    if (eventType?.includes("created") || eventType?.includes("signed_up")) {
      await User.findOneAndUpdate(
        { _id: data.id },
        {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
          resume: "",
          raw: data,
        },
        { upsert: true, new: true }
      );
      console.log(`✅ User created/signed up in DB: ${data.id}`);
    } else if (eventType?.includes("updated")) {
      await User.findOneAndUpdate(
        { _id: data.id },
        {
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
          raw: data,
        },
        { upsert: true, new: true }
      );
      console.log(`✏️ User updated in DB: ${data.id}`);
    } else if (eventType?.includes("deleted")) {
      await User.findByIdAndDelete(data.id);
      console.log(`🗑️ User deleted from DB: ${data.id}`);
    } else {
      console.log(`⚠️ Unhandled webhook type: ${type}`);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};
