import { CategoriesModel } from './categories.model';

export interface CreateUpdatePostModel {
    title: string;
    description: string;
    content: string;
    picture: string;
    published: boolean;
    userId: number;
    categories?: CategoriesModel[];
    includedCategories?: [];
    excludedCategories?: [];
}

