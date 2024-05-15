import { Injectable } from '@angular/core';
import { AuthorPostModel } from '../../core/models/author-post.model';
import { RoleEnum } from '../../core/enums';
import { AuthService } from '../../modules/auth/auth.service';
import { AuthUserModel, UserModel } from '../../core/models';
import { HEAD_SUPER_ADMIN } from '../constants/head-super-admin';
import { PERMISSIONS } from '../constants/permissions';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private authService: AuthService,) {
  }

  /**
   * Check if the current user has permission to edit or delete a post
   * @param author Author of the post
   */
  public checkActionPostPermission(author: AuthorPostModel): boolean {
    const authorRole = author.role;
    const authorId = author.id
    const {id: currentUserId, role: currentUserRole} = this.authService.accountSubject$.value?.userInfo || {};

    if (currentUserRole) {
      if (currentUserRole === RoleEnum.SuperAdmin) {
        return true;
      } else if (currentUserRole === RoleEnum.ProjectAdmin) {
        return (currentUserRole === RoleEnum.ProjectAdmin && authorId === currentUserId) || [RoleEnum.Manager, RoleEnum.Client].includes(authorRole);

      } else if (currentUserRole === RoleEnum.Manager) {
        return (currentUserRole === RoleEnum.Manager && authorId === currentUserId) || authorRole === RoleEnum.Client;

      } else if (currentUserRole === RoleEnum.Client) {
        return authorRole === RoleEnum.Client && authorId === currentUserId;
      }
    }
    return false;
  }

  /**
   * isHeadSuperAdmin checks if the user is a super admin.
   * @param user UserModel
   */
  isHeadSuperAdmin(user: UserModel): boolean {
    return !(user.role === HEAD_SUPER_ADMIN.role && user.id === HEAD_SUPER_ADMIN.id);
  }

  /**
   * isAuthUser checks if the user is the authenticated user
   * @param user UserModel
   */
  isAuthUser(user: UserModel): boolean {
    return user.id === this.authService.accountSubject$.value?.userInfo?.id;
  }

  /**
   * checkManagerPermissions checks if the user is a manager and has permissions to manage other users
   * @param authUser AuthUserModel
   * @param currentUser UserModel
   */
  checkManagerPermissions(authUser: AuthUserModel | undefined, currentUser: UserModel): boolean | string[] {
    if (authUser?.role === RoleEnum.Manager && authUser?.id !== currentUser?.id) {
      return PERMISSIONS.MANAGER.PAGE_USERS.DIALOG.elements;
    }
    return true;
  }

}
