export interface AccessTokenPayload {
  userId: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
}

export interface RefreshTokenPayload {
  tokenId: string;
  userId: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
