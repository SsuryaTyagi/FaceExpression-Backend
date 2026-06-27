require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;  
const User = require('../models/user.model');

// ── Google Strategy ──
passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          if (!user.avatar) user.avatar = profile.photos[0]?.value;
          await user.save();
          return done(null, user);
        }

        user = await User.create({
          username: profile.displayName,
          email:    profile.emails[0].value,
          googleId: profile.id,
          avatar:   profile.photos[0]?.value || '',
          verified: true
        });
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// ── GitHub Strategy ──
passport.use(
  new GitHubStrategy(         
    {
      clientID:     process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:  process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.username}@github.noemail.com`;

        let user = await User.findOne({ githubId: profile.id });
        if (user) return done(null, user);

        user = await User.findOne({ email });
        if (user) {
          user.githubId = profile.id;
          if (!user.avatar) user.avatar = profile.photos[0]?.value;
          await user.save();
          return done(null, user);
        }

        user = await User.create({
          username: profile.username || profile.displayName,
          email,
          githubId: profile.id,
          avatar:   profile.photos[0]?.value || '',
          verified: true
        });
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});