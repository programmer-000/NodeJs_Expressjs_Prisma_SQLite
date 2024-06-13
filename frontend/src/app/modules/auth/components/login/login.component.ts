import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { NotificationService, RoleService } from '../../../../shared/services';
import { AppRouteEnum } from '../../../../core/enums';
import { EMAIL_VALIDATION_PATTERN } from '../../../../shared/validation-patterns/pattern-email';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  // Enum to access route names
  AppRouteEnum = AppRouteEnum;
  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();
  // Flag to indicate data loading state
  dataLoading = false;
  // Form group for authentication
  authForm: FormGroup;
  // Flag to toggle password visibility
  hide = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private roleService: RoleService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy(): void {
    // Complete subject to avoid memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Builds the authentication form with validation
   */
  private buildForm(): void {
    this.authForm = this.fb.group({
      email: [null, [
        Validators.required,
        Validators.email,
        Validators.pattern(EMAIL_VALIDATION_PATTERN),
        Validators.maxLength(100)
      ]],
      password: [null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50)
      ]]
    });
  }

  /**
   * Handles form submission for authentication
   * Navigates to the first page after successful login
   */
  onSubmitAuth(): void {
    this.dataLoading = true;

    if (this.authForm.valid) {
      const loginUserData = this.authForm.value;

      this.authService.login(loginUserData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          resp => {
            this.dataLoading = false;
            const currentRole = this.authService.currentRole;
            if (currentRole !== null) {
              this.roleService.setRolesList(currentRole);
            }
            this.router.navigate(['/']);
          },
          error => {
            this.dataLoading = false;
            console.error(error);
            this.notificationService.showError(error);
          }
        );
    }
  }

}
