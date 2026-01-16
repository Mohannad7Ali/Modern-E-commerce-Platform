import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { UserRepository } from '@/modules/auth/repositories/user.repository';
import { TokenService } from '@/modules/auth/utils/token.service';
const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('🔍 [OPTIONAL AUTH] optionalAuth middleware called');
  console.log('🔍 [OPTIONAL AUTH] Request headers:', req.headers);

  const accessToken = req.cookies?.accessToken;
  console.log('🔍 [OPTIONAL AUTH] Access token from header:', accessToken ? 'present' : 'not present');

  if (!accessToken) {
    console.log('🔍 [OPTIONAL AUTH] No access token found, proceeding without auth');
    return next();
  }

  try {
    const payload = TokenService.verifyAccessToken(accessToken) as JwtPayload;
    console.log('🔍 [OPTIONAL AUTH] Token decoded successfully:', payload);

    const user = await UserRepository.findUserById(payload.user.id);
    console.log('🔍 [OPTIONAL AUTH] User found in database:', user);

    if (user) {
      req.user = user;
      console.log('🔍 [OPTIONAL AUTH] User set in request:', req.user);
    } else {
      console.log('🔍 [OPTIONAL AUTH] User not found in database');
    }
  } catch (error) {
    console.log('🔍 [OPTIONAL AUTH] Error in optionalAuth:', error);
  }

  console.log('🔍 [OPTIONAL AUTH] Proceeding to next middleware');
  next();
};

export default optionalAuth;
