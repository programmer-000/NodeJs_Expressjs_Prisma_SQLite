import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogPostsComponent } from '../../dialogs/dialog-posts/dialog-posts.component';
import { DialogConfirmComponent } from '../../../../shared/components/dialog-confirm/dialog-confirm.component';
import { PostsService } from '../../posts.service';
import { Store } from '@ngxs/store';
import { DeletePost } from '../../store-posts/posts.action';
import { PostModel } from '../../../../core/models';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() post: PostModel;

  constructor(
    public store: Store,
    public dialog: MatDialog,
    public postsService: PostsService,
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

  ngOnDestroy(): void {
  }
}
