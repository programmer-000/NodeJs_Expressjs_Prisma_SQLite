import { Injectable } from '@angular/core';
import { NgxsPlugin, getActionTypeFromInstance } from '@ngxs/store';
import { ClearState } from './app.actions';

/**
 * Plugin (Meta Reducers) to clear the state.
 */
@Injectable()
export class ClearStatePlugin implements NgxsPlugin {
  handle(state: any, action: any, next: (state: any, action: any) => any) {
    if (getActionTypeFromInstance(action) === ClearState.type) {
      state = {};
    }
    return next(state, action);
  }
}
