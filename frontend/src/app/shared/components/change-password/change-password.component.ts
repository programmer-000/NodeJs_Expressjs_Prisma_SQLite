import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../modules/auth/auth.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { mustMatchValidator } from '../../custom-validators/must-match.validator';
import { UsersService } from '../../../modules/users/users.service';
import { AppRouteEnum, RoleEnum } from '../../../core/enums';
import { Router } from '@angular/router';
import { NotificationService, PermissionService } from '../../services';
import { AuthUserModel, DialogNewPasswordModel, ValidResetTokenModel } from '../../../core/models';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usersService: UsersService,
    private authService: AuthService,
    private notificationService: NotificationService,
    public permissionService: PermissionService,
  ) {}

  @Input() userData: DialogNewPasswordModel; // Input: Data for changing password
  @Output() closeDialogDialogNewPassword: EventEmitter<any> = new EventEmitter(); // Output: Event emitter to close the dialog

  // Enum for user roles
  protected readonly RoleEnum = RoleEnum;

  AppRouteEnum = AppRouteEnum; // Enum for accessing route names
  private destroy$: Subject<void> = new Subject<void>(); // Subject to handle subscription cleanup
  dataLoading: boolean = false; // Flag to indicate data loading state
  validCurrentPassword: any; // Object to store validity of the current password
  validResetToken: ValidResetTokenModel = { valid: false }; // Object to store validity of the reset token
  changePasswordForm: FormGroup; // Form group for changing password

  hideCurrentPassword = true; // Flag to toggle visibility of current password
  hideNewPassword = true; // Flag to toggle visibility of new password
  hideConfirmPassword = true; // Flag to toggle visibility of confirm password

  authUser: AuthUserModel | undefined = this.authService.accountSubject$.value?.userInfo;

  ngOnInit() {
    console.log(111, this.userData)

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
        Validators.minLength(6),
        Validators.maxLength(50)])
      ],
      newPassword: [null, Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50)])
      ],
      confirmPassword: [null, Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50)])
      ]
    }, {
      validator: mustMatchValidator('newPassword', 'confirmPassword') // Custom validator to ensure new and confirm passwords match
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
        },
        (error) => {
          this.dataLoading = false;
        }
      );
  }

  /**
   * Display the change password form based on user role and data availability for the user being edited or the user resetting the password (if any)
   */
  public handlerDisplay(): boolean {
    return this.permissionService.displayFieldCurrentPassword(this.userData, this.authUser);
  }

  /**
   * Enable/disable form controls based on current password validity and reset token validity
   */
  private toggleStateControls() {
    if (
      this.validCurrentPassword?.validPassword ||
      this.validResetToken.valid ||
      this.authUser?.role === RoleEnum.SuperAdmin ||
      this.authUser?.role === RoleEnum.ProjectAdmin && !this.userData?.editProfile
    ) {
      this.changePasswordForm.controls['newPassword'].enable();
      this.changePasswordForm.controls['confirmPassword'].enable();
    } else {
      this.changePasswordForm.controls['newPassword'].disable();
      this.changePasswordForm.controls['confirmPassword'].disable();
    }
  }

  /**
   * Check if the form is allowed to be submitted based on the current user role and data availability
   * for the user being edited or the user resetting the password (if any)
   */
  public allowedSubmit(): boolean {
    const isSuperAdmin = this.authUser?.role === RoleEnum.SuperAdmin;
    const isProjectAdmin = this.authUser?.role === RoleEnum.ProjectAdmin;

    // Case 1: SuperAdmin or ProjectAdmin with userData
    if (this.userData && (isSuperAdmin || isProjectAdmin)) {
      return this.isNewPasswordAndConfirmValid();
    }
    // Case 2: Other roles with userData
    if (this.userData) {
      return this.isFormValidWithCurrentPassword();
    }
    // Case 3: No userData (password reset)
    return this.isFormValidWithResetToken();
  }

  /** Check if newPassword and confirmPassword fields are valid */
  private isNewPasswordAndConfirmValid(): boolean {
    return this.changePasswordForm.controls['newPassword'].valid &&
      this.changePasswordForm.controls['confirmPassword'].valid;
  }
  /** Check if the entire form is valid and current password is valid */
  private isFormValidWithCurrentPassword(): boolean {
    return this.changePasswordForm.valid && this.validCurrentPassword?.validPassword;
  }
  /** Check if newPassword and confirmPassword fields are valid and reset token is valid */
  private isFormValidWithResetToken(): boolean {
    return this.isNewPasswordAndConfirmValid() && !!this.validResetToken.valid;
  }


  /**
   * Submit the change password request based on the current user role and data availability
   * for the user being edited or the user resetting the password (if any)
   */
  public onSubmitChangePassword(): void {
    if (this.allowedSubmit()) {
      this.dataLoading = true;

      if (this.userData) {
        this.updatePasswordForUser();
      } else {
        this.resetPassword();
      }
    }
  }

  /** Update password for a user (SuperAdmin, ProjectAdmin, or regular user) */
  private updatePasswordForUser(): void {
    const id = this.userData.userId;
    const params = { password: this.changePasswordForm.value.newPassword };

    this.usersService.updateUserPassword(id, params)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        resp => this.handleSuccess(resp.message),
        error => this.handleError(error)
      );
  }
  /** Reset password for a user who forgot their password */
  private resetPassword(): void {
    this.authService.onChangePassword(this.changePasswordForm.value.newPassword, this.validResetToken)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        resp => this.handleSuccess(resp.message, true),
        error => this.handleError(error)
      );
  }
  /** Handle successful password update/reset */
  private handleSuccess(message: string, navigateToLogin: boolean = false): void {
    this.dataLoading = false;
    this.notificationService.showSuccess(message);
    this.closeClick();
    if (navigateToLogin) {
      this.router.navigate(['auth/login']);
    }
  }
  /** Handle errors during password update/reset */
  private handleError(error: any): void {
    this.dataLoading = false;
    this.closeClick();
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
