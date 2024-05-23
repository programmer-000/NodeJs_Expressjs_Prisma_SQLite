import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../../shared/services';
import { HomeService } from '../home.service';

import { tap } from 'rxjs';
import { StatisticsResponse } from '../../../core/models';
import { GetStatisticsAction } from './dashboard.action';


/**
 * Define the structure of the DashboardStateModel
 */
export class DashboardStateModel {
  statisticsCounters: StatisticsResponse[];
}

/**
 * Decorator for defining a state class
 */
@State<DashboardStateModel>({
  name: 'DashboardState',
  defaults: {
    statisticsCounters: [],
  }
})

@Injectable()
export class DashboardState {

  constructor(
    private homeService: HomeService,
    private notificationService: NotificationService,
  ) {
  }

  /**
   * Action to get all Statistics
   */
  @Action(GetStatisticsAction)
  getAllStatistics({getState, setState}: StateContext<DashboardStateModel>) {
    return this.homeService.getStatistics().pipe(tap((result) => {
        const state = getState();
        setState({
          ...state,
          statisticsCounters: result,
        });
      },
      (error) => {
        console.error(error);
        this.notificationService.showError(error);
      }));
  }
}

