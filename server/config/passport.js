const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { User } = require("../models");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("\n========== GOOGLE LOGIN ==========");

        console.log("Google Profile ID:", profile.id);

        const email = profile.emails?.[0]?.value;
        console.log("Google Email:", email);

        const user = await User.findOne({
          where: {
            email,
          },
        });

        console.log("User Found:", user ? "YES" : "NO");

        if (!user) {
          console.log("❌ User not found in database.");
          return done(null, false);
        }

        if (!user.googleId) {
          console.log("🔗 Linking Google account...");

          user.googleId = profile.id;
          user.provider = "GOOGLE";

          await user.save();

          console.log("✅ Google account linked.");
        } else {
          console.log("✅ Google account already linked.");
        }

        console.log("✅ Google authentication successful.");
        console.log("==================================\n");

        return done(null, user);
      } catch (error) {
        console.error("❌ Passport Error:", error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;