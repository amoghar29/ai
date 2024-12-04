import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { config } from "dotenv";
import { LoginWithGoogle } from "../helpers/socialLogin.js";
import { getUserById } from "../helpers/data.js";

config();

// Google Strategy
const GoogleProvider = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ["profile", "email"],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      await LoginWithGoogle(profile, done);
    } catch (error) {
      done(error, null);
    }
  }
);

// JWT Strategy
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_JWT_SECRET,
};

const JWTProvider = new JwtStrategy(options, async (jwt_payload, done) => {
  try {
    const user = await getUserById(jwt_payload.id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

// Export Passport Configuration
export default (passport) => {
  passport.use(GoogleProvider);
  passport.use(JWTProvider);
};
