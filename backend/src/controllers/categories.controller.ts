import db from '../utils/db';
import { AllCategoriesResponseModel } from '../models';

/**
 * Retrieves all categories from the database.
 * @returns Promise<any> A promise that resolves to an array of categories.
 */
export const getAllCategoriesHandler = async (): Promise<AllCategoriesResponseModel> => {
    const categories = await db.category.findMany({
        select: {
            id: true,
            name: true,
        },
    });
    return { categories };
};

/**
 * Creates a new category in the database.
 * @param category An object containing category information.
 * @returns Promise<any> A promise that resolves to the newly created category.
 */
export const createCategoryHandler = async (category: any): Promise<any> => {
    const { name } = category;
    const newCategory = await db.category.create({
        data: {
            name
        },
        select: {
            id: true,
            name: true,
            posts: true
        },
    });
    return { newCategory };
};

/**
 * Updates an existing category in the database.
 * @param category An object containing updated category information.
 * @param id The ID of the category to update.
 * @returns Promise<any> A promise that resolves to the updated category.
 */
export const updateCategoryHandler = async (category: any, id: number): Promise<any> => {
    const { name, posts } = category;
    return db.category.update({
        where: {
            id,
        },
        data: {
            name,
            posts
        },
        select: {
            id: true,
            name: true,
            posts: true
        },
    });
};

/**
 * Deletes a category from the database.
 * @param id The ID of the category to delete.
 * @returns Promise<void> A promise that resolves when the category is successfully deleted.
 */
export const deleteCategoryHandler = async (id: number): Promise<void> => {
    // Check if the category has any posts
    const category = await db.category.findUnique({
        where: { id },
        select: {
            posts: true
        },
    });

    if (category && category.posts.length > 0) {
        throw new Error('Cannot delete category with associated posts');
    }

    // Delete the category if no posts are associated
    await db.category.delete({
        where: {
            id,
        },
    });
};
