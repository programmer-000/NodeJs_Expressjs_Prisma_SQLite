import { body, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware function for parsing the post_params JSON string in the request body.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {Response|undefined} - If parsing fails, it sends a response with status 400 and an error message. Otherwise, it calls the next middleware function.
 */
export const parsePostCreateParams = (req: Request, res: Response, next: NextFunction): Response | undefined => {
    try {
        req.body.post_params = JSON.parse(req.body.post_params);
        next();
    } catch (e) {
        return res.status(400).json({ errors: [{ msg: 'Invalid JSON in post_params' }] });
    }
};

/**
 * Middleware function for validating the request body when creating a post.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {Response|undefined} - If validation fails, it sends a response with status 400 and the validation errors. Otherwise, it calls the next middleware function.
 */
export const createPostValidator = [
    body('post_params.title')
        .isString().withMessage('Title must be a string')
        .notEmpty().withMessage('Title must be a non-empty string'),
    body('post_params.description')
        .isString().withMessage('Description must be a string')
        .notEmpty().withMessage('Description must be a non-empty string'),
    body('post_params.content')
        .isString().withMessage('Content must be a string')
        .notEmpty().withMessage('Content must be a non-empty string'),
    body('post_params.categories')
        .isArray({ min: 1 })
        .withMessage('Categories must be an array with at least one category'),
    body('post_params.categories.*.id').isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),
    body('post_params.published').isBoolean().withMessage('Published must be a boolean'),
    body('post_params.userId').isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation Error', errors: errors.array() });
        }
        next();
    }
];

