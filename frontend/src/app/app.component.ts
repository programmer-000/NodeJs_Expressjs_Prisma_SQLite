import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { AuthService } from './modules/auth/auth.service';
import { Router } from '@angular/router';
import { AuthModel } from './core/models';
import { RoleEnum } from './core/enums';
import { DialogUsersComponent } from './modules/users/dialogs/dialog-users/dialog-users.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  account: AuthModel | null; // Current user account information

  // Observable to track if the device is a handset or not
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
  ) {
  }

  // Enum for user roles
  protected readonly RoleEnum = RoleEnum;

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
      if (!this.account) {
        // If the user is not authenticated, navigate to the login page
        // Commented out for now as it's not enabled
        // this.router.navigate(['auth/login']);
      }
    });
  }

  /**
   * Open dialog to edit a user
   */
  editProfile(id: number | undefined) {
    const dialogRef = this.dialog.open(DialogUsersComponent, {
      data: {id, newUser: false, editProfile: true }
    });

    // After dialog is closed, render table rows
    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        // Some action here
      }, 1000);
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
