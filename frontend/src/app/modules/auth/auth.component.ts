import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();
  // Flag to indicate user's account status
  public account?: boolean;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getAccount();
  }

  /**
   * Retrieves user account status
   */
  private getAccount(): void {
    if (this.authService.accountValue) {
      // ANY ACTION AFTER AUTHORIZATION
      // this.router.navigate(['/users']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
