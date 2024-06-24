import { Request, Response, NextFunction } from 'express';
import db from '../utils/db';
import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * Middleware to grant other middlewares the current user's role.
 * @returns Middleware function for Express.js.
 */
export const currentRoleMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const token = authorization.split(' ')[1];
            const decodeToken = jwt.decode(token) as JwtPayload;
            const userId = decodeToken.userId;

            // Fetch the user's role from the database
            const userRole: { role: number } | null = await db.user.findUnique({
                where: { id: userId },
                select: { role: true }
            });

            if (!userRole?.role) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            // Attach the user's role to the request object
            req.userRole = userRole.role;

            return next();
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};
