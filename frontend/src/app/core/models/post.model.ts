import { CategoriesModel } from './categories.model';
import { UserModel } from './user.model';

export class PostModel {
  id: number;
  title: string;
  description: string;
  content?: string;
  picture?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  user: UserModel;
  userId: number;
  categories: CategoriesModel[]
}
