import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware for handling 404 errors.
 * Sets the response status to 404 and passes an error message with the original URL to the next middleware.
 */
export function notFound(request: Request, response: Response, next: NextFunction) {
    response.status(404); // Set status code to 404
    const error = new Error(`🔍 - Not Found - ${request.originalUrl}`); // Create error message with requested URL
    next(error); // Pass error to the next middleware
}

/**
 * Middleware for handling errors.
 * Sets the response status code based on the current status code or defaults to 500,
 * and sends a JSON response with the error message and stack trace.
 */
export function errorHandler(err: any, request: Request, response: Response, next: NextFunction) {
    const statusCode = response.statusCode !== 200 ? response.statusCode : 500; // Determine status code based on response status
    response.status(statusCode); // Set response status code
    response.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack // Include error message and stack trace in response
    });
}

/**
 * Middleware for authenticating requests.
 * Checks for the presence of an authorization header in the request,
 * verifies the JWT token, and adds the token payload to the request object.
 * Throws an error if authentication fails.
 */
export function isAuthenticated(request: any, response: Response, next: NextFunction) {
    const { authorization } = request.headers; // Get authorization header from request

    if (!authorization) {
        response.status(401); // Set status code to 401 (Unauthorized)
        throw new Error('🚫 Un-Authorized 🚫'); // Throw error if authorization header is missing
    }

    try {
        const token = authorization.split(' ')[1]; // Extract token from authorization header
        request.payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string); // Verify token and add payload to request object

    } catch (err: any) {
        response.status(401); // Set status code to 401 (Unauthorized)
        if (err.name === 'TokenExpiredError') {
            throw new Error(err.name); // Throw error if token is expired
        }
        throw new Error('🚫 Un-Authorized 🚫'); // Throw error for other authentication failures
    }

    return next(); // Move to the next middleware if authentication is successful
}
