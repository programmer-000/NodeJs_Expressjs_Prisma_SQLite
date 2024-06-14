import { query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware function for validating the request query when getting users.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {Response|undefined} - If validation fails, it sends a response with status 400 and the validation errors. Otherwise, it calls the next middleware function.
 */
export const getUsersValidator = [
    query('orderByColumn').optional().isString().withMessage('orderByColumn must be a string'),
    query('orderByDirection').optional().isIn(['asc', 'desc']).withMessage('orderByDirection must be "asc" or "desc"'),
    query('pageIndex').optional().isInt().withMessage('pageIndex must be an integer'),
    query('pageSize').optional().isInt().withMessage('pageSize must be an integer'),
    query('firstName').optional({nullable: true, checkFalsy: true}).isString().withMessage('firstName must be a string'),
    query('lastName').optional({nullable: true, checkFalsy: true}).isString().withMessage('lastName must be a string'),
    query('email').optional({nullable: true, checkFalsy: true}).isEmail().withMessage('email must be a valid email'),
    query('roles').optional().custom(value => {
        try {
            const roles = JSON.parse(value);
            if (Array.isArray(roles) && roles.every(role => typeof role === 'number')) {
                return true;
            }
            throw new Error('roles must be a JSON array of integers');
        } catch (err) {
            throw new Error('roles must be a JSON array of integers');
        }
    }),
    // Middleware to check for validation errors
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation Error', errors: errors.array() });
        }
        next();
    }
];
