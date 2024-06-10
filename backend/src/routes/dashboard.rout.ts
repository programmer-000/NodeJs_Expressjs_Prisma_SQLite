import express from 'express';
import type { Request, Response } from 'express';
import * as DashboardHandler from '../controllers/dashboard.controllers';
import { StatisticsResponse } from '../models';

export const dashboardRouter = express.Router();

/**
 * GET: Get post counts and user counts by various criteria.
 * @returns An object containing counts by total, role, user, category, status, and location.
 */
dashboardRouter.get('/', async (reg: Request, res: Response) => {
    try {
        const counts: StatisticsResponse = await DashboardHandler.getStatisticsHandler();
        return res.status(200).json(counts);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
});
