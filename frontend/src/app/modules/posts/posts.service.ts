import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import * as config from '../../../app-config';
import { CategoriesModel, PostModel, PostParamsModel } from '../../core/models';


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private http: HttpClient,
  ) {}

  // Subject to handle posts filters
  postsFilters$ = new BehaviorSubject<any>({});

  /**
   * Fetch posts based on provided parameters.
   * @param params The parameters for fetching posts.
   */
  fetchPosts(params: PostParamsModel): Observable<any> {
    return this.http.get(config.API_URL + `/posts`, {
      params: new HttpParams()
        .set('pageIndex', params.pageIndex)
        .set('pageSize', params.pageSize)
        .set('authors', JSON.stringify(params.authors))
        .set('categories', JSON.stringify(params.categories))
        .set('published', JSON.stringify(params.published))
    });
  }

  /**
   * Get a specific post by its ID.
   * @param id The ID of the post to retrieve.
   */
  getPost(id: number): Observable<any> {
    return this.http.get(config.API_URL + `/posts/` + id);
  }

  /**
   * Update a post with the provided ID and parameters.
   * @param id The ID of the post to update.
   * @param params The updated parameters for the post.
   * @param picture The new picture for the post.
   * @param pictureOrUrl A boolean indicating whether the picture is a URL or a file.
   * @param previousPictureUrl The URL of the previous picture.
   */
  updatePost(id: number, params: PostModel, picture: any, pictureOrUrl: boolean, previousPictureUrl: string): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('ProfilePicture', picture);
    uploadData.append('post_params', JSON.stringify(params));
    uploadData.append('pictureOrUrl', JSON.stringify(pictureOrUrl));
    uploadData.append('previousPictureUrl', JSON.stringify(previousPictureUrl));
    return this.http.put(config.API_URL + `/posts/` + id, uploadData);
  }

  /**
   * Add a new post with the provided parameters and avatar.
   * @param params The parameters for the new post.
   * @param avatar The avatar for the new post.
   */
  addPost(params: PostModel, avatar: any): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('ProfilePicture', avatar);
    uploadData.append('post_params', JSON.stringify(params));
    return this.http.post(config.API_URL + `/posts/`, uploadData);
  }

  /**
   * Remove a post with the provided ID and parameters.
   * @param id The ID of the post to remove.
   * @param params Additional parameters for the removal request.
   */
  removePost(id: number, params: any): Observable<any> {
    return this.http.delete(config.API_URL + `/posts/` + id, {params});
  }

  /**
   * Fetch a list of all users.
   */
  fetchListAllUsers(): Observable<any> {
    return this.http.get(config.API_URL + `/users/list_all_users`);
  }

  /**
   * Fetch a list of categories for posts.
   */
  fetchListCategories(): Observable<any> {
    return this.http.get(config.API_URL + `/categories`);
  }

  /**
   * Add a new category.
   * @param params The parameters for the new category.
   */
  addCategory(params: CategoriesModel): Observable<any> {
    return this.http.post(config.API_URL + `/categories/`, params);
  }

  /**
   * Update a category with the provided ID and parameters.
   * @param id The ID of the category to update.
   * @param params The updated parameters for the category.
   */
  updateCategory(id: number, params: CategoriesModel): Observable<any> {
    return this.http.put(config.API_URL + `/categories/` + id, params);
  }

  /**
   * Remove a category with the provided ID.
   * @param id The ID of the category to remove.
   */
  removeCategory(id: number): Observable<any> {
    return this.http.delete(config.API_URL + `/categories/` + id);
  }

}
