import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { ConfigEnvironment } from "~/config/env";

import { AuthService } from "~/modules/auth/services/auth.service";
import { HttpResponse } from "~/utils/http-response";

// config lay token o headers moi request
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ConfigEnvironment.jwtSecret,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await AuthService.getById(jwtPayload.id);

      if (!user) {
        throw HttpResponse.error({ message: "Unauthorize" });
      }

      if (user) return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// // Google OAuth Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: ConfigEnvironment.googleClientId,
//       clientSecret: ConfigEnvironment.googleClientSecret,
//       callbackURL: '/api/auth/google/callback',
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails?.[0].value || ''

//         if (!email) throw HttpResponse.error({ message: 'Email not valid' })

//         const user = await AuthService.registerBySocial({
//           data: { email, name: profile.displayName, password: '' },
//           providerId: profile.id,
//           provider: EAuthProvider.Google,
//         })

//         return done(null, user)
//       } catch (err) {
//         return done(err, false)
//       }
//     }
//   )
// )

// var scopes = ['identify', 'email', 'guilds', 'guilds.join']

// passport.use(
//   new DiscordStrategy(
//     {
//       clientID: 'id',
//       clientSecret: 'secret',
//       callbackURL: '/api/auth/discord/callback',
//       scope: scopes,
//     },
//     async function (accessToken, refreshToken, profile, done) {
//       console.log(profile)
//       // User.findOrCreate({ discordId: profile.id }, function (err, user) {
//       //   return cb(err, user)
//       // })

//       try {
//         // const email = profile.emails?.[0].value || ''
//         // if (!email) throw HttpResponse.error({ message: 'Email not valid' })
//         // const user = await AuthService.registerBySocial({
//         //   data: { email, name: profile.displayName, password: '' },
//         //   providerId: profile.id,
//         //   provider: EAuthProvider.Google,
//         // })
//         // return done(null, user)
//       } catch (err) {
//         return done(err, false)
//       }
//     }
//   )
// )

export default passport;
