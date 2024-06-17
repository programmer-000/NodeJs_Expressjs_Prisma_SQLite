import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { PostsService } from '../../posts.service';
import { Select, Store } from '@ngxs/store';
import { AddPost, GetCategories, SetSelectedPost, UpdatePost } from '../../store-posts/posts.actions';
import { PostsSelectors } from '../../store-posts/posts.selectors';
import * as _ from 'lodash';
import { AuthService } from '../../../auth/auth.service';
import { CategoriesModel, PostModel } from '../../../../core/models';
import { NotificationService } from '../../../../shared/services';

const pictureDefault = 'assets/images/image-placeholder.jpg';

/**
 * Interface for food options in select dropdown
 */
export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialogs-posts',
  templateUrl: './dialog-posts.component.html',
  styleUrls: ['./dialog-posts.component.scss']
})
export class DialogPostsComponent implements OnInit, OnDestroy {

  constructor(
    public store: Store,
    public dialogRef: MatDialogRef<DialogPostsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    public postsService: PostsService,
    private authService: AuthService
  ) {}


// Selecting list of categories from the store
  @Select(PostsSelectors.getListCategories) listAllCategories$: Observable<CategoriesModel[]>;

// Current userId
  userId: number | undefined;

// Array to store all categories
  listAllCategories: any = [];

// Flag to indicate if data is loading
  dataLoading: boolean = false;

// Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();

// Form group for post data
  postForm: FormGroup;

// Current post model
  currentPost: PostModel;

// URL of the picture
  pictureUrl: any;

// URL of the previous picture
  previousPictureUrl: '';

// Uploaded picture file
  pictureFile: any;

// Default picture URL
  pictureDefault: any;

// Array to store initial categories
  initCategories: CategoriesModel[] = [];

// Array to store selected categories
  selectedCategories: CategoriesModel[] = [];

// Array to store included categories
  includedCategories: CategoriesModel[] = [];

// Array to store excluded categories
  excludedCategories: CategoriesModel[] = [];


  /**
   * Determines if two category objects are the same
   * @param categoryA First category object
   * @param categoryB Second category object
   * @returns True if the two categories are the same, false otherwise
   */
  public isSameCategory(categoryA?: CategoriesModel, categoryB?: CategoriesModel): boolean {
    return categoryA?.id === categoryB?.id;
  }

  ngOnInit() {
    this.userId = this.authService.accountValue?.userInfo.id;

    this.fetchCategories();
    this.buildForm();
    this.pictureDefault = pictureDefault;
    if (this.data.newPost) {
      this.postForm.reset();
      this.postForm.patchValue({
        published: true
      });
    } else {
      this.fetchCurrentPost();
    }
    this.calculationSelectedCategories();
  }

  /**
   * Fetches all categories from the store
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
   * Fetches the current post from the service
   */
  private fetchCurrentPost() {
    const id: number = this.data.id;
    this.postsService.getPost(id).pipe(
      takeUntil(this.destroy$))
      .subscribe(data => {
          this.currentPost = data;
          this.initCategories = data.categories;
          if (this.currentPost) {
            this.initPostFormValue();
          }
          this.previousPictureUrl = data.picture;
          this.pictureUrl = data.picture;
          this.store.dispatch(new SetSelectedPost(data));
        },
        (error) => {
          this.dataLoading = false;
          console.error(error);
          this.notificationService.showError(error);
        }
      );
  }

