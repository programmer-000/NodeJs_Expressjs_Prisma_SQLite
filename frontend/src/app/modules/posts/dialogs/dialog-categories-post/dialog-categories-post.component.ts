import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { AddCategory, DeleteCategory, GetCategories, UpdateCategory } from '../../store-posts/posts.action';
import { PostsSelectors } from '../../store-posts/posts.selectors';
import { DialogConfirmComponent } from '../../../../shared/components/dialog-confirm/dialog-confirm.component';
import { CategoriesModel } from '../../../../core/models';

@Component({
  selector: 'app-dialog-categories-post',
  templateUrl: './dialog-categories-post.component.html',
  styleUrls: ['./dialog-categories-post.component.scss']
})
export class DialogCategoriesPostComponent implements OnInit, OnDestroy {

  constructor(
    public store: Store,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogCategoriesPostComponent>,
  ) {
  }

  // Selecting list of categories from the store
  @Select(PostsSelectors.getListCategories) listAllCategories$: Observable<CategoriesModel[]>;

  // Flag to indicate if data is loading
  dataLoading: boolean = false;

  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();

  // Array to store all categories
  listAllCategories: CategoriesModel[] = [];

  // Form control for category input field
  category = new FormControl('', [Validators.required]);

  // Selected category for editing
  selectedCategory: CategoriesModel;

  // Name of the category
  categoryName: string | null;

  // Flag to indicate whether to add a new category
  addFlag: boolean = false;

  // Flag to control visibility of category fields
  visibilityFields: boolean = false;

  ngOnInit() {
    this.fetchCategories();
    this.onChangesCategory();
  }

  /**
   *Subscribe to changes in the category input field
   */
  private onChangesCategory() {
    this.category.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.destroy$)
    ).subscribe(val => {
      this.categoryName = val;
    });
  }

  /**
   *Fetch all categories from the store
   */
  private fetchCategories() {
    this.dataLoading = true;
    this.store.dispatch(new GetCategories());

    // Subscribe to the list of categories
    this.listAllCategories$.pipe(
      takeUntil(this.destroy$))
      .subscribe(resp => {
        this.listAllCategories = resp;
        if (resp) {
          this.dataLoading = false;
        }
      });
  }

  /**
   *Track categories by their index
   */
  trackByFn(index: any, item: any) {
    return item.id;
  }

  /**
   *Edit a category
   */
  editCategory(category: CategoriesModel) {
    this.selectedCategory = category;
    this.visibilityFields = true;
    this.addFlag = false;
    this.category.patchValue(category.name);
  }

  /**
   *Add a new category
   */
  addCategory() {
    if (!this.categoryName) {
      return;
    }
    const params = {
      name: this.categoryName
    };
    this.store.dispatch(new AddCategory(params));
    this.addFlag = false;
    this.visibilityFields = false;
    this.category.patchValue('');
  }

  /**
   *Update a category
   */
  updateCategory() {
    if (!this.selectedCategory || !this.categoryName) {
      return;
    }
    const {id} = this.selectedCategory;
    const params = {
      name: this.categoryName
    };
    this.store.dispatch(new UpdateCategory(id, params));
    this.visibilityFields = false;
    this.category.patchValue('');
  }

  /**
   *Display category fields for adding a new category
   */
  displayFields() {
    this.visibilityFields = true;
    this.addFlag = true;
    this.category.patchValue('');
  }

  /**
   *Open dialog to confirm category deletion
   */
  openDialogDeleteCategory(category: CategoriesModel) {
    const {id, name} = category;
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        subtitle: name,
        title: 'Delete category - ',
        okText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.store.dispatch(new DeleteCategory(id));
      }
    });
  }

  /**
   *Close dialog
   */
  onNoClick(): void {
    this.dialogRef.close();
    this.category.valueChanges;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.dialogRef.close();
  }
}
