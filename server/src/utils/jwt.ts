import jwt from "jsonwebtoken";
export const generateToken = (userId: String) => {
  const secret = process.env.JWT_SECRET || "default_secret";
  //token sign = payload + secret + expiry
  return jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });
};
