import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxsModule } from '@ngxs/store';
import { DashboardState } from './store-dashboard/dashboard-state.service';

// Components
import { PostStatisticsComponent } from './components/post-statistics/post-statistics.component';
import { UserStatisticsComponent } from './components/user-statistics/user-statistics.component';

// Define the routes for the HomeComponent
const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    PostStatisticsComponent,
    UserStatisticsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([DashboardState])
  ]
})
export class HomeModule { }
