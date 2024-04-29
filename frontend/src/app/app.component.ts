import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { AuthService } from './modules/auth/auth.service';
import { Router } from '@angular/router';
import { AuthModel } from './core/models/auth-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  account?: AuthModel | null; // Current user account information

  // Observable to track if the device is a handset or not
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
  ) {
  }

  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit() {
    // Retrieve user account information from local storage
    this.getAccount();
    // Check if the user is authenticated
    this.isAth();
  }

  /**
   *Retrieve user account information from local storage
   */
  private getAccount() {
    this.authService.getAccountLocalStorage();
  }

  /**
   *Check if the user is authenticated
   */
  private isAth() {
    this.authService.accountSubject$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(resp => {
      this.account = resp;
      // console.log(this.account);
      if (!this.account) {
        // If the user is not authenticated, navigate to the login page
        // Commented out for now as it's not enabled
        // this.router.navigate(['auth/login']);
      }
    });
  }

  /**
   *Logout the user
   */
  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
