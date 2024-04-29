import { PostModel } from './post.model';

export interface CategoriesModel {
    id: number;
    name: string;
    posts?: PostModel[];
}
