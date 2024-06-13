import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageEnum, RoleEnum } from '../../core/enums';
import { ROLES_LIST } from '../constants/roles-list';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  public rolesListSubject$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(ROLES_LIST);

  constructor() {
  }

  /**
   * Function to set the list of available roles based on the current user role
   * For the ProjectAdmin, the roles of Managers and Clients are displayed
   * @param currentUserRole - current user role
   */
  public setRolesList(currentUserRole: number | null | undefined): void {
    const rolesList = ROLES_LIST.map(role => {
      if (currentUserRole === RoleEnum.ProjectAdmin && (role.id === RoleEnum.SuperAdmin || role.id === RoleEnum.ProjectAdmin)) {
        return {...role, display: false};
      }
      return role;
    });
    localStorage.setItem(LocalStorageEnum.ROLES_LIST, JSON.stringify(rolesList));
    this.rolesListSubject$.next(rolesList);
  }
}
