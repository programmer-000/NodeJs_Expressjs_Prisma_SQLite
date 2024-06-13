import { query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Custom validation function that checks if a query parameter is a JSON array of integers.
 * @param field
 */
const optionalJsonArrayOfIntegers = (field: string) =>
    query(field).optional().custom(value => {
        try {
            const array = JSON.parse(value);
            if (Array.isArray(array) && array.every(item => typeof item === 'number' || 'boolean')) {
                return true;
            }
            throw new Error(`${field} must be a JSON array of integers or booleans`);
        } catch (err) {
            throw new Error(`${field} must be a JSON array of integers or booleans`);
        }
    });

/**
 * Middleware function for validating the request query when getting posts.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {Response|undefined} - If validation fails, it sends a response with status 400 and the validation errors. Otherwise, it calls the next middleware function.
 */
export const getPostsValidator = [
    query('pageIndex').optional().isInt().withMessage('pageIndex must be an integer'),
    query('pageSize').optional().isInt().withMessage('pageSize must be an integer'),
    optionalJsonArrayOfIntegers('authors'),
    optionalJsonArrayOfIntegers('categories'),
    optionalJsonArrayOfIntegers('published'),

    // Middleware to check for validation errors
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation Error', errors: errors.array() });
        }
        next();
    }
];
