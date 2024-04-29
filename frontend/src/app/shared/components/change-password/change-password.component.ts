import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../modules/auth/auth.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { MustMatch } from '../../../core/helpers/must-match.validator';
import { UpdateUserPassword } from '../../../modules/users/store-users/users.action';
import { Store } from '@ngxs/store';
import { UsersService } from '../../../modules/users/users.service';
import { AppRouteEnum } from '../../../core/enums';
import { Router } from '@angular/router';
import { NotificationService } from '../../notification.service';
import { DialogNewPasswordModel, ValidResetTokenModel } from '../../../core/models';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private usersService: UsersService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  @Input() userData: DialogNewPasswordModel; // Input: Data for changing password
  @Output() closeDialogDialogNewPassword: EventEmitter<any> = new EventEmitter(); // Output: Event emitter to close the dialog
  AppRouteEnum = AppRouteEnum; // Enum for accessing route names
  private destroy$: Subject<void> = new Subject<void>(); // Subject to handle subscription cleanup
  dataLoading: boolean = false; // Flag to indicate data loading state
  validCurrentPassword: any; // Object to store validity of the current password
  validResetToken: ValidResetTokenModel = { valid: false }; // Object to store validity of the reset token
  changePasswordForm: FormGroup; // Form group for changing password

  hideCurrentPassword = true; // Flag to toggle visibility of current password
  hideNewPassword = true; // Flag to toggle visibility of new password
  hideConfirmPassword = true; // Flag to toggle visibility of confirm password

  ngOnInit() {
    this.buildChangePasswordForm(); // Initialize the change password form
    if (this.userData) {
      this.changesControlCurrentPassword(); // Set up control for current password field
      this.toggleStateControls(); // Enable/disable form controls based on user data
    } else {
      this.stateValidResetToken(); // Check the validity of the reset token
    }
  }

  /**
   * Check the validity of the reset token
   */
  private stateValidResetToken() {
    this.authService.validResetToken$
      .pipe(takeUntil(this.destroy$))
      .subscribe(resp => {
        this.validResetToken = resp;
        this.toggleStateControls();
      });
  }


  /**
   * Build the change password form with validators
   */
  private buildChangePasswordForm() {
    this.changePasswordForm = this.fb.group({
      currentPassword: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])
      ],
      newPassword: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])
      ],
      confirmPassword: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])
      ]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword') // Custom validator to ensure new and confirm passwords match
    });
  }


  /**
   * Set up control for current password field to check its validity
   */
  private changesControlCurrentPassword() {
    this.changePasswordForm.controls['currentPassword'].valueChanges
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe(val => {
        this.checkValidCurrentPassword(val); // Check the validity of the current password
      });
  }


  /**
   * Check the validity of the current password
   */
  private checkValidCurrentPassword(val: string) {
    const userData = {
      email: this.userData.email,
      password: val
    }

    this.authService.fetchValidPassword(userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(resp => {
        if (resp) {
          this.validCurrentPassword = resp;
          this.toggleStateControls();
        } else {
          this.toggleStateControls();
        }
      });
  }


  /**
   * Enable/disable form controls based on current password validity and reset token validity
   */
  private toggleStateControls() {
    if (this.validCurrentPassword?.validPassword || this.validResetToken.valid) {
      this.changePasswordForm.controls['newPassword'].enable();
      this.changePasswordForm.controls['confirmPassword'].enable();
    } else {
      this.changePasswordForm.controls['newPassword'].disable();
      this.changePasswordForm.controls['confirmPassword'].disable();
    }
  }


  /**
   * Check if the form is allowed to be submitted
   */
  public allowedSubmit(): boolean {
    if (this.userData) {
      return !(!this.changePasswordForm.valid || !this.validCurrentPassword?.validPassword);
    } else {
      return !(!this.changePasswordForm.controls['newPassword'].valid || !this.changePasswordForm.controls['confirmPassword'].valid || !this.validResetToken.valid);
    }
  }


  /**
   * Submit the change password request
   */
  onSubmitChangePassword(): void {
    if (this.userData) {
      if (this.changePasswordForm.valid) {
        this.dataLoading = true;
        const id = this.userData.userId;
        const params = {
          password: this.changePasswordForm.value.newPassword
        }
        this.store.dispatch(new UpdateUserPassword(id, params)); // Dispatch action to update user password
        this.dataLoading = false;
        this.closeClick(); // Close the dialog after successful submission
      } else {
        return;
      }
    } else {
      if (this.changePasswordForm.controls['newPassword'].valid && this.changePasswordForm.controls['confirmPassword'].valid) {
        this.dataLoading = true;
        this.authService.onChangePassword(this.changePasswordForm.value.newPassword, this.validResetToken)
          .pipe(takeUntil(this.destroy$))
          .subscribe(resp => {
              if (resp) {
                this.notificationService.showSuccess(resp.message);
                this.router.navigate(['auth/login']); // Navigate to login page after successful password change
              }
            },
            error => {
              console.error(error);
              this.notificationService.showError(error);
            });
        this.dataLoading = false;
      } else {
        return;
      }
    }
  }

  /**
   * Emit event to close the dialog
   */
  closeClick(): void {
    this.closeDialogDialogNewPassword.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.authService.validResetToken$.next(undefined);
    this.validResetToken = {};
  }
}
