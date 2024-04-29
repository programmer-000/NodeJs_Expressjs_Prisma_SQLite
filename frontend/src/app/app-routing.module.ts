import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './layout/error-page/error-page.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AppRouteEnum } from './core/enums';

// Importing modules using dynamic imports for lazy loading
const homeModule = () => import('./modules/home/home.module').then(m => m.HomeModule);
const authModule = () => import('./modules/auth/auth.module').then(m => m.AuthModule);
const usersModule = () => import('./modules/users/users.module').then(m => m.UsersModule);
const postsModule = () => import('./modules/posts/posts.module').then(m => m.PostsModule);

// Define app routes
const appRoutes: Routes = [
  { path: '', loadChildren: homeModule, canActivate: [AuthGuard] },
  { path: AppRouteEnum.Auth, loadChildren: authModule },
  { path: AppRouteEnum.Users, loadChildren: usersModule, canActivate: [AuthGuard] },
  { path: AppRouteEnum.Posts, loadChildren: postsModule, canActivate: [AuthGuard] },
  { path: AppRouteEnum.NotFound, component: ErrorPageComponent },
  { path: '**', redirectTo: '/' + AppRouteEnum.NotFound, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
