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
        console.log('Root GET - All CATEGORIES = ', request.body);
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
        console.log('Create CATEGORY = ', request.body);
        const newCategory: NewCategoryModel = await CategoryHandler.createCategoryHandler(request.body);
        return response.status(201).json(newCategory);
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
        console.log('Update CATEGORY body = ', request.body);
        console.log('ID = ', id);
        const updatedCategory: CategoriesModel = await CategoryHandler.updateCategoryHandler(request.body, id);
        return response.status(200).json(updatedCategory);
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
        console.log('DELETE CATEGORY = ', request.body);
        await CategoryHandler.deleteCategoryHandler(id);
        return response.status(204).json('Category was successfully deleted');
    } catch (error: any) {
        if (error.message === 'Cannot delete category with associated posts') {
            return response.status(400).json({ message: error.message });
        }
        return response.status(500).json({ message: error.message });
    }
});
