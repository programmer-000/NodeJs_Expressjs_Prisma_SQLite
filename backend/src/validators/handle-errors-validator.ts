import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware function to handle validation errors.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 * @returns {Response|undefined} - If validation fails, it sends a response with status 400 and the validation errors. Otherwise, it calls the next middleware function.
 */
export const handleErrorsValidator = (req: Request, res: Response, next: NextFunction): Response | undefined => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
