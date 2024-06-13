import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Select, Store } from '@ngxs/store';
import { DeletePost, SetSelectedPost } from '../../store-posts/posts.actions';
import { PostsSelectors } from '../../store-posts/posts.selectors';

import { PostsService } from '../../posts.service';
import { PostModel } from '../../../../core/models';
import { NotificationService, PermissionService } from '../../../../shared/services';
import { AuthorPostModel } from '../../../../core/models/author-post.model';
import { DialogConfirmComponent } from '../../../../shared/components/dialog-confirm/dialog-confirm.component';
import { DialogPostsComponent } from '../../dialogs/dialog-posts/dialog-posts.component';
import { AppRouteEnum } from '../../../../core/enums';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  dataLoading: boolean = false;
  post: PostModel | null = null;
  postId: number | null = null;

  constructor(
    private notificationService: NotificationService,
    public permissionService: PermissionService,
    public postsService: PostsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public store: Store,
  ) {}

  // Select post from the store
  @Select(PostsSelectors.getSelectedPost) post$: Observable<PostModel>;

  ngOnInit() {
    this.getPostId();
    this.fetchPost();
    this.setPost();
  }

  /**
   * Get post ID from the route
   * @private
   */
  private getPostId() {
    this.activatedRoute.params.subscribe(params => {
      this.postId = +params['id'];
    });
  }

  /**
   * Fetch post by ID from the server and set it to the store state
   * @private
   */
  private fetchPost() {
    if (this.postId !== null) {
      this.dataLoading = true;
      this.postsService.getPost(this.postId).pipe(
        takeUntil(this.destroy$)
      ).subscribe(data => {
          this.store.dispatch(new SetSelectedPost(data));
          this.dataLoading = false;
        },
        (error) => {
          this.dataLoading = false;
          console.error(error);
          this.notificationService.showError(error);
        }
      );
    }
  }

  /**
   * Set post from the store
   * @private
   */
  public setPost(): void {
    this.post$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((data) => {
      this.post = data;
    });
  }

  /**
   * Check if the current user has permission to edit or delete a post
   * @param author Author of the post
   */
  public hasActionPermission(author: AuthorPostModel): boolean {
    return this.permissionService.checkActionPostPermission(author);
  }

  /**
   * Opens the dialog for editing a post
   * @param id ID of the post to edit
   */
  openDialogEditPost(id: number): void {
    const dialogRef = this.dialog.open(DialogPostsComponent, {
      width: 'auto',
      data: { id, newPost: false },
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

  /**
   * Opens the dialog for deleting a post
   * @param post Post to delete
   */
  openDialogDeletePost(post: PostModel): void {
    if (!post) return;

    const { id, title, picture } = post;
    const params = { picture };

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '375px',
      data: {
        subtitle: title,
        title: 'Delete - ',
        okText: 'Delete'
      }
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (result === true) {
        this.store.dispatch(new DeletePost(id, params));
        this.router.navigate([AppRouteEnum.Posts]);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly AppRouteEnum = AppRouteEnum;
}
