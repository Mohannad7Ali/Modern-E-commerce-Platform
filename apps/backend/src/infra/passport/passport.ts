import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '@/infra/database/prisma';
import { TokenService } from '@/modules/auth/utils/token.service';
import { ROLE } from '@/generated/prisma-client/enums';
interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  googleId?: string | null;
  role: ROLE;
  accessToken: string;
  refreshToken: {
    token: string;
    expiresAt: Date;
  };
}
export default function configurePassport() {
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
          let user = await prisma.user.findUnique({
            where: { email: profile.emails![0].value }
          });

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

          const payload = {
            userId: user.id,
            role: 'USER' as ROLE
          };

          const authUser: AuthenticatedUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            googleId: user.googleId,
            role: user.role,
            accessToken: TokenService.generateAccessToken(payload),
            refreshToken: TokenService.generateRefreshToken()
          };

          return done(null, authUser);
        } catch (error) {
          done(error);
        }
      }
    )
  );
}
