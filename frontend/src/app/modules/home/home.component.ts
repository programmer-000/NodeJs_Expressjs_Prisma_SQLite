import { Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthUserModel } from '../../core/models';
import { RoleEnum } from '../../core/enums';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    public homeService: HomeService
  ) {
  }

  // Enum to access route names
  protected readonly RoleEnum = RoleEnum;

  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();

  data: AuthUserModel;

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Fetches data from the HomeService
   */
  private fetchData() {
    this.homeService.getData().pipe(
      takeUntil(this.destroy$))
      .subscribe(resp => {
        this.data = resp;
        // console.log(this.data)
      });
  }
}
