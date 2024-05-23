import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { StatisticsResponse } from '../../../../core/models';
import { DashboardSelectors } from '../../store-dashboard/dashboard.selectors';
import { roleTransform } from '../../../../shared/utils/role-transform';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-post-statistics',
  templateUrl: './post-statistics.component.html',
  styleUrls: ['./post-statistics.component.scss']
})
export class PostStatisticsComponent implements OnInit, OnDestroy {
  constructor(
    public store: Store
  ) {
  }

  // Selector to get the statistics data from the store
  @Select(DashboardSelectors.getStatisticsAll) statisticsPosts$: Observable<StatisticsResponse>;

  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();

  // Initialize with default values for the statistics data counters
  public statisticsPosts: StatisticsResponse = {
    totalPosts: 0,
    postsByRole: [],
    postsByUser: [],
    postsByCategory: [],
    postsByStatus: [],
  };

  // Flag to indicate if data is loading
  public dataLoading: boolean = false;

  // Post by Category Chart Data
  public categoryPostsChartLabels: string[] = [];
  public categoryPostsChartData: ChartConfiguration<'doughnut'>['data']['datasets'] = [];
  public categoryPostsCartOptions: ChartConfiguration<'doughnut'>['options'] = {};

  // Post by Role Chart Data
  public rolePostsChartLabels: string[] = [];
  public rolePostsChartData: ChartConfiguration<'doughnut'>['data']['datasets'] = [];
  public rolePostsCartOptions: ChartConfiguration<'doughnut'>['options'] = {};

  // Post by User Chart Data
  public userPostsChartLabels: string[] = [];
  public userPostsChartData: ChartConfiguration<'bar'>['data']['datasets'] = [];
  public userPostsCartOptions: ChartConfiguration<'bar'>['options'] = {};

  ngOnInit(): void {
    this.fetchPostsStatistics();
  }

  /**
   * Fetch the statistics data for posts
   */
  private fetchPostsStatistics(): void {
    this.dataLoading = true;
    this.statisticsPosts$.pipe(takeUntil(this.destroy$)).subscribe(resp => {
      this.statisticsPosts = resp || {
        totalPosts: 0,
        postsByRole: [],
        postsByUser: [],
        postsByCategory: [],
        postsByStatus: [],
      };
      this.updatePostsCharts();
      this.dataLoading = false;
    });
  }

  /**
   * Get the count of published posts
   * @returns The count of published posts
   */
  public getPublishedPostsCount(): number {
    if (!this.statisticsPosts.postsByStatus) {
      return 0;
    }
    const publishedStatus = this.statisticsPosts.postsByStatus.find(status => status.published);
    return publishedStatus ? publishedStatus.count : 0;
  }

  /**
   * Update the charts with the new data values
   */
  private updatePostsCharts(): void {
    // Ensure the properties are defined and have default values
    const postsByCategory = this.statisticsPosts.postsByCategory || [];
    const postsByRole = this.statisticsPosts.postsByRole || [];
    const postsByUser = this.statisticsPosts.postsByUser || [];

    // Category Chart Data
    this.categoryPostsChartLabels = postsByCategory.map(category => category.name);
    this.categoryPostsChartData = [{
      data: postsByCategory.map(category => category._count.posts),
      label: 'Posts by Category'
    }];
    this.categoryPostsCartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Posts by Category'
        }
      }
    }

    // Role Chart Data
    this.rolePostsChartLabels = postsByRole.map(role => roleTransform(role.role));
    this.rolePostsChartData = [{
      data: postsByRole.map(role => role.count),
      label: 'Posts by Role'
    }];
    this.rolePostsCartOptions = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Posts by Role'
        }
      }
    }

    // User Chart Data
    this.userPostsChartLabels = postsByUser.map(user => `${user.firstName} ${user.lastName}`);
    this.userPostsChartData = [{
      data: postsByUser.map(user => user._count.posts),
      label: 'Posts by User'
    }];
    this.userPostsCartOptions = {
      responsive: true,
      plugins: {
        colors: {
          enabled: true,
        },
        title: {
          display: true,
          text: 'Posts by User'
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
