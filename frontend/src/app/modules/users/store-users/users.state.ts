import { Action, State, StateContext } from '@ngxs/store';
import {
  AddUser,
  DeleteUser,
  GetUsers,
  SetAuthUser,
  SetSelectedUser,
  UpdateUser,
  UpdateUserPassword
} from './users.action';
import { UsersService } from '../users.service';
import { tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../../shared/notification.service';
import { AuthUserModel, AuthModel, UserModel } from '../../../core/models';
import { LocalStorageEnum } from '../../../core/enums';
import { AuthService } from '../../auth/auth.service';

/**
 * Define the structure of the state
 */
export class UsersStateModel {
  users: UserModel[];
  usersCounter?: any;
  selectedUser?: UserModel | null;
  authUser?: AuthUserModel | null;
}

/**
 * Define the state and its initial values
 */
@State<UsersStateModel>({
  name: 'UsersState',
  defaults: {
    users: [],
    usersCounter: null,
    selectedUser: null,
    authUser: null
  }
})
@Injectable()
export class UsersState {

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
  }

  /**
   * Action to fetch all users
   */
  @Action(GetUsers)
  getAllUsers({getState, setState}: StateContext<UsersStateModel>, {params}: GetUsers) {
    return this.usersService.fetchUsers(params).pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        users: result.users,
        usersCounter: result.totalCount,
      });
    }));
  }

  /**
   * Action to set the selected user
   */
  @Action(SetSelectedUser)
  setSelectedUserId({getState, setState}: StateContext<UsersStateModel>, {payload}: SetSelectedUser) {
    const state = getState();
    setState({
      ...state,
      selectedUser: payload
    });
  }

  /**
   * Action to set the authUser
   */
  @Action(SetAuthUser)
    setAuthUser({getState, setState}: StateContext<UsersStateModel>, {payload}: SetAuthUser) {
    const state = getState();
    setState({
      ...state,
      authUser: payload
    });
  }


  /**
   * Action to add a new user
   */
  @Action(AddUser)
  addNewUser({getState, patchState}: StateContext<UsersStateModel>, {params, avatar}: AddUser) {
    return this.usersService.addUser(params, avatar).pipe(tap((result) => {
        this.notificationService.showSuccess('User created successfully');
        const state = getState();
        patchState({
          users: [...state.users, result.newUser],
          usersCounter: result.totalCount,
        });
      },
      (error) => {
        console.error(error);
        this.notificationService.showError(error);
      }
    ));
  }

  /**
   * Action to update a user
   */
  @Action(UpdateUser)
  updateCurrentsUser({getState, setState}: StateContext<UsersStateModel>, {
    id,
    params,
    avatar,
    imageOrUrl,
    previousImageUrl
  }: UpdateUser) {
    return this.usersService.updateUser(id, params, avatar, imageOrUrl, previousImageUrl).pipe(tap((result) => {
        this.notificationService.showSuccess('User updated successfully');
        const state = getState();
        const usersList = [...state.users];
        const userIndex = usersList.findIndex(item => item.id === id);

        // Update the current account if the user is the same as the current account
        const currentAccount = this.authService.accountValue;
        const authUser: AuthUserModel = {
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          role: result.role,
          avatar: result.avatar,
        }
        if (authUser.id === currentAccount!.userInfo.id) {
          localStorage.setItem(LocalStorageEnum.ACCOUNT, JSON.stringify(authUser));
          const account: AuthModel = {
            userInfo: authUser,
            refreshToken: currentAccount!.refreshToken,
            accessToken: currentAccount!.accessToken
          }
          this.authService.accountSubject$.next(account);
        }

        // Update the user in the list
        usersList[userIndex] = result;
        setState({
          ...state,
          users: usersList,
          authUser,
        });
      },
      (error) => {
        console.error(error);
        this.notificationService.showError(error);
      }
    ));
  }

  /**
   * Action to update a user's password
   */
  @Action(UpdateUserPassword)
  updateUserPassword({getState}: StateContext<UsersStateModel>, {
    id, params
  }: UpdateUserPassword) {
    return this.usersService.updateUserPassword(id, params).pipe(tap((result) => {
        this.notificationService.showSuccess('User password updated successfully');
        console.log(result);
      },
      (error) => {
        console.error(error);
        this.notificationService.showError(error);
      }
    ));
  }

  /**
   * Action to delete a user
   */
  @Action(DeleteUser)
  deleteUser({getState, setState}: StateContext<UsersStateModel>, {id, params}: DeleteUser) {
    return this.usersService.removeUser(id, params).pipe(tap((result) => {
        this.notificationService.showSuccess('User delete successfully');
        const state = getState();
        const filteredArray = state.users.filter(item => item.id !== id);
        setState({
          ...state,
          users: filteredArray,
          usersCounter: state.usersCounter - 1
        });
      },
      (error) => {
        console.error(error);
        this.notificationService.showError(error);
      }
    ));
  }
}
