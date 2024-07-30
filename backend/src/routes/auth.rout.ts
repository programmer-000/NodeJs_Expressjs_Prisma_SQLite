import express from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import * as AuthUserHandler from '../controllers/auth.controller';
import * as UserHandler from '../controllers/users.controller';

import { generateTokens } from '../utils/jwt';
import { handlerEmailSending } from '../utils/sendEmail';
import { hashToken } from '../utils/hashToken';
import { UserModel } from '../models';
import {
    loginUserValidator,
    currentPasswordValidator,
    refreshTokenValidator,
    registerUserValidator,
    revokeRefreshTokenValidator,
    verifyEmailValidator,
    resetPasswordLinkValidator,
    changePasswordValidator,
    handleErrorsValidator,
} from '../validators';


export const authRouter = express.Router();

const urlClient = process.env.BASE_URL_CLIENT as string;

/**
 POST: Register
 */
authRouter.post(
    '/register',
    registerUserValidator,
    handleErrorsValidator,
    async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body.registerUserData;
            const user = req.body.registerUserData;
            const hashPassword = bcrypt.hashSync(user.password, 7);

            if (!email || !password) {
                return res.status(400).json({ message: `You must provide an email and a password` });
            }

            const existingUser = await AuthUserHandler.findUserByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: `Email already in use` });
            }

            user.password = hashPassword;
            const createdUser = await UserHandler.createUserHandler(user);
            const userId = createdUser.newUser.id;

            const jti: any = uuidv4();
            const { accessToken, refreshToken } = generateTokens(createdUser.newUser, jti);
            await AuthUserHandler.addRefreshTokenToWhitelist({ jti, refreshToken, userId });

            /** SEND access to the site */
            /* Set transporter options:*/
            const siteLink = `${urlClient}`;
            const subject = 'Registration on the website!';
            const htmlContent = `<h2>Hi ${createdUser.newUser.firstName} ${createdUser.newUser.lastName}!</h2>
                <p>You have registered on the site "NodeJs_Expressjs_Prisma - ${siteLink}"</p>
                <p>To enter the site use:</p>
                <p>Login - ${createdUser.newUser.email}</p>
                <p>Password - ${password} </p>`;
            const text = `Some text`;

            /* Start send E-MAIL*/
            await handlerEmailSending(existingUser, email, subject, htmlContent, text);

            return res.status(201).json({
                message: `Registration successful!`,
                accessToken,
                refreshToken
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
);


/**
 POST: Login
 */
authRouter.post(
    '/login',
    loginUserValidator,
    handleErrorsValidator,
    async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body.loginUserData;

            if (!email || !password) {
                return res.status(400).json({message: `You must provide an email and a password`})
            }

            // Check existence User
            const existingUser = await AuthUserHandler.findUserByEmail(email);
            let userId = null;
            let userStatus = null;
            if (!existingUser) {
                return res.status(400).json({message: `User - (${email}) not found`})
            } else {
                userStatus = existingUser.status;
                userId = existingUser.id;
            }

            // Check if the user is active
            if (!userStatus) {
                return res.status(400).json({message: `User - (${email}) is inactive`})
            }

            // Check the validity of the password
            const validPassword = bcrypt.compareSync(password, existingUser.password)
            if (!validPassword) {
                return res.status(400).json({message: `Incorrect password entered`})
            }

            // Generate tokens
            const jti: any = uuidv4();
            const {accessToken, refreshToken} = generateTokens(existingUser, jti);
            const userInfo = {
                id: existingUser.id,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                avatar: existingUser.avatar,
                email: existingUser.email,
                role: existingUser.role
            };

            await AuthUserHandler.addRefreshTokenToWhitelist({jti, refreshToken, userId});
            return res.status(200).json({
                userInfo,
                accessToken,
                refreshToken
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
);


/**
 POST: RefreshToken
 */
authRouter.post(
    '/refreshToken',
    refreshTokenValidator,
    handleErrorsValidator,
    async (req: Request, res: Response) => {
        try {
            const {refreshToken} = req.body;

            if (!refreshToken) {
                return res.status(400).json({message: `Missing refresh token.`})
            }
            const payload: JwtPayload | any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
            const savedRefreshToken = await AuthUserHandler.findRefreshTokenById(payload.jti);

            if (!savedRefreshToken) {
                return res.status(401).json({message: `Unauthorized`})
            }

            const hashedToken = hashToken(refreshToken);
            if (hashedToken !== savedRefreshToken.hashedToken) {
                return res.status(401).json({message: `Unauthorized`})
            }

            const user = await UserHandler.findUserById(payload.userId);
            if (!user) {
                return res.status(401).json({message: `Unauthorized`})
            }

            await AuthUserHandler.revokeTokens(savedRefreshToken.id);
            // await AuthUserHandler.deleteRefreshToken(savedRefreshToken.id);
            const jti: any = uuidv4();
            const {accessToken, refreshToken: newRefreshToken} = generateTokens(user, jti);
            await AuthUserHandler.addRefreshTokenToWhitelist({jti, refreshToken: newRefreshToken, userId: user.id});

            return res.status(201).json({
                accessToken,
                refreshToken: newRefreshToken
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
);

/**
 * POST: Revoke Refresh Tokens
 */
authRouter.post(
    '/revokeRefreshTokens',
    revokeRefreshTokenValidator,
    handleErrorsValidator,
    async (req: Request, res: Response) => {
        try {
            const {refreshToken} = req.body;

            if (!refreshToken) {
                return res.status(400).json({message: `Missing refresh token.`})
            }
            const payload: JwtPayload | any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
            const savedRefreshToken = await AuthUserHandler.findRefreshTokenById(payload.jti);

            if (!savedRefreshToken) {
                return res.status(401).json({message: `Unauthorized`})
            }

            await AuthUserHandler.revokeTokens(savedRefreshToken.id);
            return res.status(201).json({message: `Tokens revoked for user`});
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
);


/**
 GET: Valid Password
 */
authRouter.post(
    '/valid_password',
    currentPasswordValidator,
    handleErrorsValidator,
    async (req: Request, res: Response) => {
        const {email, password} = req.body.validPasswordData;

        /** Check existence User */
        if (!email || !password) {
            return res.status(400).json({message: `You must provide an email and a password`})
        }
        const existingUser: UserModel | null = await AuthUserHandler.findUserByEmail(email);
        if (!existingUser) {
            return res.status(400).json({message: `User - (${email}) not found`})
        }
        /** Check the validity of the current password */
        const validPassword: boolean = bcrypt.compareSync(password, existingUser.password)
        return res.status(201).json({validPassword});
    }
);


/**
 GET: Checking whether the Email exists in the database for password recovery
 */
authRouter.post(
    '/verify_email',
    verifyEmailValidator,
    handleErrorsValidator,
    async (req: Request, res: Response) => {
        try {
            const {email} = req.body.verifyEmail;
            if (!email) {
                return res.status(400).json({message: `You must provide an email`});
            }

            /** Check existence User */
            const existingUser = await AuthUserHandler.findUserInfoByEmail(email);
            if (!existingUser) {
                return res.status(400).json({message: `User (${email}) not found!`});
            }

            const existingUserId: number = existingUser.id;
            const existingResetTokens = existingUser.passwordResetToken;

            /** Delete existing PasswordResetTokens */
            if (!existingResetTokens || existingResetTokens.length) {
                await AuthUserHandler.deletePreviousPasswordResetTokens(existingUserId);
            }

            /** Generate PasswordResetToken */
            const generatedPasswordResetToken = crypto.randomBytes(32);
            if (!generatedPasswordResetToken) {
                return res.status(500).json({
                    message: 'An error occurred. Please try again later.',
                    status: 'error',
                });
            }
            const convertPasswordResetToken = generatedPasswordResetToken.toString('hex');

            /** Setting the token expire (30 MINUTES) */
            const lifeTime: number = 30;
            const expireTimeReset = new Date(Date.now() + lifeTime * 60 * 1000);

            /** Write the token to the database */
            await AuthUserHandler.addPasswordResetToken(convertPasswordResetToken, existingUserId, expireTimeReset.toISOString());

            /** Generate a link to reset the token */
            const resetLink = `${urlClient}/auth/reset-password?id=${existingUser.id}&token=${convertPasswordResetToken}`;

            /** SEND a link to reset your password by e-mail */
            /* Set transporter options:*/
            const subject = 'Reset password!'
            const htmlContent = `<h2>Hi ${existingUser.firstName}</h2> <p>To set a new password, follow this link ${resetLink}</p>`;
            const text = `To set a new password, follow this link ${resetLink}`;

            /* Start send E-MAIL*/
            await handlerEmailSending(existingUser, email, subject, htmlContent, text);

            return res.status(201).json({message: `Password reset link sent to your email account - (${email})`});
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
);


/**
 POST: Reset Password link
 */
authRouter.post(
    '/reset_password_link',
    resetPasswordLinkValidator,
    handleErrorsValidator,
    async (req: Request, res: Response) => {
        const {passwordResetToken} = req.body;
        if (!passwordResetToken) {
            return res.status(400).json({message: `Missing password reset token.`})
        }

        /** Chek existence PasswordResetToken */
        const userId: number = passwordResetToken.id;
        const requestResetToken = passwordResetToken.token;
        const existingPasswordResetToken = await AuthUserHandler.findPasswordResetToken(userId);

        /** Checking the validity and expiration time of the PasswordResetToken */
        if (!existingPasswordResetToken || !existingPasswordResetToken.length || requestResetToken !== existingPasswordResetToken[0].resetToken) {
            return res.status(400).json({message: `Invalid or Expired Token!`});
        }

        /** Checking the expiration time of the PasswordResetToken */
        const expireResetTokenTime = existingPasswordResetToken[0].expireTime;
        if (!expireResetTokenTime || expireResetTokenTime.getTime() < Date.now()) {
            return res.status(400).json({message: `Time to change password has expired. Submit a new req to change your password!`});
        }

        const lifetimePasswordResetToken = Math.round((expireResetTokenTime.getTime() - Date.now()) / 60 / 1000);
        return res.status(201).json({message: `Password reset page is available for another - (${lifetimePasswordResetToken}) minutes`});
    }
);


/**
 POST: Change Password
 */
authRouter.put(
    '/change_password',
    changePasswordValidator,
    handleErrorsValidator,
    async (req: Request, res: Response) => {
        const {password, passwordResetToken} = req.body;
        if (!passwordResetToken || !password) {
            return res.status(400).json({message: `Missing password or password reset token.`});
        }
        /** Check existence PasswordResetToken */
        const userId: number = Number(passwordResetToken.id);
        const requestResetToken = passwordResetToken.token;
        const existingPasswordResetToken = await AuthUserHandler.findPasswordResetToken(userId);

        /** Checking the validity and expiration time of the PasswordResetToken */
        if (!existingPasswordResetToken || !existingPasswordResetToken.length || requestResetToken !== existingPasswordResetToken[0].resetToken) {
            return res.status(400).json({message: `Invalid or Expired Token!`});
        }
        /** Checking the expiration time of the PasswordResetToken */
        if (!existingPasswordResetToken[0].expireTime || existingPasswordResetToken[0].expireTime.getTime() < Date.now()) {
            return res.status(400).json({message: `Time to change password has expired. Submit a new req to change your password!`});
        }
        /** Update the password of an existing user */
        const hashNewPassword = bcrypt.hashSync(password, 7);
        await AuthUserHandler.changePasswordHandler({password: hashNewPassword}, userId);
        await AuthUserHandler.deletePreviousPasswordResetTokens(userId);

        return res.status(201).json({message: `Password changed successfully!`});
    }
);
