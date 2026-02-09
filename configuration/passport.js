const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { getDB } = require('./db');
const { ObjectId } = require('mongodb');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const db = getDB();
  const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
  done(null, user);
});

passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const db = getDB();

      let user = await db.collection('users').findOne({
        provider: 'github',
        providerId: profile.id
      });

      if (!user) {
        user = {
          name: profile.username,
          email: profile.emails?.[0]?.value || null,
          provider: 'github',
          providerId: profile.id,
          role: 'user',
          createdAt: new Date()
        };

        const result = await db.collection('users').insertOne(user);
        user._id = result.insertedId;
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const db = getDB();

      let user = await db.collection('users').findOne({
        provider: 'google',
        providerId: profile.id
      });

      if (!user) {
        user = {
          name: profile.displayName,
          email: profile.emails?.[0]?.value || null,
          provider: 'google',
          providerId: profile.id,
          role: 'user',
          createdAt: new Date()
        };

        const result = await db.collection('users').insertOne(user);
        user._id = result.insertedId;
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));


module.exports = passport;
