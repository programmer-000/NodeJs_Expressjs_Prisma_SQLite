import { NextFunction, Request, Response } from 'express';
import { RoleTypesEnum } from '../enums/role-types.enum';
import { roles } from './roles';

/**
 * Middleware to check if the user has the required permission.
 * @param permission - Permission required to access the route.
 * @returns Middleware function for Express.js.
 */
export const checkPermissionMiddleware = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.userRole as RoleTypesEnum;

        if (!userRole) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const rolePermissions = roles[userRole];

        if (rolePermissions.includes('*') || rolePermissions.includes(permission)) {
            return next();
        } else {
            return res.status(403).json({ message: 'Forbidden' });
        }
    };
};
