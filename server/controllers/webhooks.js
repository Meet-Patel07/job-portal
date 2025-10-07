import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("🔔 Webhook hit!");
    console.log("Headers:", req.headers);
    console.log("Raw body type:", typeof req.body, "length:", req.body?.length);
    // Create a Svix instance with Clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const payloadString = req.body.toString();
    // Verifying Webhook Headers with Svix
    const payload = req.body;
    // console.log("🧾 Raw Webhook Payload:", payload);
    // process.exit(0);
    await whook.verify(payloadString, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Getting Data from request body
    // const { data, type } = JSON.parse(payload);
    const { data, type } = JSON.parse(payloadString);

    // Switch Cases for different Clerk Events
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          name: `${data.first_name} ${data.last_name}`,
          email: data.email_addresses[0].email_address,
          image: data.image_url,
          resume: "",
        };

        const newUser = await User.create(userData);
        console.log("User Created:", newUser);
        res.json({});
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
        };

        // Update the existing user in the database
        const updatedUser = await User.findByIdAndUpdate(data.id, userData, {
          new: true,
        });
        console.log("User Updated:", updatedUser); // Log success for debugging
        res.json({});
        break;
      }
      case "user.deleted": {
        // Delete user from the database
        await User.findByIdAndDelete(data.id);
        console.log("User Deleted:", data.id); // Log success for debugging
        res.json({});
        break;
      }
      default:
        console.log("Unhandled Event Type:", type);
        res.json({});
        break;
    }
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.json({ success: false, message: "Webhooks Error" });
  }
};
