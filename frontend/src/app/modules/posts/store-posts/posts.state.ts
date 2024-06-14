import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../../shared/services';
import { PostsService } from '../posts.service';
import { tap } from 'rxjs';
import {
  AddCategory,
  AddPost, DeleteCategory,
  DeletePost,
  GetCategories,
  GetListAllUsers,
  GetPosts,
  SetSelectedPost, UpdateCategory,
  UpdatePost
} from './posts.actions';
import { CategoriesModel, PostModel, UserListModel } from '../../../core/models';


/**
 * Define the structure of the PostsStateModel
 */
export class PostsStateModel {
  posts: PostModel[];
  postsCounter?: any;
  selectedPost?: PostModel | null | undefined;
  usersList: UserListModel[];
  categories: CategoriesModel[];
}

/**
 * Decorator for defining a state class
 */
@State<PostsStateModel>({
  name: 'PostsState',
  defaults: {
    posts: [],
    postsCounter: null,
    selectedPost: null,
    usersList: [],
    categories: [],
  }
})

@Injectable()
export class PostsState {

  constructor(
    private postsService: PostsService,
    private notificationService: NotificationService,
  ) {
  }

  /**
   *Action to get all posts
   */
  @Action(GetPosts)
  getAllPosts({getState, setState}: StateContext<PostsStateModel>, {params}: GetPosts) {
    return this.postsService.fetchPosts(params).pipe(tap((result) => {
        const state = getState();
        setState({
          ...state,
          posts: result.posts,
          postsCounter: result.totalCount
        });
      }
    ));
  }

  /**
   *Action to set selected post
   */
  @Action(SetSelectedPost)
  setSelectedPostId({getState, setState}: StateContext<PostsStateModel>, {payload}: SetSelectedPost) {
    const state = getState();
    setState({
      ...state,
      selectedPost: payload
    });
  }

  /**
   *Action to add a new post
   */
  @Action(AddPost)
  addNewPost({getState, patchState}: StateContext<PostsStateModel>, {params, avatar}: AddPost) {
    return this.postsService.addPost(params, avatar).pipe(tap((result) => {
        this.notificationService.showSuccess(result.message);
        const state = getState();
        patchState({
          posts: [...state.posts, result.data.newPost],
          postsCounter: result.data.totalCount
        });
      }
    ));
  }

  /**
   * Action to update an existing post
   */
  @Action(UpdatePost)
  updateCurrentPost({getState, setState}: StateContext<PostsStateModel>, {
    id, params, picture, pictureOrUrl, previousPictureUrl
  }: UpdatePost) {
    return this.postsService.updatePost(id, params, picture, pictureOrUrl, previousPictureUrl).pipe(tap((result) => {
        this.notificationService.showSuccess(result.message);
        const state = getState();
        const postsList = [...state.posts];
        const postIndex = postsList.findIndex(item => item.id === id);

        // TODO 3: Replace setState with patchState
        postsList[postIndex] = result.data;
        setState({
          ...state,
          posts: postsList,
          selectedPost: result.data
        });
      }
    ));
  }

  /**
   *Action to delete a post
   */
  @Action(DeletePost)
  deletePost({getState, setState}: StateContext<PostsStateModel>, {id, params}: DeletePost) {
    return this.postsService.removePost(id, params).pipe(tap((result) => {
        this.notificationService.showSuccess(result.message);
        const state = getState();
        const filteredArray = state.posts.filter(item => item.id !== id);
        setState({
          ...state,
          posts: filteredArray,
          postsCounter: state.postsCounter - 1
        });
      }
    ));
  }

  /**
   *Action to get all users
   */
  @Action(GetListAllUsers)
  getListAllUsers({getState, setState}: StateContext<PostsStateModel>) {
    return this.postsService.fetchListAllUsers().pipe(tap((result) => {
        const state = getState();
        setState({
          ...state,
          usersList: result.users
        });
      }
    ));
  }

  /**
   *Action to get all categories
   */
  @Action(GetCategories)
  getListCategories({getState, setState}: StateContext<PostsStateModel>) {
    return this.postsService.fetchListCategories().pipe(tap((result) => {
        const state = getState();
        setState({
          ...state,
          categories: result.categories
        });
      }
    ));
  }

  /**
   *Action to add a new category
   */
  @Action(AddCategory)
  addNewCategory({getState, patchState}: StateContext<PostsStateModel>, {params}: AddCategory) {
    return this.postsService.addCategory(params).pipe(tap((result) => {
        this.notificationService.showSuccess(result.message);
        const state = getState();
        patchState({
          categories: [...state.categories, result.data.newCategory],
        });
      }
    ));
  }

  /**
   *Action to update an existing category
   */
  @Action(UpdateCategory)
  updateCurrentCategory({getState, setState}: StateContext<PostsStateModel>, {
    id, params
  }: UpdateCategory) {
    return this.postsService.updateCategory(id, params).pipe(tap((result) => {
        this.notificationService.showSuccess(result.message);
        const state = getState();
        const categoriesList = [...state.categories];
        const postIndex = categoriesList.findIndex(item => item.id === id);
        categoriesList[postIndex] = result.data;
        setState({
          ...state,
          categories: categoriesList,
        });
      }
    ));
  }

  /**
   *Action to delete a category
   */
  @Action(DeleteCategory)
  deleteCategory({getState, setState}: StateContext<PostsStateModel>, {id}: DeleteCategory) {
    return this.postsService.removeCategory(id).pipe(tap((result) => {
        this.notificationService.showSuccess(result.message);
        const state = getState();
        const filteredArray = state.categories.filter(item => item.id !== id);
        setState({
          ...state,
          categories: filteredArray
        });
      }
    ));
  }
}
