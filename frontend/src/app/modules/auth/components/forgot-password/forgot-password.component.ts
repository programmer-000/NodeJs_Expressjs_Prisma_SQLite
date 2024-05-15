import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { AppRouteEnum } from '../../../../core/enums';
import { EMAIL_VALIDATION_PATTERN } from '../../../../shared/validation-patterns/pattern-email';
import { NotificationService } from '../../../../shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  // Enum to access route names
  AppRouteEnum = AppRouteEnum;
  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();
  // Flag to indicate data loading state
  dataLoading: boolean = false;
  // Form group for password recovery
  recoveryForm: FormGroup;
  // Flag to toggle password visibility
  hide = true;
  // Stores the response from verifying email
  private verifyCurrentEmail: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.buildRecoveryForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Builds the password recovery form with validation
   */
  private buildRecoveryForm(): void {
    this.recoveryForm = this.fb.group({
      email: [null, Validators.compose([
        Validators.required,
        Validators.email,
        Validators.pattern(EMAIL_VALIDATION_PATTERN),
        Validators.maxLength(100)
      ])]
    });
  }

  /**
   * Handles form submission for password recovery
   */
  onSubmitRecovery(): void {
    if (this.recoveryForm.valid) {
      this.dataLoading = true;
      const verifyEmail = this.recoveryForm.value;

      this.authService.fetchVerifyEmail(verifyEmail)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (resp) => {
            this.dataLoading = false;
            this.verifyCurrentEmail = resp;
            // Show success notification and navigate to login page
            this.notificationService.showSuccess(this.verifyCurrentEmail.message);
            this.router.navigate(['auth/login']);
          },
          (error) => {
            this.dataLoading = false;
            console.error(error);
            this.notificationService.showError(error);
          }
        );
    } else {
      return;
    }
  }
}
