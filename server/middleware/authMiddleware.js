import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

export const protectCompany = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.json({
      success: false,
      message: "Not authorized, Login again",
    });
  }
  try {
    const JWT_SECRET = "meet#secret";

    const decoded = jwt.verify(token, JWT_SECRET);
    req.company = await Company.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
