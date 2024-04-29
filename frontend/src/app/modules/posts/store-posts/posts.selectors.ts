import { Selector } from '@ngxs/store';
import { PostsState, PostsStateModel } from './posts.state';

/**
 * Selector class for accessing state data related to posts.
 */
export class PostsSelectors {

  /**
   * Retrieves the list of posts from the state.
   * @returns The list of posts.
   */
  @Selector([PostsState])
  static getPostsList(state: PostsStateModel) {
    return state.posts;
  }

  /**
   * Retrieves the count of posts from the state.
   * @returns The count of posts.
   */
  @Selector([PostsState])
  static getPostsCounter(state: PostsStateModel) {
    return state.postsCounter;
  }

  /**
   * Retrieves the list of users from the state.
   * @returns The list of users.
   */
  @Selector([PostsState])
  static getListUsers(state: PostsStateModel) {
    return state.usersList;
  }

  /**
   * Retrieves the list of categories from the state.
   * @returns The list of categories.
   */
  @Selector([PostsState])
  static getListCategories(state: PostsStateModel) {
    return state.categories;
  }

}
