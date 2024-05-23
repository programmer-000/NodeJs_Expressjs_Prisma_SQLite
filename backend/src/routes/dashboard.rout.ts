import express from 'express';
import type { Request, Response } from 'express';
import * as DashboardHandler from '../controllers/dashboard.controllers';
import { StatisticsResponse } from '../models';

export const dashboardRouter = express.Router();

/**
 * GET: Get post counts and user counts by various criteria.
 * @returns An object containing counts by total, role, user, category, status, and location.
 */
dashboardRouter.get('/', async (request: Request, response: Response) => {
    try {
        const counts: StatisticsResponse = await DashboardHandler.getStatisticsHandler();
        return response.status(200).json(counts);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});
