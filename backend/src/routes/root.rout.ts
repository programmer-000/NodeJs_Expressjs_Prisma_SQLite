import express from 'express';
import type { Request, Response } from 'express';
import * as RootHandler from '../controllers/root.controller';


export const rootRouter = express.Router();

/**
 * GET: Get the root object.
 */
rootRouter.get('/', async (request: Request, response: Response) => {
    try {
        const root = await RootHandler.getRootHandler();
        return response.status(200).json(root);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});
