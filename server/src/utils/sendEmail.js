import transporter from "../config/mailer.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";

const sendVerificationEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email address",
    html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", token),
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

const sendPasswordResetEmail = async (email, resetURL) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Please use below link to reset your password",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info);
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapCient.send({
      from: sender,
      to: recipient,
      subject: "Password reset successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.log("Error sending password reset success email :- ", error);
    throw new Error("Error sending password reset success email :- ", error);
  }
};

export { sendVerificationEmail, sendPasswordResetEmail, sendResetSuccessEmail };
