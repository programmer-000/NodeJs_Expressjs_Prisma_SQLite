import { body, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware function for parsing the user_params JSON string in the request body.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 * @returns {Response|undefined} - If parsing fails, it sends a response with status 400 and an error message. Otherwise, it calls the next middleware function.
 */
export const parseUserUpdateParams = (req: Request, res: Response, next: NextFunction): Response | undefined => {
    try {
        req.body.user_params = JSON.parse(req.body.user_params);
        req.body.imageOrUrl = JSON.parse(req.body.imageOrUrl);
        req.body.previousImageUrl = JSON.parse(req.body.previousImageUrl);
        next();
    } catch (e) {
        return res.status(400).json({ errors: [{ msg: 'Invalid JSON in request body' }] });
    }
};

/**
 * Middleware function for validating the request body when updating a user.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 * @returns {Response|undefined} - If validation fails, it sends a response with status 400 and the validation errors. Otherwise, it calls the next middleware function.
 */
export const updateUserValidator = [
    body('user_params.id').isInt().withMessage('ID must be an integer'),
    body('user_params.email').isEmail().withMessage('Email must be valid'),
    body('user_params.firstName')
        .isString().withMessage('First name must be a string')
        .notEmpty().withMessage('First name must be a non-empty string'),
    body('user_params.lastName')
        .isString().withMessage('Last name must be a string')
        .notEmpty().withMessage('Last name must be a non-empty string'),
    body('user_params.role').isInt().withMessage('Role must be an integer'),
    body('user_params.location').isString().withMessage('Location must be a string'),
    body('user_params.status').isBoolean().withMessage('Status must be a boolean'),
    body('user_params.birthAt').isISO8601().withMessage('Birth date must be a valid date'),
    body('imageOrUrl').isBoolean().withMessage('ImageOrUrl must be a boolean'),
    body('previousImageUrl').optional({nullable: true, checkFalsy: true}).isString().withMessage('PreviousImageUrl must be a string'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation Error', errors: errors.array() });
        }
        next();
    }
];
