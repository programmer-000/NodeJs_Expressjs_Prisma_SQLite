import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

/**
 * Middleware function for validating the request body when registering a user.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {Response|undefined} - If validation fails, it sends a response with status 400 and the validation errors. Otherwise, it calls the next middleware function.
 */
export const registerUserValidator = [
    body('registerUserData.email').isEmail().withMessage('Email must be valid'),
    body('registerUserData.password').isLength({ min: 6, max: 50 }).withMessage('Password must be at least 6 characters'),
    body('registerUserData.firstName')
        .isString().withMessage('First name must be a string')
        .notEmpty().withMessage('First name must be a non-empty string'),
    body('registerUserData.lastName')
        .isString().withMessage('Last name must be a string')
        .notEmpty().withMessage('Last name must be a non-empty string'),
    body('registerUserData.role').isInt().withMessage('Role must be an integer'),
    body('registerUserData.location').isString().withMessage('Location must be a string'),
    body('registerUserData.status').isBoolean().withMessage('Status must be a boolean'),
    body('registerUserData.birthAt').isISO8601().withMessage('Birth date must be a valid date'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation Error', errors: errors.array() });
        }
        next();
    }
];
