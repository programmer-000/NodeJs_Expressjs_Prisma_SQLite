import { body, param, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware function for parsing the post_params, pictureOrUrl, and previousPictureUrl JSON strings in the request body.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 * @returns {Response|undefined} - If parsing fails, it sends a response with status 400 and an error message. Otherwise, it calls the next middleware function.
 */
export const parsePostUpdateParams = (req: Request, res: Response, next: NextFunction): Response | undefined => {
    try {
        req.body.post_params = JSON.parse(req.body.post_params);
        req.body.pictureOrUrl = JSON.parse(req.body.pictureOrUrl);
        req.body.previousPictureUrl = JSON.parse(req.body.previousPictureUrl);
        next();
    } catch (e) {
        return res.status(400).json({ errors: [{ msg: 'Invalid JSON in request body' }] });
    }
};

/**
 * Middleware function for validating the request body when updating a post.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 * @returns {Response|undefined} - If validation fails, it sends a response with status 400 and the validation errors. Otherwise, it calls the next middleware function.
 */
export const updatePostValidator = [
    param('id').isInt().withMessage('ID must be an integer'),
    body('post_params.id').isInt().withMessage('Post ID must be an integer'),
    body('post_params.title')
        .isString().withMessage('Title must be a string')
        .notEmpty().withMessage('Title must be a non-empty string'),
    body('post_params.description')
        .isString().withMessage('Description must be a string')
        .notEmpty().withMessage('Description must be a non-empty string'),
    body('post_params.content').isString().withMessage('Content must be a string'),
    body('post_params.published').isBoolean().withMessage('Published must be a boolean'),
    body('post_params.includedCategories').isArray().withMessage('Included Categories must be an array'),
    body('post_params.excludedCategories').isArray().withMessage('Excluded Categories must be an array'),
    body('post_params.userId').isInt().withMessage('User ID must be an integer'),
    body('pictureOrUrl').isBoolean().withMessage('PictureOrUrl must be a boolean'),
    body('previousPictureUrl').optional({ nullable: true, checkFalsy: true }).isString().withMessage('PreviousPictureUrl must be a string'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation Error', errors: errors.array() });
        }
        next();
    }
];
