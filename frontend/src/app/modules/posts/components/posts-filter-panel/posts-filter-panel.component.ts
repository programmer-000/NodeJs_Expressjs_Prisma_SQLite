import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, filter, Observable, pairwise, Subject } from 'rxjs';
import { debounceTime, map, startWith, takeUntil } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { PostsService } from '../../posts.service';
import { GetCategories, GetListAllUsers } from '../../store-posts/posts.actions';
import { PostsSelectors } from '../../store-posts/posts.selectors';
import { DialogPostsComponent } from '../../dialogs/dialog-posts/dialog-posts.component';
import { DialogCategoriesPostComponent } from '../../dialogs/dialog-categories-post/dialog-categories-post.component';
import { CategoriesModel, UserListModel } from '../../../../core/models';
import { RoleEnum } from '../../../../core/enums';

@Component({
  selector: 'app-posts-filter-panel',
  templateUrl: './posts-filter-panel.component.html',
  styleUrls: ['./posts-filter-panel.component.scss']
})
export class PostsFilterPanelComponent implements OnInit, OnDestroy {

  constructor(
    private fb: FormBuilder,
    public postsService: PostsService,
    public dialog: MatDialog,
    public store: Store,
  ) {
  }

  // Selectors for retrieving data from Ngxs store
  @Select(PostsSelectors.getListUsers) listAllUsers$: Observable<UserListModel[]>;
  @Select(PostsSelectors.getListCategories) listAllCategories$: Observable<CategoriesModel[]>;

  // Enum for user roles
  protected readonly RoleEnum = RoleEnum;

  // Object to hold filter data
  private filterData: any = { authors: [], categories: [] };
  public postFilterForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();

  // Reference to search input elements
  @ViewChild('search') searchTextBox: ElementRef;
  @ViewChild('searchCategories') searchCategories: ElementRef;

  // Form controls for search inputs
  searchTextboxControl = new FormControl();
  searchTextboxControlCategories = new FormControl();

  // Arrays to store fetched data
  listAllUsers: UserListModel[] = [];
  listAllCategories: CategoriesModel[] = [];

  // Arrays to store selected values
  selectedValuesAuthors: any = [];
  selectedValuesCategories: any = [];
  selectedValuesPublished: any = [];

  // Observables for filtering options
  filteredOptions$: Observable<any[]>;
  filteredOptionsCategories$: Observable<any[]>;
  filteredOptionsPublished$= new BehaviorSubject<any>([]);

  // Clear All option label
  clearAllOption: string = 'Clear All';

  // Enum for post status
  statusPublished = [
    {id: 1, name: 'Published', published: true},
    {id: 2, name: 'Not Published', published: false},
    // {id: 3, name: 'All', published: undefined}
  ];

  ngOnInit() {
    this.fetchAllUsers();
    this.fetchCategories();
    this.initPublished()
    this.buildForm();
    this.onChangesControlAuthors();
    this.onChangesControlCategories();
    this.onChangesControlPublished();
  }

  /**
   * Fetches users from the store
   */
  private fetchAllUsers() {
    this.store.dispatch(new GetListAllUsers());

    // Subscribe to the list of all users
    this.listAllUsers$.pipe(
      takeUntil(this.destroy$))
      .subscribe(resp => {
        this.listAllUsers = resp;
        if (this.listAllUsers?.length) {
          this.filteredUsers();
        }
      });
  }

  /**
   * Sets up filtering for user search
   */
  private filteredUsers() {
    this.filteredOptions$ = this.searchTextboxControl.valueChanges
      .pipe(
        startWith<any>(''),
        map(name => this._filter(name))
      );
  }

  /**
   * Builds the form for post filters
   */
  private buildForm() {
    this.postFilterForm = this.fb.group({
      authors: [],
      categories: [],
      published: [],
    });
  }

