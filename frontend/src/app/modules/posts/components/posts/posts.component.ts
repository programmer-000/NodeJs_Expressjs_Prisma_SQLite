import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PostsService } from '../../posts.service';
import { GetPosts } from '../../store-posts/posts.action';
import { PostsSelectors } from '../../store-posts/posts.selectors';
import { Select, Store } from '@ngxs/store';
import { PostFilterModel, PostModel } from '../../../../core/models';
import { AuthService } from '../../../auth/auth.service';
import { RoleEnum } from '../../../../core/enums';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {


  constructor(
    public postsService: PostsService,
    private authService: AuthService,
    public dialog: MatDialog,
    public store: Store
  ) {}

  // Selectors for retrieving posts list and counter from the Ngxs store
  @Select(PostsSelectors.getPostsList) posts$: Observable<PostModel[]>;
  @Select(PostsSelectors.getPostsCounter) postsCounter$: Observable<number>;

  // Flag to indicate whether data is loading
  dataLoading: boolean = false;

  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();

  // Default and current filters for posts
  private defaultPostsFilters: PostFilterModel = {authors: [], categories: []};
  private postsFilters: PostFilterModel = this.defaultPostsFilters;

  // Current userId
  userId: any;

  // Pagination variables
  length = 0; // Total number of items
  pageSize = 2; // Number of items per page
  pageIndex = 0; // Current page index
  pageSizeOptions = [2, 3, 5, 10, 15, 20, 25];
  previousPageIndex = 0;
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent: PageEvent;

  ngOnInit(): void {
    this.userId = this.authService.accountValue?.userInfo.id;
    this.getPostsFilter();
  }

  /**
   * Subscribe to post filter changes
   */
  private getPostsFilter() {
    this.postsService.postsFilters$
      .pipe(takeUntil(this.destroy$))
      .subscribe(resp => {

        // Initialize filters with default values
        this.postsFilters = !Object.keys(resp).length ? this.defaultPostsFilters : resp;

        // Set current user's ID as the author if the role is Client
        if (this.authService.currentRole === RoleEnum.Client) {
          this.postsFilters.authors = [this.userId];
        }
        this.fetchData();
      });
  }

  /**
   * Fetch posts based on filters and pagination
   */
  private fetchData(): void {
    this.dataLoading = true;
    const params = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      authors: this.postsFilters.authors,
      categories: this.postsFilters.categories
    };
    this.store.dispatch(new GetPosts(params));
    this.postsCounter$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(resp => {
      this.length = resp;
      this.dataLoading = false;
    });
  }

  /**
   * Handle page change event
   * @param e PageEvent object containing pagination data
   */
  handlePageEvent(e: PageEvent): void {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.fetchData();
  }

  /**
   * TrackBy function for ngFor
   * @param index Index of the current item
   * @param item Current item being iterated over
   * @returns Unique identifier for the item
   */
  trackByFn(index: number, item: PostModel): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
