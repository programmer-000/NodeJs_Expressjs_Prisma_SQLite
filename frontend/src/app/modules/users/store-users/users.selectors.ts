import { Selector } from '@ngxs/store';
import { UsersState, UsersStateModel } from './users.state';

/**
 * Selector class for accessing state data related to users.
 */
export class UsersSelectors {

  /**
   * Retrieves the list of users from the state.
   * @returns The list of users.
   */
  @Selector([UsersState])
  static getUsersList(state: UsersStateModel) {
    return state.users;
  }

  /**
   * Retrieves the count of users from the state.
   * @returns The count of users.
   */
  @Selector([UsersState])
  static getUsersCounter(state: UsersStateModel) {
    return state.usersCounter;
  }
}
