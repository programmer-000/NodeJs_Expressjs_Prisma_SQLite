import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { UsersService } from '../../users.service';
import { RoleEnum } from '../../../../core/enums';
import { RoleService } from '../../../../shared/services';

@Component({
  selector: 'app-users-filter-panel',
  templateUrl: './users-filter-panel.component.html',
  styleUrls: ['./users-filter-panel.component.scss']
})
export class UsersFilterPanelComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    public usersService: UsersService,
    public roleService: RoleService
  ) {
  }

  // Array to store available roles
  public rolesList: any[] = [];

  // Enum for user roles
  protected readonly RoleEnum = RoleEnum;

  // Form group for user filter
  public userFilterForm: FormGroup;

  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();

  // Select All option label
  public selectAllOption: string = 'Select All';

  // Flag to track if all roles are selected
  private selectAllFlag: boolean = false;

  // Initialize flag to track if all fields are filled
  public allFieldsFilled: boolean = false;

  ngOnInit() {
    // Get available roles list
    this.getAvailableRoleList()
    // Initialize form
    this.buildForm();
    // Listen for form changes
    this.onChanges();
  }

  /**
   * Get available roles list
   */
  private getAvailableRoleList(): void {
    this.roleService.rolesListSubject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(resp => {
      this.rolesList = resp.filter(role => role.display) || [];
    });
  }

  /**
   * Build the form
   */
  private buildForm(): void{
    this.userFilterForm = this.fb.group({
      firstName: '',
      lastName: '',
      email: '',
      roles: [[]], // Set initial value as an empty array
    });
    this.initDefaultUsersFilters();
  }

  /**
   * Initializing data in the stream (usersFilters$) of user filters
   */
  private initDefaultUsersFilters() {
    this.usersService.usersFilters$.next(this.userFilterForm.value)
  }

  /**
   * Listen for changes in the form fields
   **/
  private onChanges(): void {
    this.userFilterForm.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.destroy$)).subscribe(val => {

      let arrRoles = [];
      if (val.roles) {
        for (let i = 0; i < val.roles.length; i++) {
          arrRoles.push(val.roles[i].id);
        }
      } else {
        arrRoles = [];
      }

      let filterData = {
        firstName: val.firstName,
        lastName: val.lastName,
        email: val.email,
        roles: arrRoles
      }
      this.usersService.usersFilters$.next(filterData);

      // Check if all fields are filled
      this.allFieldsFilled = this.isFilterFieldsUsers();
      this.updateSelectAllLabel();
    });
  }

  /**
   * Function to toggle all roles selection
   */
  toggleAllRoles(): void {
    const rolesControl = this.userFilterForm.get('roles');
    const rolesList = this.rolesList
    if (rolesControl && rolesList) {
      rolesControl.setValue(this.selectAllFlag ? [] : rolesList);
      this.selectAllFlag = !this.selectAllFlag;
      this.selectAllOption = this.selectAllFlag ? 'Deselect All' : 'Select All';
    }
  }

  /**
   * Update the label of the "Select All" option based on current selection
   */
  updateSelectAllLabel(): void {
    const selectedRoles = this.userFilterForm.get('roles')?.value?.length;
    const totalRoles = this.rolesList?.length;
    this.selectAllOption = selectedRoles === totalRoles ? 'Deselect All' : 'Select All';
  }

  /**
   * Check if more than one form field is filled
   */
  isFilterFieldsUsers(): boolean {
    const {firstName, lastName, email, roles} = this.userFilterForm.value;
    return [firstName, lastName, email, roles?.length].filter(Boolean).length > 1;
  }

  /**
   * Clear all form fields
   */
  clearAllFields(): void {
    this.userFilterForm.setValue({
      firstName: '',
      lastName: '',
      email: '',
      roles: [],
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
