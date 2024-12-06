import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import passport from 'passport';
import User from '../models/User';

passport.use(
  new Strategy(
    {
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    },
    async function (
      _accessToken: string,
      _refreshToken: string,
      profile: any,
      done: VerifyCallback
    ) {
      try {
        const [user] = await User.findOrCreate({
          where: { email: profile.emails[0].value, googleId: profile.id },
          defaults: {
            email: profile.emails[0].value,
            googleId: profile.id,
            type: 'google'
          }
        });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.serializeUser((user, done) => {
  done(null, (user as any).id);
});

export default passport;
