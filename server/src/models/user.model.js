import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    select: false, // Password won't be included in queries unless explicitly selected
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  provider: {
    type: String,
    enum: ["google", "facebook", "local"],
    default: "local",
  },
  providerId: {
    type: String, // Used for OAuth logins
  },
  profilePicture: {
    type: String, // Stores profile picture URL
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verificationToken: {
    type: String,
  },
  verificationExpiresAt: {
    type: Date,
  },
  resetPasswordToken: { type: String },
  resetPasswordExpiresAt: { type: Date },
});

export const User = mongoose.model("User", userSchema);
