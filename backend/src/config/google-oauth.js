import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import emailService from '../services/emailService.js';

const configureGoogleAuth = () => {
  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // User exists, update their info if needed
        if (user.name !== profile.displayName || 
            user.profileImage !== profile.photos[0]?.value) {
          user.name = profile.displayName;
          user.profileImage = profile.photos[0]?.value || '';
          await user.save();
        }
        return done(null, user);
      }

      // Check if user exists with same email but different provider
      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.profileImage = profile.photos[0]?.value || user.profileImage;
        await user.save();
        return done(null, user);
      }

      // Create new user
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        profileImage: profile.photos[0]?.value || '',
        authProvider: 'google'
      });

      await user.save();

      // Send welcome email for new users (don't wait for it)
      emailService.sendWelcomeEmail(user).catch(err => {
        console.error('Failed to send welcome email:', err);
      });

      done(null, user);

    } catch (error) {
      console.error('Google OAuth error:', error);
      done(error, null);
    }
  }));
};

export default configureGoogleAuth;