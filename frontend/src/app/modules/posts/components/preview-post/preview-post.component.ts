import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';

import { PostModel } from '../../../../core/models';

@Component({
  selector: 'app-preview-post',
  templateUrl: './preview-post.component.html',
  styleUrls: ['./preview-post.component.scss']
})
export class PreviewPostComponent implements OnInit, OnDestroy {
  @Input() post: PostModel | null = null;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    public store: Store,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.post) {
      console.warn('Post is not defined in PreviewPostComponent');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
