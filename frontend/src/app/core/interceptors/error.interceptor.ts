import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../modules/auth/auth.service';
import { NotificationService } from '../../shared/services';
import * as _ from "lodash";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  /**
   * Intercepts HTTP requests and handles errors.
   * @param request The HTTP request being intercepted
   * @param next The HTTP handler for the request
   * @returns An Observable of the HTTP event
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        // Check if the error status is 401 or 403 and user is logged in
        if ([401, 403].includes(err.status) && this.authService.accountValue) {
          // Auto logout if 401 or 403 response returned from API
          this.authService.logout();
        }

        // Extract error message from the response or use default status text
        const error = (err && err.error && err.error.message) || err.statusText;

        // const firstErrorAttempt: string = _.get(err, "error.error.message",  err.statusText);
        // const secondErrorAttempt: string = _.get(err, "error.message", firstErrorAttempt);

        this.notificationService.showError(error);
        // Log the error
        console.error(2, 'ErrorInterceptor:', error);

        // Throw the error to be caught by the subscriber
        return throwError(() => error);
      })
    );
  }
}
