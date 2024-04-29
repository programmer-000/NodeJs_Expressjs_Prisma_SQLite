import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, startWith, takeUntil } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { PostsService } from '../../posts.service';
import { GetCategories, GetListAllUsers } from '../../store-posts/posts.action';
import { PostsSelectors } from '../../store-posts/posts.selectors';
import { DialogPostsComponent } from '../../dialogs/dialog-posts/dialog-posts.component';
import { DialogCategoriesPostComponent } from '../../dialogs/dialog-categories-post/dialog-categories-post.component';
import { CategoriesModel, UserListModel } from '../../../../core/models';

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

  // Object to hold filter data
  private filterData: any = {authors: [], categories: []};
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
  selectedValues: any = [];
  selectedValuesCategories: any = [];

  // Observables for filtering options
  filteredOptions: Observable<any[]>;
  filteredOptionsCategories: Observable<any[]>;

  ngOnInit() {
    this.fetchUsers();
    this.fetchCategories();
    this.buildForm();
    this.onChangesControlAuthors();
    this.onChangesControlCategories();
  }

  /**
   *Fetches users from the store
   */
  private fetchUsers() {
    this.store.dispatch(new GetListAllUsers());
    this.listAllUsers$.pipe(
      takeUntil(this.destroy$))
      .subscribe(resp => {
        this.listAllUsers = resp;
        if (this.listAllUsers.length) {
          this.filteredUsers();
        }
      });
  }

  /**
   *Sets up filtering for user search
   */
  private filteredUsers() {
    this.filteredOptions = this.searchTextboxControl.valueChanges
      .pipe(
        startWith<any>(''),
        map(name => this._filter(name))
      );
  }

  /**
   *Builds the form for post filters
   */
  private buildForm() {
    this.postFilterForm = this.fb.group({
      authors: [],
      categories: []
    });
  }

  /**
   *Subscribes to changes in the authors control
   */
  private onChangesControlAuthors(): void {
    this.postFilterForm.controls['authors'].valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.destroy$)
    ).subscribe(val => {

      let arrAuthors = [];
      if (val.length) {
        for (let i = 0; i < val.length; i++) {
          arrAuthors.push(val[i].id);
        }
      } else if (!Object.keys(val).length) {
        arrAuthors = [];
      }
      this.filterData.authors = arrAuthors;
      this.postsService.postsFilters$.next(this.filterData)
    });
  }

  /**
   *Filters users based on input value
   */
  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    this.setSelectedValues();
    this.postFilterForm.controls['authors'].patchValue(this.selectedValues);
    return this.listAllUsers.filter(option => option.firstName.toLowerCase().indexOf(filterValue) === 0);
  }

  /**
   *Handles selection change in the user dropdown
   */
  selectionChange(event: any) {
    if (event.isUserInput && !event.source.selected) {
      const index = this.selectedValues.indexOf(event.source.value);
      this.selectedValues.splice(index, 1);
    }
  }

  /**
   *Focuses on search input when dropdown is opened
   */
  openedChangeAuthors(e: any) {
    this.searchTextboxControl.patchValue('');
    if (e) {
      this.searchTextBox.nativeElement.focus();
    }
  }

  /**
   *Clears the search input value
   */
  clearSearch(event: Event) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }

  /**
   *Sets selected values to retain state
   */
  setSelectedValues() {
    if (this.postFilterForm.controls['authors'].value && this.postFilterForm.controls['authors'].value.length > 0) {
      this.postFilterForm.controls['authors'].value.forEach((e: any) => {
        if (this.selectedValues.indexOf(e) === -1) {
          this.selectedValues.push(e);
        }
      });
    }
  }

  /**
   *Fetches categories from the store
   */
  fetchCategories() {
    this.store.dispatch(new GetCategories());
    this.listAllCategories$.pipe(
      takeUntil(this.destroy$))
      .subscribe(resp => {
        this.listAllCategories = resp;
        if (this.listAllCategories.length) {
          this.filteredCategories();
        }
      });
  }

  /**
   *Sets up filtering for category search
   */
  private filteredCategories() {
    this.filteredOptionsCategories = this.searchTextboxControlCategories.valueChanges.pipe(
      startWith(''),
      map(name => this._filterCategories(name))
    );
  }

  /**
   *Filters categories based on input value
   */
  private _filterCategories(name: string): any[] {
    const filterValue = name.toLowerCase();
    this.setSelectedValuesCategories();
    this.postFilterForm.controls['categories'].patchValue(this.selectedValuesCategories);
    return this.listAllCategories.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  /**
   *Subscribes to changes in the categories control
   */
  private onChangesControlCategories(): void {
    this.postFilterForm.controls['categories'].valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.destroy$)
    ).subscribe(val => {
        let arrCategories = [];
        if (val.length) {
          for (let i = 0; i < val.length; i++) {
            arrCategories.push(val[i].id);
          }
        } else if (!Object.keys(val).length) {
          arrCategories = [];
        }
        this.filterData.categories = arrCategories;
        this.postsService.postsFilters$.next(this.filterData)
      }
    );
  }

  /**
   *Handles selection change in the category dropdown
   */
  selectionChangeCategories(event: any) {
    if (event.isUserInput && !event.source.selected) {
      const index = this.selectedValuesCategories.indexOf(event.source.value);
      this.selectedValuesCategories.splice(index, 1);
    }
  }

  /**
   *Focuses on search input when dropdown is opened
   */
  openedChangeCategories(e: any) {
    this.searchTextboxControlCategories.patchValue('');
    if (e) {
      this.searchCategories.nativeElement.focus();
    }
  }

  /**
   *Clears the search input value
   */
  clearSearchCategories(event: Event) {
    event.stopPropagation();
    this.searchTextboxControlCategories.patchValue('');
  }

  /**
   *Sets selected values to retain state
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
   *Opens the dialog for managing categories
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCategoriesPostComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  /**
   *Opens the dialog for adding a new post
   */
  addPost() {
    const dialogRef = this.dialog.open(DialogPostsComponent, {data: {newPost: true}});
    dialogRef.afterClosed().subscribe(result => {
      console.log('dialogRef result', result);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
