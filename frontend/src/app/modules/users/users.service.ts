import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as config from '../../../app-config';
import { UserModel, UserParamsModel } from '../../core/models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
  ) {}

  // BehaviorSubject for storing the list of users
  users$ = new BehaviorSubject<any>([]);
  // BehaviorSubject for storing user filters
  usersFilters$ = new BehaviorSubject<any>({});

  /**
   * Add a new user.
   * @param params User parameters.
   * @param avatar User avatar.
   */
  addUser(params: UserModel, avatar: any): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('ProfilePicture', avatar);
    uploadData.append('user_params', JSON.stringify(params));
    return this.http.post(config.API_URL + `/users/`, uploadData);
  }

  /**
   * Update user information.
   * @param id User ID.
   * @param params User parameters.
   * @param avatar User avatar.
   * @param imageOrUrl Flag to indicate if avatar is an image or URL.
   * @param previousImageUrl Previous avatar URL.
   */
  updateUser(id: number, params: UserModel, avatar: any, imageOrUrl: boolean, previousImageUrl: string): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('ProfilePicture', avatar);
    uploadData.append('user_params', JSON.stringify(params));
    uploadData.append('imageOrUrl', JSON.stringify(imageOrUrl));
    uploadData.append('previousImageUrl', JSON.stringify(previousImageUrl));
    return this.http.put(config.API_URL + `/users/` + id, uploadData);
  }

  /**
   * Update user password.
   * @param id User ID.
   * @param params Password parameters.
   */
  updateUserPassword(id: number, params: any): Observable<any> {
    return this.http.put(config.API_URL + `/users/update_password/` + id, params);
  }

  /**
   * Remove user.
   * @param id User ID.
   * @param params Additional parameters.
   */
  removeUser(id: number, params: any): Observable<any> {
    return this.http.delete(config.API_URL + `/users/` + id, {params});
  }

  /**
   * Fetch users based on provided parameters.
   * @param params User parameters for filtering.
   */
  fetchUsers(params: UserParamsModel): Observable<any> {
    const queryParams = new HttpParams()
      .set('orderByColumn', params.orderByColumn)
      .set('orderByDirection', params.orderByDirection)
      .set('pageIndex', params.pageIndex)
      .set('pageSize', params.pageSize)
      .set('firstName', params.firstName)
      .set('lastName', params.lastName)
      .set('email', params.email)
      .set('roles', JSON.stringify(params.roles));

    return this.http.get(config.API_URL + `/users`, { params: queryParams }).pipe(
      catchError(error => {
        console.error('Error fetching users: ', error); // Logging error
        return throwError(error); // Rethrowing the error
      })
    );
  }

  /**
   * Get information about a selected user.
   * @param id User ID.
   */
  getUser(id: number): Observable<any> {
    return this.http.get(config.API_URL + `/users/` + id).pipe(
      catchError(error => {
        console.error('Error fetching user: ', error); // Logging error
        return throwError(error); // Rethrowing the error
      })
    );
  }
}
