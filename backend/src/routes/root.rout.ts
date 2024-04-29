import express from 'express';
import type { Request, Response } from 'express';
import * as RootHandler from '../controllers/root.conroller';


export const rootRouter = express.Router();

console.log('Root - ROUTS')

rootRouter.get('/', async (request: Request, response: Response) => {
    try {
        const root = await RootHandler.getRootHandler();
        return response.status(200).json(root);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});
