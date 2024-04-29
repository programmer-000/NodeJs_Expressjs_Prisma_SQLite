import { PostModel } from "./post.model";

export class CategoriesModel {
  id: number;
  name: string;
  posts?: PostModel[];
}
