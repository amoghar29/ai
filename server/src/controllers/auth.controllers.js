import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokens } from "../utils/generateTokens.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../utils/sendEmail.js";
import { generateVerificationToken } from "../helpers/generateVerificationToken.js";
import jwt from "jsonwebtoken";
import {
  signupSchema,
  signinSchema,
  verifyEmailSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from "../validation/authSchema.js";
import { generateOTP } from "../utils/generateOtp.js";

export const signup = async (req, res, next) => {
  try {
    const validatedData = signupSchema.parse(req.body);

    const { email, password, username } = validatedData;

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const verificationToken = generateOTP();

    const user = new User({
      email,
      password: hashedPassword,
      name: username,
      verificationToken,
      verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "Sent Verification Email",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ success: false, message: error.errors[0].message });
    }

    console.error("Error during signup:", error);
    return next(
      createHttpError(500, "Unexpected error occurred during signup")
    );
  }
};

export const verifyEmail = async (req, res) => {
  const validatedData = verifyEmailSchema.parse(req.body);

  const { code } = validatedData;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Verification code is invalid or has expired.",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpiresAt = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ success: false, message: error.errors[0].message });
    }
    console.error("Error in verifyEmail controller:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const login = async (req, res) => {
  try {
    const validatedData = signinSchema.parse(req.body);

    const { email, password } = validatedData;

    const user = await User.findOne({ email }).select(
      "+password +isEmailVerified"
    );
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Email is not verified. Please verify your email first.",
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful.",
      accessToken,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }

    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error("Error during logout:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const forgotPassword = async (req, res) => {
  const validatedData = forgetPasswordSchema.parse(req.body);
  const { email } = validatedData;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist." });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is not verified. Please verify your email first.",
      });
    }

    const resetToken = generateVerificationToken();
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    await user.save();

    try {
      const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
      await sendPasswordResetEmail(user.email, resetURL);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send password reset email. Try again later.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ success: false, message: error.errors[0].message });
    }
    console.error("Error in forgotPassword controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const resetPassword = async (req, res) => {
  const validatedData = resetPasswordSchema.parse(req);
  const { token } = validatedData.params;
  const { password } = validatedData.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ success: false, message: error.errors[0].message });
    }
    console.error("Error in resetPassword controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const refreshToken = async (req, res) => {
  const validatedData = refreshTokenSchema.parse(req.cookies);

  const { refreshToken } = validatedData;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

export const googleCallback = async (req, res, next) => {
  try {
    const user = req.user;

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ accessToken });

    res.redirect("http://localhost:5173");
  } catch (error) {
    console.error("Error in Google callback:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
