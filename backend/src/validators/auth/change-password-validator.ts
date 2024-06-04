import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const changePasswordValidator = [
    body('password')
        .isString().withMessage('Password must be a string').withMessage('Password must be a string')
        .isLength({ min: 6, max: 50 }).withMessage('Password must be at least 6 characters long')
        .notEmpty().withMessage('Password is required'),
    body('passwordResetToken.id')
        .isInt({ min: 1 }).withMessage('User ID must be a positive integer')
        .notEmpty().withMessage('User ID is required'),
    body('passwordResetToken.token')
        .isString().withMessage('Token must be a string')
        .notEmpty().withMessage('Token is required'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation Error', errors: errors.array() });
        }
        next();
    }
];
