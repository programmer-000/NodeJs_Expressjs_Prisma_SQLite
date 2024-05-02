import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../../modules/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  /**
   * Determines whether the user is allowed to access a particular route.
   * @param route The route to be activated.
   * @param state The router state snapshot containing information about the route.
   * @returns True if the user is authenticated and allowed to access the route, otherwise false.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const account = this.authService.accountValue;

    if (account) {
      // Check if route is restricted by role
      if (route.data['roles'] && !route.data['roles'].includes(account.userInfo.role)) {

        // RoleEnum not authorized so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      // Authorized so return true
      return true;
    } else {
      // Not logged in so redirect to login page with the return URL
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
