import db from '../utils/db';
import { hashToken } from '../utils/hashToken';
import { UserModel, RefreshToken, PasswordResetTokenModel } from '../models';

/**
 * Handlers for user-related operations.
 * These operations interact with the database to manage user authentication and tokens.
 */

/**
 * Finds a user by email.
 * @param email The email of the user to find.
 * @returns Promise<any | null> A promise that resolves to the found user or null if not found.
 */
export const findUserByEmail = async (email: string): Promise<UserModel | null> => {
    return db.user.findUnique({
        where: {
            email: email,
        },
    });
};

/**
 * Finds user information by email.
 * @param email The email of the user to find information for.
 * @returns Promise<any | null> A promise that resolves to the user information or null if not found.
 */
export const findUserInfoByEmail = async (email: string): Promise<UserModel | null> => {
    return db.user.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
            password: true,
            firstName: true,
            lastName: true,
            passwordResetToken: true,
            email: true,
            role: true,
            location: true
        },
    });
};

/**
 * Adds a refresh token to the whitelist.
 * @param jti The unique identifier for the refresh token.
 * @param refreshToken The refresh token to hash and store.
 * @param userId The ID of the user associated with the refresh token.
 * @returns Promise<any | null> A promise that resolves to the added refresh token or null if not added.
 */
export const addRefreshTokenToWhitelist = async ({ jti, refreshToken, userId }: any): Promise<RefreshToken | null> => {
    return db.refreshToken.create({
        data: {
            id: jti,
            hashedToken: hashToken(refreshToken),
            userId: userId
        },
    });
};

/**
 * Finds a refresh token by its unique identifier.
 * @param id The unique identifier of the refresh token to find.
 * @returns Promise<any | null> A promise that resolves to the found refresh token or null if not found.
 */
export const findRefreshTokenById = async (id: any): Promise<RefreshToken | null> => {
    return db.refreshToken.findUnique({
        where: {
            id,
        },
    });
};

/**
 * Deletes a refresh token by setting its 'revoked' property to true.
 * @param id The unique identifier of the refresh token to delete.
 * @returns Promise<any | null> A promise that resolves to the deleted refresh token or null if not found.
 */
export const deleteRefreshToken = async (id: any): Promise<RefreshToken | null> => {
    return db.refreshToken.update({
        where: {
            id,
        },
        data: {
            revoked: true
        }
    });
};

/**
 * Revokes all tokens associated with a user by deleting them from the database.
 * @param id The ID of the user whose tokens should be revoked.
 * @returns Promise<any | null> A promise that resolves when the tokens are successfully revoked.
 */
export const revokeTokens = async (id: any): Promise<void> => {
    await db.refreshToken.delete({
        where: {
            id,
        },
    });
};

/**
 * Finds password reset tokens associated with a user by their user ID.
 * @param userId The ID of the user whose password reset tokens should be found.
 * @returns Promise<PasswordResetTokenModel | null> A promise that resolves to an array of password reset tokens or null if none are found.
 */
export const findPasswordResetToken = async (userId: number): Promise<PasswordResetTokenModel[] | null> => {
    return db.passwordResetToken.findMany({
        where: {
            userId: +userId,
        },
    });
};

/**
 * Deletes all previous password reset tokens from the database.
 * @returns Promise<any | null> A promise that resolves when all previous password reset tokens are successfully deleted.
 */
export const deletePreviousPasswordResetTokens = async (existingUserId: number): Promise<void> => {
    await db.passwordResetToken.deleteMany({
            where: {
                userId: existingUserId
            },
    });
};

/**
 * Adds a password reset token to the database.
 * @param convertPasswordResetToken The password reset token to store.
 * @param userId The ID of the user associated with the password reset token.
 * @param expireTimeReset The expiration time of the password reset token.
 * @returns Promise<any | null> A promise that resolves to the added password reset token or null if not added.
 */
export const addPasswordResetToken = async (convertPasswordResetToken: any, userId: number, expireTimeReset: any): Promise<PasswordResetTokenModel | null> => {
    return db.passwordResetToken.create({
        data: {
            resetToken: convertPasswordResetToken,
            userId,
            expireTime: expireTimeReset
        },
    });
};

/**
 * Changes the password for a user.
 * @param newPassword The new password to set for the user.
 * @param userId The ID of the user whose password should be changed.
 * @returns Promise<any> A promise that resolves when the password is successfully changed.
 */
export const changePasswordHandler = async (newPassword: any, userId: number): Promise<void> => {
    const { password } = newPassword;
    await db.user.update({
        where: {
            id: userId,
        },
        data: {
            password,
        }
    });
};
