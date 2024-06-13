import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material components
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Components
import { PostComponent } from './components/post/post.component';
import { PostsComponent } from './components';
import { PreviewPostComponent } from './components/preview-post/preview-post.component';
import { DialogPostsComponent } from './dialogs/dialog-posts/dialog-posts.component';
import { PostsFilterPanelComponent } from './components/posts-filter-panel/posts-filter-panel.component';
import { DialogCategoriesPostComponent } from './dialogs/dialog-categories-post/dialog-categories-post.component';

// Ngxs State
import { NgxsModule } from '@ngxs/store';
import { PostsState } from './store-posts/posts.state';
import { DirectivesModule } from '../../shared/directives/directives.module';
import { SharedModule } from '../../shared/shared.module';

// Define routes for the Posts module
const routes: Routes = [
  {
    path: '',
    component: PostsComponent
  },
  {
    path: ':id',
    component: PostComponent
  }
];

@NgModule({
  declarations: [
    // Declare components and dialogs used within the module
    PostComponent,
    PreviewPostComponent,
    PostsComponent,
    DialogPostsComponent,
    PostsFilterPanelComponent,
    DialogCategoriesPostComponent
  ],
  imports: [
    // Import required Angular modules and Angular Material modules
    CommonModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([PostsState]),
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatListModule,
    MatProgressSpinnerModule,
    DirectivesModule,
    SharedModule
  ]
})
export class PostsModule {
}
