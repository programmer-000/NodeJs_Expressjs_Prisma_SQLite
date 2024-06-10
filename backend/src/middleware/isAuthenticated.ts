import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware for authenticating requests.
 * Checks for the presence of an authorization header in the request,
 * verifies the JWT token, and adds the token payload to the request object.
 * Throws an error if authentication fails.
 */
export function isAuthenticated(req: any, res: Response, next: NextFunction) {
    const { authorization } = req.headers; // Get authorization header from request

    if (!authorization) {
        res.status(401); // Set status code to 401 (Unauthorized)
        throw new Error('🚫 Un-Authorized 🚫'); // Throw error if authorization header is missing
    }

    try {
        const token = authorization.split(' ')[1]; // Extract token from authorization header
        req.payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string); // Verify token and add payload to request object

    } catch (err: any) {
        res.status(401); // Set status code to 401 (Unauthorized)
        if (err.name === 'TokenExpiredError') {
            throw new Error(err.name); // Throw error if token is expired
        }
        throw new Error('🚫 Un-Authorized 🚫'); // Throw error for other authentication failures
    }

    return next(); // Move to the next middleware if authentication is successful
}
