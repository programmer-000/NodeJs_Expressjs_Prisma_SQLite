import express from 'express';
import type { Request, Response } from 'express';
import * as RootHandler from '../controllers/root.controller';


export const rootRouter = express.Router();

/**
 * GET: Get the root object.
 */
rootRouter.get('/', async (req: Request, res: Response) => {
    try {
        const root = await RootHandler.getRootHandler();
        return res.status(200).json(root);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
});
