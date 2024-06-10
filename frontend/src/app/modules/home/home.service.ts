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
   * Get the statistics for the dashboard
   * @returns An object containing counts by total, role, user, category, and status.
   */
  getStatistics(): Observable<any> {
    return this.http.get(config.API_URL + `/dashboard`)
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(error);
        })
      );
  }
}
