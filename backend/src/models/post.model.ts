import { CategoriesModel } from './categories.model';
import { UserModel } from './user.model';

export interface PostModel {
    id: number;
    title: string;
    description: string;
    content?: string | null;
    picture?: string | null;
    published: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    user: UserModel;
    userId: number;
    categories?: CategoriesModel[];
}
