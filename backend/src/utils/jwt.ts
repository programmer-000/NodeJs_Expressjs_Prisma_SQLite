import jwt from 'jsonwebtoken';

/**
 * Generates an access token.
 * @param user The user object.
 * @returns The generated access token.
 */
export function generateAccessToken(user: any) {
    const accessSecret = process.env.JWT_ACCESS_SECRET as string;
    return jwt.sign({ userId: user.id }, accessSecret, {
        expiresIn: '20m', // Token expiration time
    });
}

/**
 * Generates a refresh token.
 * @param user The user object.
 * @param jti The JWT ID.
 * @returns The generated refresh token.
 */
export function generateRefreshToken(user: any, jti: any) {
    const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
    return jwt.sign({
        userId: user.id,
        jti
    }, refreshSecret, {
        expiresIn: '30d', // Token expiration time
        // expiresIn: '5h', // Alternative expiration time (optional)
    });
}

/**
 * Generates access and refresh tokens.
 * @param user The user object.
 * @param jti The JWT ID.
 * @returns An object containing the generated access and refresh tokens.
 */
export function generateTokens(user: any, jti: any) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, jti);
    return {
        accessToken,
        refreshToken,
    };
}
