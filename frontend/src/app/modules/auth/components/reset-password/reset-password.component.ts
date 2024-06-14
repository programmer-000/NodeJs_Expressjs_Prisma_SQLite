import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { NotificationService } from '../../../../shared/services';
import { PasswordResetTokenModel } from '../../../../core/models';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  // Flag to indicate if access to the page is allowed
  private accessPageAllowed: any;
  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();
  // Form group for password reset
  resetForm: FormGroup;
  // Flag to toggle password visibility
  hide = true;
  // Object to store reset token from query parameters
  resetTokenFromQueryParams: PasswordResetTokenModel;
  // Snapshot of URL parameters
  private urlParams: ActivatedRouteSnapshot;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.getUrlParams();
  }

  /**
   * Retrieves URL parameters from activated route snapshot
   */
  private getUrlParams(): void {
    this.urlParams = this.activatedRoute.snapshot;
    this.accessCurrentPageHandler();
  }

  /**
   * Handles access to the current page based on the validity of the reset token
   */
  private accessCurrentPageHandler(): void {
    const { id, token } = this.urlParams.queryParams;
    this.resetTokenFromQueryParams = { id, token };

    this.authService.checkValidPasswordResetToken(this.resetTokenFromQueryParams)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        resp => {
          if (resp) {
            this.accessPageAllowed = resp;
            const resetToken = { id, token, valid: true };
            this.authService.validResetToken$.next(resetToken);
            this.notificationService.showSuccess(this.accessPageAllowed.message);
          }
        },
        error => {
          const resetToken = { id, token, valid: false };
          this.authService.validResetToken$.next(resetToken);
          this.router.navigate(['auth/forgot-password']);
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
