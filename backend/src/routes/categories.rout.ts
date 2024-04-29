import express, { Request, Response } from 'express';
import * as CategoryHandler from '../controllers/categories.conroller';
import { CategoriesModel } from '../models';


export const categoriesRouter = express.Router();

/**
 * GET: List of all CATEGORIES
 */
categoriesRouter.get('/', async (req: Request, res: Response) => {
    try {
        console.log('Root GET - All CATEGORIES = ', req.body);
        const categories: CategoriesModel[] = await CategoryHandler.getAllCategoriesHandler();
        return res.status(200).json(categories);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
});

/**
 * POST: Create a CATEGORY
 */
categoriesRouter.post('/', async (req: Request, res: Response) => {
    try {
        console.log('Create CATEGORY = ', req.body);
        const newCategory: CategoriesModel = await CategoryHandler.createCategoryHandler(req.body);
        return res.status(201).json(newCategory);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
});

/**
 * PUT: Update CATEGORY
 */
categoriesRouter.put('/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        console.log('Update CATEGORY body = ', req.body);
        console.log('ID = ', id);
        const updatedCategory: CategoriesModel = await CategoryHandler.updateCategoryHandler(req.body, id);
        return res.status(200).json(updatedCategory);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
});

/**
 * DELETE: Delete an CATEGORY based on the ID
 */
categoriesRouter.delete('/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        console.log('DELETE CATEGORY = ', req.body);
        await CategoryHandler.deleteCategoryHandler(id);
        return res.status(204).json('Category was successfully deleted');
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
});
