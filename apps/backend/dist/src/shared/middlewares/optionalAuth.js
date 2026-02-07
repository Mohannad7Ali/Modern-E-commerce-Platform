"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = require("@/modules/auth/repositories/user.repository");
const token_service_1 = require("@/modules/auth/utils/token.service");
const optionalAuth = async (req, res, next) => {
    console.log('🔍 [OPTIONAL AUTH] optionalAuth middleware called');
    console.log('🔍 [OPTIONAL AUTH] Request headers:', req.headers);
    const accessToken = req.cookies?.accessToken;
    console.log('🔍 [OPTIONAL AUTH] Access token from header:', accessToken ? 'present' : 'not present');
    if (!accessToken) {
        console.log('🔍 [OPTIONAL AUTH] No access token found, proceeding without auth');
        return next();
    }
    try {
        const payload = token_service_1.TokenService.verifyAccessToken(accessToken);
        console.log('🔍 [OPTIONAL AUTH] Token decoded successfully:', payload);
        const user = await user_repository_1.UserRepository.findUserById(payload.user.id);
        console.log('🔍 [OPTIONAL AUTH] User found in database:', user);
        if (user) {
            req.user = user;
            console.log('🔍 [OPTIONAL AUTH] User set in request:', req.user);
        }
        else {
            console.log('🔍 [OPTIONAL AUTH] User not found in database');
        }
    }
    catch (error) {
        console.log('🔍 [OPTIONAL AUTH] Error in optionalAuth:', error);
    }
    console.log('🔍 [OPTIONAL AUTH] Proceeding to next middleware');
    next();
};
exports.default = optionalAuth;
