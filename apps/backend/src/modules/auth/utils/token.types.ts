export type Role = 'USER' | 'ADMIN' | 'SUPERADMIN';
export interface AccessTokenPayload {
  userId: string;
  role: Role;
}

export interface RefreshTokenPayload {
  tokenId: string;
  userId: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
