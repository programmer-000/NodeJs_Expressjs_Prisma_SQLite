import { Action, State, StateContext } from '@ngxs/store';
import { AddUser, DeleteUser, GetUsers, SetSelectedUser, UpdateUser, UpdateUserPassword } from './users.action';
import { UsersService } from '../users.service';
import { tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../../shared/notification.service';
import { UserModel } from '../../../core/models';

/**
 * Define the structure of the state
 */
export class UsersStateModel {
  users: UserModel[];
  usersCounter?: any;
  selectedUser?: UserModel | null;
}

/**
 * Define the state and its initial values
 */
@State<UsersStateModel>({
  name: 'UsersState',
  defaults: {
    users: [],
    usersCounter: null,
    selectedUser: null
  }
})
@Injectable()
export class UsersState {

  constructor(
    private usersService: UsersService,
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
        usersList[userIndex] = result;
        setState({
          ...state,
          users: usersList,
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
