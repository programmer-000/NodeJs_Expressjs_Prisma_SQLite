import express from 'express';

// Import routers for different routes
import { authRouter } from './auth.rout';
import { rootRouter } from './root.rout';
import { usersRouter } from './users.rout';
import { postsRouter } from './posts.rout';
import { categoriesRouter } from './categories.rout';
import { dashboardRouter } from './dashboard.rout';

// Import middleware
import upload from '../middleware/upload';
import { isAuthenticated } from '../middleware/middlewares';


// Create an instance of Express Router
export const router = express.Router();

// Route definitions
router.use('/auth', authRouter);
router.use('/posts', isAuthenticated, upload, postsRouter);
router.use('/categories', isAuthenticated, categoriesRouter);
router.use('/users', isAuthenticated, upload, usersRouter);
router.use('/dashboard', isAuthenticated, dashboardRouter);

// Root route
router.use('/', rootRouter);

// Export the router instance for use in other files
export default router;
