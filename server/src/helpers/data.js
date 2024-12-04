import User from "../models/user.model.js";

export const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const getEmailVerificationToken = async (token) => {
  try {
    return await User.findOne({ verificationToken: token });
  } catch (error) {
    console.error("Error fetching email verification token:", error);
    throw error;
  }
};

export const getEmailVerificationTokenById = async (userId) => {
  try {
    return await User.findOne({
      _id: userId,
      verificationToken: { $exists: true },
    });
  } catch (error) {
    console.error("Error fetching email verification token by user ID:", error);
    throw error;
  }
};

export const getPasswordResetToken = async (token) => {
  try {
    return await User.findOne({ resetPasswordToken: token });
  } catch (error) {
    console.error("Error fetching password reset token:", error);
    throw error;
  }
};

export const getPasswordResetTokenById = async (userId) => {
  try {
    return await User.findOne({
      _id: userId,
      resetPasswordToken: { $exists: true },
    });
  } catch (error) {
    console.error("Error fetching password reset token by user ID:", error);
    throw error;
  }
};