  /**
   * Subscribes to changes in the authors control
   */
  private onChangesControlAuthors(): void {
    this.postFilterForm.controls['authors'].valueChanges.pipe(
      debounceTime(250),
      map(val => {
        let arrAuthors = [];

        if (val?.length) {
          for (let i = 0; i < val.length; i++) {
            arrAuthors.push(val[i].id);
          }
        }

        if (arrAuthors.length > 0) {
          this.filterData.authors = arrAuthors;
          this.postsService.postsFilters$.next(this.filterData);
        }

        return arrAuthors;
      }),
      pairwise(),
      filter(([prev, curr]) => prev?.length > 0 && curr.length === 0),
      takeUntil(this.destroy$)
    ).subscribe(([prev, curr]) => {
      if (prev.length > 0 && curr.length === 0) {
        this.filterData.authors = [];
        this.postsService.postsFilters$.next(this.filterData);
      }
    });
  }

  /**
   * Filters users based on input value
   */
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    this.setSelectedValues();
    this.postFilterForm.controls['authors'].patchValue(this.selectedValuesAuthors);
    return this.listAllUsers.filter(option => option.firstName.toLowerCase().indexOf(filterValue) === 0);
  }

  /**
   * Handles selection change in the user dropdown
   */
  selectionChangeAuthors(event: any) {
    if (event.isUserInput && !event.source.selected) {
      const index = this.selectedValuesAuthors.indexOf(event.source.value);
      this.selectedValuesAuthors.splice(index, 1);
    }
  }

  /**
   * Focuses on search input when dropdown is opened
   */
  openedChangeAuthors(e: any) {
    this.searchTextboxControl.patchValue('');
    if (e) {
      this.searchTextBox.nativeElement.focus();
    }
  }

  /**
   * Clears the search input value
   */
  clearSearch(event: Event) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }

  /**
   * Sets selected values to retain state
   */
  setSelectedValues() {
    if (this.postFilterForm.controls['authors'].value && this.postFilterForm.controls['authors'].value.length > 0) {
      this.postFilterForm.controls['authors'].value.forEach((e: any) => {
        if (this.selectedValuesAuthors.indexOf(e) === -1) {
          this.selectedValuesAuthors.push(e);
        }
      });
    }
  }

  /**
   * Fetches categories from the store
   */
  fetchCategories() {
    this.store.dispatch(new GetCategories());

    // Subscribe to the list of all categories
    this.listAllCategories$.pipe(
      takeUntil(this.destroy$))
      .subscribe(resp => {
        this.listAllCategories = resp;
        if (this.listAllCategories?.length) {
          this.filteredCategories();
        }
      });
  }

  /**
   * Sets up filtering for category search
   */
  private filteredCategories() {
    this.filteredOptionsCategories$ = this.searchTextboxControlCategories.valueChanges.pipe(
      startWith(''),
      map(name => this._filterCategories(name))
    );
  }

  /**
   * Filters categories based on input value
   */
  private _filterCategories(name: string): any[] {
    const filterValue = name.toLowerCase();
    this.setSelectedValuesCategories();
    this.postFilterForm.controls['categories'].patchValue(this.selectedValuesCategories);
    return this.listAllCategories.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  /**
   * Subscribes to changes in the categories control
   */
  private onChangesControlCategories(): void {
    this.postFilterForm.controls['categories'].valueChanges.pipe(
      debounceTime(250),
      map(val => {
        let arrCategories = [];

        if (val?.length) {
          for (let i = 0; i < val.length; i++) {
            arrCategories.push(val[i].id);
          }
        }

        if (arrCategories.length > 0) {
          this.filterData.categories = arrCategories;
          this.postsService.postsFilters$.next(this.filterData);
        }

        return arrCategories;
      }),
      pairwise(),
      filter(([prev, curr]) => prev?.length > 0 && curr.length === 0),
      takeUntil(this.destroy$)
    ).subscribe(([prev, curr]) => {
      if (prev.length > 0 && curr.length === 0) {
        this.filterData.categories = [];
        this.postsService.postsFilters$.next(this.filterData);
      }
    });
  }

  /**
   * Handles selection change in the category dropdown
   */
  selectionChangeCategories(event: any) {
    if (event.isUserInput && !event.source.selected) {
      const index = this.selectedValuesCategories.indexOf(event.source.value);
      this.selectedValuesCategories.splice(index, 1);
    }
  }

  /**
   * Handles selection change in the published dropdown
   */
  selectionChangePublished(event: any) {
    if (event.isUserInput && !event.source.selected) {
      const index = this.selectedValuesPublished.indexOf(event.source.value);
      this.selectedValuesPublished.splice(index, 1);
    }
  }

  /**
   * Focuses on search input when dropdown is opened
   */
  openedChangeCategories(e: any) {
    this.searchTextboxControlCategories.patchValue('');
    if (e) {
      this.searchCategories.nativeElement.focus();
    }
  }

  /**
   * Clears the search input value
   */
  clearSearchCategories(event: Event) {
    event.stopPropagation();
    this.searchTextboxControlCategories.patchValue('');
  }

  /**
   * Sets selected values to retain state
   */
  setSelectedValuesCategories() {
    if (this.postFilterForm.controls['categories'].value && this.postFilterForm.controls['categories'].value.length > 0) {
      this.postFilterForm.controls['categories'].value.forEach((e: any) => {
        if (this.selectedValuesCategories.indexOf(e) === -1) {
          this.selectedValuesCategories.push(e);
        }
      });
    }
  }

  /**
   * Opens the dialog for managing categories
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCategoriesPostComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  /**
   * Opens the dialog for adding a new post
   */
  addPost() {
    const dialogRef = this.dialog.open(DialogPostsComponent, { data: { newPost: true } });
    dialogRef.afterClosed().subscribe(result => {
      console.log('dialogRef result', result);
    });
  }

  /**
   * Checks if all roles are selected
   */
  public isFilterFieldsPosts(): boolean {
    const { authors, categories, published } = this.postFilterForm.value;
    return [authors?.length, categories?.length, published?.length].filter(Boolean).length > 1;
  }

  /**
   * Clear all form fields
   */
  public clearAllFields(): void {
    this.postFilterForm.setValue({
      authors: [],
      categories: [],
      published: []
    });
    this.selectedValuesAuthors = [];
    this.selectedValuesCategories = [];
    this.selectedValuesPublished = [];
  }

  /**
   * Clear all authors
   */
  clearAllAuthors() {
    this.postFilterForm.patchValue({ authors: [] });
    this.selectedValuesAuthors = [];
  }

  /**
   * Clear all categories
   */
  clearAllCategories() {
    this.postFilterForm.patchValue({ categories: [] });
    this.selectedValuesCategories = [];
  }

  /**
   * Clear all published
   */
  clearAllPublished() {
    this.postFilterForm.patchValue({ published: [] });
    this.selectedValuesPublished = [];
  }

  /**
   * Set published filter
   * @private
   */
  private initPublished() {
    this.filteredOptionsPublished$.next(this.statusPublished);
  }

  /**
   * Subscribes to changes in the published control
   */
  private onChangesControlPublished() {
    this.postFilterForm.controls['published'].valueChanges.pipe(
      debounceTime(250),
      map(val => {
        let arrPublished = [];

        if (val?.length) {
          for (let i = 0; i < val.length; i++) {
            arrPublished.push(val[i].published);
          }
        }

        if (arrPublished.length > 0) {
          this.filterData.published = arrPublished;
          this.postsService.postsFilters$.next(this.filterData);
        }

        return arrPublished;
      }),
      pairwise(),
      filter(([prev, curr]) => prev?.length > 0 && curr.length === 0),
      takeUntil(this.destroy$)
    ).subscribe(([prev, curr]) => {
      if (prev.length > 0 && curr.length === 0) {
        this.filterData.published = [];
        this.postsService.postsFilters$.next(this.filterData);
      }
    });
  }

  ngOnDestroy(): void {
    this.postsService.postsFilters$.next({ authors: [], categories: [], published: []});
    this.destroy$.next();
    this.destroy$.complete();
  }

}
