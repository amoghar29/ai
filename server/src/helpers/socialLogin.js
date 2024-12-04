import User from "../models/user.model.js";

export const LoginWithGoogle = async (profile, done) => {
  try {
    const { email, sub } = profile._json;

    if (!email) {
      return done(new Error("No email found in the Google profile"), false);
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email,
        isVerified: true, // Assuming Google accounts are verified
        provider: "google",
        providerId: sub,
        profilePicture: profile.photos?.[0]?.value,
      });
    }

    // Check if the provider ID matches the account
    if (user.provider !== "google" || user.providerId !== sub) {
      return done(
        new Error("The account is already linked with another provider."),
        false
      );
    }

    done(null, user);
  } catch (err) {
    console.error("Error during Google login:", err);
    done(err, false);
  }
};
