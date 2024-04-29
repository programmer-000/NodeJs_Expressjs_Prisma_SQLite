import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import * as config from '../../../app-config';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  /**
   * Fetches data from the API.
   * @returns An observable with the data fetched from the API.
   */
  getData(): Observable<any> {
    return this.http.get(config.API_URL + `/`)
      .pipe(
        catchError(error => {
          console.error('Error:', error.message);
          return throwError(error);
        })
      );
  }
}