  /**
   * Builds the form for the post
   */
  private buildForm() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      content: ['', []],
      categories: ['', [Validators.required]],
      published: ['', []]
    });
  }

  /**
   * Initializes the form with values from the current post
   */
  private initPostFormValue() {
    this.postForm.patchValue({
      title: this.currentPost.title,
      description: this.currentPost.description,
      content: this.currentPost.content,
      categories: this.currentPost.categories,
      published: this.currentPost.published
    });
  }

  /**
   * Observes changes in the selected categories and calculates included and excluded categories
   */
  private calculationSelectedCategories() {
    this.postForm.controls['categories'].valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.destroy$)
    ).subscribe(val => {
        this.selectedCategories = val;

        const oldArray = [...this.initCategories];
        const newArray = [...this.selectedCategories];

        const changed = newArray.filter(newitem => {
          const olditem = oldArray.find(o => o.id == newitem.id);
          return !_.isEqual(newitem, olditem);
        });
        this.includedCategories = [...changed];

        const deleted = oldArray.filter(olditem => {
          const newitem = newArray.find(n => n.id == olditem.id);
          return !_.isEqual(newitem, olditem);
        }).filter(items => {
          const item = changed.find(cd => cd.id == items.id);
          return !item;
        });
        this.excludedCategories = [...deleted];
      }
    );
  }

  /**
   * Removes a category from the selected categories
   * @param topping The category to be removed
   */
  onToppingRemoved(topping: CategoriesModel) {
    this.excludedCategories.push(topping);
    const toppings = this.postForm.controls['categories'].value;
    this.removeFirst(toppings, topping);
    this.postForm.controls['categories'].patchValue(toppings);
  }

  /**
   * Removes the first occurrence of an item from an array
   * @param array The array from which to remove the item
   * @param toRemove The item to be removed
   */
  private removeFirst(array: any, toRemove: any): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  /**
   * Tracks the index of an item in an iterable
   * @param index The index of the item
   * @param item The item being iterated over
   * @returns The unique identifier of the item
   */
  trackByFn(index: any, item: any) {
    return item.id;
  }

  /**
   * Handles the event when an image is loaded
   * @param event The event containing information about the loaded image
   */
  handleImageLoaded(event: any) {
    if (event.target.files && event.target.files[0]) {
      const files = event.target.files;
      let invalidFlag = false;
      const pattern = /image-*/;
      for (const file of files) {
        if (!file.type.match(pattern)) {
          invalidFlag = true;
          alert('invalid format');
        }
      }
      this.handleImagePreview(files);
    }
  }

  /**
   * Displays a preview of the uploaded image
   * @param files The image files to be previewed
   */
  private handleImagePreview(files: any): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.pictureUrl = event.target.result;
    };
    this.pictureFile = files[0];
    reader.readAsDataURL(files[0]);
  }

  /**
   * Deletes the uploaded picture
   */
  public deletePicture() {
    this.pictureUrl = '';
    this.pictureFile = '';
  }

  /**
   * Submits the post form
   */
  onSubmitPost(): void {
    if (this.data.newPost) {
      this.addPost();
    } else {
      this.updatePost();
    }
  }

  /**
   * Adds a new post
   */
  private addPost(): void {
    if (this.postForm.invalid) {
      return;
    }
    const picture = this.pictureFile;
    const params: any = {
      title: this.postForm.value.title,
      description: this.postForm.value.description,
      content: this.postForm.value.content,
      categories: this.postForm.value.categories ? this.postForm.value.categories : [],
      published: this.postForm.value.published,
      userId: this.userId
    };
    this.store.dispatch(new AddPost(params, picture));
  }

  /**
   * Updates the current post
   */
  private updatePost(): void {
    if (this.postForm.invalid) {
      return;
    }
    let {id, userId} = this.currentPost;
    const picture = this.pictureFile;
    const previousPictureUrl = this.previousPictureUrl;
    let pictureOrUrl: boolean;
    pictureOrUrl = !!this.pictureUrl;

    const params: any = {
      id: id,
      title: this.postForm.value.title,
      description: this.postForm.value.description,
      content: this.postForm.value.content,
      published: this.postForm.value.published,
      includedCategories: this.includedCategories,
      excludedCategories: this.excludedCategories,
      userId: userId
    };
    this.store.dispatch(new UpdatePost(id, params, picture, pictureOrUrl, previousPictureUrl));
  }

  /**
   * Closes the dialog
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.dialogRef.close();
  }
}
