import { Request, Response, NextFunction } from 'express';
import { RoleTypesEnum } from '../enums/role-types.enum';

/**
 * Middleware to check if the user has one of the allowed roles.
 * @param allowedRoles - Array of roles that are allowed to access the route.
 * @returns Middleware function for Express.js.
 */
export const allowedRoleMiddleware = (allowedRoles: RoleTypesEnum[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userRole: number | undefined = req.userRole;

        try {
            // If user's role is not found or not in the allowed roles, respond with 403 Forbidden
            if (!userRole || !allowedRoles.includes(userRole)) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            return next();

        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};
