import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../users.service';
import { Observable, startWith, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { AddUser, SetSelectedUser, UpdateUser} from '../../store-users/users.actions';
import { COUNTRIES } from '../../../../shared/constants/countries';
import { map } from 'rxjs/operators';
import { mustMatchValidator } from '../../../../shared/custom-validators/must-match.validator';
import { futureDateValidator } from '../../../../shared/custom-validators/future-date.validator';
import { countryValidator } from '../../../../shared/custom-validators/country.validator';
import { AppRouteEnum, LocalStorageEnum, RoleEnum } from '../../../../core/enums';
import { DialogNewPasswordComponent } from '../dialog-new-password/dialog-new-password.component';
import { EMAIL_VALIDATION_PATTERN } from '../../../../shared/validation-patterns/pattern-email';
import { AuthModel, AuthUserModel, CountriesModel, UserModel } from '../../../../core/models';
import { NotificationService, PermissionService, RoleService } from '../../../../shared/services';
import { AuthService } from '../../../auth/auth.service';

// Default profile image path
const defaultProfileImage = 'assets/images/avatar_1.jpg';

@Component({
  selector: 'app-edit-users',
  templateUrl: './dialog-users.component.html',
  styleUrls: ['./dialog-users.component.scss']
})
export class DialogUsersComponent implements OnInit, OnDestroy {

  constructor(
    public store: Store,
    public dialogRefUsersComponent: MatDialogRef<DialogUsersComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService,
    public permissionService: PermissionService,
    public usersService: UsersService,
    public authService: AuthService,
    public roleService: RoleService,
    public dialog: MatDialog
  ) {
  }


  // Enum for user roles
  protected readonly RoleEnum = RoleEnum;

  authUser: AuthUserModel | undefined = this.authService.accountSubject$.value?.userInfo;

  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();

  // Loading indicator
  dataLoading: boolean = false;

  // Enum to access route names
  AppRouteEnum = AppRouteEnum;

  // Constants
  countriesList = COUNTRIES;

  // Form variables
  userForm: FormGroup;
  hide = true;
  currentUser: UserModel;

  // Avatar variables
  avatarUrl: any;
  previousImageUrl = '';
  avatarFile = '';
  avatarImageDefault: any;

  filteredCountries: Observable<CountriesModel[]>;

  ngOnInit() {
    // Initialize form
    this.buildForm();
    // Set default avatar image
    this.avatarImageDefault = defaultProfileImage;
    // Check if new user or existing user
    if (this.data.newUser) {
      this.userForm.reset();
      this.addPasswordControls();
      // Set default status value
      this.userForm.patchValue({
        status: true
      });
    } else {
      this.initFormValue();
    }
    // Enable country autocomplete
    this.autocompleteCountries();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.dialogRefUsersComponent.close();
  }

  /**
   * Build the user form with default values and validations
   */
  private buildForm(): void {
    this.userForm = this.fb.group({
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
      role: [null, Validators.compose([
        Validators.required,
        Validators.maxLength(50)])
      ],
      location: [null, Validators.compose([
        Validators.required,
        countryValidator()])],
      birthAt: [null, Validators.compose([
        Validators.required,
        futureDateValidator
      ])],
      status: '',
    });
  }

  /**
   * Dynamic add PasswordControls
   */
  private addPasswordControls(): void {
    // Add password and confirmPassword controls dynamically
    this.userForm = this.fb.group({
      ...this.userForm.controls,
      password: [null, Validators.compose([
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
      validator: mustMatchValidator('password', 'confirmPassword')
    });
  }

  /**
   * Initialize form values for an existing user
   */
  private initFormValue() {
    this.dataLoading = true;
    const id: number = this.data.id;
    this.usersService.getUser(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
          if (data) {
            this.dataLoading = false;
          }
          this.currentUser = data;
          this.previousImageUrl = data.avatar;
          this.avatarUrl = data.avatar;

          // Set form values
          this.userForm.setValue({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            location: data.location,
            status: data.status,
            birthAt: data.birthAt,
          });
          // Set selected user in the store
          this.store.dispatch(new SetSelectedUser(data));
        },
        (error) => {
          this.dataLoading = false;
        }
      );
  }

  /**
   *  Enable autocomplete for location field
   */
  private autocompleteCountries() {
    this.filteredCountries = this.userForm.controls['location'].valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterStates(state) : this.countriesList.slice())),
    );
  }

  private _filterStates(value: string): CountriesModel[] {
    // Filter countries based on user input
    const filterValue = value.toLowerCase();
    return this.countriesList.filter(state => state.name.toLowerCase().includes(filterValue));
  }

  /**
   * Handle image loading and validation
   */
  handleImageLoaded(event: any) {
    if (event.target.files && event.target.files[0]) {
      const files = event.target.files;
      let invalidFlag = false;
      const pattern = /image-*/;
      for (const file of files) {
        if (!file.type.match(pattern)) {
          invalidFlag = true;
          alert('invalid format');
        }
      }
      this.handleImagePreview(files);
    }
  }

  /**
   * Adding Image Preview
   */
  handleImagePreview(files: any): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.avatarUrl = event.target.result;
    }
    this.avatarFile = files[0];
    reader.readAsDataURL(files[0]);
  }

  /**
   * Delete selected avatar
   */
  public deleteAvatar() {
    this.avatarUrl = '';
    this.avatarFile = '';
  }

  /**
   * Check if the current Manager has access to the dialog box elements
   * @param authUser
   * @param currentUser Current user
   */
  isPermissionsManager(authUser: AuthUserModel | undefined, currentUser: UserModel): boolean | string[] {
    return this.permissionService.checkManagerPermissions(authUser, currentUser);
  }

  /**
   * Submit user form
   */
  onSubmitUser(): void {
    if (this.data.newUser) {
      this.addNewUser();
    } else {
      this.updateUser();
    }
  }

  /**
   * Add a new user
   */
  private addNewUser(): void {
    if (this.userForm.invalid) {
      return;
    }
    const avatar = this.avatarFile;
    const params: any = {
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      role: Number(this.userForm.value.role),
      location: this.userForm.value.location,
      status: this.userForm.value.status,
      birthAt: this.userForm.value.birthAt,
      avatar: ''
    };
    this.store.dispatch(new AddUser(params, avatar));
  }

  /**
   * Update existing user
   */
  private updateUser(): void {
    this.dataLoading = true;
    if (this.userForm.invalid) {
      return;
    }

    let {id} = this.currentUser
    const avatar = this.avatarFile;
    const previousImageUrl = this.previousImageUrl;
    let imageOrUrl: boolean;
    imageOrUrl = !!this.avatarUrl;

    const params: any = {
      id: id,
      email: this.userForm.value.email,
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      role: Number(this.userForm.value.role),
      location: this.userForm.value.location,
      status: this.userForm.value.status,
      birthAt: this.userForm.value.birthAt,
      avatar: '',
    };

    // Update Profile
    if (this.data.editProfile) {
      this.usersService.updateUser(id, params, avatar, imageOrUrl, previousImageUrl).pipe(
        takeUntil(this.destroy$))
        .subscribe(resp => {
           if (resp) {
              this.dataLoading = false;

              const currentAccount = this.authService.accountValue;
              const updatedProfile: AuthUserModel = {
                id: resp.data.id,
                firstName: resp.data.firstName,
                lastName: resp.data.lastName,
                email: resp.data.email,
                role: resp.data.role,
                avatar: resp.data.avatar,
              }

              // Update the current account if the user is the same as the current account
              if (updatedProfile.id === currentAccount!.userInfo.id) {
                localStorage.setItem(LocalStorageEnum.ACCOUNT, JSON.stringify(updatedProfile));
                const account: AuthModel = {
                  userInfo: updatedProfile,
                  refreshToken: currentAccount!.refreshToken,
                  accessToken: currentAccount!.accessToken
                }
                this.authService.accountSubject$.next(account);
              }
              this.notificationService.showSuccess(resp.message);
              this.closeClick();
            }
          },
          (error) => {
            this.dataLoading = false;
            this.closeClick();
          });
    } else {

      // Update User
      this.store.dispatch(new UpdateUser(id, params, avatar, imageOrUrl, previousImageUrl));
      this.dataLoading = false;
      this.closeClick();
    }
  }

  /**
   * Open dialog to change password
   */
  openDialogNewPassword(currentUser: UserModel) {
    const {id, email, role} = currentUser;
    const dialogRef = this.dialog.open(DialogNewPasswordComponent, {
      width: '375px',
      panelClass: 'dialog-new-password',
      data: {
        editProfile: this.data.editProfile,
        userId: id,
        email,
        role,
        title: 'Change Password',
        okText: 'Submit',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
      } else {
        return
      }
    });
  }

  /**
   * Close the dialog
   */
  closeClick(): void {
    this.dialogRefUsersComponent.close();
  }
}
