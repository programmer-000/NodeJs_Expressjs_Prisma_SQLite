import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackBarMessageComponent } from '../components/snack-bar-message/snack-bar-message.component';

@Injectable()
export class NotificationService {
  // Configuration for error messages
  private errorConfig: MatSnackBarConfig = {
    panelClass: 'notification-error-message-wrapper',
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
  };

  // Configuration for success messages
  private successConfig: MatSnackBarConfig = {
    panelClass: 'notification-success-message-wrapper',
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
  };

  constructor(private snackBar: MatSnackBar) {
  }

  /**
   *Method to display error message
   */
  showError(message: string, title?: string): void {
    const snackBarRef = this.snackBar.openFromComponent(
      SnackBarMessageComponent,
      {
        ...this.errorConfig, // Spread operator to merge configurations
        data: {
          message,
          type: 'error', // Indicate type of message (error)
        },
      }
    );
    // Add error handling if snackBarRef is null or undefined
  }

  /**
   *Method to display success message
   */
  showSuccess(message: any, title?: string): void {
    const snackBarRef = this.snackBar.openFromComponent(
      SnackBarMessageComponent,
      {
        ...this.successConfig, // Spread operator to merge configurations
        data: {
          message,
          type: 'success', // Indicate type of message (success)
        },
      }
    );
    // Add error handling if snackBarRef is null or undefined
  }
}
