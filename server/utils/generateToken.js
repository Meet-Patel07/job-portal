import jwt from "jsonwebtoken";

const generateToken = (id) => {
  const JWT_SECRET = "meet#secret";
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d",
  });
};
export default generateToken;
