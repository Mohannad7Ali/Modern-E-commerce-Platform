export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password');
  }
}

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('Email already exists');
  }
}

export class InvalidRefreshTokenError extends Error {
  constructor() {
    super('Invalid or expired refresh token');
  }
}
