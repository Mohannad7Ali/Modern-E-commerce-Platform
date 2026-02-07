"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidRefreshTokenError = exports.EmailAlreadyExistsError = exports.InvalidCredentialsError = void 0;
class InvalidCredentialsError extends Error {
    constructor() {
        super('Invalid email or password');
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class EmailAlreadyExistsError extends Error {
    constructor() {
        super('Email already exists');
    }
}
exports.EmailAlreadyExistsError = EmailAlreadyExistsError;
class InvalidRefreshTokenError extends Error {
    constructor() {
        super('Invalid or expired refresh token');
    }
}
exports.InvalidRefreshTokenError = InvalidRefreshTokenError;
