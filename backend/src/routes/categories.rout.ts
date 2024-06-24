import express, { Request, Response } from 'express';
import { AllCategoriesResponseModel, CategoriesModel, NewCategoryModel } from '../models';
import * as CategoryHandler from '../controllers/categories.controller';
import {
    handleErrorsValidator,
    createCategoryValidator,
    updateCategoryValidator
} from '../validators';
import { param } from 'express-validator';
import { checkPermissionMiddleware, currentRoleMiddleware } from '../rbac-config';

export const categoriesRouter = express.Router();

/**
 * GET: List of all CATEGORIES
 */
categoriesRouter.get(
    '/',
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const categories: AllCategoriesResponseModel = await CategoryHandler.getAllCategoriesHandler();
            return res.status(200).json(categories);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
);

/**
 * POST: Create a CATEGORY
 */
categoriesRouter.post(
    '/',
    createCategoryValidator,
    handleErrorsValidator,
    currentRoleMiddleware(),
    checkPermissionMiddleware('CREATE_CATEGORY'),
    async (req: Request, res: Response): Promise<Response> => {
        try {
            const data: NewCategoryModel = await CategoryHandler.createCategoryHandler(req.body);
            return res.status(201).json({
                data,
                message: 'Category created successfully'
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
);

/**
 * PUT: Update CATEGORY
 */
categoriesRouter.put(
    '/:id',
    updateCategoryValidator,
    handleErrorsValidator,
    currentRoleMiddleware(),
    checkPermissionMiddleware('UPDATE_CATEGORY'),
    async (req: Request, res: Response): Promise<Response> => {
        const id: number = parseInt(req.params.id, 10);
        try {
            const data: CategoriesModel = await CategoryHandler.updateCategoryHandler(req.body, id);
            return res.status(200).json({
                data,
                message: 'Category updated successfully'
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
);

/**
 * DELETE: Delete a CATEGORY based on the ID
 */
categoriesRouter.delete(
    '/:id',
    param('id').isInt().withMessage('ID must be an integer'),
    handleErrorsValidator,
    currentRoleMiddleware(),
    checkPermissionMiddleware('DELETE_CATEGORY'),
    async (req: Request, res: Response): Promise<Response> => {
        const id: number = parseInt(req.params.id, 10);
        try {
            await CategoryHandler.deleteCategoryHandler(id);
            return res.status(200).json({
                message: 'Category was successfully deleted'
            });
        } catch (error: any) {
            if (error.message === 'Cannot delete category with associated posts') {
                return res.status(400).json({message: error.message});
            }
            return res.status(500).json({ message: error.message });
        }
    }
);
