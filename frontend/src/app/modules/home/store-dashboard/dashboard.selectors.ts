import { Selector } from '@ngxs/store';
import { DashboardState, DashboardStateModel } from './dashboard-state.service';

/**
 * Selector class for accessing state data related to Dashboard.
 */
export class DashboardSelectors {

  /**
   * Retrieves the list Statistics from the state.
   * @returns The list of Statistics.
   */
  @Selector([DashboardState])
  static getStatisticsAll(state: DashboardStateModel) {
    return state.statisticsCounters;
  }
}
