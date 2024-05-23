import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { DashboardSelectors } from '../../store-dashboard/dashboard.selectors';
import { Observable, Subject } from 'rxjs';
import { StatisticsResponse } from '../../../../core/models';
import { takeUntil } from 'rxjs/operators';
import { roleTransform } from '../../../../shared/utils/role-transform';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.scss']
})
export class UserStatisticsComponent implements OnInit, OnDestroy {
  // Selector to get the statistics data from the store
  @Select(DashboardSelectors.getStatisticsAll) statisticsUsers$: Observable<StatisticsResponse>;

  // Subject to handle subscription cleanup
  private destroy$ = new Subject<void>();

  // Flag to indicate if data is loading
  public dataLoading = false;

  // Initialize with default values for the statistics data counters
  public statisticsUsers: StatisticsResponse = {
    totalUser: 0,
    usersByRole: [],
    usersByStatus: [],
    usersByLocation: []
  };

  // User by Role Chart Data
  public usersByRoleChartLabels: string[] = [];
  public usersByRoleChartData: ChartConfiguration<'doughnut'>['data']['datasets'] = [];
  public usersByRoleChartOptions: ChartConfiguration<'doughnut'>['options'] = {};

  // User by Status Chart Data
  public usersByStatusChartLabels: string[] = [];
  public usersByStatusChartData: ChartConfiguration<'doughnut'>['data']['datasets'] = [];
  public usersByStatusChartOptions: ChartConfiguration<'doughnut'>['options'] = {};

  // User by Location Chart Data
  public usersByLocationChartLabels: string[] = [];
  public usersByLocationChartData: ChartConfiguration<'bar'>['data']['datasets'] = [];
  public usersByLocationChartOptions: ChartConfiguration<'bar'>['options'] = {};

  ngOnInit(): void {
    this.fetchUsersStatistics();
  }

  /**
   * Fetch the statistics data for users
   */
  private fetchUsersStatistics(): void {
    this.dataLoading = true;
    this.statisticsUsers$.pipe(takeUntil(this.destroy$)).subscribe(resp => {
      this.statisticsUsers = resp || {
        totalUser: 0,
        usersByRole: [],
        usersByStatus: [],
        usersByLocation: []
      };
      this.updateUsersCharts();
      this.dataLoading = false;
    });
  }

  /**
   * Update the charts with the data from the statistics
   */
  private updateUsersCharts(): void {
    // Ensure the properties are defined and have default values
    const usersByRole = this.statisticsUsers.usersByRole || [];
    const usersByStatus = this.statisticsUsers.usersByStatus || [];
    const usersByLocation = this.statisticsUsers.usersByLocation || [];

    // User by Role Chart Data
    this.usersByRoleChartLabels = usersByRole.map(role => roleTransform(role.role));
    this.usersByRoleChartData = [{
      data: usersByRole.map(role => role.count),
      label: 'Users by Role'
    }];
    this.usersByRoleChartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Users by Role'
        }
      }
    };

    // User by Status Chart Data
    this.usersByStatusChartLabels = usersByStatus.map(status => status.status ? 'Active' : 'Inactive');
    this.usersByStatusChartData = [{
      data: usersByStatus.map(status => status.count),
      label: 'Users by Status'
    }];
    this.usersByStatusChartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Users by Status'
        }
      }
    };

    // User by Location Chart Data
    this.usersByLocationChartLabels = usersByLocation.map(location => location.location);
    this.usersByLocationChartData = [{
      data: usersByLocation.map(location => location.count),
      label: 'Users by Location'
    }];
    this.usersByLocationChartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Users by Location'
        }
      }
    };
  }

  /**
   * Get the count of active users
   * @returns The count of active users
   */
  public getActiveUsersCount(): number {
    if (!this.statisticsUsers.usersByStatus) {
      return 0;
    }
    const activeUsers = this.statisticsUsers.usersByStatus.find(status => status.status);
    return activeUsers ? activeUsers.count : 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
