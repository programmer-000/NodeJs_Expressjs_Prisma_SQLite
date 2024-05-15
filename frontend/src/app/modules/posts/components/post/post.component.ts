import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DialogPostsComponent } from '../../dialogs/dialog-posts/dialog-posts.component';
import { DialogConfirmComponent } from '../../../../shared/components/dialog-confirm/dialog-confirm.component';
import { DeletePost } from '../../store-posts/posts.action';
import { PostModel } from '../../../../core/models';
import { RoleEnum } from '../../../../core/enums';
import { AuthorPostModel } from '../../../../core/models/author-post.model';
import { PermissionService } from '../../../../shared/services';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() post: PostModel;

  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();
  // Enum for user roles
  protected readonly RoleEnum = RoleEnum;

  constructor(
    public store: Store,
    public dialog: MatDialog,
    public permissionService: PermissionService
  ) {}

  ngOnInit(): void {
  }

  /**
   * Opens the dialog for editing a post
   * @param id ID of the post to edit
   */
  openDialogEditPost(id: number): void {
    const dialogRef = this.dialog.open(DialogPostsComponent, {
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
    const { id, title, picture } = post;
    const params = { picture };

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        subtitle: title,
        title: 'Delete post - ',
        okText: 'Delete'
      }
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (result === true) {
        this.store.dispatch(new DeletePost(id, params));
      }
    });
  }

  /**
   * Check if the current user has permission to edit or delete a post
   * @param author Author of the post
   */
  public hasActionPermission(author: AuthorPostModel): boolean {
    return this.permissionService.checkActionPostPermission(author);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
