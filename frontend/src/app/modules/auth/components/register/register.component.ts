import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { COUNTRIES } from '../../../../shared/constants/countries';
import { MustMatch } from '../../../../core/helpers/must-match.validator';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { AppRouteEnum, RoleEnum } from '../../../../core/enums';
import { EMAIL_VALIDATION_PATTERN } from '../../../../shared/validation-patterns/pattern-email';
import { NotificationService } from '../../../../shared/services';
import { CountriesModel, UserModel } from '../../../../core/models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private registerUserResp: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
  }

  // Enum to access route names
  AppRouteEnum = AppRouteEnum;
  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();
  // Loading indicator
  dataLoading: boolean = false;
  // Subscription to user data
  private subUser: Subscription;

  // Lists of countries
  countriesList = COUNTRIES;
  // Default role is 'Client'
  defaultRole: number = RoleEnum.Client;
  // There may be four role options
  // 1 = Super Admin
  // 2 = Project Admin
  // 3 = Manager
  // 4 = Client


  // Form group for registration
  registerForm: FormGroup;
  // Password visibility toggle
  hide = true;

  // User and response models
  currentUser: UserModel;
  respNewUser: UserModel;
  respUpdateUser: UserModel;

  // Avatar settings
  avatarUrl: any;
  previousImageUrl = '';
  avatarFile = '';
  avatarImageDefault: any;
  // Observable for filtered countries
  filteredCountries: Observable<CountriesModel[]>;

  ngOnInit() {
    this.buildRegForm(); // Initialize registration form
    this.autocompleteCountries(); // Enable country autocomplete
  }

  /**
   * Build the registration form with validators
   */
  private buildRegForm() {
    this.registerForm = this.fb.group({
      email: [null, Validators.compose([
        Validators.required,
        Validators.email,
        Validators.pattern(EMAIL_VALIDATION_PATTERN),
        Validators.maxLength(100)])
      ],
      firstName: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])
      ],
      lastName: [null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)])
      ],
      role: this.defaultRole, // Default role is 'Client'

      location: [null, Validators.compose([
        Validators.required])],
      password: [null, Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50)])
      ],
      confirmPassword: [null, Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50)])
      ],
      birthAt: [null, Validators.compose([
        Validators.required])],
      status: false,
    }, {
      validator: MustMatch('password', 'confirmPassword') // Custom validator for password match
    });
  }

  /**
   * Enable country autocomplete
   */
  private autocompleteCountries() {
    this.filteredCountries = this.registerForm.controls['location'].valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStates(state) : this.countriesList.slice())),
    );
  }

  /**
   * Filter countries based on user input
   * @param value User input value for country
   * @returns Filtered list of countries
   */
  private _filterStates(value: string): CountriesModel[] {
    const filterValue = value.toLowerCase();
    return this.countriesList.filter(state => state.name.toLowerCase().includes(filterValue));
  }

  /**
   * Submit new user registration
   */
  onSubmitNewUser(): void {
    this.dataLoading = true;
    if (this.registerForm.valid) {
      const registerUserData = this.registerForm.value;

      const params: any = {
        email: registerUserData.email,
        firstName: registerUserData.firstName,
        lastName: registerUserData.lastName,
        role: registerUserData.role,
        location: registerUserData.location,
        password: registerUserData.password,
        birthAt: registerUserData.birthAt,
        status: registerUserData.status,
      };

      this.authService.registerUser(params).pipe(
        takeUntil(this.destroy$))
        .subscribe(resp => {
            this.registerUserResp = resp;
            if (resp) {
              setTimeout(() => {
                this.notificationService.showSuccess(resp.message);
                this.router.navigate(['/auth/login']);
              }, 1000);

              this.dataLoading = false;
            }

          },
          (error) => {
            console.error(error);
            this.dataLoading = false;
            this.notificationService.showError(error);
          });
    }
  }

  ngOnDestroy(): void {
    this.subUser?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
