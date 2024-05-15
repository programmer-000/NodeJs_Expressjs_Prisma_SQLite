import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageEnum } from '../enums';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}

  /**
   * Intercepts HTTP requests and attaches JWT token to the Authorization header.
   * @param req The HTTP request being intercepted
   * @param next The HTTP handler for the request
   * @returns An Observable of the HTTP event
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Retrieve JWT token from local storage
    const accessToken = localStorage.getItem(LocalStorageEnum.JWT_ACCESS_TOKEN_KEY);

    // If token exists, clone the request and append Authorization header with the token
    if (accessToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + accessToken)
      });
      return next.handle(cloned);
    } else {
      // If token doesn't exist, proceed with the original request
      return next.handle(req);
    }
  }
}
