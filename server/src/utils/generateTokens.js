import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const generateTokens = (userId) => {
  // Generating access token with 15 minutes expiration
  const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: "15m",
  });

  // Generating refresh token with 7 days expiration
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};
