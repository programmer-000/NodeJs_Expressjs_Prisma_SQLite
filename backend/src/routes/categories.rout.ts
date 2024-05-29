import express, { Request, Response } from 'express';
import { AllCategoriesResponseModel, CategoriesModel } from '../models';
import { NewCategoryModel } from '../models';
import * as CategoryHandler from '../controllers/categories.controller';

export const categoriesRouter = express.Router();

/**
 * GET: List of all CATEGORIES
 */
categoriesRouter.get('/', async (request: Request, response: Response): Promise<Response> => {
    try {
        const categories: AllCategoriesResponseModel = await CategoryHandler.getAllCategoriesHandler();
        return response.status(200).json(categories);
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
});

/**
 * POST: Create a CATEGORY
 */
categoriesRouter.post('/', async (request: Request, response: Response): Promise<Response> => {
    try {
        const data: NewCategoryModel = await CategoryHandler.createCategoryHandler(request.body);
        return response.status(201).json(
            {
                data,
                message: 'Category created successfully'
            }
        );
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
});

/**
 * PUT: Update CATEGORY
 */
categoriesRouter.put('/:id', async (request: Request, response: Response): Promise<Response> => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const data: CategoriesModel = await CategoryHandler.updateCategoryHandler(request.body, id);
        return response.status(200).json(
            {
                data,
                message: 'Category updated successfully'
            }
        );
    } catch (error: any) {
        return response.status(500).json({ message: error.message });
    }
});

/**
 * DELETE: Delete a CATEGORY based on the ID
 */
categoriesRouter.delete('/:id', async (request: Request, response: Response): Promise<Response> => {
    const id: number = parseInt(request.params.id, 10);
    try {
        await CategoryHandler.deleteCategoryHandler(id);
        return response.status(200).json({
            message: 'Category was successfully deleted'
        });
    } catch (error: any) {
        if (error.message === 'Cannot delete category with associated posts') {
            return response.status(400).json({ message: error.message });
        }
        return response.status(500).json({ message: error.message });
    }
});
