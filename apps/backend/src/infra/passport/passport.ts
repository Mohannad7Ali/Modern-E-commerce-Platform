import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '@/infra/database/prisma';
import { TokenService } from '@/modules/auth/utils/token.service';
import { ROLE } from '@/generated/prisma-client/enums';

export default function configurePassport() {
  // GOOGLE
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL:
          process.env.NODE_ENV === 'production'
            ? process.env.GOOGLE_CALLBACK_URL_PROD!
            : process.env.GOOGLE_CALLBACK_URL_DEV!
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await prisma.user.findUnique({ where: { email: profile.emails![0].value } });
          if (user && !user.googleId) {
            user = await prisma.user.update({
              where: { email: profile.emails![0].value },
              data: { googleId: profile.id, avatar: profile.photos![0]?.value || '' }
            });
          }
          if (!user) {
            user = await prisma.user.create({
              data: {
                email: profile.emails![0].value,
                name: profile.displayName,
                googleId: profile.id,
                avatar: profile.photos![0]?.value || ''
              }
            });
          }
          const id = user.id;
          const payload = {
            userId: id,
            role: 'USER' as ROLE
          };
          return done(null, {
            ...user,
            accessToken: TokenService.generateAccessToken(payload),
            refreshToken: TokenService.generateRefreshToken()
          });
          // done back user to passport so i can use it in route
          // req.user = returned object
          // here we combined data with route
        } catch (error) {
          done(error);
        }
      }
    )
  );
}
