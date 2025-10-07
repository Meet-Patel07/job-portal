import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("🧾 Raw Body (Buffer):", req.body);
    console.log("🧾 Type of Body:", typeof req.body);
    console.log("🧾 Is Buffer:", Buffer.isBuffer(req.body));

    const payloadString = req.body.toString("utf8");
    console.log("📦 Full Payload String:", payloadString);

    // const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // wh.verify(payloadString, headers);

    // const headers = {
    //   "svix-id": req.headers["svix-id"],
    //   "svix-timestamp": req.headers["svix-timestamp"],
    //   "svix-signature": req.headers["svix-signature"],
    // };

    const { data, type } = JSON.parse(payloadString);
    console.log("📨 Event Type:", type);

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
        console.log("✅ User Created:", newUser);
        return res.status(200).json({ success: true });
      }

      case "user.updated": {
        const userData = {
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: data.email_addresses?.[0]?.email_address || "",
          image: data.image_url || "",
        };

        const updatedUser = await User.findByIdAndUpdate(data.id, userData, {
          new: true,
        });
        console.log("♻️ User Updated:", updatedUser);
        return res.status(200).json({ success: true });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log("🗑️ User Deleted:", data.id);
        return res.status(200).json({ success: true });
      }

      default:
        console.log("⚠️ Unhandled Event Type:", type);
        return res.status(200).json({ message: "Event ignored" });
    }
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return res.status(400).json({ success: false, error: error.message });
  }
};
