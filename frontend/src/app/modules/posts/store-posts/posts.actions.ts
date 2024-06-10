import { PostModel } from '../../../core/models';

/**
 * Actions related to posts
 */
export class GetPosts {
  static readonly type = '[Posts] Get';

  constructor(public params: any) {
  }
}

/**
 * Action to add a new post
 */
export class AddPost {
  static readonly type = '[Posts] Add';

  constructor(public params: PostModel, public avatar: any) {
  }
}

/**
 * Action to update an existing post
 */
export class UpdatePost {
  static readonly type = '[Posts] Update';

  constructor(public id: number, public params: any, public picture: any, public pictureOrUrl: any, public previousPictureUrl: any) {
  }
}

/**
 * Action to delete a post
 */
export class DeletePost {
  static readonly type = '[Posts] Delete';

  constructor(public id: number, public params: any) {
  }
}

/**
 * Action to set the selected post
 */
export class SetSelectedPost {
  static readonly type = '[Posts] Set';

  constructor(public payload: PostModel) {
  }
}

/**
 * Actions related to users
 */
export class GetListAllUsers {
  static readonly type = '[Users] Get List All Users';

  constructor() {
  }
}

/**
 * Actions related to categories of posts
 */
export class GetCategories {
  static readonly type = '[Categories] Get';

  constructor() {
  }
}

/**
 * Action to add a new category
 */
export class AddCategory {
  static readonly type = '[Categories] Add';

  constructor(public params: any) {
  }
}

/**
 * Action to update an existing category
 */
export class UpdateCategory {
  static readonly type = '[Categories] Update';

  constructor(public id: number, public params: any) {
  }
}

/**
 * Action to delete a category
 */
export class DeleteCategory {
  static readonly type = '[Categories] Delete';

  constructor(public id: number) {
  }
}
