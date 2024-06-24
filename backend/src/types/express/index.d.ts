import * as express from 'express'

/**
 * Augment the Request interface in the Express module to include the userRole property.
 */
declare module 'express' {
    interface Request {
        userRole?: number;
    }
}
