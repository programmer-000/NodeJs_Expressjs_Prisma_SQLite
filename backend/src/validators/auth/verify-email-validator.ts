import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware function for validating the request body when verifying an email address.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {Response|undefined} - If validation fails, it sends a response with status 400 and the validation errors. Otherwise, it calls the next middleware function.
 */
export const verifyEmailValidator = [
    body('verifyEmail.email')
        .isEmail().withMessage('Email is not valid')
        .notEmpty().withMessage('Email is required'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({message: 'Validation Error', errors: errors.array()});
        }
        next();
    }
];
