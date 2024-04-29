import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';

export interface AppStateModel {
  appName: string;
}

export class SetAppName {
  static readonly type = '[App] SetAppName';

  constructor(public appName: string) {
  }
}

@State<AppStateModel>({name: 'AppState'})

@Injectable()
export class AppState {
  @Selector()
  static getAppName(state: AppStateModel): string {
    return state.appName = 'App State';
  }

  @Action(SetAppName)
  setHost(ctx: StateContext<AppStateModel>, action: SetAppName) {
    ctx.patchState({
      appName: action.appName
    });
  }
}
