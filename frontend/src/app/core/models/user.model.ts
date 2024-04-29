import { PostModel } from './post.model';

export class UserModel {
  id: number;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
  role: number;
  avatar?: string;
  posts?: PostModel[];
  status: boolean;
  birthAt: string;
  location: string;
}
