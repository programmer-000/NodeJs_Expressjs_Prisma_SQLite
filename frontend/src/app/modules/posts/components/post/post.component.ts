import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPostsComponent } from '../../dialogs/dialog-posts/dialog-posts.component';
import { DialogConfirmComponent } from '../../../../shared/components/dialog-confirm/dialog-confirm.component';
import { Store } from '@ngxs/store';
import { DeletePost } from '../../store-posts/posts.action';
import { PostModel } from '../../../../core/models';
import { RoleEnum } from '../../../../core/enums';
import { Subject } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() post: PostModel;

  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();
  // Enum to access route names
  protected readonly RoleEnum = RoleEnum;

  constructor(
    public store: Store,
    public dialog: MatDialog,
    private authService: AuthService,
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

    dialogRef.afterClosed().subscribe((result) => {
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

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.store.dispatch(new DeletePost(id, params));
      } else {
        return;
      }
    });
  }

  /**
   * Check if the user has permission to edit or delete a post
   * @param id ID of the post
   */
  public checkPermissionRole(id: number) {
    const currentUserRole = this.authService.accountSubject$.value?.userInfo.role;
    return currentUserRole === RoleEnum.Manager && (id === RoleEnum.SuperAdmin || id === RoleEnum.ProjectAdmin);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
