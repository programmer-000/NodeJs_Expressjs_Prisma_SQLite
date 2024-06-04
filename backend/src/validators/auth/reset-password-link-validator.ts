import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware function for validating the request body when resetting a password.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {Response|undefined} - If validation fails, it sends a response with status 400 and the validation errors. Otherwise, it calls the next middleware function.
 */
export const resetPasswordLinkValidator = [
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
