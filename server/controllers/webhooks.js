import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("🧾 Webhook received");

    // Svix instance
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // req.body is raw (Buffer), convert to string
    const payloadString = req.body.toString();

    // Verify webhook signature
    await whook.verify(payloadString, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Parse payload
    const { data, type } = JSON.parse(payloadString);

    switch (type) {
      case "user.created":
        const newUser = await User.create({
          _id: data.id,
          name: `${data.first_name} ${data.last_name}`,
          email: data.email_addresses[0].email_address,
          image: data.image_url,
          resume: "",
        });
        console.log("✅ User Created:", newUser);
        break;

      case "user.updated":
        const updatedUser = await User.findByIdAndUpdate(
          data.id,
          {
            name: `${data.first_name} ${data.last_name}`,
            email: data.email_addresses[0].email_address,
            image: data.image_url,
          },
          { new: true }
        );
        console.log("✅ User Updated:", updatedUser);
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("✅ User Deleted:", data.id);
        break;

      default:
        console.log("ℹ️ Unhandled event type:", type);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    res.status(400).json({ success: false, message: "Webhook Error" });
  }
};
